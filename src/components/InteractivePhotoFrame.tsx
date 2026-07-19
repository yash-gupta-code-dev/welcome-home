/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Sparkles } from 'lucide-react';
import { audioEngine } from '../lib/AudioEngine';

interface InteractivePhotoFrameProps {
  id: string;
  emoji: string;
  title: string;
  description: string;
  date: string;
  positionClasses: string; // Tailwind placement, e.g. "top-12 left-6"
  rotation?: string;       // Tailwind rotation, e.g. "rotate-3", "-rotate-6"
  frameStyle?: 'wood' | 'gold' | 'charcoal' | 'polaroid';
  caption?: string;
}

export default function InteractivePhotoFrame({
  id,
  emoji,
  title,
  description,
  date,
  positionClasses,
  rotation = 'rotate-0',
  frameStyle = 'wood',
  caption,
}: InteractivePhotoFrameProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    audioEngine.init();
    audioEngine.playSparkle();
    audioEngine.playNote(523.25, 'sine', 0.2); // Soft C5 sound
    setIsOpen(true);
  };

  const handleClose = () => {
    audioEngine.init();
    audioEngine.playNote(392.00, 'sine', 0.1); // Soft G4 sound
    setIsOpen(false);
  };

  // Border/frame styling classes
  const getFrameClasses = () => {
    switch (frameStyle) {
      case 'gold':
        return 'bg-slate-950 border-2 border-amber-500/80 p-1.5 shadow-[0_4px_20px_rgba(245,158,11,0.25)] hover:border-amber-400';
      case 'charcoal':
        return 'bg-zinc-900 border-2 border-zinc-700 p-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:border-zinc-500';
      case 'polaroid':
        return 'bg-[#faf6ed] p-1 pb-3.5 border border-amber-900/10 shadow-lg hover:rotate-1 hover:scale-105';
      case 'wood':
      default:
        return 'bg-amber-950 border-2 border-amber-900 rounded p-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.4)] hover:border-amber-700';
    }
  };

  return (
    <>
      {/* Mini Frame on Wall */}
      <motion.div
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleOpen}
        className={`absolute ${positionClasses} ${rotation} ${getFrameClasses()} cursor-pointer pointer-events-auto select-none transition-all duration-300 z-10`}
        title={`Click to open memory: "${title}"`}
        id={`photo-frame-${id}`}
      >
        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#faf5ec] rounded flex items-center justify-center relative overflow-hidden group">
          {/* Heart icon glow on hover */}
          <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/5 transition flex items-center justify-center">
            <Heart className="w-3 h-3 text-rose-500/0 group-hover:text-rose-500/20 transition-all duration-300 scale-50 group-hover:scale-100" />
          </div>
          <span className="text-xl md:text-2xl drop-shadow group-hover:scale-110 transition duration-300">
            {emoji}
          </span>
        </div>
        {caption && (
          <div className="text-[6px] md:text-[7px] text-center font-serif text-amber-200 mt-1 uppercase tracking-wider opacity-70">
            {caption}
          </div>
        )}
      </motion.div>

      {/* Heartwarming Overlay Pop-up Memory */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              {/* Soft decorative background glow */}
              <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-rose-500/10 filter blur-xl pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-amber-500/10 filter blur-xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-750 border border-slate-700/60 text-slate-400 hover:text-slate-200 transition cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Polaroid Frame Container */}
              <div className="flex flex-col items-center">
                {/* Polaroid photo white box */}
                <div className="w-full aspect-square bg-[#fbf9f4] border border-amber-950/5 p-4 rounded-xs shadow-md flex flex-col justify-between relative">
                  {/* Subtle paper fiber pattern */}
                  <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:10px_10px]" />
                  
                  {/* Image/Emoji Slot */}
                  <div className="w-full flex-grow bg-gradient-to-tr from-rose-50 to-amber-50 rounded border border-amber-900/10 flex items-center justify-center relative overflow-hidden">
                    <motion.span
                      animate={{ y: [-2, 2, -2], rotate: [-1, 1, -1] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      className="text-7xl filter drop-shadow-lg"
                    >
                      {emoji}
                    </motion.span>
                    <div className="absolute top-2 right-2 text-xs opacity-40 animate-pulse">✨</div>
                  </div>

                  {/* Handwriting style label */}
                  <div className="h-10 flex items-center justify-center text-center mt-3 border-t border-amber-900/5 pt-1">
                    <span className="font-serif font-bold text-slate-800 text-sm italic tracking-tight">
                      {title}
                    </span>
                  </div>
                </div>

                {/* Heartwarming Description text below the Polaroid */}
                <div className="w-full mt-5 space-y-3 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                    <Heart className="w-3 h-3 fill-rose-300" />
                    Memory • {date}
                  </div>
                  
                  <p className="text-slate-300 text-sm leading-relaxed font-sans px-1">
                    {description}
                  </p>

                  <div className="flex items-center justify-center gap-1 text-[11px] text-amber-300/80 font-mono italic mt-2 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>A precious moment in time</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
