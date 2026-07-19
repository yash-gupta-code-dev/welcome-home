/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Flame, Sparkles, Coffee, Soup } from 'lucide-react';
import { audioEngine } from '../lib/AudioEngine';
import InteractivePhotoFrame from './InteractivePhotoFrame';
// @ts-ignore
import kitchenStove from '../assets/images/kitchen_stove_1784441700600.jpg';

interface RoomKitchenProps {
  onBackToMap: () => void;
  onClueFound: (room: 'hall' | 'kitchen' | 'coding' | 'music') => void;
  isClueFound: boolean;
  bakedCakeState: {
    completed: boolean;
    frosting: string;
    toppings: string[];
    candlesLit: boolean;
    candlesBlown: boolean;
  };
  onUpdateBakedCake: (cake: any) => void;
}

const INGREDIENTS = [
  { id: 'flour', name: 'Flour (Base of Dreams)', emoji: '🌾', color: 'bg-yellow-50 text-slate-800' },
  { id: 'sugar', name: 'Sugar (Sweet Memories)', emoji: '🍬', color: 'bg-pink-100 text-slate-800' },
  { id: 'eggs', name: 'Eggs (Binding Friendship)', emoji: '🥚', color: 'bg-amber-100 text-slate-800' },
  { id: 'cocoa', name: 'Cocoa (Rich Laughter)', emoji: '🍫', color: 'bg-amber-900 text-amber-50' },
  { id: 'love', name: 'Infinite Love & Support', emoji: '❤️', color: 'bg-red-500 text-white' },
];

const FROSTINGS = [
  { id: 'pink', name: 'Strawberry Pink', color: 'bg-pink-300' },
  { id: 'white', name: 'Vanilla White', color: 'bg-slate-100' },
  { id: 'chocolate', name: 'Fudge Chocolate', color: 'bg-amber-800' },
  { id: 'cosmic', name: 'Cosmic Blue', color: 'bg-indigo-500' },
];

const TOPPINGS = [
  { id: 'sprinkles', name: 'Rainbow Sprinkles', emoji: '✨' },
  { id: 'berries', name: 'Fresh Berries', emoji: '🍓' },
  { id: 'stars', name: 'Golden Stars', emoji: '⭐' },
  { id: 'chips', name: 'Chocolate Chips', emoji: '🟤' },
];

export default function RoomKitchen({
  onBackToMap,
  onClueFound,
  isClueFound,
  bakedCakeState,
  onUpdateBakedCake,
}: RoomKitchenProps) {
  const [step, setStep] = useState(bakedCakeState.completed ? 4 : 0);
  const [addedIngredients, setAddedIngredients] = useState<string[]>([]);
  const [stirProgress, setStirProgress] = useState(0);
  const [isBaking, setIsBaking] = useState(false);
  const [bakeTimer, setBakeTimer] = useState(0);
  const [selectedFrosting, setSelectedFrosting] = useState(bakedCakeState.frosting || 'pink');
  const [selectedToppings, setSelectedToppings] = useState<string[]>(bakedCakeState.toppings || []);
  const [candlesCount] = useState(4);
  const [candlesLit, setCandlesLit] = useState(bakedCakeState.candlesLit || false);
  const [candlesBlown, setCandlesBlown] = useState(bakedCakeState.candlesBlown || isClueFound || false);

  // Gas Stove States
  const [burnerLit, setBurnerLit] = useState(false);
  const [kettleOn, setKettleOn] = useState(false);
  const [boilProgress, setBoilProgress] = useState(0);
  const [teaPoured, setTeaPoured] = useState(false);
  const [teaSipped, setTeaSipped] = useState(false);

  // Modal Hotspot overlays
  const [showBakeryModal, setShowBakeryModal] = useState(false);
  const [showStoveModal, setShowStoveModal] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (burnerLit && kettleOn && boilProgress < 100) {
      interval = setInterval(() => {
        setBoilProgress((prev) => {
          const next = prev + 5;
          if (next >= 100) {
            audioEngine.playNote(987.77, 'sine', 0.25); // Kettle high whistling note
            return 100;
          }
          // Bubbling noise synthesis
          audioEngine.playNote(140 + Math.random() * 80, 'sine', 0.04);
          return next;
        });
      }, 250);
    } else if (!burnerLit || !kettleOn) {
      if (boilProgress > 0) {
        interval = setInterval(() => {
          setBoilProgress((prev) => Math.max(0, prev - 4));
        }, 400);
      }
    }
    return () => clearInterval(interval);
  }, [burnerLit, kettleOn, boilProgress]);

  const handleToggleBurner = () => {
    audioEngine.init();
    if (burnerLit) {
      setBurnerLit(false);
    } else {
      audioEngine.playNote(220, 'sawtooth', 0.15);
      setTimeout(() => audioEngine.playNote(330, 'sawtooth', 0.1), 80);
      setBurnerLit(true);
    }
  };

  const handlePourTea = () => {
    audioEngine.init();
    audioEngine.playSparkle();
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        audioEngine.playNote(850 + Math.random() * 350, 'sine', 0.08);
      }, i * 140);
    }
    setKettleOn(false);
    setTeaPoured(true);
    setTeaSipped(false);
  };

  const handleSipTea = () => {
    audioEngine.init();
    audioEngine.playChime();
    setTeaSipped(true);
  };

  const handleAddIngredient = (id: string) => {
    if (addedIngredients.includes(id)) return;
    audioEngine.playNote(400 + addedIngredients.length * 100, 'triangle', 0.2);
    setAddedIngredients([...addedIngredients, id]);
  };

  const handleStir = () => {
    if (stirProgress >= 5) return;
    const nextStir = stirProgress + 1;
    setStirProgress(nextStir);
    audioEngine.playNote(220 + nextStir * 80, 'sine', 0.15);
    
    if (nextStir === 5) {
      audioEngine.playChime();
    }
  };

  const handleStartBaking = () => {
    setIsBaking(true);
    setBakeTimer(3);
    audioEngine.playNote(300, 'sawtooth', 0.5);

    const countdown = setInterval(() => {
      setBakeTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setIsBaking(false);
          setStep(3); // Go to decorate step
          audioEngine.playChime();
          return 0;
        }
        audioEngine.playNote(400, 'sine', 0.1);
        return prev - 1;
      });
    }, 1000);
  };

  const handleToggleTopping = (id: string) => {
    audioEngine.playNote(600, 'triangle', 0.1);
    if (selectedToppings.includes(id)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== id));
    } else {
      setSelectedToppings([...selectedToppings, id]);
    }
  };

  const handleCompleteCake = () => {
    onUpdateBakedCake({
      completed: true,
      frosting: selectedFrosting,
      toppings: selectedToppings,
      candlesLit: false,
      candlesBlown: false,
    });
    setStep(4);
    audioEngine.playSparkle();
  };

  const handleLightCandles = () => {
    setCandlesLit(true);
    setCandlesBlown(false);
    audioEngine.playChime();
  };

  const handleBlowOutCandles = () => {
    audioEngine.playBlowWind();
    setTimeout(() => {
      setCandlesBlown(true);
      setCandlesLit(false);
      audioEngine.playConfettiPop();
      onClueFound('kitchen');
      onUpdateBakedCake({
        completed: true,
        frosting: selectedFrosting,
        toppings: selectedToppings,
        candlesLit: false,
        candlesBlown: true,
      });
    }, 400);
  };

  const handleResetBakery = () => {
    setStep(0);
    setAddedIngredients([]);
    setStirProgress(0);
    setIsBaking(false);
    setSelectedFrosting('pink');
    setSelectedToppings([]);
    setCandlesLit(false);
    setCandlesBlown(false);
    onUpdateBakedCake({
      completed: false,
      frosting: '',
      toppings: [],
      candlesLit: false,
      candlesBlown: false,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 w-full max-w-5xl mx-auto p-6 md:p-8 text-slate-100 flex flex-col min-h-[85vh] rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950"
    >
      {/* IMMERSIVE 2D KITCHEN BACKDROP */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
        {/* Kitchen Tiled Wall */}
        <div className="w-full flex-grow bg-gradient-to-b from-[#9B8EC7] via-[#211c34] to-[#141221] relative overflow-hidden">
          {/* Tile lines pattern */}
          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          {/* Glowing under-cabinet lights */}
          <div className="absolute top-0 inset-x-0 h-1 bg-[#B4D2D9]/40 shadow-md shadow-[#B4D2D9]/80" />

          {/* 1. UPPER CABINETS / WALL CUPBOARDS (2D stylized) */}
          <div className="absolute top-4 inset-x-12 flex justify-between gap-6 pointer-events-auto">
            {/* Left Cupboard Unit */}
            <div className="w-48 h-24 bg-[#9B8EC7]/10 backdrop-blur-sm border-2 border-[#BDA6CE] rounded-lg p-2 shadow-lg flex gap-2 relative group hover:border-[#F2EAE0] transition-all duration-300">
              <div className="flex-1 border border-[#BDA6CE]/40 rounded bg-[#9B8EC7]/10 flex flex-col justify-around p-1 text-[10px] text-[#F2EAE0]/80">
                <div className="h-0.5 w-full bg-[#BDA6CE]/30" />
                <div className="flex justify-around"><span>☕</span><span>🍵</span></div>
                <div className="h-0.5 w-full bg-[#BDA6CE]/30" />
                <div className="flex justify-around"><span>🍯</span><span>🧉</span></div>
              </div>
              <div className="flex-1 border border-[#BDA6CE]/40 rounded bg-[#9B8EC7]/10 flex flex-col justify-around p-1 text-[10px] text-[#F2EAE0]/80">
                <div className="h-0.5 w-full bg-[#BDA6CE]/30" />
                <div className="flex justify-around"><span>🍪</span><span>🥛</span></div>
                <div className="h-0.5 w-full bg-[#BDA6CE]/30" />
                <div className="flex justify-around"><span>🍫</span><span>🍬</span></div>
              </div>
              {/* Cupboard handles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1">
                <div className="w-1.5 h-3 bg-[#B4D2D9] rounded" />
                <div className="w-1.5 h-3 bg-[#B4D2D9] rounded" />
              </div>
              <div className="absolute -bottom-5 left-2 text-[9px] text-[#B4D2D9]/60 font-semibold">Spice Cupboard</div>
            </div>

            {/* Right Cupboard Unit */}
            <div className="w-48 h-24 bg-[#9B8EC7]/10 backdrop-blur-sm border-2 border-[#BDA6CE] rounded-lg p-2 shadow-lg flex gap-2 relative group hover:border-[#F2EAE0] transition-all duration-300">
              <div className="flex-1 border border-[#BDA6CE]/40 rounded bg-[#9B8EC7]/10 flex flex-col justify-around p-1 text-[10px] text-[#F2EAE0]/80">
                <div className="h-0.5 w-full bg-[#BDA6CE]/30" />
                <div className="flex justify-around"><span>🏺</span><span>🧉</span></div>
                <div className="h-0.5 w-full bg-[#BDA6CE]/30" />
                <div className="flex justify-around"><span>🧁</span><span>🍩</span></div>
              </div>
              <div className="flex-1 border border-[#BDA6CE]/40 rounded bg-[#9B8EC7]/10 flex flex-col justify-around p-1 text-[10px] text-[#F2EAE0]/80">
                <div className="h-0.5 w-full bg-[#BDA6CE]/30" />
                <div className="flex justify-around"><span>🧂</span><span>🧂</span></div>
                <div className="h-0.5 w-full bg-[#BDA6CE]/30" />
                <div className="flex justify-around"><span>🥫</span><span>🥫</span></div>
              </div>
              {/* Cupboard handles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1">
                <div className="w-1.5 h-3 bg-[#B4D2D9] rounded" />
                <div className="w-1.5 h-3 bg-[#B4D2D9] rounded" />
              </div>
              <div className="absolute -bottom-5 right-2 text-[9px] text-[#B4D2D9]/60 font-semibold">Pantry Overhead</div>
            </div>
          </div>

          {/* 2. PHOTO FRAMES & ART ON WALL (Interactive memories for Yash) */}
          <div className="absolute top-32 inset-x-12 flex justify-center gap-12 pointer-events-auto">
            <InteractivePhotoFrame
              id="kitchen-disaster"
              emoji="🍰"
              title="The Baking Disasters"
              description="That time we tried to bake a soufflé and it completely collapsed into a sweet, gooey pancake. We laughed so hard our stomachs hurt, and we ended up eating it straight off the baking sheet anyway!"
              date="December 2025"
              positionClasses="relative"
              rotation="-rotate-3"
              frameStyle="wood"
              caption="Soufflé"
            />

            <InteractivePhotoFrame
              id="kitchen-chats"
              emoji="🍵"
              title="Warm Kitchen Chats"
              description="Late-night hot chocolate conversations at the kitchen island, talking about coding frameworks, music theory, and our future plans. Food is great, but the company is what makes it a home."
              date="Autumn 2025"
              positionClasses="relative"
              rotation="rotate-2"
              frameStyle="gold"
              caption="Warm Chats"
            />

            <InteractivePhotoFrame
              id="kitchen-secret"
              emoji="❤️"
              title="Secret Ingredient: Love"
              description="The most important secret to any recipe in this kitchen is love. Sharing warm meals and sweet moments together, building a lifetime of beautiful, cherished memories."
              date="Ongoing"
              positionClasses="relative"
              rotation="rotate-6"
              frameStyle="polaroid"
              caption="secret.txt"
            />
          </div>

          {/* 3. FLOATING WOODEN SHELVES */}
          <div className="absolute top-36 left-8 flex flex-col gap-1.5 pointer-events-auto">
            <div className="w-36 h-2 bg-[#9B8EC7] rounded shadow-md relative">
              {/* Shelf Items */}
              <div className="absolute -top-6 left-2 flex gap-2 text-sm select-none">
                <span title="Fresh Basil Pot" className="hover:animate-bounce cursor-help">🪴</span>
                <span title="Honey Jar" className="hover:scale-110 cursor-help">🍯</span>
                <span title="Teapot" className="hover:scale-110 cursor-help">🫖</span>
              </div>
            </div>
            <div className="text-[8px] text-[#B4D2D9]/80 pl-1">Herb Shelf</div>
          </div>

          <div className="absolute top-36 right-8 flex flex-col gap-1.5 pointer-events-auto">
            <div className="w-36 h-2 bg-[#9B8EC7] rounded shadow-md relative">
              {/* Shelf Items */}
              <div className="absolute -top-6 right-2 flex gap-2 text-sm select-none">
                <span title="Red Wine Bottle" className="hover:scale-110 cursor-help">🍾</span>
                <span title="Fresh Apples Basket" className="hover:animate-bounce cursor-help">🍎</span>
                <span title="Cookbook" className="hover:scale-110 cursor-help">📕</span>
              </div>
            </div>
            <div className="text-[8px] text-[#B4D2D9]/80 pr-1 text-right">Pantry Shelf</div>
          </div>

          {/* Hanging copper pans & cooking ladles */}
          <div className="absolute top-6 left-1/4 flex gap-4 opacity-40 text-xl">
            <span>🍳</span>
            <span>🥄</span>
            <span>🔪</span>
            <span>🏺</span>
          </div>
        </div>

        {/* Polished Granite Countertop & CENTER COZY DINING TABLE */}
        <div className="w-full h-56 bg-gradient-to-b from-[#BDA6CE] via-[#B4D2D9] to-[#F2EAE0] border-t-4 border-[#9B8EC7] relative overflow-hidden">
          {/* Tile perspective lines inside counter base */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-zinc-950/20" />

          {/* 4. COZY DINING TABLE & STOOLS (2D vectors) */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto z-10">
            {/* Table Surface */}
            <div className="w-48 h-5 bg-gradient-to-r from-[#9B8EC7] via-[#BDA6CE] to-[#B4D2D9] rounded-full border border-[#F2EAE0] shadow-md flex items-center justify-around relative group hover:brightness-110 transition duration-300">
              {/* Coffee Cup with steam */}
              <div className="absolute -top-6 left-6 text-sm flex items-center gap-0.5 group/cup cursor-help" title="Steaming Hot Coffee">
                <span className="relative">
                  ☕
                  <span className="absolute -top-2 left-1 text-[8px] animate-pulse">♨️</span>
                </span>
              </div>
              {/* Flower Vase */}
              <div className="absolute -top-7 right-6 text-base group/vase cursor-help hover:animate-bounce" title="Fresh Chamomiles">
                🌸
              </div>
            </div>
            {/* Table Legs */}
            <div className="flex gap-20 -mt-1">
              <div className="w-1.5 h-16 bg-[#211c34] shadow-lg" />
              <div className="w-1.5 h-16 bg-[#211c34] shadow-lg" />
            </div>
            {/* Foot rest bar */}
            <div className="w-32 h-1 bg-[#211c34] -mt-4 shadow-sm" />

            {/* Left High Chair/Stool */}
            <div className="absolute bottom-0 -left-12 flex flex-col items-center group/stool cursor-help" title="Cozy Dining Stool">
              {/* Cushion */}
              <div className="w-10 h-2 bg-[#9B8EC7] rounded-full border border-[#BDA6CE] shadow hover:bg-[#BDA6CE] transition" />
              {/* Stool Legs */}
              <div className="flex gap-5 -mt-0.5">
                <div className="w-1 h-12 bg-zinc-800 shadow-lg" />
                <div className="w-1 h-12 bg-zinc-800 shadow-lg" />
              </div>
            </div>

            {/* Right High Chair/Stool */}
            <div className="absolute bottom-0 -right-12 flex flex-col items-center group/stool2 cursor-help" title="Cozy Dining Stool">
              {/* Cushion */}
              <div className="w-10 h-2 bg-[#9B8EC7] rounded-full border border-[#BDA6CE] shadow hover:bg-[#BDA6CE] transition" />
              {/* Stool Legs */}
              <div className="flex gap-5 -mt-0.5">
                <div className="w-1 h-12 bg-zinc-800 shadow-lg" />
                <div className="w-1 h-12 bg-zinc-800 shadow-lg" />
              </div>
            </div>
          </div>

          {/* Cozy cupboard/cabinet standing on the right countertop */}
          <div className="absolute bottom-2 right-12 w-20 h-28 bg-[#9B8EC7]/10 border-2 border-[#BDA6CE] rounded-md p-1.5 flex flex-col justify-between shadow-2xl pointer-events-auto hover:border-[#F2EAE0] transition" title="Pantry Locker">
            <div className="h-full border border-[#BDA6CE]/40 bg-slate-950/80 rounded p-1 flex flex-col justify-between">
              <div className="flex justify-around text-xs border-b border-slate-800/60 pb-1">
                <span>🧂</span>
                <span>🍯</span>
              </div>
              <div className="flex justify-around text-xs border-b border-slate-800/60 pb-1">
                <span>🧅</span>
                <span>🧄</span>
              </div>
              <div className="flex justify-around text-xs">
                <span>🥔</span>
                <span>🥕</span>
              </div>
            </div>
            <div className="text-[7px] text-slate-500 text-center font-bold">VEGGIE STAND</div>
          </div>
        </div>
      </div>

      {/* FOREGROUND INTERACTIVE CONTENT */}
      <div className="relative z-10 flex flex-col flex-grow">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBackToMap}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-850 text-slate-100 rounded-full border border-slate-800 text-sm font-medium transition cursor-pointer shadow-lg backdrop-blur-sm"
            id="kitchenBackBtn"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to House Map
          </button>
          <div className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 px-4 py-1.5 rounded-full text-xs text-pink-300 backdrop-blur-sm">
            🍰 Memory Bakery (Kitchen)
          </div>
        </div>

        {/* Immersive Kitchen Hotspots Countertop Plan */}
        <div className="relative flex-grow w-full min-h-[50vh] md:min-h-[55vh] mt-4 mb-2">
          {/* Left: Cake Bakery Hotspot */}
          <div className="absolute bottom-6 left-4 md:left-10 flex flex-col items-center z-10">
            {/* Bakery platform */}
            <div 
              onClick={() => {
                audioEngine.init();
                setShowBakeryModal(true);
              }}
              className="w-28 h-28 md:w-36 md:h-32 bg-slate-900/95 border-2 border-slate-750 rounded-2xl relative shadow-2xl cursor-pointer overflow-hidden group flex flex-col justify-end p-2 transition hover:scale-105"
            >
              {step === 4 ? (
                <div className="flex-grow flex flex-col items-center justify-center relative">
                  {/* Cake Platform Base */}
                  <div className="absolute bottom-2 w-20 h-2 bg-slate-800 rounded-full" />
                  {/* Cake body */}
                  <div className={`w-14 h-10 rounded-t-lg relative flex flex-col justify-end ${
                    selectedFrosting === 'pink' ? 'bg-pink-400' :
                    selectedFrosting === 'white' ? 'bg-slate-100' :
                    selectedFrosting === 'chocolate' ? 'bg-amber-700' :
                    'bg-indigo-500'
                  } shadow-md`}>
                    {/* Cake toppings */}
                    <div className="absolute -top-1 inset-x-0 flex justify-center gap-0.5 text-[8px]">
                      {selectedToppings.includes('sprinkles') && <span>✨</span>}
                      {selectedToppings.includes('berries') && <span>🍓</span>}
                      {selectedToppings.includes('stars') && <span>⭐</span>}
                    </div>
                    {/* Candles */}
                    {candlesLit && (
                      <div className="absolute -top-3 inset-x-0 flex justify-center gap-1.5">
                        <span className="w-1 h-3 bg-red-400 rounded-full relative animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center relative">
                  {/* Baking Bowl and Whisk */}
                  <span className="text-4xl animate-bounce">🥣</span>
                  <span className="text-sm absolute right-4 top-4 rotate-12">🥄</span>
                </div>
              )}
            </div>
            {/* Label under it */}
            <button 
              onClick={() => {
                audioEngine.init();
                setShowBakeryModal(true);
              }} 
              className="mt-2.5 px-3 py-1 bg-slate-900/95 hover:bg-slate-800 rounded-full border border-slate-700/80 text-[10px] font-bold text-pink-300 animate-pulse flex items-center gap-1 shadow-md cursor-pointer"
            >
              🎂 Bakery (Click here)
            </button>
          </div>

          {/* Right: Stove Station Hotspot */}
          <div className="absolute bottom-6 right-4 md:right-10 flex flex-col items-center z-10">
            {/* Stove Platform */}
            <div 
              onClick={() => {
                audioEngine.init();
                setShowStoveModal(true);
              }}
              className="w-28 h-28 md:w-36 md:h-32 bg-slate-900/95 border-2 border-slate-755 rounded-2xl relative shadow-2xl cursor-pointer overflow-hidden group flex flex-col justify-end p-2 transition hover:scale-105"
            >
              {/* Burner Visual */}
              <div className="flex-grow flex items-center justify-center relative">
                <div className="w-16 h-16 bg-slate-950 rounded-full border-2 border-slate-800 flex items-center justify-center relative">
                  <AnimatePresence>
                    {burnerLit && (
                      <motion.div
                        animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="absolute inset-2 rounded-full bg-blue-500/30 filter blur-sm"
                      />
                    )}
                  </AnimatePresence>
                  {kettleOn ? (
                    <span className="text-3xl relative z-10 select-none">
                      🫖
                      {burnerLit && boilProgress > 30 && (
                        <span className="absolute -top-1 -right-1 text-xs animate-ping">💨</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-[8px] text-slate-550 font-bold select-none uppercase">HOB</span>
                  )}
                </div>
              </div>
            </div>
            {/* Label under it */}
            <button 
              onClick={() => {
                audioEngine.init();
                setShowStoveModal(true);
              }} 
              className="mt-2.5 px-3 py-1 bg-slate-900/95 hover:bg-slate-800 rounded-full border border-slate-700/80 text-[10px] font-bold text-orange-400 animate-pulse flex items-center gap-1 shadow-md cursor-pointer"
            >
              🫖 Stove (Click here)
            </button>
          </div>
        </div>
      </div>

      {/* Memory Bakery Modal Overlay */}
      <AnimatePresence>
        {showBakeryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBakeryModal(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[82vh] flex flex-col overflow-hidden shadow-2xl text-slate-100"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🍰</span>
                  <div>
                    <h3 className="text-lg font-bold">Memory Bakery</h3>
                    <p className="text-xs text-slate-400">Bake a legendary birthday cake for Yash</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBakeryModal(false)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer transition font-sans"
                >
                  ✕ Close
                </button>
              </div>

              {/* Modal Content - Scrollable Steps Container */}
              <div className="flex-grow overflow-y-auto p-5 md:p-6 flex flex-col">
                {/* Step indicators */}
                <div className="grid grid-cols-5 gap-2 mb-6 text-center text-[10px] md:text-xs">
                  {['1. Mix', '2. Stir', '3. Bake', '4. Frost', '5. Celebrate'].map((name, idx) => (
                    <div
                      key={name}
                      className={`pb-2 border-b-2 font-medium transition ${
                        step === idx
                          ? 'border-pink-500 text-pink-400 font-bold'
                          : step > idx
                          ? 'border-emerald-500 text-emerald-400'
                          : 'border-slate-800 text-slate-500'
                      }`}
                    >
                      {name}
                    </div>
                  ))}
                </div>

                {/* Step 0: Gather Ingredients */}
                {step === 0 && (
                  <div className="flex-grow flex flex-col items-center justify-between gap-4">
                    <div className="text-center">
                      <h2 className="text-xl font-bold text-slate-100">Bowl of Foundations</h2>
                      <p className="text-slate-400 text-xs mt-1 max-w-md">
                        Click to add the key ingredients needed to bake a legendary birthday cake for Yash.
                      </p>
                    </div>

                    {/* Bowl with added ingredients */}
                    <div className="my-2 relative w-44 h-44 flex items-center justify-center">
                      {/* Bowl Back */}
                      <div className="absolute bottom-2 w-36 h-20 bg-slate-950 rounded-b-full border-b-4 border-slate-800 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-slate-900/60 flex items-center justify-center">
                          <AnimatePresence>
                            {addedIngredients.map((ingId, idx) => {
                              const ing = INGREDIENTS.find((i) => i.id === ingId);
                              return (
                                <motion.span
                                  key={ingId}
                                  initial={{ scale: 0, y: -60, opacity: 0 }}
                                  animate={{ scale: 1.1, y: 5 + (idx * 3), opacity: 1 }}
                                  exit={{ scale: 0 }}
                                  className="absolute text-2xl select-none"
                                  style={{ left: `${15 + (idx * 18)}px` }}
                                >
                                  {ing?.emoji}
                                </motion.span>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Bowl Front lip */}
                      <div className="absolute bottom-20 w-36 h-3 border-2 border-slate-800 bg-slate-950/40 rounded-full" />
                    </div>

                    {/* Ingredient Selection list */}
                    <div className="w-full max-w-md">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {INGREDIENTS.map((ing) => {
                          const isAdded = addedIngredients.includes(ing.id);
                          return (
                            <button
                              key={ing.id}
                              onClick={() => handleAddIngredient(ing.id)}
                              disabled={isAdded}
                              className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                                isAdded
                                  ? 'bg-slate-900 border-slate-850 opacity-40 text-slate-550'
                                  : 'bg-slate-850 hover:bg-slate-800 border-slate-750 text-slate-100'
                              }`}
                              title={ing.name}
                            >
                              <span className="text-xl select-none">{ing.emoji}</span>
                              <span className="text-[9px] font-medium leading-none block line-clamp-1">{ing.name.split(' ')[0]}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Next step button */}
                    <button
                      onClick={() => setStep(1)}
                      disabled={addedIngredients.length < INGREDIENTS.length}
                      className="w-full py-2.5 bg-pink-600 hover:bg-pink-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold text-xs cursor-pointer transition shadow-md shadow-pink-950/20"
                      id="kitchenNextStep1"
                    >
                      {addedIngredients.length < INGREDIENTS.length
                        ? `Add all ingredients (${addedIngredients.length}/${INGREDIENTS.length})`
                        : 'Proceed to Stirring! ✨'}
                    </button>
                  </div>
                )}

                {/* Step 1: Stir Batter */}
                {step === 1 && (
                  <div className="flex-grow flex flex-col items-center justify-between gap-4">
                    <div className="text-center">
                      <h2 className="text-xl font-bold text-slate-100">Fold in the Love</h2>
                      <p className="text-slate-400 text-xs mt-1 max-w-md">
                        Stir the ingredients smoothly to form a cohesive, rich birthday batter full of sweet memories.
                      </p>
                    </div>

                    {/* Stir Visual Representation */}
                    <div className="my-2 relative w-44 h-44 flex items-center justify-center bg-slate-950 rounded-full border-4 border-slate-850 shadow-inner overflow-hidden">
                      <div
                        className="absolute inset-2 rounded-full bg-gradient-to-tr from-amber-200/20 via-pink-300/10 to-amber-100/10 blur-xs transition-transform duration-700"
                        style={{
                          transform: `rotate(${stirProgress * 72}deg) scale(${0.8 + (stirProgress * 0.04)})`,
                        }}
                      />
                      <AnimatePresence>
                        {stirProgress > 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            {[...Array(stirProgress)].map((_, i) => (
                              <motion.div
                                key={i}
                                animate={{
                                  scale: [0.8, 1.2, 0.8],
                                  opacity: [0.4, 0.8, 0.4],
                                }}
                                transition={{ repeat: Infinity, duration: 1.5 + i * 0.3 }}
                                className="absolute w-4 h-4 bg-amber-100/30 rounded-full filter blur-xxs"
                                style={{
                                  left: `${25 + i * 22}px`,
                                  top: `${35 + (i % 2) * 26}px`,
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </AnimatePresence>

                      <motion.div
                        animate={
                          stirProgress < 5
                            ? { rotate: [0, 360], scale: [1, 1.05, 1] }
                            : { rotate: 0 }
                        }
                        transition={{ duration: 1, ease: 'linear', repeat: stirProgress > 0 && stirProgress < 5 ? Infinity : 0 }}
                        className="text-4xl select-none z-10 cursor-pointer"
                        onClick={handleStir}
                      >
                        🥄
                      </motion.div>
                    </div>

                    {/* Stirring Progress Status */}
                    <div className="w-full max-w-xs space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Batter Blend:</span>
                        <span>{stirProgress === 5 ? 'Perfect Consistency!' : `${stirProgress * 20}%`}</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                        <div
                          className="bg-pink-500 h-full transition-all duration-300"
                          style={{ width: `${stirProgress * 20}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 w-full max-w-xs">
                      <button
                        onClick={() => setStep(0)}
                        className="px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition border border-slate-700/50"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleStir}
                        disabled={stirProgress >= 5}
                        className="flex-grow py-2.5 bg-pink-600 hover:bg-pink-500 disabled:bg-slate-800 disabled:text-pink-300/40 text-white rounded-xl font-bold text-xs cursor-pointer transition shadow-md shadow-pink-950/20"
                        id="kitchenStirBtn"
                      >
                        {stirProgress === 5 ? 'Stirring Complete!' : 'Click to Stir Batter 🔄'}
                      </button>
                    </div>

                    {stirProgress === 5 && (
                      <button
                        onClick={() => setStep(2)}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs cursor-pointer transition animate-pulse"
                        id="kitchenNextStep2"
                      >
                        Preheat & Go to Oven! 🌡️
                      </button>
                    )}
                  </div>
                )}

                {/* Step 2: Bake the Cake */}
                {step === 2 && (
                  <div className="flex-grow flex flex-col items-center justify-between gap-4">
                    <div className="text-center">
                      <h2 className="text-xl font-bold text-slate-100">The Dream Oven</h2>
                      <p className="text-slate-400 text-xs mt-1 max-w-md">
                        Bake the batter into a fluffy chocolate gold base. Watch the heating indicators!
                      </p>
                    </div>

                    {/* Oven Animation */}
                    <div className="my-2 relative w-44 h-40 bg-slate-900 border-4 border-slate-800 rounded-xl shadow-2xl flex flex-col justify-between overflow-hidden">
                      <div className="flex-grow bg-slate-950 m-2.5 rounded border border-slate-800/80 flex items-center justify-center relative">
                        <AnimatePresence>
                          {isBaking && (
                            <motion.div
                              animate={{ opacity: [0.15, 0.4, 0.15] }}
                              transition={{ repeat: Infinity, duration: 1.2 }}
                              className="absolute inset-0 bg-orange-600/35 filter blur-xs"
                            />
                          )}
                        </AnimatePresence>

                        <motion.div
                          animate={isBaking ? { scale: [0.8, 1.05], y: [10, 0] } : { scale: 0.8, y: 10 }}
                          transition={{ duration: 3, ease: 'easeOut' }}
                          className="text-4xl select-none z-10"
                        >
                          🎂
                        </motion.div>
                      </div>

                      <div className="h-6 bg-slate-950 border-t border-slate-850 px-2.5 flex justify-between items-center text-[8px] text-slate-500 font-mono">
                        <span>OVEN ACTIVE: 350°F</span>
                        <div className="flex gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${isBaking ? 'bg-orange-500 animate-ping' : 'bg-slate-700'}`} />
                          <span className={`w-1.5 h-1.5 rounded-full ${isBaking ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                        </div>
                      </div>
                    </div>

                    {isBaking && (
                      <div className="text-center">
                        <span className="text-xs text-amber-400 font-mono font-bold animate-pulse">
                          Baking in progress... Remaining: {bakeTimer}s
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2 w-full max-w-xs">
                      <button
                        onClick={() => setStep(1)}
                        disabled={isBaking}
                        className="px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition border border-slate-700/50 disabled:opacity-40"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleStartBaking}
                        disabled={isBaking}
                        className="flex-grow py-2.5 bg-pink-600 hover:bg-pink-500 disabled:bg-slate-800 disabled:text-pink-300/40 text-white rounded-xl font-bold text-xs cursor-pointer transition shadow-md shadow-pink-950/20"
                        id="kitchenBakeBtn"
                      >
                        {isBaking ? 'Baking Batter...' : 'Close Door & Bake Base 🚪'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Decorate the Cake */}
                {step === 3 && (
                  <div className="flex-grow flex flex-col items-center justify-between gap-4">
                    <div className="text-center">
                      <h2 className="text-xl font-bold text-slate-100">Frost & Decorate</h2>
                      <p className="text-slate-400 text-xs mt-1 max-w-md">
                        Style the baked sponge with custom frosting and delicious golden stars.
                      </p>
                    </div>

                    {/* Interactive Custom Cake Preview */}
                    <div className="my-2 relative w-44 h-40 flex items-center justify-center">
                      <div className="absolute bottom-1 w-24 h-3 bg-slate-950 rounded-full border-b border-slate-800" />
                      <div className="absolute bottom-3 w-4 h-8 bg-slate-800" />
                      <div className="absolute bottom-10 w-32 h-2.5 bg-slate-950 rounded-full border border-slate-800 shadow-md" />

                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={`absolute bottom-11 w-24 h-18 rounded-t-2xl shadow-xl border-t border-white/20 relative flex flex-col justify-end overflow-hidden ${
                          selectedFrosting === 'pink' ? 'bg-pink-400' :
                          selectedFrosting === 'white' ? 'bg-slate-100' :
                          selectedFrosting === 'chocolate' ? 'bg-amber-700' :
                          'bg-indigo-500'
                        } transition-colors duration-500`}
                      >
                        <div className="absolute inset-x-0 top-0 h-4 flex justify-around">
                          {[...Array(6)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-3 rounded-b-full -mt-1 ${
                                selectedFrosting === 'pink' ? 'bg-pink-300' :
                                selectedFrosting === 'white' ? 'bg-white' :
                                selectedFrosting === 'chocolate' ? 'bg-amber-800' :
                                'bg-indigo-400'
                              } transition-colors duration-500`}
                            />
                          ))}
                        </div>

                        <div className="absolute top-4 inset-x-0 flex flex-wrap justify-center items-center gap-1 px-2">
                          <AnimatePresence>
                            {selectedToppings.map((topId) => {
                              const topping = TOPPINGS.find((t) => t.id === topId);
                              return (
                                <motion.span
                                  key={topId}
                                  initial={{ scale: 0, rotate: -30 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0 }}
                                  className="text-xs select-none"
                                >
                                  {topping?.emoji}
                                </motion.span>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    </div>

                    {/* Customize Controls */}
                    <div className="w-full space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Frosting flavor:</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {FROSTINGS.map((f) => (
                            <button
                              key={f.id}
                              onClick={() => setSelectedFrosting(f.id)}
                              className={`py-2 px-1.5 rounded-lg border text-[10px] font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                selectedFrosting === f.id
                                  ? 'border-pink-500 bg-pink-500/15 text-pink-300'
                                  : 'border-slate-800 bg-slate-850 hover:bg-slate-800 text-slate-450'
                              }`}
                            >
                              <span className={`w-3 h-3 rounded-full ${f.color} border border-white/10`} />
                              {f.name.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Toppings:</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {TOPPINGS.map((t) => {
                            const isSelected = selectedToppings.includes(t.id);
                            return (
                              <button
                                key={t.id}
                                onClick={() => handleToggleTopping(t.id)}
                                className={`py-1.5 px-3 rounded-lg border text-left text-xs transition cursor-pointer flex justify-between items-center ${
                                  isSelected
                                    ? 'border-pink-500/40 bg-pink-500/10 text-pink-300 font-bold'
                                    : 'border-slate-800 bg-slate-850 hover:bg-slate-800 text-slate-400'
                                }`}
                              >
                                <span>{t.emoji} {t.name}</span>
                                {isSelected && <span className="text-[10px] text-pink-400">✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleCompleteCake}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs cursor-pointer transition shadow-md shadow-emerald-950/20"
                      id="kitchenCompleteCakeBtn"
                    >
                      Bake and Assemble Cake! 🎂
                    </button>
                  </div>
                )}

                {/* Step 4: Celebrate (Light & Blow Candles) */}
                {step === 4 && (
                  <div className="flex-grow flex flex-col items-center justify-between gap-4">
                    <div className="text-center">
                      <h2 className="text-xl font-bold text-slate-100">The Celebration</h2>
                      <p className="text-slate-400 text-xs mt-1 max-w-md">
                        Light the candles, make a beautiful wish for Yash, and blow them out together!
                      </p>
                    </div>

                    {/* Huge Birthday Cake Render */}
                    <div className="my-2 relative w-52 h-44 flex items-center justify-center">
                      <div className="absolute bottom-0 w-36 h-3 bg-slate-950 rounded-full border-b border-slate-800 shadow-lg" />

                      <motion.div
                        animate={candlesLit ? { y: [0, -2, 0] } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`w-32 h-24 rounded-t-3xl relative shadow-2xl flex flex-col justify-end border-t border-white/10 ${
                          selectedFrosting === 'pink' ? 'bg-pink-400' :
                          selectedFrosting === 'white' ? 'bg-slate-100' :
                          selectedFrosting === 'chocolate' ? 'bg-amber-700' :
                          'bg-indigo-500'
                        }`}
                      >
                        <div className="absolute inset-x-0 top-0 h-5 flex justify-around">
                          {[...Array(6)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-5 h-4 rounded-b-full -mt-1 ${
                                selectedFrosting === 'pink' ? 'bg-pink-300' :
                                selectedFrosting === 'white' ? 'bg-white' :
                                selectedFrosting === 'chocolate' ? 'bg-amber-800' :
                                'bg-indigo-400'
                              }`}
                            />
                          ))}
                        </div>

                        <div className="absolute top-5 inset-x-0 flex flex-wrap justify-center items-center gap-1.5 px-3">
                          {selectedToppings.map((topId) => {
                            const topping = TOPPINGS.find((t) => t.id === topId);
                            return (
                              <span key={topId} className="text-sm select-none filter drop-shadow">
                                {topping?.emoji}
                              </span>
                            );
                          })}
                        </div>

                        <div className="absolute -top-7 inset-x-0 flex justify-center gap-2">
                          {[...Array(candlesCount)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center">
                              <div className="h-1 w-[1px] bg-slate-600" />
                              <AnimatePresence>
                                {candlesLit && (
                                  <motion.div
                                    animate={{
                                      scale: [1, 1.3, 0.9, 1.2, 1],
                                      y: [0, -3, 0],
                                    }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 0.6 + i * 0.1,
                                    }}
                                    className="w-2.5 h-4 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-200 rounded-t-full filter blur-xxs absolute -top-3.5"
                                  />
                                )}
                              </AnimatePresence>
                              <div className="w-2 h-7 bg-gradient-to-b from-teal-400 to-emerald-500 rounded-b shadow-md border-t border-teal-300" />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    <div className="w-full space-y-3">
                      <AnimatePresence>
                        {candlesBlown && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3.5 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl text-xs text-center text-slate-100 shadow-md space-y-1.5"
                          >
                            <p className="text-emerald-300 font-bold flex items-center gap-1.5 justify-center">
                              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                              Cake Complete & Candles Blown!
                            </p>
                            <p className="text-slate-300 leading-relaxed text-[11px]">
                              Congratulations, Yash! Your second safe combination digit is revealed: <strong className="font-mono text-emerald-100 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-500/20 text-sm">"2"</strong>
                            </p>
                            <div className="text-[10px] text-slate-400 pt-1 font-mono">
                              Code Clue Found: 1 2 _ _
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex justify-center gap-2">
                        <button
                          onClick={handleLightCandles}
                          disabled={candlesLit}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-full font-bold text-xs flex items-center gap-1 cursor-pointer shadow-md disabled:opacity-40 transition"
                          id="kitchenLightCandlesBtn"
                        >
                          <Flame className="w-3.5 h-3.5" />
                          Light Candles
                        </button>

                        {candlesLit && (
                          <button
                            onClick={handleBlowOutCandles}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-xs flex items-center gap-1 cursor-pointer shadow-md transition"
                            id="kitchenBlowCandlesBtn"
                          >
                            💨 Blow Out!
                          </button>
                        )}

                        {(candlesBlown || candlesLit) && (
                          <button
                            onClick={handleResetBakery}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full font-semibold text-xs flex items-center gap-1 cursor-pointer transition"
                            id="kitchenResetBtn"
                          >
                            Reset Cake
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vintage Stove Modal Overlay */}
      <AnimatePresence>
        {showStoveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStoveModal(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative overflow-hidden shadow-2xl flex flex-col gap-4 text-slate-100 max-h-[82vh]"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 animate-pulse text-amber-500" />
                  <h3 className="text-xl font-bold">Vintage Gas Range</h3>
                </div>
                <button
                  onClick={() => setShowStoveModal(false)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer transition font-sans"
                >
                  ✕ Close
                </button>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed">
                Turn on the stove burners, place the kettle, hear water boil, and brew a satisfying, hot lofi tea!
              </p>

              {/* Realistic Gas Range Visualizer */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col items-center relative overflow-hidden h-44 justify-center">
                <div className="absolute inset-0 opacity-15 select-none pointer-events-none">
                  <img
                    src={kitchenStove}
                    alt="Vintage gas stove"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Hot burner hob */}
                <div className="relative w-24 h-24 flex items-center justify-center bg-slate-950 rounded-full border-4 border-slate-800 shadow-inner z-10">
                  <div className="absolute inset-2 rounded-full border border-dashed border-slate-700/60" />
                  
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-slate-800 rounded-full"
                      style={{
                        transform: `rotate(${i * 45}deg) translateY(-22px)`,
                      }}
                    />
                  ))}

                  <AnimatePresence>
                    {burnerLit && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.3, 0.5, 0.3] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                          className="absolute w-16 h-16 rounded-full bg-blue-500/30 filter blur-md"
                        />
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              scale: [1, 1.3, 0.8, 1.2, 1],
                              y: [0, -2, 0],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.5 + (i % 3) * 0.15,
                              ease: 'easeInOut',
                            }}
                            className="absolute w-1 h-3 bg-gradient-to-t from-blue-600 via-sky-400 to-cyan-200 rounded-full filter blur-xxs"
                            style={{
                              transform: `rotate(${i * 45}deg) translateY(-22px)`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {kettleOn && (
                      <motion.div
                        initial={{ scale: 0.7, y: -20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.7, y: -20, opacity: 0 }}
                        className="absolute z-10 text-3xl select-none filter drop-shadow-2xl cursor-pointer"
                        onClick={() => setKettleOn(false)}
                        title="Click to pick up kettle"
                      >
                        🫖
                        
                        {boilProgress > 30 && (
                          <div className="absolute -top-3 -right-2 flex flex-col gap-1">
                            {[...Array(3)].map((_, idx) => (
                              <motion.div
                                key={idx}
                                animate={{
                                  y: [0, -15],
                                  x: [0, (idx - 1) * 4],
                                  scale: [0.5, 1.1, 0.2],
                                  opacity: [0, 0.8, 0],
                                }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1.2,
                                  delay: idx * 0.3,
                                }}
                                className="w-1.5 h-1.5 bg-slate-100/60 rounded-full filter blur-xxs"
                              />
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!kettleOn && (
                    <span className="text-[8px] text-slate-550 font-bold select-none text-center leading-none max-w-16">
                      HOB READY
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {kettleOn && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Water Heating...</span>
                      <span className={boilProgress === 100 ? 'text-emerald-400 animate-pulse font-bold' : ''}>
                        {boilProgress === 100 ? 'Whistling! 💨' : `${boilProgress}%`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-blue-500 via-amber-500 to-red-500 h-full transition-all duration-300"
                        style={{ width: `${boilProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleToggleBurner}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      burnerLit
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-950/30'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/50'
                    }`}
                    id="kitchenStoveToggleBtn"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    {burnerLit ? 'Turn Off Hob' : 'Ignite Hob'}
                  </button>

                  <button
                    onClick={() => {
                      audioEngine.init();
                      audioEngine.playNote(440, 'triangle', 0.15);
                      setKettleOn(!kettleOn);
                    }}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      kettleOn
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/50'
                    }`}
                    id="kitchenKettleBtn"
                  >
                    ☕ {kettleOn ? 'Remove Kettle' : 'Place Kettle'}
                  </button>
                </div>

                {boilProgress === 100 && (
                  <div className="pt-2 border-t border-slate-800 flex gap-2">
                    <button
                      onClick={handlePourTea}
                      disabled={teaPoured}
                      className="flex-grow py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800/80 disabled:text-slate-500 text-white rounded-xl font-bold text-xs cursor-pointer transition flex items-center justify-center gap-1 shadow-md shadow-emerald-950/20"
                      id="kitchenPourTeaBtn"
                    >
                      <Soup className="w-3.5 h-3.5" />
                      {teaPoured ? 'Tea Ready 🍵' : 'Pour Tea'}
                    </button>

                    {teaPoured && (
                      <button
                        onClick={handleSipTea}
                        disabled={teaSipped}
                        className="flex-grow py-2 bg-pink-600 hover:bg-pink-500 disabled:bg-slate-800/80 disabled:text-slate-500 text-white rounded-xl font-bold text-xs cursor-pointer transition flex items-center justify-center gap-1 shadow-md shadow-pink-950/20"
                        id="kitchenSipTeaBtn"
                      >
                        <Coffee className="w-3.5 h-3.5" />
                        {teaSipped ? 'Sipped! ❤️' : 'Cozy Sip'}
                      </button>
                    )}
                  </div>
                )}

                <AnimatePresence>
                  {teaSipped && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-3 bg-pink-950/25 border border-pink-500/20 rounded-xl text-[10px] text-slate-300 space-y-1 relative"
                    >
                      <p className="italic text-pink-200">
                        "You take a warm sip of Rashi's special ginger tea. Cozy warmth spreads through you..."
                      </p>
                      <p className="text-slate-400 leading-relaxed text-[9px]">
                        💖 <span className="text-pink-400 font-semibold">Rashi's Card:</span> Yash, I know you love midnight coding tea breaks. I hope this cup keeps your heart cozy! Happy birthday! ☕❤️
                      </p>
                      <button
                        onClick={() => setTeaSipped(false)}
                        className="absolute top-1 right-2 text-slate-450 hover:text-white"
                      >
                        ✕
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
