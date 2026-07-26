/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Heart, Sparkles, Volume2 } from 'lucide-react';
import { audioEngine } from '../lib/AudioEngine';

interface RoomLetterProps {
  onBackToMap: () => void;
}

export default function RoomLetter({ onBackToMap }: RoomLetterProps) {
  // Trigger cozy ambient piano chords when reading the heartfelt letter
  useEffect(() => {
    audioEngine.init();
    audioEngine.startAmbience();
    return () => {
      // Let the music keep playing if they liked it, or we can leave it. Let's let it run but provide mute buttons!
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 w-full max-w-3xl mx-auto px-4 py-6 text-slate-100 flex flex-col min-h-[85vh]"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-full border border-slate-700 text-sm font-medium transition cursor-pointer"
          id="letterBackBtn"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to House Map
        </button>
        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-4 py-1.5 rounded-full text-xs text-rose-300">
          💌 Heartfelt Scroll (Letter)
        </div>
      </div>

      {/* Parchment Letter Body */}
      <div className="bg-[#fcf8f0] text-stone-900 border-4 border-[#BDA6CE] shadow-2xl rounded-3xl p-8 md:p-12 flex-grow flex flex-col justify-between relative overflow-hidden">
        
        {/* Soft Background Watermark */}
        <div className="absolute inset-0 bg-radial-gradient from-amber-100/30 to-transparent pointer-events-none" />

        {/* Floating Hearts particle layout */}
        <div className="absolute top-4 left-6 text-rose-600/15 text-6xl select-none rotate-12">❤️</div>
        <div className="absolute bottom-6 right-8 text-rose-600/10 text-8xl select-none -rotate-12">❤️</div>

        {/* Letter Contents */}
        <div className="space-y-6 text-xl md:text-2xl leading-relaxed font-serif relative z-10 select-text max-w-xl mx-auto" style={{ fontFamily: "'Caveat', cursive, serif" }}>
          
          {/* Audio prompt banner */}
          <div className="flex items-center gap-2 bg-amber-900/5 px-4 py-2 rounded-xl border border-stone-800/10 font-sans text-xs text-stone-600 mb-6 w-fit mx-auto">
            <Volume2 className="w-4 h-4 text-amber-800 animate-pulse" />
            <span>Cozy ambient lofi chords are playing in the background... Enjoy reading.</span>
          </div>

          <div className="flex flex-wrap justify-between items-center border-b-2 border-stone-800/10 pb-4 mb-6 gap-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 flex items-center gap-2">
              <span>Hey, Love.</span>
              <Heart className="w-6 h-6 text-red-600 fill-current animate-pulse" />
            </h2>
            <span className="font-sans text-xs md:text-sm font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-300 shadow-sm">
              🎂 August 18th, 2026
            </span>
          </div>

          <p className="font-bold text-stone-900 bg-amber-100/60 p-4 rounded-2xl border border-amber-900/10 shadow-sm">
            Welcom to our little, cute house on internet-a-place build just for you. one tiny detail at a time. Every room holds a memory, a surprise and some task and piece of how much u mean to me.
          </p>

          <p>
            I hope u alove it all.Take ur taketime exploring, look around and make yourself at home.
          </p>

          <p>
            Looking back at our beautiful journey, I feel incredibly lucky to have you. From our cozy late-night conversations to our silly kitchen cooking adventures, and watching you put your whole heart into both your code and your music—you inspire me every single day.
          </p>

          <p>
            No matter how fast the world changes or how busy we get, remember that this little house of memories is always open for you. I will always be in your corner, cheering you on, supporting you through every bug, and celebrating all your incredible triumphs.
          </p>

          <div className="pt-8 border-t border-stone-800/10 flex flex-col items-end">
            <p className="text-xl md:text-2xl font-bold text-rose-600 mb-1">Love you Aaho</p>
            <p className="text-3xl md:text-4xl font-extrabold text-stone-900">- From your duggu. ❤️</p>
          </div>
        </div>

        {/* Letter Footer Chime info */}
        <div className="mt-8 border-t border-stone-800/5 pt-4 text-center font-sans text-xs text-stone-400 flex items-center gap-1 justify-center pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>This letter was written with 100% genuine love and affection. Happy Birthday!</span>
        </div>

      </div>
    </motion.div>
  );
}
