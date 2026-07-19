/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Music, CheckCircle, Info } from 'lucide-react';
import { MusicKey } from '../types';
import { audioEngine } from '../lib/AudioEngine';

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
      className="relative z-10 w-full max-w-4xl mx-auto px-4 py-6 text-slate-100 flex flex-col min-h-[85vh]"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-full border border-slate-700 text-sm font-medium transition cursor-pointer"
          id="musicBackBtn"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to House Map
        </button>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs text-emerald-300">
          🎵 Music Studio (Melody Room)
        </div>
      </div>

      {/* Music Studio Panel */}
      <div className="bg-slate-900/75 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md flex-grow flex flex-col justify-between">
        
        {/* Top Instructions & Puzzle hint */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2 justify-center">
            <Music className="w-6 h-6 text-emerald-400" />
            The Harmony Organ
          </h2>
          <p className="text-slate-400 text-sm">
            Music is a time capsule of the soul. Play the simple birthday sequence below on the piano keys to discover your final digit safe clue!
          </p>

          {/* Sheet Music helper */}
          <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 inline-flex flex-col items-center">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Sheet Music Tune</div>
            <div className="flex gap-2 items-center font-mono">
              {SECRET_MELODY.map((note, idx) => {
                const isPlayed = playedSequence[idx] === note; // simple match visual
                return (
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
                );
              })}
            </div>
            <div className="text-[10px] text-slate-500 mt-1.5 font-mono">
              Key Pattern: <kbd className="bg-slate-800 px-1 rounded text-slate-300">A</kbd> → <kbd className="bg-slate-800 px-1 rounded text-slate-300">A</kbd> → <kbd className="bg-slate-800 px-1 rounded text-slate-300">S</kbd> → <kbd className="bg-slate-800 px-1 rounded text-slate-300">A</kbd> → <kbd className="bg-slate-800 px-1 rounded text-slate-300">F</kbd> → <kbd className="bg-slate-800 px-1 rounded text-slate-300">D</kbd>
            </div>
          </div>
        </div>

        {/* Playable Piano Visual */}
        <div className="my-10 relative select-none">
          {/* Piano board container */}
          <div className="bg-slate-950 border-4 border-slate-850 p-4 rounded-3xl shadow-2xl relative w-full flex justify-center items-stretch h-56 md:h-64">
            
            {/* Keys wrapper */}
            <div className="relative flex justify-center w-full max-w-2xl h-full border-t-8 border-slate-900">
              {KEYS.map((key) => {
                const isPressed = pressedKey === key.note;
                const isWhite = key.color === 'white';

                if (isWhite) {
                  return (
                    <button
                      key={key.note}
                      onClick={() => handlePlayNote(key)}
                      className={`relative z-10 flex flex-col justify-end items-center pb-4 w-11 md:w-12 h-full border-r border-slate-300/20 rounded-b-lg shadow transition-all duration-100 cursor-pointer ${
                        isPressed
                          ? 'bg-emerald-50/90 scale-y-[0.98] border-t-4 border-t-emerald-500 shadow-inner'
                          : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      <span className="font-mono text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                        {key.keyboardKey}
                      </span>
                      <span className="font-mono text-[8px] text-slate-400 font-bold">
                        {key.note}
                      </span>
                    </button>
                  );
                } else {
                  // Black Key
                  // Calculate offset based on previous key positions to position absolutely
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
                      className={`absolute z-20 w-6 md:w-7 h-[60%] rounded-b-md shadow-lg transition-all duration-100 cursor-pointer ${
                        isPressed
                          ? 'bg-emerald-700 scale-y-[0.98] border-b-2 border-emerald-900 shadow-inner'
                          : 'bg-slate-900 hover:bg-slate-850 border-b-4 border-slate-950'
                      } ${leftOffsets[key.note] || 'left-0'}`}
                    >
                      <div className="flex flex-col h-full justify-between items-center py-2">
                        <span className="font-mono text-[8px] text-slate-400 font-bold select-none leading-none">
                          {key.keyboardKey}
                        </span>
                        <span className="font-mono text-[7px] text-slate-500 font-semibold select-none leading-none">
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

        {/* Memory Display / Log Board below */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 flex gap-4 items-center min-h-[90px]">
          <div className="text-3xl p-3 bg-slate-900/60 rounded-xl border border-slate-800/60 select-none">
            📻
          </div>
          <div>
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Music Capsule Memory
            </div>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed transition-all duration-300">
              {activeMemory}
            </p>
          </div>
        </div>

        {/* Clue Panel Badge */}
        <AnimatePresence>
          {songMatched && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-center gap-2 justify-center p-3.5 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl text-xs md:text-sm text-emerald-300"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>
                <strong>Beautiful Harmony!</strong> Melody matching complete. Fourth combinations clue revealed: <strong className="font-mono text-emerald-100 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-500/20 text-md">"9"</strong>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
