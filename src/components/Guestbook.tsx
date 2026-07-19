/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Send, User, Sparkles, MessageCircle, Heart, X } from 'lucide-react';
import { GuestbookEntry } from '../types';
import { audioEngine } from '../lib/AudioEngine';

interface GuestbookProps {
  onClose?: () => void;
}

const DEFAULT_GUESTBOOK: GuestbookEntry[] = [
  {
    id: '1',
    name: 'Mom ❤️',
    message: 'Happy Birthday my wonderful son! Between managing the food stall business and keeping you in my thoughts, my heart is always full of pride. Wishing my brilliant engineer son a year as spectacular as your talents!',
    timestamp: 'Today, 8:00 AM',
    avatar: '👩‍🍳',
  },
  {
    id: '2',
    name: 'Dad 🌟',
    message: 'Happy Birthday, Yash! As a security consultant, I know a secure foundation when I see one—and you have built an incredible life. Proud of your brilliance, both in music and in engineering. Keep shining!',
    timestamp: 'Today, 9:15 AM',
    avatar: '🛡️',
  },
  {
    id: '3',
    name: 'Priya (Your Sister) 🔬',
    message: 'Happy Birthday, Yash! Whether analyzing medical lab results for my government job or watching you run your terminal scripts, we both love a clean, bug-free diagnosis! Wishing you a legendary year ahead!',
    timestamp: 'Today, 10:30 AM',
    avatar: '🔬',
  },
  {
    id: '4',
    name: 'Rashi 💖',
    message: 'Happy Birthday to my incredible boyfriend! I designed this cozy digital house of memories just for you. You bring so much music, warmth, and laughter to my life, Yash. I love you to the stars and back!',
    timestamp: 'Today, 11:00 AM',
    avatar: '🥰',
  },
];

const AVAILABLE_AVATARS = ['🦊', '🐱', '🐶', '🐼', '🐨', '🦁', '🐸', '🚀', '🧙‍♂️', '💻', '🥰', '🎈', '🎸', '🎮', '💡'];

export default function Guestbook({ onClose }: GuestbookProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(DEFAULT_GUESTBOOK);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🎈');
  const [signedCount, setSignedCount] = useState(0);

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('welcome_home_guestbook');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        setEntries(DEFAULT_GUESTBOOK);
      }
    }
  }, []);

  const handleAddEntry = (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMessage.trim()) return;

    audioEngine.init();
    audioEngine.playSparkle();
    audioEngine.playNote(523.25, 'sine', 0.25); // high spark C5

    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name: newName.trim(),
      message: newMessage.trim(),
      timestamp: 'Just now',
      avatar: selectedAvatar,
    };

    const updated = [newEntry, ...entries];
    localStorage.setItem('welcome_home_guestbook', JSON.stringify(updated));
    setEntries(updated);
    setNewName('');
    setNewMessage('');
    setSignedCount((prev) => prev + 1);
  };

  return (
    <div className="w-full h-full flex flex-col text-slate-100 font-sans" id="guestbookComponent">
      {/* Decorative ambient background glow */}
      <div className="absolute top-10 right-10 w-44 h-44 rounded-full bg-sky-500/10 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-44 h-44 rounded-full bg-purple-500/10 filter blur-3xl pointer-events-none" />

      {/* parchment header */}
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-center justify-center text-sky-400 relative">
            <Book className="w-6 h-6 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1 text-amber-300" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
              The Birthday Guestbook
            </h3>
            <p className="text-xs text-slate-400">
              Leave a heartwarming birthday blessing or a shared memory for Yash
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="self-end md:self-auto px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/60 hover:text-slate-100 rounded-xl text-xs font-semibold cursor-pointer transition flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            Close Book
          </button>
        )}
      </div>

      {/* Main Content Pane Grid split into 2 Columns (Form & Messages) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 flex-grow overflow-hidden">
        
        {/* Left Column (Signing Form) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-5 bg-slate-950/40 border border-slate-800 rounded-2xl space-y-4 shadow-xl"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-sky-400" />
                Leave Your Signature
              </h4>
              {signedCount > 0 && (
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full animate-bounce">
                  ✨ Signed {signedCount} {signedCount === 1 ? 'wish' : 'wishes'}!
                </span>
              )}
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4">
              {/* Avatar Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Select Your Signature Avatar
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-900/80 rounded-xl border border-slate-800/80 max-h-24 overflow-y-auto">
                  {AVAILABLE_AVATARS.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => {
                        audioEngine.playNote(349.23, 'sine', 0.05);
                        setSelectedAvatar(avatar);
                      }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg cursor-pointer transition-all ${
                        selectedAvatar === avatar
                          ? 'bg-sky-600/30 border-2 border-sky-500 scale-110 shadow-md'
                          : 'bg-slate-950/40 hover:bg-slate-800 border border-slate-800/50 hover:scale-105'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input details */}
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Your Name (e.g., Priya, Hardik)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    maxLength={30}
                    required
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl text-sm focus:outline-none transition text-slate-200 placeholder-slate-500"
                  />
                </div>

                <div className="relative">
                  <textarea
                    placeholder="Write a warm birthday note or memory..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    maxLength={300}
                    required
                    rows={4}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl text-sm focus:outline-none resize-none transition text-slate-200 placeholder-slate-500"
                  />
                  <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 font-mono">
                    {newMessage.length}/300
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition shadow-lg shadow-sky-950/60 active:scale-[0.98]"
              >
                <Send className="w-3.5 h-3.5" />
                Sign Birthday Wish
              </button>
            </form>
          </motion.div>

          <div className="p-4 bg-slate-950/20 border border-slate-800/60 rounded-xl text-[10px] text-slate-400 leading-relaxed italic">
            💡 "Every single wish added here is saved right in Yash's local browser memory, building an expanding capsule of birthday blessings to look back on."
          </div>
        </div>

        {/* Right Column (List of entries, scrollable) */}
        <div className="lg:col-span-7 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
              Signed Wishes ({entries.length})
            </span>
          </div>

          <div className="flex-grow overflow-y-auto pr-1 space-y-3.5 max-h-[50vh] lg:max-h-[58vh]">
            <AnimatePresence initial={false}>
              {entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-slate-950/50 hover:bg-slate-950 border border-slate-800/80 rounded-2xl flex gap-4 items-start transition-colors shadow-md relative overflow-hidden group"
                >
                  {/* Subtle hover frame line glow */}
                  <div className="absolute inset-0 border border-sky-500/0 group-hover:border-sky-500/10 rounded-2xl transition duration-300" />

                  {/* Left avatar badge */}
                  <div className="text-2xl p-2.5 bg-slate-900 border border-slate-800/60 rounded-xl select-none group-hover:scale-105 transition">
                    {entry.avatar}
                  </div>

                  {/* Right text box */}
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-sky-300 text-sm flex items-center gap-1">
                        {entry.name}
                        {entry.name.includes('Mom') || entry.name.includes('Rashi') || entry.name.includes('Dad') ? (
                          <Heart className="w-3 h-3 fill-rose-500 text-rose-500 ml-0.5 animate-pulse" />
                        ) : null}
                      </h4>
                      <span className="text-[9px] text-slate-500 font-mono tracking-tighter">
                        {entry.timestamp}
                      </span>
                    </div>
                    
                    <p className="text-slate-300 text-xs leading-relaxed font-sans whitespace-pre-line">
                      {entry.message}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
