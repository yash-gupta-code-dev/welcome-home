/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, RotateCw, Camera } from 'lucide-react';
import { PolaroidPhoto } from '../types';
import { audioEngine } from '../lib/AudioEngine';

interface RoomGalleryProps {
  onBackToMap: () => void;
}

const POLAROIDS: PolaroidPhoto[] = [
  {
    id: '1',
    title: 'Our First Dinner Date',
    imagePlaceholder: 'bg-gradient-to-tr from-amber-200 to-amber-500',
    emoji: '🍜',
    date: 'Summer 2023',
    description: 'Remember our very first dinner date? We sat at that tiny corner table, talking for hours until the restaurant closed. We both ordered the extra spicy noodles and spent the night laughing while drinking cold water.',
  },
  {
    id: '2',
    title: 'The Great Roadtrip',
    imagePlaceholder: 'bg-gradient-to-tr from-cyan-300 to-blue-500',
    emoji: '🚗',
    date: 'July 2024',
    description: 'Eight hours in the car eating gas-station candy, sharing headphones, and singing romantic ballads out of tune. You held my hand as we watched the sunset over the horizon, promising to travel the world together.',
  },
  {
    id: '3',
    title: 'First Coding Project',
    imagePlaceholder: 'bg-gradient-to-tr from-indigo-500 to-purple-600',
    emoji: '💻',
    date: 'November 2024',
    description: 'You sitting down with me for hours, patiently explaining how your backend server works and drawing diagrams on paper. Your passion for engineering is so beautiful, Yash. I loved watching you build things!',
  },
  {
    id: '4',
    title: "Mom's Food Stall Feast",
    imagePlaceholder: 'bg-gradient-to-tr from-yellow-300 to-orange-400',
    emoji: '🍳',
    date: 'Spring 2025',
    description: "Helping your mom at her food stall business! We tried to make a giant batch of her special rolls, but we accidentally spilled the batter everywhere, making your sister Priya laugh so hard she dropped her diagnostics books!",
  },
  {
    id: '5',
    title: 'Engineering Milestone',
    imagePlaceholder: 'bg-gradient-to-tr from-emerald-400 to-teal-600',
    emoji: '🛠️',
    date: 'June 2025',
    description: 'Seeing you take on major engineering challenges. I am so proud of your brilliant analytical mind, Yash. I will always be your biggest cheerleader and supporter in life. Love you to the moon!',
  },
];

export default function RoomGallery({ onBackToMap }: RoomGalleryProps) {
  const [flippedCards, setFlippedCards] = useState<{ [id: string]: boolean }>({});

  const handleCardClick = (id: string) => {
    audioEngine.playNote(500, 'sine', 0.1);
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 w-full max-w-5xl mx-auto px-4 py-6 text-slate-100 flex flex-col min-h-[85vh]"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-full border border-slate-700 text-sm font-medium transition cursor-pointer"
          id="galleryBackBtn"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to House Map
        </button>
        <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full text-xs text-cyan-300">
          📷 Photo Gallery (Memory Wall)
        </div>
      </div>

      {/* Gallery Wall Box */}
      <div className="bg-slate-900/75 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md flex-grow flex flex-col justify-between">
        
        {/* Intro */}
        <div className="text-center max-w-lg mx-auto space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2 justify-center">
            <Camera className="w-6 h-6 text-cyan-400" />
            The Polaroid Photo Wall
          </h2>
          <p className="text-slate-400 text-sm">
            Hanging gently on hemp string, here are a few snap snapshots of our absolute favorite memories. Click a photo to flip and read the backstory!
          </p>
        </div>

        {/* Polaroid grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-center items-start flex-grow">
          {POLAROIDS.map((photo, idx) => {
            const isFlipped = flippedCards[photo.id];
            
            // Random slight rotation to look organic on string
            const rotateDeg = (idx % 2 === 0 ? 1.5 : -2) + (idx * 0.5);

            return (
              <div
                key={photo.id}
                className="flex flex-col items-center justify-center relative cursor-pointer"
                style={{ transform: `rotate(${rotateDeg}deg)` }}
                onClick={() => handleCardClick(photo.id)}
              >
                {/* Cute hanger string and clip */}
                <div className="absolute -top-6 w-0.5 h-6 bg-amber-900/40 z-0" />
                <div className="absolute -top-3 w-4 h-3 bg-amber-850 rounded-sm border border-amber-900/50 z-10 flex justify-center items-center">
                  <div className="w-1.5 h-1.5 bg-amber-950 rounded-full" />
                </div>

                {/* 3D Flipping Card */}
                <div className="w-44 h-56 perspective-1000 z-10">
                  <div
                    className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* CARD FRONT (Polaroid Photo) */}
                    <div className="absolute inset-0 backface-hidden bg-white text-slate-900 p-3 shadow-2xl rounded-sm flex flex-col justify-between border border-slate-200">
                      
                      {/* Image Canvas */}
                      <div className={`w-full h-36 rounded-xs relative overflow-hidden flex items-center justify-center ${photo.imagePlaceholder}`}>
                        {/* Sun glare lines */}
                        <div className="absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-black/20 pointer-events-none" />
                        <span className="text-5xl select-none filter drop-shadow-md">{photo.emoji}</span>
                      </div>

                      {/* Polaroid text label */}
                      <div className="text-center font-serif py-1.5 leading-tight">
                        <div className="font-bold text-xs text-slate-800 tracking-tight leading-none mb-0.5">
                          {photo.title}
                        </div>
                        <div className="text-[9px] text-slate-500 italic">
                          {photo.date}
                        </div>
                      </div>

                      {/* Flip Hint */}
                      <div className="text-[8px] text-slate-400 font-sans flex items-center gap-1 justify-center border-t border-slate-100 pt-1">
                        <RotateCw className="w-2.5 h-2.5 text-slate-400" />
                        <span>Click to flip</span>
                      </div>
                    </div>

                    {/* CARD BACK (Handwritten memory note) */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#fffdf0] text-slate-800 p-4 shadow-2xl rounded-sm border border-slate-200 flex flex-col justify-between font-serif">
                      <div className="space-y-2 flex-grow overflow-y-auto pr-0.5">
                        <div className="font-bold text-xs text-slate-900 border-b border-slate-200 pb-1 flex justify-between">
                          <span>📝 Our Love Story</span>
                          <span className="text-[9px] text-slate-400 font-sans">{photo.date}</span>
                        </div>
                        <p className="text-[10px] leading-relaxed text-slate-700 italic select-text" style={{ fontFamily: "'Caveat', cursive, serif", fontSize: '15px' }}>
                          {photo.description}
                        </p>
                      </div>
                      
                      <div className="text-[8px] text-slate-400 font-sans text-center border-t border-slate-100 pt-1 flex items-center gap-1 justify-center">
                        <RotateCw className="w-2.5 h-2.5" />
                        <span>Flip back</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
