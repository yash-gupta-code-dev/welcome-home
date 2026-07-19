/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Lock, Unlock, Award, Volume2, Sparkles, Flame, CheckCircle, Printer } from 'lucide-react';
import { audioEngine } from '../lib/AudioEngine';

interface RoomAtticProps {
  onBackToMap: () => void;
  chestUnlocked: boolean;
  onUnlockChest: () => void;
  clues: {
    hall: boolean;
    kitchen: boolean;
    coding: boolean;
    music: boolean;
  };
}

export default function RoomAttic({
  onBackToMap,
  chestUnlocked,
  onUnlockChest,
  clues,
}: RoomAtticProps) {
  const [pinCode, setPinCode] = useState<string>('');
  const [pinError, setPinError] = useState(false);
  const [customName, setCustomName] = useState('Yash');
  const [candlesLit, setCandlesLit] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleKeyPress = (num: string) => {
    if (pinCode.length >= 4) return;
    audioEngine.playNote(520 + pinCode.length * 80, 'sine', 0.1);
    setPinCode((prev) => prev + num);
    setPinError(false);
  };

  const handleClear = () => {
    audioEngine.playNote(300, 'triangle', 0.15);
    setPinCode('');
    setPinError(false);
  };

  const handleSubmitPin = () => {
    if (pinCode === '1209') {
      audioEngine.playDoorCreak();
      setTimeout(() => {
        audioEngine.playConfettiPop();
        onUnlockChest();
      }, 1000);
    } else {
      audioEngine.playNote(150, 'sawtooth', 0.5);
      setPinError(true);
      setPinCode('');
    }
  };

  const handlePlaySound = (sound: 'horn' | 'sparkle' | 'chime') => {
    if (sound === 'horn') {
      audioEngine.playPartyHorn();
    } else if (sound === 'sparkle') {
      audioEngine.playSparkle();
    } else {
      audioEngine.playChime();
    }
  };

  const handleBlowOutFinalCandles = () => {
    audioEngine.playBlowWind();
    setTimeout(() => {
      setCandlesLit(false);
      audioEngine.playConfettiPop();
    }, 450);
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
          id="atticBackBtn"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to House Map
        </button>
        <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full text-xs text-purple-300">
          📦 Cozy Attic (Secret Vault)
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900/75 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md flex-grow flex flex-col justify-center relative">
        
        {/* Floating hanging fairy lights */}
        <div className="absolute top-0 inset-x-12 h-6 flex justify-between select-none opacity-60">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-0.5 h-3 bg-slate-700" />
              <div className="w-2 h-2 rounded-full bg-yellow-200 animate-pulse shadow-[0_0_8px_#fef08a]" style={{ animationDelay: `${i * 0.3}s` }} />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!chestUnlocked ? (
            /* LOCKED STATE (Combination Lock Dial) */
            <motion.div
              key="locked-vault"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-6 space-y-6"
            >
              <div className="text-center max-w-md mx-auto space-y-2">
                <div className="w-16 h-16 bg-purple-500/15 border border-purple-500/30 text-purple-300 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold">Rashi's Secret Vault</h2>
                <p className="text-slate-400 text-sm">
                  The final birthday treasure is safe inside! Enter the 4-digit code compiled from clues hidden in the rooms of this house.
                </p>
              </div>

              {/* Clues board tracker */}
              <div className="grid grid-cols-4 gap-3 w-full max-w-sm text-center">
                <div className={`p-2.5 rounded-xl border text-[10px] font-mono ${clues.hall ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-950/50 border-slate-850 text-slate-600'}`}>
                  <div>Hall Clue</div>
                  <div className="font-bold text-xs mt-1">{clues.hall ? '1' : '?'}</div>
                </div>
                <div className={`p-2.5 rounded-xl border text-[10px] font-mono ${clues.kitchen ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-950/50 border-slate-850 text-slate-600'}`}>
                  <div>Kitchen Clue</div>
                  <div className="font-bold text-xs mt-1">{clues.kitchen ? '2' : '?'}</div>
                </div>
                <div className={`p-2.5 rounded-xl border text-[10px] font-mono ${clues.coding ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-950/50 border-slate-850 text-slate-600'}`}>
                  <div>Coding Clue</div>
                  <div className="font-bold text-xs mt-1">{clues.coding ? '0' : '?'}</div>
                </div>
                <div className={`p-2.5 rounded-xl border text-[10px] font-mono ${clues.music ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-950/50 border-slate-850 text-slate-600'}`}>
                  <div>Music Clue</div>
                  <div className="font-bold text-xs mt-1">{clues.music ? '9' : '?'}</div>
                </div>
              </div>

              {/* Pin Pad Visual */}
              <div className="bg-[#12121e] border-2 border-slate-800 p-5 rounded-3xl w-full max-w-xs shadow-2xl flex flex-col items-center">
                {/* Pin Screen Display */}
                <div className={`w-full py-4 px-6 rounded-2xl bg-slate-950 border border-slate-850 mb-5 font-mono text-center tracking-[0.5em] text-xl font-extrabold ${
                  pinError ? 'text-red-500 border-red-500/50 animate-shake' : 'text-purple-300'
                }`}>
                  {pinError ? 'ERROR' : pinCode.padEnd(4, '•')}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-3 gap-3 w-full mb-4">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleKeyPress(num)}
                      className="aspect-square bg-slate-800/60 hover:bg-slate-700/60 active:scale-95 border border-slate-750 font-bold font-mono text-lg rounded-2xl transition cursor-pointer"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={handleClear}
                    className="aspect-square bg-red-950/40 hover:bg-red-900/40 active:scale-95 border border-red-900/25 text-red-400 font-semibold font-mono text-xs rounded-2xl transition cursor-pointer"
                  >
                    CLEAR
                  </button>
                  <button
                    onClick={() => handleKeyPress('0')}
                    className="aspect-square bg-slate-800/60 hover:bg-slate-700/60 active:scale-95 border border-slate-750 font-bold font-mono text-lg rounded-2xl transition cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    onClick={handleSubmitPin}
                    disabled={pinCode.length < 4}
                    className="aspect-square bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold font-mono text-xs rounded-2xl transition disabled:opacity-40 cursor-pointer flex items-center justify-center"
                    id="safeEnterBtn"
                  >
                    ENTER
                  </button>
                </div>
              </div>

            </motion.div>
          ) : (
            /* UNLOCKED / CELEBRATION STATE */
            <motion.div
              key="celebration-vault"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-6 space-y-8 flex flex-col items-center"
            >
              {/* Unlock Header Banner */}
              <div className="space-y-2">
                <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-full flex items-center justify-center mx-auto mb-2 shadow-[0_0_15px_#10b981]">
                  <Unlock className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-amber-300 flex items-center justify-center gap-2">
                  🎉 HAPPY BIRTHDAY! 🎉
                </h2>
                <p className="text-slate-300 text-sm max-w-lg mx-auto">
                  The safe clicks open, bathing the cozy attic in a warm glowing light. Congratulations! You've unlocked the legendary birthday hoard!
                </p>
              </div>

              {/* Award Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full max-w-3xl">
                {/* Visual Trophy Display */}
                <div className="bg-slate-950/40 border border-slate-800/60 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-between min-h-[300px]">
                  
                  {/* Floating sparkles */}
                  <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-transparent to-transparent pointer-events-none" />

                  <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                    Interactive Prize Claim
                  </h3>

                  <div className="my-6 relative flex flex-col items-center">
                    <motion.div
                      animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                      className="text-7xl select-none"
                    >
                      🏆
                    </motion.div>
                    <div className="w-24 h-3 bg-amber-950 rounded-full filter blur-xs mt-3 opacity-60" />
                  </div>

                  <div className="space-y-3 w-full">
                    {/* Custom Certificate Input */}
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Write your name..."
                      maxLength={24}
                      className="w-full text-center px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-400 transition"
                    />
                    <button
                      onClick={() => {
                        audioEngine.playSparkle();
                        setShowCertificate(true);
                      }}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-950"
                    >
                      <Award className="w-4 h-4" />
                      View Birthday Award
                    </button>
                  </div>
                </div>

                {/* Final Interactive Cake & Soundboard */}
                <div className="flex flex-col gap-5 justify-between h-full">
                  
                  {/* Birthday Cake */}
                  <div className="bg-slate-950/40 border border-slate-800/60 rounded-3xl p-5 flex flex-col items-center relative">
                    {/* Glowing Candle fire */}
                    <div className="flex gap-3 justify-center mb-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center relative w-2 h-8">
                          {candlesLit && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 0.9, 1] }}
                              transition={{ repeat: Infinity, duration: 0.5 }}
                              className="absolute -top-4 w-2 h-4 bg-orange-500 rounded-full filter blur-xxs"
                            />
                          )}
                          <div className="w-1 h-full bg-linear-to-b from-yellow-300 to-amber-500 rounded" />
                        </div>
                      ))}
                    </div>

                    <div className="w-32 h-14 bg-pink-400 rounded-t-xl border-b-4 border-amber-950 flex items-center justify-center text-2xl select-none">
                      🎂
                    </div>
                    <div className="w-36 h-2 bg-slate-400 rounded-full" />

                    <div className="mt-3 flex gap-2">
                      {candlesLit ? (
                        <button
                          onClick={handleBlowOutFinalCandles}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-bold cursor-pointer transition"
                        >
                          💨 Blow Candles
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            audioEngine.playChime();
                            setCandlesLit(true);
                          }}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold cursor-pointer transition"
                        >
                          🔥 Relight
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Party Soundboard */}
                  <div className="bg-slate-950/40 border border-slate-800/60 rounded-3xl p-5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3 text-center flex items-center gap-1 justify-center">
                      <Volume2 className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                      Party Soundboard
                    </span>
                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        onClick={() => handlePlaySound('horn')}
                        className="py-3 px-1.5 bg-slate-800 hover:bg-slate-750 rounded-xl text-center text-xs font-semibold cursor-pointer border border-slate-750 transition active:scale-95"
                      >
                        📯 Horn
                      </button>
                      <button
                        onClick={() => handlePlaySound('sparkle')}
                        className="py-3 px-1.5 bg-slate-800 hover:bg-slate-750 rounded-xl text-center text-xs font-semibold cursor-pointer border border-slate-750 transition active:scale-95"
                      >
                        ✨ Sparkle
                      </button>
                      <button
                        onClick={() => handlePlaySound('chime')}
                        className="py-3 px-1.5 bg-slate-800 hover:bg-slate-750 rounded-xl text-center text-xs font-semibold cursor-pointer border border-slate-750 transition active:scale-95"
                      >
                        🔔 Chime
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Customizable Certificate Print Modal Overlay */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, rotate: -0.5 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.95, rotate: 0.5 }}
              className="bg-[#fcfaf4] text-amber-950 border-8 border-double border-amber-900 shadow-2xl rounded-3xl p-8 max-w-xl w-full text-center flex flex-col justify-between max-h-[85vh] overflow-y-auto font-serif"
              id="certificateModal"
            >
              {/* Close Button Header */}
              <div className="flex justify-end mb-4 font-sans print:hidden">
                <button
                  onClick={() => setShowCertificate(false)}
                  className="px-3.5 py-1.5 bg-amber-900/10 hover:bg-amber-900/20 text-amber-900 font-semibold rounded-lg text-xs cursor-pointer transition"
                >
                  Close
                </button>
              </div>

              {/* Certificate Inner content */}
              <div className="border-2 border-dashed border-amber-900/30 p-6 md:p-8 space-y-6">
                <span className="text-amber-800 font-bold uppercase tracking-widest text-xs md:text-sm block">Certificate of Legendary Love</span>
                
                <h3 className="text-3xl md:text-4xl font-extrabold text-amber-900 font-serif leading-tight">
                  WORLD'S BEST BOYFRIEND
                </h3>

                <span className="text-xs text-amber-700 block italic">This prestigious award is proudly conferred to</span>

                <div className="py-2 border-b-2 border-dashed border-amber-900/30 font-bold text-2xl md:text-3xl font-serif text-amber-950 uppercase tracking-tight my-4">
                  {customName || 'Yash'}
                </div>

                <p className="text-xs md:text-sm text-stone-700 leading-relaxed max-w-sm mx-auto italic font-sans">
                  For being the most incredible partner, a brilliant engineer, curating the most beautiful playlists, and bringing endless music, warmth, and love into my life every single day.
                </p>

                <div className="grid grid-cols-2 gap-8 items-end pt-6 text-[10px] font-sans font-semibold text-stone-500">
                  <div className="text-center flex flex-col items-center">
                    <span className="font-mono text-stone-900 mb-1" style={{ fontFamily: "'Caveat', cursive", fontSize: '20px' }}>Rashi</span>
                    <div className="w-full border-t border-stone-300 pt-1 uppercase tracking-wider">With All My Heart</div>
                  </div>
                  <div className="text-center flex flex-col items-center">
                    <span className="text-stone-900 mb-1 font-mono">July 18th, 2026</span>
                    <div className="w-full border-t border-stone-300 pt-1 uppercase tracking-wider">Date Granted</div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex justify-center gap-4 font-sans print:hidden">
                <button
                  onClick={() => {
                    audioEngine.playSparkle();
                    window.print();
                  }}
                  className="px-5 py-2 bg-amber-800 hover:bg-amber-750 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition"
                >
                  <Printer className="w-4 h-4" />
                  Print Certificate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
