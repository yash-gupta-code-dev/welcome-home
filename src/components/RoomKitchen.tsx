/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Flame, Sparkles, RefreshCw } from 'lucide-react';
import { audioEngine } from '../lib/AudioEngine';

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
  const [candlesCount, setCandlesCount] = useState(4);
  const [candlesLit, setCandlesLit] = useState(bakedCakeState.candlesLit || false);
  const [candlesBlown, setCandlesBlown] = useState(bakedCakeState.candlesBlown || false);

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
      className="relative z-10 w-full max-w-4xl mx-auto px-4 py-6 text-slate-100 flex flex-col min-h-[85vh]"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-full border border-slate-700 text-sm font-medium transition cursor-pointer"
          id="kitchenBackBtn"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to House Map
        </button>
        <div className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 px-4 py-1.5 rounded-full text-xs text-pink-300">
          🍰 Memory Bakery (Kitchen)
        </div>
      </div>

      {/* Bakery Board */}
      <div className="bg-slate-900/75 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md flex-grow flex flex-col">
        {/* Step indicators */}
        <div className="grid grid-cols-5 gap-2 mb-8 text-center text-xs">
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
          <div className="flex-grow flex flex-col items-center justify-between">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-100">Bowl of Foundations</h2>
              <p className="text-slate-400 text-sm mt-1 max-w-lg">
                Click to add the key ingredients needed to bake a legendary birthday cake for Yash. Each representing a fundamental piece of your support!
              </p>
            </div>

            {/* Bowl with added ingredients */}
            <div className="my-8 relative w-64 h-64 flex items-center justify-center">
              {/* Bowl Back */}
              <div className="absolute bottom-4 w-52 h-28 bg-slate-950 rounded-b-full border-b-4 border-slate-800 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-slate-900/60 flex items-center justify-center">
                  <AnimatePresence>
                    {addedIngredients.map((ingId, idx) => {
                      const ing = INGREDIENTS.find((i) => i.id === ingId);
                      return (
                        <motion.span
                          key={ingId}
                          initial={{ scale: 0, y: -80, opacity: 0 }}
                          animate={{ scale: 1.2, y: 10 + (idx * 5), opacity: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute text-4xl select-none"
                          style={{ left: `${25 + (idx * 25)}px` }}
                        >
                          {ing?.emoji}
                        </motion.span>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* Bowl Front lip */}
              <div className="absolute bottom-28 w-52 h-4 border-2 border-slate-800 bg-slate-950/40 rounded-full" />
            </div>

            {/* Ingredient Selection list */}
            <div className="w-full max-w-2xl">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {INGREDIENTS.map((ing) => {
                  const isAdded = addedIngredients.includes(ing.id);
                  return (
                    <button
                      key={ing.id}
                      onClick={() => handleAddIngredient(ing.id)}
                      disabled={isAdded}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                        isAdded
                          ? 'bg-slate-950/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-45'
                          : 'bg-slate-800/50 hover:bg-slate-700/50 border-slate-750 text-slate-200'
                      }`}
                      id={`ingredient-${ing.id}`}
                    >
                      <span className="text-3xl select-none">{ing.emoji}</span>
                      <span className="text-xs font-semibold leading-tight">{ing.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Next Step Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setStep(1)}
                  disabled={addedIngredients.length < INGREDIENTS.length}
                  className={`px-8 py-3.5 rounded-full font-bold transition flex items-center gap-2 cursor-pointer ${
                    addedIngredients.length === INGREDIENTS.length
                      ? 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-950/50'
                      : 'bg-slate-800 text-slate-500 border border-slate-750 cursor-not-allowed'
                  }`}
                  id="kitchenNextToStir"
                >
                  Stir Batter Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Stir Batter */}
        {step === 1 && (
          <div className="flex-grow flex flex-col items-center justify-between">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-100 font-sans">Whisking Memories</h2>
              <p className="text-slate-400 text-sm mt-1 max-w-lg">
                Click the stir button multiple times to whisk the ingredients together into a beautiful, silky smooth batter.
              </p>
            </div>

            {/* Stirring Bowl visual */}
            <div className="my-8 relative w-56 h-56 flex items-center justify-center">
              {/* Wooden Spoon */}
              <motion.span
                animate={
                  stirProgress > 0 && stirProgress < 5
                    ? { rotate: [0, 360], originX: 0.5, originY: 0.5 }
                    : { rotate: 0 }
                }
                transition={{ repeat: stirProgress > 0 && stirProgress < 5 ? Infinity : 0, duration: 0.8 }}
                className="absolute text-5xl z-20 bottom-16 select-none"
              >
                🥄
              </motion.span>

              {/* Mixing Bowl */}
              <div className="absolute bottom-4 w-48 h-24 bg-slate-950 rounded-b-full border-b-4 border-slate-800 flex items-center justify-center overflow-hidden">
                <div
                  className="w-full bg-amber-900/80 transition-all duration-500"
                  style={{ height: `${20 + stirProgress * 15}%` }}
                />
              </div>
              <div className="absolute bottom-24 w-48 h-4 border-2 border-slate-800 bg-slate-950/40 rounded-full" />
            </div>

            {/* Stirring Button control */}
            <div className="text-center space-y-4">
              <div className="text-sm font-mono text-pink-300 bg-pink-950/30 px-4 py-1.5 rounded-full border border-pink-500/10">
                Batter Consistency: {stirProgress * 20}%
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleStir}
                  className="px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white rounded-full font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-pink-950/50 transition-all"
                  id="kitchenStirBtn"
                >
                  <RefreshCw className={`w-5 h-5 ${stirProgress > 0 && stirProgress < 5 ? 'animate-spin' : ''}`} />
                  {stirProgress >= 5 ? 'Perfect Consistency!' : 'Stir Batter'}
                </button>

                {stirProgress >= 5 && (
                  <button
                    onClick={() => setStep(2)}
                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold cursor-pointer transition-all shadow-lg shadow-emerald-950/30"
                    id="kitchenNextToBake"
                  >
                    Bake the Cake 🍰
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Bake the Cake */}
        {step === 2 && (
          <div className="flex-grow flex flex-col items-center justify-between">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-100">The Magical Oven</h2>
              <p className="text-slate-400 text-sm mt-1 max-w-lg">
                Slide the batter into the vintage oven. Light the embers and watch the cake rise to golden fluff!
              </p>
            </div>

            {/* Glowing Oven Visual */}
            <div className="my-8 w-64 h-56 bg-slate-950 border-4 border-slate-800 rounded-3xl relative overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
              {/* Oven Top vent */}
              <div className="flex justify-between gap-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-8 h-1 bg-slate-800 rounded" />
                ))}
              </div>

              {/* Oven Glass Door */}
              <div className={`flex-grow border-2 border-slate-900 rounded-xl my-3 flex items-center justify-center relative transition-all duration-1000 ${
                isBaking ? 'bg-orange-950/40 border-orange-500/50 shadow-inner shadow-orange-900/60' : 'bg-slate-900/30'
              }`}>
                {/* Baking cake inside glass */}
                <motion.div
                  animate={isBaking ? { scaleY: [1, 1.4], y: [10, -5] } : { scaleY: 1 }}
                  transition={{ duration: 3, ease: 'easeOut' }}
                  className="w-24 h-12 bg-amber-950 rounded-lg absolute bottom-2"
                />

                {/* Oven Heat waves */}
                <AnimatePresence>
                  {isBaking && (
                    <div className="absolute inset-x-0 top-2 flex justify-center gap-4">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -10], opacity: [0, 0.8, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.25 }}
                          className="w-1 h-4 bg-orange-400 rounded-full"
                        />
                      ))}
                    </div>
                  )}
                </AnimatePresence>

                {/* Baking Timer display overlay */}
                {isBaking && (
                  <div className="absolute top-2 right-2 font-mono text-xs text-orange-400 bg-slate-950/80 px-2 py-0.5 rounded border border-orange-500/20">
                    Baking: {bakeTimer}s
                  </div>
                )}
              </div>

              {/* Oven dials */}
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono px-2">
                <span>TEMP: 350°F</span>
                <span>TIMER: 3S</span>
              </div>
            </div>

            {/* Baking Controls */}
            <div className="text-center">
              <button
                onClick={handleStartBaking}
                disabled={isBaking}
                className="px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-bold shadow-lg shadow-orange-950 flex items-center gap-2 cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
                id="kitchenBakeBtn"
              >
                <Flame className="w-5 h-5 animate-pulse" />
                {isBaking ? 'Baking Sponge...' : 'Ignite & Bake!'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Decorate the Cake */}
        {step === 3 && (
          <div className="flex-grow flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Left Column: Decorating Controls */}
            <div className="flex-grow w-full md:w-1/2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100">Frosting & Toppings</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Choose a frosting base, sprinkle some tasty toppings, and get ready for a magical candle-lighting ceremony!
                </p>
              </div>

              {/* Frosting Selection */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Select Frosting</span>
                <div className="grid grid-cols-2 gap-2">
                  {FROSTINGS.map((frost) => (
                    <button
                      key={frost.id}
                      onClick={() => {
                        audioEngine.playNote(500, 'sine', 0.1);
                        setSelectedFrosting(frost.id);
                      }}
                      className={`px-4 py-2.5 rounded-xl border text-left text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
                        selectedFrosting === frost.id
                          ? 'bg-pink-600/10 border-pink-500 text-pink-300'
                          : 'bg-slate-800/40 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full ${frost.color}`} />
                      {frost.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toppings Selection */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Add Toppings</span>
                <div className="grid grid-cols-2 gap-2">
                  {TOPPINGS.map((top) => {
                    const isSelected = selectedToppings.includes(top.id);
                    return (
                      <button
                        key={top.id}
                        onClick={() => handleToggleTopping(top.id)}
                        className={`px-4 py-2.5 rounded-xl border text-left text-sm font-semibold flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-pink-600/10 border-pink-500 text-pink-300'
                            : 'bg-slate-800/40 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg select-none">{top.emoji}</span>
                          {top.name}
                        </span>
                        {isSelected && <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Complete Decoration Button */}
              <button
                onClick={handleCompleteCake}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold cursor-pointer transition shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2"
                id="kitchenCompleteDecorating"
              >
                Assemble Yash's Cake!
              </button>
            </div>

            {/* Right Column: Cake Preview */}
            <div className="w-full md:w-1/2 flex items-center justify-center py-6">
              <div className="relative w-64 h-64 flex flex-col justify-end items-center">
                {/* Frosting layer of cake */}
                <div className={`w-52 h-24 rounded-t-3xl border-b-8 border-amber-950 shadow-inner relative transition-colors duration-500 ${
                  selectedFrosting === 'pink' ? 'bg-pink-300' :
                  selectedFrosting === 'white' ? 'bg-slate-100' :
                  selectedFrosting === 'chocolate' ? 'bg-amber-900' : 'bg-indigo-400'
                }`}>
                  {/* Drips of frosting */}
                  <div className={`absolute -bottom-2 inset-x-0 h-4 flex justify-around select-none ${
                    selectedFrosting === 'pink' ? 'text-pink-300' :
                    selectedFrosting === 'white' ? 'text-slate-100' :
                    selectedFrosting === 'chocolate' ? 'text-amber-900' : 'text-indigo-400'
                  }`}>
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-current rounded-full" />
                    ))}
                  </div>

                  {/* Render toppings */}
                  <div className="absolute inset-0 p-4 grid grid-cols-4 gap-2 text-xl select-none pointer-events-none">
                    {selectedToppings.map((topId, idx) => {
                      const top = TOPPINGS.find((t) => t.id === topId);
                      return [...Array(2)].map((_, i) => (
                        <motion.span
                          key={`${topId}-${idx}-${i}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="inline-block transform"
                          style={{
                            rotate: `${(idx + i) * 35}deg`,
                            translateY: `${(idx * 3) - 5}px`,
                          }}
                        >
                          {top?.emoji}
                        </motion.span>
                      ));
                    })}
                  </div>
                </div>

                {/* Cake Stand */}
                <div className="w-60 h-4 bg-slate-300 rounded-full border-b-2 border-slate-400" />
                <div className="w-20 h-8 bg-slate-400 rounded-b-xl border-b-2 border-slate-500" />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Celebrate (Light and Blow out candles) */}
        {step === 4 && (
          <div className="flex-grow flex flex-col items-center justify-between">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2 justify-center">
                ✨ Blow Out Your Candles! ✨
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-lg">
                Light the birthday candles, wish for code that compiles on the first try, and click to blow them out to discover your second combination clue!
              </p>
            </div>

            {/* Giant Birthday Cake visual */}
            <div className="my-8 relative w-80 h-72 flex flex-col justify-end items-center">
              
              {/* Candles group */}
              <div className="absolute bottom-28 flex justify-center gap-6 z-20">
                {[...Array(candlesCount)].map((_, idx) => (
                  <div key={idx} className="relative w-3 h-14 flex flex-col items-center">
                    {/* Flame */}
                    <AnimatePresence>
                      {candlesLit && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: [1, 1.2, 0.9, 1.1, 1], y: [-2, 0, -2] }}
                          exit={{ scale: 0 }}
                          transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
                          className="absolute -top-6 w-3 h-6 bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-100 rounded-full filter blur-xxs"
                        />
                      )}
                    </AnimatePresence>

                    {/* Candle stick */}
                    <div className="w-2 h-full bg-linear-to-b from-blue-400 to-indigo-600 rounded-md shadow-sm border border-indigo-700" />
                  </div>
                ))}
              </div>

              {/* Cake sponge layer */}
              <div className={`w-56 h-28 rounded-t-3xl border-b-8 border-amber-950 shadow-inner relative transition-colors duration-500 ${
                selectedFrosting === 'pink' ? 'bg-pink-300' :
                selectedFrosting === 'white' ? 'bg-slate-100' :
                selectedFrosting === 'chocolate' ? 'bg-amber-900' : 'bg-indigo-400'
              }`}>
                {/* Frosting drops */}
                <div className={`absolute -bottom-2 inset-x-0 h-4 flex justify-around select-none ${
                  selectedFrosting === 'pink' ? 'text-pink-300' :
                  selectedFrosting === 'white' ? 'text-slate-100' :
                  selectedFrosting === 'chocolate' ? 'text-amber-900' : 'text-indigo-400'
                }`}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-current rounded-full" />
                  ))}
                </div>

                {/* Render toppings */}
                <div className="absolute inset-0 p-4 grid grid-cols-4 gap-2 text-xl select-none pointer-events-none">
                  {selectedToppings.map((topId, idx) => {
                    const top = TOPPINGS.find((t) => t.id === topId);
                    return [...Array(2)].map((_, i) => (
                      <span
                        key={`${topId}-${idx}-${i}`}
                        className="inline-block transform"
                        style={{
                          rotate: `${(idx + i) * 35}deg`,
                          translateY: `${(idx * 3) - 5}px`,
                        }}
                      >
                        {top?.emoji}
                      </span>
                    ));
                  })}
                </div>
              </div>

              {/* Cake Stand */}
              <div className="w-64 h-4 bg-slate-300 rounded-full border-b-2 border-slate-400" />
              <div className="w-24 h-8 bg-slate-400 rounded-b-xl border-b-2 border-slate-500" />
            </div>

            {/* Interaction buttons */}
            <div className="text-center space-y-4">
              {candlesBlown && (
                <div className="text-sm font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-6 py-2 rounded-2xl animate-bounce">
                  ✨ Magic Clue Unlocked! Second safe digit is: <span className="font-mono text-lg font-extrabold text-emerald-300">"2"</span>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleLightCandles}
                  disabled={candlesLit}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-full font-bold flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-40 transition"
                  id="kitchenLightCandlesBtn"
                >
                  <Flame className="w-4 h-4" />
                  Light Candles
                </button>

                {candlesLit && (
                  <button
                    onClick={handleBlowOutCandles}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition"
                    id="kitchenBlowCandlesBtn"
                  >
                    💨 Blow Out!
                  </button>
                )}

                {(candlesBlown || candlesLit) && (
                  <button
                    onClick={handleResetBakery}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full font-semibold flex items-center gap-1 cursor-pointer transition"
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
  );
}
