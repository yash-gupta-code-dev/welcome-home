/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, ShieldQuestion, Check, Lock, Award, Heart, Key, Compass } from 'lucide-react';
import { RoomId, GameState } from './types';
import { audioEngine } from './lib/AudioEngine';

// Components
import BackgroundStars from './components/BackgroundStars';
import RoomHall from './components/RoomHall';
import RoomKitchen from './components/RoomKitchen';
import RoomCoding from './components/RoomCoding';
import RoomMusic from './components/RoomMusic';
import RoomGallery from './components/RoomGallery';
import RoomGarden from './components/RoomGarden';
import RoomLetter from './components/RoomLetter';
import RoomAttic from './components/RoomAttic';

const INITIAL_STATE: GameState = {
  currentRoom: 'welcome',
  cluesFound: {
    hall: false,
    kitchen: false,
    coding: false,
    music: false,
  },
  chestUnlocked: false,
  activeMusic: false,
  bakedCake: {
    completed: false,
    frosting: '',
    toppings: [],
    candlesLit: false,
    candlesBlown: false,
  },
  gardenWishes: {
    plantedCount: 0,
    wateredCount: 0,
    flowersBloomed: [],
  },
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [doorOpened, setDoorOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Synchronize state from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('welcome_home_game_state_2026');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGameState(parsed);
        // If they had music active, let's keep track
        setIsMuted(!parsed.activeMusic);
      } catch (e) {
        setGameState(INITIAL_STATE);
      }
    }
  }, []);

  const saveState = (updater: GameState | ((prev: GameState) => GameState)) => {
    setGameState((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem('welcome_home_game_state_2026', JSON.stringify(updated));
      return updated;
    });
  };

  const handleToggleMusic = () => {
    audioEngine.init();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    
    if (nextMuted) {
      audioEngine.stopAmbience();
    } else {
      audioEngine.startAmbience();
    }

    saveState((prev) => ({
      ...prev,
      activeMusic: !nextMuted,
    }));
  };

  const handleEnterHome = () => {
    audioEngine.init();
    audioEngine.playDoorCreak();
    setDoorOpened(true);
    
    // Automatically unmute and play soft ambient chords to guide them
    setIsMuted(false);
    audioEngine.startAmbience();

    setTimeout(() => {
      saveState((prev) => ({
        ...prev,
        currentRoom: 'map',
        activeMusic: true,
      }));
    }, 1500);
  };

  const handleNavigate = (room: RoomId) => {
    audioEngine.init();
    audioEngine.playNote(440, 'sine', 0.1);
    saveState((prev) => ({
      ...prev,
      currentRoom: room,
    }));
  };

  const handleClueFound = (room: 'hall' | 'kitchen' | 'coding' | 'music') => {
    saveState((prev) => ({
      ...prev,
      cluesFound: {
        ...prev.cluesFound,
        [room]: true,
      },
    }));
  };

  const handleUnlockChest = () => {
    saveState((prev) => ({
      ...prev,
      chestUnlocked: true,
    }));
  };

  const handleUpdateBakedCake = (cake: any) => {
    saveState((prev) => ({
      ...prev,
      bakedCake: cake,
    }));
  };

  const handleUpdateGardenWishes = (garden: any) => {
    saveState((prev) => ({
      ...prev,
      gardenWishes: garden,
    }));
  };

  const handleResetAllProgress = () => {
    setShowResetConfirm(true);
  };

  const executeResetAllProgress = () => {
    audioEngine.playNote(150, 'sawtooth', 0.5);
    localStorage.removeItem('welcome_home_game_state_2026');
    localStorage.removeItem('welcome_home_guestbook');
    setGameState(INITIAL_STATE);
    setDoorOpened(false);
    setIsMuted(true);
    audioEngine.stopAmbience();
    audioEngine.stopFireplace();
    setShowResetConfirm(false);
  };

  // Determine clue code values gathered so far
  const cluesCount = Object.values(gameState.cluesFound).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col relative overflow-x-hidden font-sans select-none antialiased">
      {/* Moving Cosmic Stars Layer */}
      <BackgroundStars />

      {/* Persistent global audio control panel */}
      {gameState.currentRoom !== 'welcome' && (
        <header className="relative z-30 w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center bg-slate-900/40 backdrop-blur-md border-b border-slate-800/60 shadow-lg">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-pulse">🏡</span>
            <div>
              <h1 className="font-display font-extrabold text-lg md:text-xl text-amber-300 tracking-tight leading-none">
                Welcome Home
              </h1>
              <span className="text-[10px] text-slate-400 font-medium">A little digital sanctuary built with memories</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Clues Progress HUD */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-950/60 rounded-full border border-slate-800 text-xs text-slate-300">
              <Key className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="font-semibold">Code Clues Gained:</span>
              <span className="font-mono text-amber-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-amber-500/15">
                {gameState.cluesFound.hall ? '1' : '_'} {gameState.cluesFound.kitchen ? '2' : '_'} {gameState.cluesFound.coding ? '0' : '_'} {gameState.cluesFound.music ? '9' : '_'}
              </span>
            </div>

            {/* Ambient Sound wave visualizer and sound toggle */}
            <div className="flex items-center gap-2">
              {!isMuted && (
                <div className="flex items-end gap-0.5 h-4 px-1">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 16, 4] }}
                      transition={{ repeat: Infinity, duration: 0.6 + i * 0.15, ease: 'easeInOut' }}
                      className="w-0.75 bg-amber-400 rounded-full"
                    />
                  ))}
                </div>
              )}
              <button
                onClick={handleToggleMusic}
                className={`p-2.5 rounded-full border cursor-pointer transition ${
                  isMuted
                    ? 'bg-slate-800/40 hover:bg-slate-700/40 border-slate-700 text-slate-400'
                    : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 text-amber-300 shadow-md shadow-amber-950/20'
                }`}
                title={isMuted ? 'Unmute Lofi ambient chords' : 'Mute Lofi ambient chords'}
                id="globalAudioBtn"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* CORE ROUTING ENGINE */}
      <main className="flex-grow flex items-center justify-center relative w-full overflow-y-auto">
        <AnimatePresence mode="wait">
          
          {/* WELCOME SCREEN */}
          {gameState.currentRoom === 'welcome' && (
            <motion.div
              key="welcome-room"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-20 w-full max-w-xl px-4 py-8 text-center flex flex-col items-center justify-center space-y-8"
              id="welcomeView"
            >
              <div className="space-y-3">
                <motion.h1
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.0, ease: 'easeOut' }}
                  className="font-display font-extrabold text-5xl md:text-7xl text-amber-300 tracking-tight leading-tight select-none"
                >
                  Welcome Home
                </motion.h1>
                <motion.p
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.8 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                  className="text-slate-300 italic text-sm md:text-lg select-none font-sans"
                >
                  A little digital sanctuary built with memories ❤️
                </motion.p>
              </div>

              {/* 3D Rotating Wooden Door */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.0, delay: 0.3, ease: 'easeOut' }}
                className="perspective-1000 w-44 h-64 flex justify-center items-center my-6"
              >
                <motion.div
                  animate={doorOpened ? { rotateY: -100, originX: 0 } : { rotateY: 0 }}
                  transition={{ duration: 1.4, ease: 'easeInOut' }}
                  className="w-full h-full bg-amber-800 border-4 border-amber-900 rounded-lg shadow-2xl relative cursor-pointer group flex items-center justify-center border-double"
                  onClick={handleEnterHome}
                  id="woodenDoor"
                >
                  {/* Brass lock dial/knob */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full border border-yellow-600 flex items-center justify-center shadow-md group-hover:scale-110 transition">
                    <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full" />
                  </div>
                  
                  {/* Cozy greeting sign */}
                  <div className="px-3 py-1 bg-[#fffdf0] text-amber-950 font-serif border border-amber-900/30 text-[10px] uppercase tracking-wider font-extrabold rotate-3 shadow-md rounded-xs select-none">
                    Come inside
                  </div>
                </motion.div>
              </motion.div>

              <motion.button
                initial={{ y: -15, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                onClick={handleEnterHome}
                className="px-10 py-4 border-none rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-display font-extrabold text-lg cursor-pointer transition shadow-xl shadow-amber-950/60 active:scale-95"
                id="enterBtn"
              >
                Enter Yash's Birthday Sanctuary
              </motion.button>
            </motion.div>
          )}

          {/* HOUSE MAP BLUEPRINT */}
          {gameState.currentRoom === 'map' && (
            <motion.div
              key="map-room"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 flex flex-col justify-between"
              id="blueprintView"
            >
              {/* Sibling HUD intro */}
              <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/15 flex items-center gap-1.5 w-fit mx-auto">
                  <Compass className="w-4 h-4 animate-spin text-amber-400" />
                  Explore House Blueprint
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-100 tracking-tight">
                  Cozy House Map
                </h2>
                <p className="text-slate-400 text-xs md:text-sm">
                  Click on any room card below to travel inside. Uncover clues in the first 4 interactive rooms to obtain the 4-digit numeric code for the secure safe in the Attic!
                </p>
              </div>

              {/* Grid of rooms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {/* 1. Grand Entry Hall */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => handleNavigate('hall')}
                  className="bg-slate-900/70 hover:bg-slate-850/80 border border-slate-800 hover:border-amber-500/30 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition relative group overflow-hidden backdrop-blur-md shadow-lg"
                  id="roomCard-hall"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-3xl p-2 bg-amber-500/10 rounded-xl">🏠</span>
                      {gameState.cluesFound.hall ? (
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Clue "1" Found
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-bold text-amber-300 flex items-center gap-1">
                          <Key className="w-3 h-3" /> Unlocks Clue
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-lg group-hover:text-amber-300 transition">Grand Entry Hall</h3>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                      Warm your hands by the crackling fireplace and read the guestbook letters from Rashi and Yash's loving family.
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-4 border-t border-slate-800/40 pt-2 flex justify-between items-center">
                    <span>Clue: First digit</span>
                    <span>📍 Main Floor</span>
                  </div>
                </motion.div>

                {/* 2. Memory Bakery */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => handleNavigate('kitchen')}
                  className="bg-slate-900/70 hover:bg-slate-850/80 border border-slate-800 hover:border-pink-500/30 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition relative group overflow-hidden backdrop-blur-md shadow-lg"
                  id="roomCard-kitchen"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-3xl p-2 bg-pink-500/10 rounded-xl">🍰</span>
                      {gameState.cluesFound.kitchen ? (
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Clue "2" Found
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-pink-500/10 border border-pink-500/20 rounded-full text-[10px] font-bold text-pink-300 flex items-center gap-1">
                          <Key className="w-3 h-3" /> Unlocks Clue
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-lg group-hover:text-pink-300 transition">Memory Bakery</h3>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                      Stir batter, bake custom chocolate sponge in a retro oven, select tasty toppings, and light/blow candles!
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-4 border-t border-slate-800/40 pt-2 flex justify-between items-center">
                    <span>Clue: Second digit</span>
                    <span>📍 Ground Floor</span>
                  </div>
                </motion.div>

                {/* 3. Coding Lab */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => handleNavigate('coding')}
                  className="bg-slate-900/70 hover:bg-slate-850/80 border border-slate-800 hover:border-indigo-500/30 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition relative group overflow-hidden backdrop-blur-md shadow-lg"
                  id="roomCard-coding"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-3xl p-2 bg-indigo-500/10 rounded-xl">💻</span>
                      {gameState.cluesFound.coding ? (
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Clue "0" Found
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-300 flex items-center gap-1">
                          <Key className="w-3 h-3" /> Unlocks Clue
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-lg group-hover:text-indigo-300 transition">Coding Lab</h3>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                      A fully terminal-integrated IDE. Inspect bash/python files, trigger code leaks, and compile warm birthday scripts!
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-4 border-t border-slate-800/40 pt-2 flex justify-between items-center">
                    <span>Clue: Third digit</span>
                    <span>📍 Left Wing</span>
                  </div>
                </motion.div>

                {/* 4. Music Studio */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => handleNavigate('music')}
                  className="bg-slate-900/70 hover:bg-slate-850/80 border border-slate-800 hover:border-emerald-500/30 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition relative group overflow-hidden backdrop-blur-md shadow-lg"
                  id="roomCard-music"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-3xl p-2 bg-emerald-500/10 rounded-xl">🎵</span>
                      {gameState.cluesFound.music ? (
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Clue "9" Found
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                          <Key className="w-3 h-3" /> Unlocks Clue
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-lg group-hover:text-emerald-300 transition">Music Studio</h3>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                      An interactive synthesized organ of memory. Click keys to listen to melodies, or play custom sheet music!
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-4 border-t border-slate-800/40 pt-2 flex justify-between items-center">
                    <span>Clue: Fourth digit</span>
                    <span>📍 Right Wing</span>
                  </div>
                </motion.div>

                {/* 5. Photo Gallery */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => handleNavigate('gallery')}
                  className="bg-slate-900/70 hover:bg-slate-850/80 border border-slate-800 hover:border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition relative group overflow-hidden backdrop-blur-md shadow-lg"
                  id="roomCard-gallery"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-3xl p-2 bg-cyan-500/10 rounded-xl">📷</span>
                      <span className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-bold text-cyan-300">
                        Explore Stories
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg group-hover:text-cyan-300 transition">Photo Gallery</h3>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                      Flip adorable Polaroid photos hanging on strings to reveal highly detailed, heartwarming backstories.
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-4 border-t border-slate-800/40 pt-2 flex justify-between items-center">
                    <span>No Clues hidden</span>
                    <span>📍 East Hall</span>
                  </div>
                </motion.div>

                {/* 6. Wish Garden */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => handleNavigate('garden')}
                  className="bg-slate-900/70 hover:bg-slate-850/80 border border-slate-800 hover:border-teal-500/30 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition relative group overflow-hidden backdrop-blur-md shadow-lg"
                  id="roomCard-garden"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-3xl p-2 bg-teal-500/10 rounded-xl">🌱</span>
                      <span className="px-2.5 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-[10px] font-bold text-teal-300">
                        Grow Wishes
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg group-hover:text-teal-300 transition">Wish Meadow</h3>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                      Plant seed cards, pour water, and watch them grow with transitions into glowing, color-changing neon wish flowers!
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-4 border-t border-slate-800/40 pt-2 flex justify-between items-center">
                    <span>No Clues hidden</span>
                    <span>📍 Backyard</span>
                  </div>
                </motion.div>

                {/* 7. Sibling Letter */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => handleNavigate('letter')}
                  className="bg-slate-900/70 hover:bg-slate-850/80 border border-slate-800 hover:border-rose-500/30 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition relative group overflow-hidden backdrop-blur-md shadow-lg"
                  id="roomCard-letter"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-3xl p-2 bg-rose-500/10 rounded-xl">💌</span>
                      <span className="px-2.5 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-[10px] font-bold text-rose-300">
                        Read Card
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg group-hover:text-rose-300 transition">Heartfelt Letter</h3>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                      Read a deeply personal parchment scroll expressing Rashi's infinite love and support.
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-4 border-t border-slate-800/40 pt-2 flex justify-between items-center">
                    <span>Mellow Lofi Chords</span>
                    <span>📍 Cozy Study</span>
                  </div>
                </motion.div>

                {/* 8. Secret Attic */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => handleNavigate('attic')}
                  className="bg-slate-900/70 hover:bg-slate-850/80 border border-slate-800 hover:border-purple-500/30 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition relative group overflow-hidden backdrop-blur-md shadow-lg"
                  id="roomCard-attic"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-3xl p-2 bg-purple-500/10 rounded-xl">📦</span>
                      {gameState.chestUnlocked ? (
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                          <Award className="w-3 h-3 text-emerald-300" /> Safe Open!
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-bold text-purple-300 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Combination Locked
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-lg group-hover:text-purple-300 transition">Secret Cozy Attic</h3>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                      A vintage safe sits here. Punch in the 4 secret digits gathered from the house to reveal the main celebration!
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-4 border-t border-slate-800/40 pt-2 flex justify-between items-center">
                    <span>Combination Required</span>
                    <span>📍 Upper Floor</span>
                  </div>
                </motion.div>
              </div>

              {/* Reset progress footer control */}
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleResetAllProgress}
                  className="px-5 py-2.5 bg-slate-950/30 hover:bg-red-950/20 border border-slate-850 hover:border-red-500/15 text-slate-500 hover:text-red-400 rounded-full text-xs font-semibold tracking-wide transition cursor-pointer"
                  id="progressResetBtn"
                >
                  Reset Game Progress & Safe Lock
                </button>
              </div>
            </motion.div>
          )}

          {/* ROOM 1: HALL */}
          {gameState.currentRoom === 'hall' && (
            <RoomHall
              onBackToMap={() => handleNavigate('map')}
              onClueFound={handleClueFound}
              isClueFound={gameState.cluesFound.hall}
            />
          )}

          {/* ROOM 2: KITCHEN */}
          {gameState.currentRoom === 'kitchen' && (
            <RoomKitchen
              onBackToMap={() => handleNavigate('map')}
              onClueFound={handleClueFound}
              isClueFound={gameState.cluesFound.kitchen}
              bakedCakeState={gameState.bakedCake}
              onUpdateBakedCake={handleUpdateBakedCake}
            />
          )}

          {/* ROOM 3: CODING */}
          {gameState.currentRoom === 'coding' && (
            <RoomCoding
              onBackToMap={() => handleNavigate('map')}
              onClueFound={handleClueFound}
              isClueFound={gameState.cluesFound.coding}
            />
          )}

          {/* ROOM 4: MUSIC */}
          {gameState.currentRoom === 'music' && (
            <RoomMusic
              onBackToMap={() => handleNavigate('map')}
              onClueFound={handleClueFound}
              isClueFound={gameState.cluesFound.music}
            />
          )}

          {/* ROOM 5: GALLERY */}
          {gameState.currentRoom === 'gallery' && (
            <RoomGallery onBackToMap={() => handleNavigate('map')} />
          )}

          {/* ROOM 6: GARDEN */}
          {gameState.currentRoom === 'garden' && (
            <RoomGarden
              onBackToMap={() => handleNavigate('map')}
              gardenWishes={gameState.gardenWishes}
              onUpdateGardenWishes={handleUpdateGardenWishes}
            />
          )}

          {/* ROOM 7: LETTER */}
          {gameState.currentRoom === 'letter' && (
            <RoomLetter onBackToMap={() => handleNavigate('map')} />
          )}

          {/* ROOM 8: ATTIC */}
          {gameState.currentRoom === 'attic' && (
            <RoomAttic
              onBackToMap={() => handleNavigate('map')}
              chestUnlocked={gameState.chestUnlocked}
              onUnlockChest={handleUnlockChest}
              clues={gameState.cluesFound}
            />
          )}

        </AnimatePresence>
      </main>

      {/* Custom reset confirmation modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden text-center space-y-6"
            >
              <div className="w-16 h-16 bg-red-500/15 border border-red-500/30 text-red-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-100">Lock Safe & Reset Progress?</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Are you sure you want to lock the attic safe and completely reset your birthday celebration progress? This will clear your custom cake, planted garden wishes, and exit back to the front door.
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={executeResetAllProgress}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-md shadow-red-950 transition active:scale-95"
                  id="confirmResetBtn"
                >
                  Yes, Lock & Reset Progress
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
