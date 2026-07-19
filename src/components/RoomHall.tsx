/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Flame, FlameKindling, FileText, Send, User, ChevronLeft } from 'lucide-react';
import { GuestbookEntry } from '../types';
import { audioEngine } from '../lib/AudioEngine';

interface RoomHallProps {
  onBackToMap: () => void;
  onClueFound: (room: 'hall' | 'kitchen' | 'coding' | 'music') => void;
  isClueFound: boolean;
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

export default function RoomHall({ onBackToMap, onClueFound, isClueFound }: RoomHallProps) {
  const [fireplaceActive, setFireplaceActive] = useState(false);
  const [showGuestbook, setShowGuestbook] = useState(false);
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(DEFAULT_GUESTBOOK);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showLetter, setShowLetter] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('welcome_home_guestbook');
    if (saved) {
      try {
        setGuestbook(JSON.parse(saved));
      } catch (e) {
        setGuestbook(DEFAULT_GUESTBOOK);
      }
    }
  }, []);

  const saveGuestbook = (entries: GuestbookEntry[]) => {
    localStorage.setItem('welcome_home_guestbook', JSON.stringify(entries));
    setGuestbook(entries);
  };

  const handleToggleFireplace = () => {
    audioEngine.init();
    if (fireplaceActive) {
      audioEngine.stopFireplace();
      setFireplaceActive(false);
    } else {
      audioEngine.startFireplace();
      setFireplaceActive(true);
    }
  };

  const handleAddEntry = (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMessage.trim()) return;

    const avatars = ['🦊', '🐱', '🐶', '🐼', '🐨', '🦁', '🐸', '🚀', '🧙‍♂️', '💻'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name: newName.trim(),
      message: newMessage.trim(),
      timestamp: 'Just now',
      avatar: randomAvatar,
    };

    const updated = [newEntry, ...guestbook];
    saveGuestbook(updated);
    setNewName('');
    setNewMessage('');
    audioEngine.playSparkle();
  };

  const handleReadLetter = () => {
    audioEngine.playSparkle();
    setShowLetter(true);
    if (!isClueFound) {
      onClueFound('hall');
    }
  };

  // Turn off fireplace sound on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopFireplace();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 w-full max-w-5xl mx-auto px-4 py-6 text-slate-100 flex flex-col min-h-[85vh]"
    >
      {/* Navigation Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-full border border-slate-700 text-sm font-medium transition cursor-pointer"
          id="hallBackBtn"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to House Map
        </button>
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full text-xs text-amber-300">
          📍 Grand Entry Hall
        </div>
      </div>

      {/* Main Room Screen */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch flex-grow">
        {/* Fireplace (Left column) */}
        <div className="md:col-span-5 bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
          {/* Flame Ambient Glow */}
          <AnimatePresence>
            {fireplaceActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.25 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-radial-gradient from-orange-600 via-transparent to-transparent pointer-events-none"
              />
            )}
          </AnimatePresence>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-amber-400">
              <Flame className="w-6 h-6 animate-pulse" />
              The Fireplace
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Click to light a warm hearth fire. Listen to the crackle and unwind.
            </p>
          </div>

          {/* Interactive Fireplace Graphic */}
          <div className="my-8 flex justify-center items-center h-48 relative">
            <div className="absolute bottom-2 w-32 h-6 bg-slate-950 rounded-full blur-sm" />
            
            {/* Logs */}
            <div className="absolute bottom-6 flex justify-center items-center gap-1 z-10">
              <div className="w-20 h-4 bg-amber-950 rounded border-t border-amber-900/40 rotate-12 transform origin-center" />
              <div className="w-20 h-4 bg-amber-950 rounded border-t border-amber-900/40 -rotate-12 transform origin-center -translate-x-4" />
            </div>

            {/* Simulated Flame with Framer Motion */}
            <AnimatePresence>
              {fireplaceActive ? (
                <div className="relative z-20 flex justify-center items-end h-32 w-24">
                  {/* Fireball 1 */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 0.9, 1.1, 1],
                      y: [0, -15, 0],
                      rotate: [-3, 3, -2, 2, 0],
                    }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="absolute w-12 h-20 bg-gradient-to-t from-red-600 via-orange-500 to-amber-300 rounded-t-full filter blur-xs"
                  />
                  {/* Fireball 2 */}
                  <motion.div
                    animate={{
                      scale: [1, 0.8, 1.2, 0.9, 1],
                      y: [0, -25, 0],
                      rotate: [3, -3, 2, -2, 0],
                    }}
                    transition={{ repeat: Infinity, duration: 1.8, delay: 0.2, ease: 'easeInOut' }}
                    className="absolute w-8 h-16 bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-200 rounded-t-full filter blur-xs"
                  />
                  {/* Sparkles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [-10, -80],
                        x: [0, (Math.random() - 0.5) * 40],
                        opacity: [1, 0],
                        scale: [1, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1 + Math.random(),
                        delay: i * 0.2,
                      }}
                      className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full"
                      style={{ bottom: '15px' }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-slate-600 flex flex-col items-center gap-1.5 select-none opacity-40">
                  <FlameKindling className="w-10 h-10" />
                  <span className="text-xs">Cold logs</span>
                </div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleToggleFireplace}
            className={`w-full py-3.5 px-6 rounded-2xl font-semibold transition-all duration-300 relative z-10 flex items-center justify-center gap-2 cursor-pointer ${
              fireplaceActive
                ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-950'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/50'
            }`}
            id="fireplaceToggleBtn"
          >
            <Flame className="w-5 h-5" />
            {fireplaceActive ? 'Extinguish Fireplace' : 'Light Fireplace'}
          </button>
        </div>

        {/* Central Exploration Area (Right columns) */}
        <div className="md:col-span-7 flex flex-col gap-6">
          {/* Cozy Hall Desk */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 flex flex-col flex-grow justify-between backdrop-blur-md relative overflow-hidden">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                📂 Rashi's Welcome Desk
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                A warm mahogany desk with string lights, a guestbook, and a glowing parchment scroll.
              </p>
            </div>

            {/* visual interactives desk */}
            <div className="grid grid-cols-2 gap-4 my-6">
              {/* Scroll paper item */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                onClick={handleReadLetter}
                className="bg-amber-50/5 hover:bg-amber-50/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer group transition-all"
                id="hallLetterBtn"
              >
                <div className="w-14 h-14 bg-amber-500/10 group-hover:bg-amber-500/20 rounded-full flex items-center justify-center mb-3 transition">
                  <FileText className="w-7 h-7 text-amber-400 group-hover:scale-110 transition" />
                </div>
                <h3 className="font-semibold text-amber-200">Letter of Welcome</h3>
                <p className="text-xs text-slate-400 mt-1">Read the starting note left on the desk.</p>
              </motion.div>

              {/* Guestbook item */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                onClick={() => {
                  audioEngine.playSparkle();
                  setShowGuestbook(true);
                }}
                className="bg-sky-50/5 hover:bg-sky-50/10 border border-sky-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer group transition-all"
                id="hallGuestbookBtn"
              >
                <div className="w-14 h-14 bg-sky-500/10 group-hover:bg-sky-500/20 rounded-full flex items-center justify-center mb-3 transition">
                  <Book className="w-7 h-7 text-sky-400 group-hover:scale-110 transition" />
                </div>
                <h3 className="font-semibold text-sky-200">The Guestbook</h3>
                <p className="text-xs text-slate-400 mt-1">See lovely letters from family or sign one yourself.</p>
              </motion.div>
            </div>

            <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800 text-xs text-slate-400">
              💡 <span className="text-amber-300 font-medium">Warm Clue:</span> Explore the Welcome Desk objects. Inside the welcome letter, there\'s a clue containing a safe combination code digit to unlock the treasure chest in the attic!
            </div>
          </div>
        </div>
      </div>

      {/* Guestbook Modal Overlay */}
      <AnimatePresence>
        {showGuestbook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
              id="guestbookModal"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <div className="flex items-center gap-2.5">
                  <Book className="w-6 h-6 text-sky-400" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">Yash's Birthday Guestbook</h3>
                    <p className="text-xs text-slate-400">Warm birthday greetings from friends & family</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGuestbook(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer transition"
                >
                  Close
                </button>
              </div>

              {/* Modal Content - Scrollable list + form */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {/* Guestbook List */}
                <div className="space-y-4">
                  {guestbook.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex gap-4 items-start"
                    >
                      <div className="text-3xl p-2.5 bg-slate-900 rounded-xl border border-slate-850 select-none">
                        {entry.avatar}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-sky-300 text-sm">{entry.name}</h4>
                          <span className="text-[10px] text-slate-500 font-mono">{entry.timestamp}</span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{entry.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit Form */}
                <form onSubmit={handleAddEntry} className="p-4 bg-slate-950/30 border border-slate-800/60 rounded-2xl space-y-3">
                  <h4 className="font-semibold text-slate-200 text-sm flex items-center gap-1.5">
                    <User className="w-4 h-4 text-sky-400" />
                    Sign the Guestbook
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="text"
                      placeholder="Your Name (e.g. Mom, Friend)"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      maxLength={30}
                      required
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl text-sm focus:outline-none transition text-slate-200"
                    />
                    <textarea
                      placeholder="Write your heart-warming birthday wish..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      maxLength={300}
                      required
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl text-sm focus:outline-none resize-none transition text-slate-200"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shadow-md shadow-sky-950"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Sign Wish
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rashi's Welcome Letter Overlay */}
      <AnimatePresence>
        {showLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, rotate: -1 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.95, rotate: 1 }}
              className="bg-[#f9f5eb] text-amber-950 border-4 border-amber-900/30 shadow-2xl rounded-3xl p-8 max-w-lg w-full font-serif flex flex-col justify-between max-h-[80vh] overflow-y-auto"
              style={{ fontFamily: "'Caveat', cursive, serif" }}
              id="letterModal"
            >
              <div className="space-y-6 text-xl md:text-2xl leading-relaxed">
                <div className="flex justify-between items-center border-b border-amber-900/10 pb-4">
                  <span className="font-bold text-amber-800 text-2xl">July 18th, 2026</span>
                  <button
                    onClick={() => setShowLetter(false)}
                    className="px-3 py-1 bg-amber-900/10 hover:bg-amber-900/20 text-amber-900 font-sans rounded-lg text-xs cursor-pointer transition"
                  >
                    Close
                  </button>
                </div>

                <p className="font-bold text-3xl text-amber-900">Dearest Yash,</p>
                
                <p>
                  Welcome home! ❤️ I built this little digital sanctuary especially for you, my amazing boyfriend.
                  Every room in this house holds a piece of our story, a beautiful memory, or a dream we share together.
                </p>
                <p>
                  I\'ve hidden a legendary treasure chest in the **Attic** of this house, but it\'s locked with a secure 4-digit code.
                  To open it, you must explore the house and complete the tasks in each room. Each completed room will reveal one key digit!
                </p>
                <p>
                  Here is your very first clue:
                  <br />
                  <span className="font-bold text-amber-800 bg-amber-200/50 px-2 py-1.5 rounded-lg border border-amber-300 block text-center my-3 font-mono text-lg md:text-xl">
                    🚪 Clue #1: Underneath this very scroll, scribbled on a dusty desk plaque, is the first digit: "1"
                  </span>
                </p>
                <p>
                  Go ahead, click on the House Map and explore the other rooms! Have the most wonderful birthday!
                </p>
                <p className="text-right font-bold text-3xl text-amber-900 mt-6">- Your Loving Rashi ❤️</p>
              </div>

              {/* Clue Panel footer */}
              <div className="mt-8 border-t border-amber-900/10 pt-4 flex justify-between items-center font-sans text-xs text-amber-800">
                <span className="font-mono">Code Clue Found: 1 _ _ _</span>
                <span className="bg-amber-800 text-amber-50 px-3 py-1 rounded-full font-bold">First Clue Revealed!</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
