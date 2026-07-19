/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Flower, Sparkles } from 'lucide-react';
import { audioEngine } from '../lib/AudioEngine';

interface RoomGardenProps {
  onBackToMap: () => void;
  gardenWishes: {
    plantedCount: number;
    wateredCount: number;
    flowersBloomed: string[];
  };
  onUpdateGardenWishes: (wishes: any) => void;
}

interface SiblingWish {
  id: string;
  name: string;
  flowerName: string;
  color: string;
  wish: string;
  emoji: string;
}

const WISHES: SiblingWish[] = [
  {
    id: 'harmony',
    name: 'Harmony Seed',
    flowerName: 'Glow Chrysanthemum',
    color: 'shadow-sky-500 bg-sky-400 border-sky-300',
    emoji: '🌸',
    wish: 'May your mind always find a serene quiet center, no matter how chaotic the code or the outer world becomes.',
  },
  {
    id: 'abundance',
    name: 'Success Seed',
    flowerName: 'Golden Orchid',
    color: 'shadow-amber-500 bg-amber-400 border-amber-300',
    emoji: '🌻',
    wish: 'Wishing you a future overflowing with brilliant creative breakthroughs, abundance, and satisfying achievements.',
  },
  {
    id: 'adventure',
    name: 'Adventure Seed',
    flowerName: 'Cosmic Violet',
    color: 'shadow-purple-500 bg-purple-400 border-purple-300',
    emoji: '🌺',
    wish: 'May you wander across breathtaking mountains, swim in tropical oceans, and discover spectacular new worlds of wonder.',
  },
  {
    id: 'vitality',
    name: 'Energy Seed',
    flowerName: 'Solar Tulip',
    color: 'shadow-orange-500 bg-orange-400 border-orange-300',
    emoji: '🌹',
    wish: 'Wishing you robust health, deeply refreshing sleep, hot delicious cups of coffee, and infinite vibrant energy.',
  },
  {
    id: 'bonds',
    name: 'Affection Seed',
    flowerName: 'Everlove Lotus',
    color: 'shadow-pink-500 bg-pink-400 border-pink-300',
    emoji: '🌷',
    wish: 'May you always feel enveloped by family, backed by loyal friends, and loved unconditionally exactly as you are.',
  },
];

export default function RoomGarden({
  onBackToMap,
  gardenWishes,
  onUpdateGardenWishes,
}: RoomGardenProps) {
  const [plantedSeeds, setPlantedSeeds] = useState<string[]>(gardenWishes.flowersBloomed || []);
  const [wateringSeed, setWateringSeed] = useState<string | null>(null);
  const [bloomedSeeds, setBloomedSeeds] = useState<string[]>(gardenWishes.flowersBloomed || []);
  const [selectedFlowerWish, setSelectedFlowerWish] = useState<SiblingWish | null>(null);

  const handlePlantSeed = (id: string) => {
    if (plantedSeeds.includes(id)) return;
    audioEngine.playNote(400, 'sine', 0.2);
    const nextPlanted = [...plantedSeeds, id];
    setPlantedSeeds(nextPlanted);
    
    // Automatically trigger watering flow
    setWateringSeed(id);
    
    onUpdateGardenWishes({
      plantedCount: nextPlanted.length,
      wateredCount: gardenWishes.wateredCount,
      flowersBloomed: bloomedSeeds,
    });
  };

  const handleWaterSeed = (id: string) => {
    audioEngine.playSparkle();
    setWateringSeed(null);
    
    setTimeout(() => {
      const nextBloomed = [...bloomedSeeds, id];
      setBloomedSeeds(nextBloomed);
      
      const wish = WISHES.find((w) => w.id === id);
      if (wish) {
        setSelectedFlowerWish(wish);
      }

      onUpdateGardenWishes({
        plantedCount: plantedSeeds.length,
        wateredCount: gardenWishes.wateredCount + 1,
        flowersBloomed: nextBloomed,
      });
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 w-full max-w-4xl mx-auto px-4 py-6 text-slate-100 flex flex-col min-h-[85vh]"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-full border border-slate-700 text-sm font-medium transition cursor-pointer"
          id="gardenBackBtn"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to House Map
        </button>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs text-emerald-300">
          🌱 Rashi's Wish Meadow (Garden)
        </div>
      </div>

      {/* Garden Board */}
      <div className="bg-slate-950/80 border-2 border-[#BDA6CE] rounded-3xl p-6 md:p-8 backdrop-blur-md flex-grow flex flex-col justify-between relative overflow-hidden shadow-[0_0_25px_rgba(155,142,199,0.15)]">
        
        {/* Crescent Moon */}
        <div className="absolute top-6 right-8 w-16 h-16 bg-transparent rounded-full shadow-[-12px_12px_0_0_#fef08a] filter drop-shadow-[0_0_15px_rgba(254,240,138,0.3)] animate-pulse pointer-events-none" />

        {/* 1. SWINGING HOVERABLE WIND CHIMES (Top Left) */}
        <div className="absolute top-4 left-6 pointer-events-auto select-none group z-10" title="Cozy Garden Wind Chimes">
          <motion.div 
            whileHover={{ rotate: [-8, 8, -6, 6, 0], transition: { duration: 1.5, ease: "easeInOut" } }}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => audioEngine.playChime()}
          >
            {/* Hanging String */}
            <div className="w-0.5 h-6 bg-[#BDA6CE]" />
            {/* Wooden top disc */}
            <div className="w-8 h-1.5 bg-[#9B8EC7] rounded-full" />
            {/* Chime Tubes */}
            <div className="flex gap-1 items-start -mt-0.5">
              <div className="w-1 h-8 bg-[#B4D2D9] rounded-b shadow" />
              <div className="w-1 h-10 bg-[#BDA6CE] rounded-b shadow" />
              <div className="w-1 h-9 bg-[#B4D2D9] rounded-b shadow" />
              <div className="w-1 h-7 bg-[#BDA6CE] rounded-b shadow" />
            </div>
            {/* Wooden sail clapper */}
            <div className="w-2.5 h-4 bg-[#B4D2D9] rounded-b-md mt-0.5 shadow animate-pulse" />
          </motion.div>
        </div>

        {/* 2. RUSTIC WOODEN BIRDHOUSE (Middle Right) */}
        <div className="absolute top-24 right-6 flex flex-col items-center pointer-events-auto z-10 select-none group hidden sm:flex" title="Chirpy Bird Sanctuary">
          {/* Birdhouse Roof */}
          <div className="w-10 h-6 bg-[#9B8EC7] rotate-45 border-t border-l border-[#BDA6CE] origin-bottom-right shadow-md" />
          {/* Birdhouse Box */}
          <div className="w-8 h-8 bg-[#BDA6CE] border-x border-b border-[#9B8EC7] rounded-b flex flex-col items-center justify-around p-1 -mt-4 relative shadow-lg">
            {/* Entrance Hole */}
            <div className="w-3 h-3 bg-zinc-950 rounded-full flex items-center justify-center">
              <span className="text-[7px] leading-none animate-pulse">🐦</span>
            </div>
            {/* Little perch stick */}
            <div className="w-4 h-0.5 bg-[#211c34]" />
          </div>
          {/* Standing Pole */}
          <div className="w-1.5 h-16 bg-[#211c34] shadow-md" />
        </div>

        {/* 3. COZY PATIO WOODEN GARDEN BENCH (Bottom Left Corner) */}
        <div className="absolute bottom-24 left-4 w-32 h-16 bg-[#9B8EC7]/10 border-2 border-[#BDA6CE] rounded-xl p-1.5 flex flex-col justify-between shadow-2xl pointer-events-auto hover:brightness-110 transition group hidden md:flex" title="Love Carved Park Bench">
          {/* Slat backrest with a heart cutout */}
          <div className="h-6 border-b border-[#BDA6CE]/35 flex justify-center items-center font-bold text-xs text-[#9B8EC7] select-none">
            💖
          </div>
          {/* Bench seat */}
          <div className="h-3 bg-[#9B8EC7] rounded shadow-inner" />
          {/* Bench armrests and legs */}
          <div className="flex justify-between px-2 -mb-2.5">
            <div className="w-1.5 h-4 bg-[#211c34] shadow" />
            <div className="w-1.5 h-4 bg-[#211c34] shadow" />
          </div>
        </div>

        {/* 4. SWINGING MEADOW HAMMOCK (Bottom Right Corner) */}
        <div className="absolute bottom-24 right-4 w-36 h-12 pointer-events-auto select-none hidden md:block" title="Sunset Siesta Hammock">
          <motion.div 
            animate={{ rotate: [-2, 2, -2] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-full h-full flex flex-col items-center relative"
          >
            {/* Supporting ropes hooked to imaginary trees */}
            <div className="absolute top-0 inset-x-0 h-0.5 bg-[#BDA6CE]/40" />
            {/* Woven Mesh Hammock curve */}
            <div className="w-full h-6 bg-gradient-to-r from-[#9B8EC7]/20 via-[#BDA6CE]/50 to-[#B4D2D9]/20 rounded-b-full border-b-2 border-[#BDA6CE] shadow-lg flex items-center justify-center text-[10px] text-[#F2EAE0] font-serif">
              🍃 R E L A X
            </div>
            {/* Sleep Pillow */}
            <div className="absolute -top-1.5 left-4 w-5 h-3 bg-[#F2EAE0] rounded-sm border border-[#BDA6CE] rotate-[-12deg]" />
          </motion.div>
        </div>

        {/* 5. MEADOW FLAT STONE PAVERS (Floor accents) */}
        <div className="absolute bottom-2 inset-x-24 h-6 flex justify-around pointer-events-none select-none z-0">
          <div className="w-14 h-3 bg-slate-800/40 rounded-full border border-slate-700/20 transform skew-x-12" />
          <div className="w-10 h-2 bg-slate-800/40 rounded-full border border-slate-700/20 transform -skew-x-12" />
          <div className="w-16 h-3 bg-slate-800/40 rounded-full border border-slate-700/20 transform skew-x-6" />
        </div>

        {/* Intro */}
        <div className="text-center max-w-lg mx-auto space-y-2 mb-4 z-10">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2 justify-center">
            <Flower className="w-6 h-6 text-emerald-400 animate-bounce" />
            The Magic Wish Meadow
          </h2>
          <p className="text-slate-400 text-sm">
            Plant seeds of wonderful wishes, nurture them with water, and watch beautiful neon flowers blossom from the rich fertile soil. Click a blooming flower to read the wish!
          </p>
        </div>

        {/* Wish Flower Pots Area */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 justify-center items-end my-6 flex-grow z-10">
          {WISHES.map((wish) => {
            const isPlanted = plantedSeeds.includes(wish.id);
            const isBloomed = bloomedSeeds.includes(wish.id);
            const isWatering = wateringSeed === wish.id;

            return (
              <div key={wish.id} className="flex flex-col items-center gap-4">
                {/* Pot/Flower Stage */}
                <div className="relative w-28 h-40 flex flex-col justify-end items-center">
                  
                  {/* Sprouted Flower Plant */}
                  {isBloomed && (
                    <motion.div
                      initial={{ scaleY: 0, originY: 1 }}
                      animate={{ scaleY: 1 }}
                      className="absolute bottom-10 flex flex-col items-center"
                      onClick={() => {
                        audioEngine.playNote(650, 'sine', 0.2);
                        setSelectedFlowerWish(wish);
                      }}
                    >
                      {/* Glow Flower Blossom */}
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        className={`w-14 h-14 rounded-full flex items-center justify-center border-2 text-2xl shadow-lg cursor-pointer ${wish.color}`}
                      >
                        {wish.emoji}
                      </motion.div>

                      {/* Green stem */}
                      <div className="w-1.5 h-12 bg-emerald-500 rounded relative">
                        {/* Leaf Left */}
                        <div className="absolute -left-2 top-3 w-3.5 h-2 bg-emerald-600 rounded-bl-full rounded-tr-full rotate-45" />
                        {/* Leaf Right */}
                        <div className="absolute -right-2 top-5 w-3.5 h-2 bg-emerald-600 rounded-br-full rounded-tl-full -rotate-45" />
                      </div>
                    </motion.div>
                  )}

                  {/* Seed Sprout (just watering) */}
                  {isPlanted && !isBloomed && (
                    <div className="absolute bottom-10 flex flex-col items-center">
                      {isWatering ? (
                        <button
                          onClick={() => handleWaterSeed(wish.id)}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition animate-bounce shadow-md"
                        >
                          💧 Water
                        </button>
                      ) : (
                        <div className="w-1 h-6 bg-emerald-700 rounded animate-pulse" />
                      )}
                    </div>
                  )}

                  {/* Clay Pot */}
                  <div className="w-16 h-10 bg-amber-700/80 rounded-b-xl border-x-2 border-b-2 border-amber-800 shadow-lg relative flex items-center justify-center">
                    <div className="absolute -top-1.5 w-18 h-2 bg-amber-600 rounded-full border border-amber-700" />
                    
                    {!isPlanted && (
                      <button
                        onClick={() => handlePlantSeed(wish.id)}
                        className="text-[10px] font-bold text-amber-100 hover:text-white bg-amber-900/50 hover:bg-amber-900 px-2 py-0.5 rounded-full cursor-pointer transition border border-amber-800"
                        id={`plant-${wish.id}`}
                      >
                        🌱 Plant
                      </button>
                    )}
                  </div>
                </div>

                {/* Pot label */}
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{wish.name}</span>
              </div>
            );
          })}
        </div>

        {/* Wish Card detail Board */}
        <AnimatePresence>
          {selectedFlowerWish && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 flex gap-4 items-center min-h-[100px] z-10"
              id="wishDetailBoard"
            >
              <div className="text-4xl p-2 bg-slate-900/80 rounded-xl border border-slate-800 select-none">
                {selectedFlowerWish.emoji}
              </div>
              <div>
                <div className="text-emerald-400 font-bold text-xs md:text-sm uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
                  {selectedFlowerWish.flowerName}
                </div>
                <p className="text-slate-200 text-xs md:text-sm leading-relaxed" style={{ fontFamily: "'Caveat', cursive, serif", fontSize: '20px' }}>
                  "{selectedFlowerWish.wish}"
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
