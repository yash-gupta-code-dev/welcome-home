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
      <div className="bg-[#fcf8f0] text-stone-900 border-4 border-amber-900/25 shadow-2xl rounded-3xl p-8 md:p-12 flex-grow flex flex-col justify-between relative overflow-hidden">
        
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

          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-6 border-b-2 border-stone-800/10 pb-4 flex justify-between items-center">
            <span>My Dearest Yash,</span>
            <Heart className="w-6 h-6 text-red-600 fill-current animate-pulse" />
          </h2>

          <p>
            Today is a very special day. It's the birthday of my favorite human, my partner-in-crime, and my brilliant coder companion.
          </p>

          <p>
            Looking back at our beautiful journey, I feel incredibly lucky to have you. From our cozy late-night conversations to our silly kitchen cooking adventures, and watching you put your whole heart into both your code and your music—you inspire me every single day.
          </p>

          <p>
            I've always admired your brilliant mind, your relentless drive, and above all, the massive, kind heart you carry. You tackle complex production bugs and life challenges with a quiet persistence that makes me so incredibly proud to stand by your side.
          </p>

          <p>
            No matter how fast the world changes or how busy we get, remember that this little house of memories is always open for you. I will always be in your corner, cheering you on, supporting you through every bug, and celebrating all your incredible triumphs.
          </p>

          <p>
            I wish you a year of absolute happiness, deep peace, coffee that tastes perfect, code that compiles on the first try, and the courage to pursue every single dream you have ever imagined.
          </p>

          <div className="pt-8 border-t border-stone-800/10 flex flex-col items-end">
            <p className="text-sm font-sans font-semibold text-stone-500 uppercase tracking-widest leading-none mb-1">With all my love,</p>
            <p className="text-3xl md:text-4xl font-extrabold text-red-700">- Your Rashi ❤️</p>
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
