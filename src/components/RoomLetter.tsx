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
            First of all, Happiest 24th birthday to you! May you get all the success, love, peace and happiness in your life. This is a small letter for you, I hope you love it.
          </p>

          <p>
            So thank you so much for being here with me, loving me all along. I hope you're happy today, enjoying your fullest and getting all the love from your family, friends, and all the love you deserve. I really want to thank your mother who gave birth to such a beautiful soul who loves the people in his surroundings and has good teachings and a good heart.
          </p>

          <p>
            I'm happy to have you in my life. You really cherish my world by being there with me. All these months I have spent with you were the bestest of my life, and every struggle we went through was a test of our relationship, and I'm happy we passed it. All these months you went through a lot and still you gave your best in everything—in your relationship, in your work, and in your music as well. I'm happy I chose the best partner I could ever get.
          </p>

          <p>
            You know the best thing in you is you accept things and make improvements in them. Even when things were messy between us, you were always positive about it, and that kept this love between us. I at some point was not capable of facing things, but you made me stand up, and I really thank you for this. I'm grateful to you for handling all my mood swings and my tantrums. Thank you so much for being there for me always. You're the best boyfriend I could ever have, love.
          </p>

          <p>
            And finally, I love you more, and I will love you for life—whether you're poor or rich, whether you're handsome or not.
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
