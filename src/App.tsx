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
    
    // Deep clone INITIAL_STATE to avoid mutating the source reference
    const resetState = JSON.parse(JSON.stringify(INITIAL_STATE));
    setGameState(resetState);
    
    setDoorOpened(false);
    setIsMuted(true);
    audioEngine.stopAmbience();
    audioEngine.stopFireplace();
    setShowResetConfirm(false);
  };

  // Determine clue code values gathered so far
  const cluesCount = Object.values(gameState.cluesFound).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F2EAE0] text-slate-800 flex flex-col relative overflow-x-hidden font-sans select-none antialiased">
      {/* Moving Cosmic Stars Layer */}
      <BackgroundStars />

      {/* Persistent global audio control panel */}
      {gameState.currentRoom !== 'welcome' && (
        <header className="relative z-30 w-full max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center bg-white/75 backdrop-blur-md border-b border-purple-100 shadow-sm rounded-b-2xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-pulse">🏡</span>
            <div>
              <h1 className="font-display font-extrabold text-sm md:text-xl text-purple-700 tracking-tight leading-none">
                Welcome Home
              </h1>
              <span className="text-[9px] md:text-[10px] text-purple-500/80 font-medium hidden xs:inline-block">A little digital sanctuary built with memories</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Clues Progress HUD - Responsive (always visible but compact on mobile) */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50/90 rounded-full border border-purple-100 text-xs text-purple-850">
              <Key className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
              <span className="font-semibold hidden md:inline">Code Clues Gained:</span>
              <span className="font-semibold inline md:hidden text-[10px]">Clues:</span>
              <span className="font-mono text-purple-700 font-bold bg-white/80 px-1.5 md:px-2 py-0.5 rounded border border-purple-200">
                {gameState.cluesFound.hall ? '1' : '_'} {gameState.cluesFound.kitchen ? '2' : '_'} {gameState.cluesFound.coding ? '0' : '_'} {gameState.cluesFound.music ? '9' : '_'}
              </span>
            </div>

            {/* Ambient Sound wave visualizer, sound toggle, and reset button */}
            <div className="flex items-center gap-1.5 md:gap-2">
              {!isMuted && (
                <div className="hidden xs:flex items-end gap-0.5 h-4 px-1">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 16, 4] }}
                      transition={{ repeat: Infinity, duration: 0.6 + i * 0.15, ease: 'easeInOut' }}
                      className="w-0.75 bg-purple-500 rounded-full"
                    />
                  ))}
                </div>
              )}
              
              {/* Reset Game Button (Accessible globally from header) */}
              <button
                onClick={handleResetAllProgress}
                className="p-2 md:p-2.5 rounded-full border border-purple-200 bg-purple-100/40 hover:bg-red-50 hover:text-red-600 text-purple-500 transition cursor-pointer"
                title="Reset game progress and lock safe"
                id="headerResetBtn"
              >
                <Lock className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>

              {/* Mute/Unmute audio */}
              <button
                onClick={handleToggleMusic}
                className={`p-2 md:p-2.5 rounded-full border cursor-pointer transition ${
                  isMuted
                    ? 'bg-purple-100/40 hover:bg-purple-100/70 border-purple-200 text-purple-500'
                    : 'bg-purple-600 hover:bg-purple-500 border-purple-500 text-white shadow-md shadow-purple-200'
                }`}
                title={isMuted ? 'Unmute Lofi ambient chords' : 'Mute Lofi ambient chords'}
                id="globalAudioBtn"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4" />}
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
                  className="font-display font-extrabold text-5xl md:text-7xl text-purple-800 tracking-tight leading-tight select-none"
                >
                  Welcome Home
                </motion.h1>
                <motion.p
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.85 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                  className="text-purple-600/90 italic text-sm md:text-lg select-none font-sans font-medium"
                >
                  A little digital sanctuary built with memories ❤️
                </motion.p>
              </div>

              {/* Cozy House Facade enclosing the Opening Door */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.0, delay: 0.3, ease: 'easeOut' }}
                className="relative w-80 md:w-[380px] bg-purple-50/90 border border-purple-200/80 rounded-3xl p-6 pt-16 flex flex-col items-center justify-end shadow-xl backdrop-blur-md mt-4 mb-6"
              >
                {/* Pitched Roof (triangular border block) */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-0 h-0 
                  border-l-[170px] border-r-[170px] border-b-[42px] 
                  md:border-l-[210px] md:border-r-[210px] md:border-b-[50px] 
                  border-l-transparent border-r-transparent border-b-purple-300/90 z-0" 
                />

                {/* Chimney */}
                <div className="absolute -top-12 right-12 w-6 h-10 bg-purple-400 border border-purple-300 rounded-t-xs" />
                
                {/* Smoke rising from Chimney */}
                <motion.div
                  animate={{ y: [-12, -36], opacity: [0, 0.7, 0], scale: [0.6, 1.4] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
                  className="absolute -top-16 right-[53px] w-3 h-3 bg-purple-300/40 rounded-full blur-[1px]"
                />

                {/* Left window with gold cross grids and glow */}
                <div className="absolute top-14 left-6 md:left-8 w-10 h-14 bg-amber-100/60 border border-amber-200 rounded-md p-1 shadow-[0_0_15px_rgba(251,191,36,0.3)] flex flex-col justify-between">
                  <div className="flex-1 border-b border-r border-amber-300/30" />
                  <div className="flex-1 border-t border-l border-amber-300/30" />
                </div>

                {/* Right window with gold cross grids and glow */}
                <div className="absolute top-14 right-6 md:right-8 w-10 h-14 bg-amber-100/60 border border-amber-200 rounded-md p-1 shadow-[0_0_15px_rgba(251,191,36,0.3)] flex flex-col justify-between">
                  <div className="flex-1 border-b border-r border-amber-300/30" />
                  <div className="flex-1 border-t border-l border-amber-300/30" />
                </div>

                {/* Friendly welcome sign board on the wall */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest font-mono font-bold text-purple-700/80 select-none z-10">
                  Yash's Sanctuary
                </div>

                {/* 3D Rotating Wooden Door Frame & Door */}
                <div className="perspective-1000 w-36 h-56 md:w-40 md:h-60 relative bg-purple-950 border-2 border-purple-300 rounded-lg shadow-inner overflow-hidden mb-2">
                  
                  {/* Glowing Cozy Interior (revealed when door opens) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-300 via-pink-200 to-amber-100 flex flex-col items-center justify-center p-3 text-center">
                    <motion.div
                      animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.7, 0.9, 0.7] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      className="absolute inset-0 bg-gradient-to-r from-amber-200/20 to-purple-300/10 pointer-events-none"
                    />
                    <span className="text-2xl filter drop-shadow">🏡</span>
                    <span className="text-[10px] font-display font-extrabold text-purple-950 uppercase tracking-widest mt-1">
                      Welcome
                    </span>
                    <span className="text-[8px] font-sans font-medium text-purple-900/80">
                      Step inside...
                    </span>
                  </div>

                  {/* The Door itself */}
                  <motion.div
                    animate={doorOpened ? { rotateY: -110, originX: 0 } : { rotateY: 0 }}
                    transition={{ duration: 1.4, ease: 'easeInOut' }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="absolute inset-0 bg-purple-300 border-4 border-purple-400 rounded-md shadow-2xl cursor-pointer group flex flex-col items-center justify-center border-double z-10 origin-left"
                    onClick={handleEnterHome}
                    id="woodenDoor"
                  >
                    {/* Brass lock dial/knob */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-300 rounded-full border border-yellow-500 flex items-center justify-center shadow-md group-hover:scale-110 transition">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                    </div>
                    
                    {/* Cozy greeting sign */}
                    <div className="px-2 py-0.5 bg-white text-purple-950 font-serif border border-purple-300 text-[9px] uppercase tracking-wider font-extrabold rotate-3 shadow-md rounded-xs select-none">
                      Come in
                    </div>
                  </motion.div>
                </div>
                
                {/* Welcome Mat */}
                <div className="w-44 h-2 bg-purple-200 rounded-full border border-purple-300/20 shadow-sm" />

                {/* Little potted plants */}
                <div className="absolute bottom-0 left-3 text-xl select-none opacity-90 filter drop-shadow">🪴</div>
                <div className="absolute bottom-0 right-3 text-xl select-none opacity-90 filter drop-shadow">🪴</div>
              </motion.div>

              <motion.button
                initial={{ y: -15, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                onClick={handleEnterHome}
                className="px-10 py-4 border-none rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-display font-extrabold text-lg cursor-pointer transition shadow-xl shadow-purple-200 active:scale-95"
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
                <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-100 px-3.5 py-1 rounded-full border border-purple-200 flex items-center gap-1.5 w-fit mx-auto">
                  <Compass className="w-4 h-4 animate-spin text-purple-500" />
                  Explore House Blueprint
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-purple-950 tracking-tight">
                  Cozy House Map
                </h2>
                <p className="text-purple-900/80 text-xs md:text-sm">
                  Click on any room card below to travel inside. Uncover clues in the first 4 interactive rooms to obtain the 4-digit numeric code for the secure safe in the Attic!
                </p>
              </div>

              {/* Grid of rooms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {/* 1. Grand Entry Hall */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => handleNavigate('hall')}
                  className="bg-purple-50/80 hover:bg-purple-100/80 border border-purple-200 hover:border-purple-400 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition relative group overflow-hidden backdrop-blur-md shadow-md"
                  id="roomCard-hall"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-3xl p-2 bg-purple-100/60 rounded-xl">🏠</span>
                      {gameState.cluesFound.hall ? (
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Clue "1" Found
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-purple-100 border border-purple-200 rounded-full text-[10px] font-bold text-purple-600 flex items-center gap-1">
                          <Key className="w-3 h-3" /> Unlocks Clue
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-lg text-purple-950 group-hover:text-purple-700 transition">Grand Entry Hall</h3>
                    <p className="text-purple-900/80 text-xs mt-1.5 leading-relaxed">
                      Warm your hands by the crackling fireplace and read the guestbook letters from Rashi and Yash's loving family.
                    </p>
                  </div>
                  <div className="text-[10px] text-purple-600/75 font-mono mt-4 border-t border-purple-200/50 pt-2 flex justify-between items-center">
                    <span>Clue: First digit</span>
                    <span>📍 Main Floor</span>
                  </div>
                </motion.div>

                {/* 2. Memory Bakery */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => handleNavigate('kitchen')}
                  className="bg-pink-50/80 hover:bg-pink-100/80 border border-pink-200 hover:border-pink-400 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition relative group overflow-hidden backdrop-blur-md shadow-md"
                  id="roomCard-kitchen"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-3xl p-2 bg-pink-100/60 rounded-xl">🍰</span>
                      {gameState.cluesFound.kitchen ? (
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Clue "2" Found
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-pink-100 border border-pink-200 rounded-full text-[10px] font-bold text-pink-600 flex items-center gap-1">
                          <Key className="w-3 h-3" /> Unlocks Clue
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-lg text-pink-950 group-hover:text-pink-700 transition">Memory Bakery</h3>
                    <p className="text-pink-900/80 text-xs mt-1.5 leading-relaxed">
                      Stir batter, bake custom chocolate sponge in a retro oven, select tasty toppings, and light/blow candles!
                    </p>
                  </div>
                  <div className="text-[10px] text-pink-600/75 font-mono mt-4 border-t border-pink-200/50 pt-2 flex justify-between items-center">
                    <span>Clue: Second digit</span>
                    <span>📍 Ground Floor</span>
                  </div>
                </motion.div>

                {/* 3. Coding Lab */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => handleNavigate('coding')}
                  className="bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200 hover:border-indigo-400 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition relative group overflow-hidden backdrop-blur-md shadow-md"
                  id="roomCard-coding"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-3xl p-2 bg-indigo-100/60 rounded-xl">💻</span>
                      {gameState.cluesFound.coding ? (
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Clue "0" Found
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-indigo-100 border border-indigo-200 rounded-full text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                          <Key className="w-3 h-3" /> Unlocks Clue
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-lg text-indigo-950 group-hover:text-indigo-700 transition">Coding Lab</h3>
                    <p className="text-indigo-900/80 text-xs mt-1.5 leading-relaxed">
                      A fully terminal-integrated IDE. Inspect bash/python files, trigger code leaks, and compile warm birthday scripts!
                    </p>
                  </div>
                  <div className="text-[10px] text-indigo-600/75 font-mono mt-4 border-t border-indigo-200/50 pt-2 flex justify-between items-center">
                    <span>Clue: Third digit</span>
                    <span>📍 Left Wing</span>
                  </div>
                </motion.div>

                {/* 4. Music Studio */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => handleNavigate('music')}
                  className="bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200 hover:border-emerald-400 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition relative group overflow-hidden backdrop-blur-md shadow-md"
                  id="roomCard-music"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-3xl p-2 bg-emerald-100/60 rounded-xl">🎵</span>
                      {gameState.cluesFound.music ? (
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Clue "9" Found
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-emerald-100 border border-emerald-200 rounded-full text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                          <Key className="w-3 h-3" /> Unlocks Clue
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-lg text-emerald-950 group-hover:text-emerald-700 transition">Music Studio</h3>
                    <p className="text-emerald-900/80 text-xs mt-1.5 leading-relaxed">
                      An interactive synthesized organ of memory. Click keys to listen to melodies, or play custom sheet music!
                    </p>
                  </div>
                  <div className="text-[10px] text-emerald-600/75 font-mono mt-4 border-t border-emerald-200/50 pt-2 flex justify-between items-center">
                    <span>Clue: Fourth digit</span>
                    <span>📍 Right Wing</span>
                  </div>
                </motion.div>

                {/* 5. Photo Gallery */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => handleNavigate('gallery')}
                  className="bg-sky-50/80 hover:bg-sky-100/80 border border-sky-200 hover:border-sky-400 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition relative group overflow-hidden backdrop-blur-md shadow-md"
                  id="roomCard-gallery"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-3xl p-2 bg-sky-100/60 rounded-xl">📷</span>
                      <span className="px-2.5 py-0.5 bg-sky-100 border border-sky-200 rounded-full text-[10px] font-bold text-sky-600">
                        Explore Stories
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-sky-950 group-hover:text-sky-700 transition">Photo Gallery</h3>
                    <p className="text-sky-900/80 text-xs mt-1.5 leading-relaxed">
                      Flip adorable Polaroid photos hanging on strings to reveal highly detailed, heartwarming backstories.
                    </p>
                  </div>
                  <div className="text-[10px] text-sky-600/75 font-mono mt-4 border-t border-sky-200/50 pt-2 flex justify-between items-center">
                    <span>No Clues hidden</span>
                    <span>📍 East Hall</span>
                  </div>
                </motion.div>

                {/* 6. Wish Garden */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => handleNavigate('garden')}
                  className="bg-teal-50/80 hover:bg-teal-100/80 border border-teal-200 hover:border-teal-400 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition relative group overflow-hidden backdrop-blur-md shadow-md"
                  id="roomCard-garden"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-3xl p-2 bg-teal-100/60 rounded-xl">🌱</span>
                      <span className="px-2.5 py-0.5 bg-teal-100 border border-teal-200 rounded-full text-[10px] font-bold text-teal-600">
                        Grow Wishes
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-teal-950 group-hover:text-teal-700 transition">Wish Meadow</h3>
                    <p className="text-teal-900/80 text-xs mt-1.5 leading-relaxed">
                      Plant seed cards, pour water, and watch them grow with transitions into glowing, color-changing neon wish flowers!
                    </p>
                  </div>
                  <div className="text-[10px] text-teal-600/75 font-mono mt-4 border-t border-teal-200/50 pt-2 flex justify-between items-center">
                    <span>No Clues hidden</span>
                    <span>📍 Backyard</span>
                  </div>
                </motion.div>

                {/* 7. Sibling Letter */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => handleNavigate('letter')}
                  className="bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200 hover:border-rose-400 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition relative group overflow-hidden backdrop-blur-md shadow-md"
                  id="roomCard-letter"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-3xl p-2 bg-rose-100/60 rounded-xl">💌</span>
                      <span className="px-2.5 py-0.5 bg-rose-100 border border-rose-200 rounded-full text-[10px] font-bold text-rose-600">
                        Read Card
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-rose-950 group-hover:text-rose-700 transition">Heartfelt Letter</h3>
                    <p className="text-rose-900/80 text-xs mt-1.5 leading-relaxed">
                      Read a deeply personal parchment scroll expressing Rashi's infinite love and support.
                    </p>
                  </div>
                  <div className="text-[10px] text-rose-600/75 font-mono mt-4 border-t border-rose-200/50 pt-2 flex justify-between items-center">
                    <span>Mellow Lofi Chords</span>
                    <span>📍 Cozy Study</span>
                  </div>
                </motion.div>

                {/* 8. Secret Attic */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => handleNavigate('attic')}
                  className="bg-fuchsia-50/80 hover:bg-fuchsia-100/80 border border-fuchsia-200 hover:border-fuchsia-400 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition relative group overflow-hidden backdrop-blur-md shadow-md"
                  id="roomCard-attic"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-3xl p-2 bg-fuchsia-100/60 rounded-xl">📦</span>
                      {gameState.chestUnlocked ? (
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                          <Award className="w-3 h-3 text-emerald-700" /> Safe Open!
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-fuchsia-100 border border-fuchsia-200 rounded-full text-[10px] font-bold text-fuchsia-600 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Combination Locked
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-lg text-fuchsia-950 group-hover:text-fuchsia-700 transition">Secret Cozy Attic</h3>
                    <p className="text-fuchsia-900/80 text-xs mt-1.5 leading-relaxed">
                      A vintage safe sits here. Punch in the 4 secret digits gathered from the house to reveal the main celebration!
                    </p>
                  </div>
                  <div className="text-[10px] text-fuchsia-600/75 font-mono mt-4 border-t border-fuchsia-200/50 pt-2 flex justify-between items-center">
                    <span>Combination Required</span>
                    <span>📍 Upper Floor</span>
                  </div>
                </motion.div>
              </div>

              {/* Reset progress footer control */}
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleResetAllProgress}
                  className="px-5 py-2.5 bg-purple-100/50 hover:bg-red-50 hover:text-red-600 text-purple-700/80 border border-purple-200 hover:border-red-200 rounded-full text-xs font-semibold tracking-wide transition cursor-pointer"
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
