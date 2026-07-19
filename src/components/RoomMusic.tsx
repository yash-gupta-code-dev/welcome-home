/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Music, CheckCircle, Info } from 'lucide-react';
import { MusicKey } from '../types';
import { audioEngine } from '../lib/AudioEngine';
import InteractivePhotoFrame from './InteractivePhotoFrame';

interface RoomMusicProps {
  onBackToMap: () => void;
  onClueFound: (room: 'hall' | 'kitchen' | 'coding' | 'music') => void;
  isClueFound: boolean;
}

const KEYS: MusicKey[] = [
  { note: 'C4', frequency: 261.63, keyboardKey: 'A', memory: 'That late-night karaoke session until 3 AM when we both lost our voices singing our favorite love songs.', color: 'white' },
  { note: 'C#4', frequency: 277.18, keyboardKey: 'W', memory: 'The absolute funniest piano duet we tried to play during our first cozy holiday dinner together.', color: 'black' },
  { note: 'D4', frequency: 293.66, keyboardKey: 'S', memory: 'Silly road trip duets, screaming rock songs out of tune with the windows down, holding your hand.', color: 'white' },
  { note: 'D#4', frequency: 311.13, keyboardKey: 'E', memory: 'Sharing headphones on cold train rides, listening to your favorite acoustic tracks while looking out at the foggy mountains.', color: 'black' },
  { note: 'E4', frequency: 329.63, keyboardKey: 'D', memory: 'Your very first music gig, where I stood in the front row cheering like a maniac, holding up a silly handmade poster!', color: 'white' },
  { note: 'F4', frequency: 349.23, keyboardKey: 'F', memory: 'The custom lofi coding playlist you curated for me during my busy work weeks.', color: 'white' },
  { note: 'F#4', frequency: 369.99, keyboardKey: 'T', memory: 'Listening to classic vinyl records on the living room rug during rainy autumn Sundays wrapped in a warm blanket.', color: 'black' },
  { note: 'G4', frequency: 392.00, keyboardKey: 'G', memory: 'Teaching me how to play that simple three-chord melody on your keyboard while wrapping your hands over mine.', color: 'white' },
  { note: 'G#4', frequency: 415.30, keyboardKey: 'Y', memory: 'Making up ridiculous song lyrics with goofy voices to make me smile whenever I was stressed.', color: 'black' },
  { note: 'A4', frequency: 440.00, keyboardKey: 'H', memory: 'When you saved up to surprise me with that beautiful music box that plays our song.', color: 'white' },
  { note: 'A#4', frequency: 466.16, keyboardKey: 'U', memory: 'Silly dance-offs in the kitchen while listening to retro tunes and washing dinner dishes together.', color: 'black' },
  { note: 'B4', frequency: 493.88, keyboardKey: 'J', memory: 'Sitting on the grass at midnight, listening to acoustic guitar, looking at the crickets and counting shooting stars.', color: 'white' },
  { note: 'C5', frequency: 523.25, keyboardKey: 'K', memory: 'Making cozy birthday jingles on GarageBand to celebrate your day. Happy Birthday, my love!', color: 'white' },
];

const SECRET_MELODY = ['C4', 'C4', 'D4', 'C4', 'F4', 'E4']; // Happy Birthday start phrase!

export default function RoomMusic({ onBackToMap, onClueFound, isClueFound }: RoomMusicProps) {
  const [activeMemory, setActiveMemory] = useState<string>('Click any piano key or press your keyboard (A, W, S, E, D, F, T, G, Y, H, U, J, K) to play notes & unlock memories.');
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [playedSequence, setPlayedSequence] = useState<string[]>([]);
  const [songMatched, setSongMatched] = useState(isClueFound);

  // Hotspot overlay state
  const [showOrganModal, setShowOrganModal] = useState(false);

  const handlePlayNote = (key: MusicKey) => {
    audioEngine.playNote(key.frequency, 'sine', 0.8);
    setPressedKey(key.note);
    setActiveMemory(key.memory);

    // Track sequence for the puzzle
    const nextSequence = [...playedSequence, key.note].slice(-SECRET_MELODY.length);
    setPlayedSequence(nextSequence);

    // Check if matched
    const isMatched = nextSequence.length === SECRET_MELODY.length && 
                      nextSequence.every((note, idx) => note === SECRET_MELODY[idx]);

    if (isMatched && !songMatched) {
      setSongMatched(true);
      audioEngine.playChime();
      onClueFound('music');
    }

    setTimeout(() => {
      setPressedKey((prev) => (prev === key.note ? null : prev));
    }, 1500);
  };

  // Keyboard support mapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const char = e.key.toUpperCase();
      const matchedKey = KEYS.find((k) => k.keyboardKey === char);
      if (matchedKey) {
        handlePlayNote(matchedKey);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playedSequence, songMatched]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 w-full max-w-5xl mx-auto p-6 md:p-8 text-slate-100 flex flex-col min-h-[85vh] rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950"
    >
      {/* IMMERSIVE 2D MUSIC STUDIO WALLS & INSTRUMENT BACKGROUND */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
        {/* Acoustic Soundproofing & Studio Lights */}
        <div className="w-full flex-grow bg-gradient-to-b from-slate-900 via-[#181223] to-[#21162c] relative overflow-hidden">
          {/* Vertical acoustic panel bars */}
          <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#808080_2px,transparent_2px)] bg-[size:40px_100%]" />
          
          {/* Neon mood glow rings */}
          <div className="absolute top-10 right-16 w-32 h-32 rounded-full bg-pink-500/10 filter blur-xl animate-pulse" />
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-emerald-500/5 filter blur-2xl animate-pulse" />

          {/* 1. GUITAR WALL MOUNT & RACK CUPBOARD (on left wall) */}
          <div className="absolute top-6 left-8 w-20 h-40 bg-amber-950/30 border-2 border-amber-900/40 rounded-lg p-2 shadow-xl flex flex-col items-center gap-2 pointer-events-auto hover:border-amber-700 transition duration-300" title="Instrument Hanger">
            <div className="text-[6px] text-amber-200 uppercase tracking-widest font-mono text-center font-bold">STRIKE A CHORD</div>
            {/* Guitar hanger slot 1 */}
            <div className="flex-grow flex flex-col items-center justify-around w-full border border-amber-900/20 bg-amber-950/20 rounded p-1">
              <span className="text-2xl hover:scale-125 transition duration-300 cursor-pointer animate-pulse" title="Classic Wooden Acoustic Guitar">🎸</span>
              <span className="text-xl hover:scale-125 transition duration-300 cursor-pointer" title="Masterpiece Violoncello">🎻</span>
            </div>
            <div className="text-[5px] text-amber-200/50">Yash Originals</div>
          </div>

          {/* 2. VINYL WALL GALLERY & POSTER (Center Wall) (Interactive memories for Yash) */}
          <div className="absolute top-8 left-1/3 flex gap-6 pointer-events-auto">
            <InteractivePhotoFrame
              id="music-harmonies"
              emoji="🎹"
              title="Harmonies of the Heart"
              description="Watching your fingers fly across the keyboard keys is pure magic. You composed that beautiful lofi melody just to help others relax and study. You have a heart of pure gold, Yash."
              date="January 2026"
              positionClasses="relative"
              rotation="-rotate-2"
              frameStyle="wood"
              caption="Harmonies"
            />

            <InteractivePhotoFrame
              id="music-gigs"
              emoji="🎸"
              title="First Gig Cheerleader"
              description="Your very first acoustic gig where I stood in the front row cheering like a maniac, holding up a silly handmade poster! Your passion for music is so inspiring to everyone."
              date="June 2025"
              positionClasses="relative"
              rotation="rotate-1"
              frameStyle="gold"
              caption="Live Gig"
            />

            <InteractivePhotoFrame
              id="music-playlist"
              emoji="🎧"
              title="Surprise Music Box"
              description="That rainy Sunday when you saved up to surprise me with that beautiful music box that plays our song. Every note still feels like a cozy, warm hug."
              date="November 2025"
              positionClasses="relative"
              rotation="rotate-6"
              frameStyle="polaroid"
              caption="Music Box"
            />
          </div>

          {/* 3. COZY FLOATING RECORD SHELF (on right wall) */}
          <div className="absolute top-28 right-8 flex flex-col gap-1 pointer-events-auto">
            <div className="w-40 h-2 bg-slate-700 rounded shadow relative">
              {/* Stacked Vinyl Sleeves */}
              <div className="absolute -top-5 right-2 flex gap-1 select-none">
                <span title="Acoustic Chill Hits" className="text-sm cursor-help hover:animate-bounce">💿</span>
                <span title="Techno Synth Wave" className="text-sm cursor-help hover:animate-bounce">💿</span>
                <span title="Classic Piano Sonatas" className="text-sm cursor-help hover:animate-bounce">💿</span>
                <span title="Chamber Orch Vol II" className="text-sm cursor-help hover:animate-bounce">💿</span>
              </div>
            </div>
            <div className="text-[7px] text-slate-400 font-mono pr-2 text-right">LPs & Singles</div>
          </div>
        </div>

        {/* Polished hardwood studio flooring with cozy songwriter rug */}
        <div className="w-full h-44 bg-gradient-to-b from-[#3a2215] to-[#1d110a] border-t-4 border-[#52331f] relative overflow-hidden">
          {/* Perspective wood lines */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-zinc-950/20" />

          {/* 4. PLUSH VELVET SONGWRITING COUCH (standing on left studio floor) */}
          <div className="absolute bottom-2 left-12 w-28 h-16 bg-rose-950/90 border-2 border-rose-900 rounded p-1.5 flex flex-col shadow-2xl pointer-events-auto hover:brightness-110 transition" title="Songwriter Cozy Couch">
            {/* Soft Back Cushion */}
            <div className="flex gap-1 h-5 justify-between">
              <div className="flex-1 bg-rose-900 rounded shadow-inner" />
              <div className="flex-1 bg-rose-900 rounded shadow-inner" />
            </div>
            {/* Seat and Armrests */}
            <div className="flex-grow bg-rose-850 rounded border-t border-rose-700 shadow-inner mt-1 flex justify-around items-center">
              <span className="text-[8px] text-rose-300 font-serif font-bold tracking-widest uppercase">VELVET</span>
            </div>
            {/* Mini Stool feet */}
            <div className="flex justify-between px-2 -mb-2">
              <div className="w-1.5 h-1.5 bg-amber-950 rounded-full" />
              <div className="w-1.5 h-1.5 bg-amber-950 rounded-full" />
            </div>
          </div>

          {/* 5. STUDIO SPEAKERS & MIXING TABLE (standing on right floor) */}
          <div className="absolute bottom-2 right-12 flex items-end gap-3 pointer-events-auto z-10">
            {/* Left sound monitor */}
            <div className="w-10 h-18 bg-zinc-900 border border-zinc-850 rounded p-1 flex flex-col justify-between shadow-lg" title="Reference Sound Monitor">
              <div className="w-full h-7 bg-zinc-950 rounded-full border border-zinc-800 flex items-center justify-center">
                <div className="w-4 h-4 bg-zinc-800 rounded-full animate-ping" />
              </div>
              <div className="w-full h-5 bg-zinc-950 rounded-full border border-zinc-800" />
            </div>

            {/* Cozy mixing table */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-5 bg-slate-900 border border-slate-800 rounded shadow-md flex items-center justify-around px-1" title="Cozy Preamp Module">
                <span className="text-[8px] text-pink-500 font-mono">GAIN</span>
                <div className="w-2 h-2 rounded-full bg-pink-500/80 animate-pulse" />
                <span className="text-[10px] animate-wiggle">🎧</span>
              </div>
              <div className="w-1.5 h-10 bg-slate-800" />
              <div className="w-12 h-1 bg-slate-800" />
            </div>

            {/* Right sound monitor */}
            <div className="w-10 h-18 bg-zinc-900 border border-zinc-850 rounded p-1 flex flex-col justify-between shadow-lg" title="Reference Sound Monitor">
              <div className="w-full h-7 bg-zinc-950 rounded-full border border-zinc-800 flex items-center justify-center">
                <div className="w-4 h-4 bg-zinc-800 rounded-full animate-ping" />
              </div>
              <div className="w-full h-5 bg-zinc-950 rounded-full border border-zinc-800" />
            </div>
          </div>
        </div>
      </div>

      {/* FOREGROUND INTERACTIVE CONTENT */}
      <div className="relative z-10 flex flex-col flex-grow">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBackToMap}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-850 text-slate-100 rounded-full border border-slate-800 text-sm font-medium transition cursor-pointer shadow-lg backdrop-blur-sm"
            id="musicBackBtn"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to House Map
          </button>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs text-emerald-300 backdrop-blur-sm">
            🎵 Music Studio (Melody Room)
          </div>
        </div>

        {/* Studio Floor Instrument Stage */}
        <div className="relative flex-grow w-full min-h-[45vh] md:min-h-[50vh] mt-4 mb-2 flex items-center justify-center">
          
          {/* Centerpiece Hotspot: Grand Piano/Keyboard on Stand */}
          <div className="flex flex-col items-center">
            {/* Keyboard on stand */}
            <div 
              onClick={() => {
                audioEngine.init();
                setShowOrganModal(true);
              }}
              className="w-44 h-28 md:w-52 md:h-32 bg-slate-900/95 border-2 border-slate-750 rounded-2xl relative shadow-[0_0_20px_rgba(236,72,153,0.15)] cursor-pointer group hover:scale-105 transition-all p-3 flex flex-col justify-end"
            >
              {/* Music sheet on top stand */}
              <div className="absolute top-[-22px] left-1/2 -translate-x-1/2 w-14 h-10 bg-amber-50 rounded shadow-md border border-slate-300 p-1 flex flex-col gap-0.5 relative z-10">
                <div className="w-full h-[1.5px] bg-slate-600 rounded" />
                <div className="w-4/5 h-[1.5px] bg-slate-600 rounded" />
                <div className="w-full h-[1.5px] bg-slate-600 rounded" />
                <span className="text-[6px] absolute bottom-0.5 right-1">🎵</span>
              </div>

              {/* Piano keys look inside the hotspot */}
              <div className="h-8 bg-slate-950 rounded border border-slate-800 flex gap-[2px] p-[2px] items-stretch">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`flex-grow rounded-sm relative ${i % 2 === 0 ? 'bg-slate-100' : 'bg-slate-200'}`}>
                    {/* Tiny black keys */}
                    {[1, 3, 6, 8, 10].includes(i) && (
                      <div className="absolute top-0 inset-x-[20%] h-3.5 bg-slate-900 rounded-b-xs" />
                    )}
                  </div>
                ))}
              </div>

              {/* Steel X-Stand holding the keyboard */}
              <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-32 h-2.5 bg-[#475569] rounded-full shadow border-t border-slate-500 opacity-80" />
            </div>

            {/* Glowing music organ label */}
            <button 
              onClick={() => {
                audioEngine.init();
                setShowOrganModal(true);
              }}
              className="mt-4.5 px-3 py-1 bg-slate-900/95 hover:bg-slate-800 rounded-full border border-slate-700/80 text-[10px] font-bold text-pink-400 animate-pulse flex items-center gap-1 shadow-md cursor-pointer"
            >
              🎹 Organ Stand (Click here)
            </button>
          </div>
        </div>

        {/* Clue Panel Badge */}
        <AnimatePresence>
          {songMatched && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 justify-center p-3.5 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl text-xs md:text-sm text-emerald-300 backdrop-blur-sm shadow-lg"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>
                <strong>Beautiful Harmony!</strong> Melody matching complete. Fourth combination clue revealed: <strong className="font-mono text-emerald-100 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-500/20 text-md">"9"</strong>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Harmony Organ Modal Overlay */}
      <AnimatePresence>
        {showOrganModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowOrganModal(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[82vh] flex flex-col overflow-hidden shadow-2xl text-slate-100"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-850 flex justify-between items-center bg-slate-900/50">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🎹</span>
                  <div>
                    <h3 className="text-lg font-bold">The Harmony Organ</h3>
                    <p className="text-xs text-slate-400 font-sans">A memory container keyed to Yash's favorite notes</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOrganModal(false)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer transition font-sans"
                >
                  ✕ Close
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-grow overflow-y-auto p-5 md:p-6 flex flex-col justify-between gap-6">
                
                {/* Score Sheet Tune Hint */}
                <div className="text-center max-w-xl mx-auto space-y-3">
                  <p className="text-slate-400 text-xs font-sans leading-relaxed">
                    Play the simple birthday sequence below on the piano keys (or tap keys A, W, S, E, D, F on your keyboard) to recover your final combination digit!
                  </p>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 inline-flex flex-col items-center">
                    <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-2">Sheet Music Tune</div>
                    <div className="flex gap-1.5 items-center font-mono">
                      {SECRET_MELODY.map((note, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 rounded text-xs font-bold border transition ${
                            playedSequence.includes(note)
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}
                        >
                          {note.replace('4', '')}
                        </span>
                      ))}
                    </div>
                    <div className="text-[9px] text-slate-500 mt-1.5 font-mono">
                      Key pattern: <kbd className="bg-slate-800 px-1 rounded text-slate-300">A</kbd> → <kbd className="bg-slate-800 px-1 rounded text-slate-300">A</kbd> → <kbd className="bg-slate-800 px-1 rounded text-slate-300">S</kbd> → <kbd className="bg-slate-800 px-1 rounded text-slate-300">A</kbd> → <kbd className="bg-slate-800 px-1 rounded text-slate-300">F</kbd> → <kbd className="bg-slate-800 px-1 rounded text-slate-300">D</kbd>
                    </div>
                  </div>
                </div>

                {/* The Full Sized Piano Keyboard */}
                <div className="relative select-none my-2">
                  <div className="bg-slate-950 border-4 border-slate-850 p-4 rounded-3xl shadow-inner relative w-full flex justify-center items-stretch h-48 md:h-56">
                    <div className="relative flex justify-center w-full max-w-2xl h-full border-t-4 border-slate-900">
                      {KEYS.map((key) => {
                        const isPressed = pressedKey === key.note;
                        const isWhite = key.color === 'white';

                        if (isWhite) {
                          return (
                            <button
                              key={key.note}
                              onClick={() => handlePlayNote(key)}
                              className={`relative z-10 flex flex-col justify-end items-center pb-3 w-10 md:w-11 h-full border-r border-slate-300/20 rounded-b-lg shadow transition-all duration-75 cursor-pointer ${
                                isPressed
                                  ? 'bg-emerald-50/95 scale-y-[0.98] border-t-4 border-t-emerald-500 shadow-inner'
                                  : 'bg-slate-100 hover:bg-slate-200'
                              }`}
                            >
                              <span className="font-mono text-[8px] font-bold text-slate-600 uppercase tracking-widest leading-none">
                                {key.keyboardKey}
                              </span>
                              <span className="font-mono text-[7px] text-slate-400 font-bold select-none mt-1">
                                {key.note}
                              </span>
                            </button>
                          );
                        } else {
                          const leftOffsets: { [key: string]: string } = {
                            'C#4': 'left-[7.2%]',
                            'D#4': 'left-[16.5%]',
                            'F#4': 'left-[32.5%]',
                            'G#4': 'left-[42.5%]',
                            'A#4': 'left-[52.0%]',
                          };

                          return (
                            <button
                              key={key.note}
                              onClick={() => handlePlayNote(key)}
                              className={`absolute z-20 w-5.5 md:w-6 h-[60%] rounded-b-md shadow-md transition-all duration-75 cursor-pointer ${
                                isPressed
                                  ? 'bg-emerald-700 scale-y-[0.98] border-b-2 border-emerald-900 shadow-inner'
                                  : 'bg-slate-900 hover:bg-slate-850 border-b-4 border-slate-950'
                              } ${leftOffsets[key.note] || 'left-0'}`}
                            >
                              <div className="flex flex-col h-full justify-between items-center py-1.5">
                                <span className="font-mono text-[7px] text-slate-400 font-bold select-none leading-none">
                                  {key.keyboardKey}
                                </span>
                                <span className="font-mono text-[6px] text-slate-500 font-semibold select-none leading-none">
                                  {key.note}
                                </span>
                              </div>
                            </button>
                          );
                        }
                      })}
                    </div>
                  </div>
                </div>

                {/* Memory Log Box */}
                <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-4 flex gap-3 items-center min-h-[76px]">
                  <div className="text-2xl p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60 select-none">
                    📻
                  </div>
                  <div>
                    <div className="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1 font-sans">
                      <Info className="w-3 h-3" />
                      Music Capsule Memory
                    </div>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-sans">
                      {activeMemory}
                    </p>
                  </div>
                </div>

                {/* Victory Banner */}
                <AnimatePresence>
                  {songMatched && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-xs text-center text-slate-100 shadow-md space-y-1 font-sans"
                    >
                      <p className="text-emerald-300 font-bold flex items-center gap-1.5 justify-center">
                        <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
                        Beautiful Harmony!
                      </p>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Yash, your musical soul is perfectly tuned. The final combination code digit is: <strong className="font-mono text-emerald-100 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-500/20 text-sm">"9"</strong>
                      </p>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Code Clue Found: 1 2 0 9
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
