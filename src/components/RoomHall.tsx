/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Flame, FlameKindling, FileText, Send, User, ChevronLeft, Sparkles, Armchair, Image, Edit2, Check, X, RefreshCw, Home, Upload, Heart } from 'lucide-react';
import { GuestbookEntry } from '../types';
import { audioEngine } from '../lib/AudioEngine';
import InteractivePhotoFrame from './InteractivePhotoFrame';
import Guestbook from './Guestbook';
// @ts-ignore
import livingRoomSofa from '../assets/images/living_room_sofa_1784441684930.jpg';

export interface BalloonMemory {
  id: number;
  title: string;
  caption: string;
  imageUrl: string;
  color: string;
  badge: string;
}

// ==========================================
// 🎈 BALLOON SURPRISE IMAGES (DUMMY IMAGES)
// Provide a place to add images: you can replace these dummy image URLs with your real photos!
// You can also use the in-app "✏️ Change Image" button when the balloons pop!
// ==========================================
export const DEFAULT_BALLOON_MEMORIES: BalloonMemory[] = [
  {
    id: 1,
    title: "Happy Birthday Yash! 🎉",
    caption: "Wishing you a birthday filled with joy, warmth, and endless happiness!",
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80", // Dummy celebration photo
    color: "from-[#BDA6CE] via-[#9B8EC7] to-[#211c34]",
    badge: "🎈 Memory #1",
  },
  {
    id: 2,
    title: "First Restaurant: Shawarmaji 🌯❤️",
    caption: "Our first restaurant together having shawarma from Shawarmaji! Sitting together, clicking pictures of us, talking, giggling, sharing the first bite, and you wiping my mouth.",
    imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80", // Cozy dining memory photo
    color: "from-amber-400 via-orange-500 to-rose-700",
    badge: "🎈 Memory #2",
  },
  {
    id: 3,
    title: "Endless Adventures 🚀🌟",
    caption: "Here is to another year of awesome engineering, coding, and melodies!",
    imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80", // Dummy balloon/party photo
    color: "from-[#B4D2D9] via-[#6ba8b8] to-[#1e3c48]",
    badge: "🎈 Memory #3",
  },
];

interface RoomHallProps {
  onBackToMap: () => void;
  onClueFound: (room: 'hall' | 'kitchen' | 'coding' | 'music') => void;
  isClueFound: boolean;
}

const DEFAULT_GUESTBOOK: GuestbookEntry[] = [
  {
    id: '1',
    name: 'Mom ❤️',
    message: 'Happy Birthday my wonderful son! Starting our food stall this year has been such a blessing, and seeing you make and bring those delicious momos with your own hands makes my heart melt with pride. Wishing my brilliant engineer son a flourishing, stable career that always keeps growing!',
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
    name: 'Pragati (Your Sister) 🔬',
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
  const [sittingOnSofa, setSittingOnSofa] = useState(false);
  const [sofaInteractionCount, setSofaInteractionCount] = useState(0);
  const [isDayTime, setIsDayTime] = useState(false);

  // ==========================================
  // 🎈 BALLOON ENTRANCE & PHOTO MEMORIES STATE
  // ==========================================
  const [showBalloonIntro, setShowBalloonIntro] = useState(true);
  const [poppedBalloons, setPoppedBalloons] = useState<number[]>([]);
  const [balloonMemories, setBalloonMemories] = useState<BalloonMemory[]>(() => {
    const saved = localStorage.getItem('yash_balloon_memories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_BALLOON_MEMORIES;
  });
  const [showWelcomeNoteModal, setShowWelcomeNoteModal] = useState(false);
  const [editingMemoryId, setEditingMemoryId] = useState<number | null>(null);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editCaption, setEditCaption] = useState('');

  const handlePopBalloon = (id: number) => {
    if (poppedBalloons.includes(id)) return;
    audioEngine.init();
    audioEngine.playConfettiPop();
    const nextPopped = [...poppedBalloons, id];
    setPoppedBalloons(nextPopped);
    if (nextPopped.length === 2) {
      setTimeout(() => {
        audioEngine.playChime();
        audioEngine.playPartyHorn();
      }, 500);
    }
  };

  const handleStartEditMemory = (memory: BalloonMemory) => {
    setEditingMemoryId(memory.id);
    setEditImageUrl(memory.imageUrl);
    setEditTitle(memory.title);
    setEditCaption(memory.caption);
  };

  const handleSaveMemory = (e: FormEvent) => {
    e.preventDefault();
    if (editingMemoryId === null) return;
    const updated = balloonMemories.map(m => 
      m.id === editingMemoryId 
        ? { ...m, imageUrl: editImageUrl.trim() || m.imageUrl, title: editTitle.trim() || m.title, caption: editCaption.trim() || m.caption }
        : m
    );
    setBalloonMemories(updated);
    localStorage.setItem('yash_balloon_memories', JSON.stringify(updated));
    setEditingMemoryId(null);
    audioEngine.playSparkle();
  };

  const handleWindowClick = () => {
    audioEngine.init();
    setIsDayTime(prev => {
      const next = !prev;
      if (next) {
        // Night -> Day transition
        audioEngine.playSparkle();
        audioEngine.playNote(523.25, 'sine', 0.4); // C5
        setTimeout(() => audioEngine.playNote(659.25, 'sine', 0.4), 120); // E5
      } else {
        // Day -> Night transition
        audioEngine.playBlowWind();
        audioEngine.playNote(196.00, 'triangle', 0.6); // G3
      }
      return next;
    });
  };

  // Modal display states for immersive hotspots
  const [showFireplaceModal, setShowFireplaceModal] = useState(false);
  const [showSofaModal, setShowSofaModal] = useState(false);
  const [showDeskModal, setShowDeskModal] = useState(false);

  const handleSitOnSofa = () => {
    audioEngine.init();
    audioEngine.playNote(130.81, 'sine', 0.6); // Play deep cozy C3 note
    setTimeout(() => audioEngine.playNote(164.81, 'sine', 0.4), 100); // E3 chord
    setTimeout(() => audioEngine.playNote(196.00, 'sine', 0.3), 200); // G3 chord
    setSittingOnSofa(true);
    setSofaInteractionCount(prev => prev + 1);
    setShowSofaModal(true);
  };

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
      className="relative z-10 w-full max-w-5xl mx-auto p-6 md:p-8 text-slate-100 flex flex-col min-h-[85vh] rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950"
    >
      {/* ========================================== */}
      {/* 🎈 BALLOON SURPRISE ENTRANCE & PHOTO POP OVERLAY */}
      {/* ========================================== */}
      <AnimatePresence>
        {showBalloonIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-gradient-to-br from-[#211c34] via-[#9B8EC7]/95 to-[#141221] backdrop-blur-2xl flex flex-col justify-between p-6 md:p-8 overflow-y-auto"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center w-full max-w-4xl mx-auto border-b border-[#BDA6CE]/30 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl animate-bounce">🎈</span>
                <h2 className="text-lg md:text-xl font-serif font-bold text-[#F2EAE0]">
                  Yash's Birthday Celebration
                </h2>
              </div>
              <button
                onClick={() => {
                  audioEngine.playSparkle();
                  setShowBalloonIntro(false);
                }}
                className="text-xs bg-[#211c34]/60 hover:bg-[#211c34] text-[#F2EAE0] border border-[#BDA6CE] px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 font-medium shadow-md cursor-pointer"
                title="Skip balloon surprise and enter home"
              >
                <Home className="w-3.5 h-3.5 text-[#B4D2D9]" />
                <span>{poppedBalloons.length === 2 ? "Enter Home Now" : "Skip to Home"}</span>
              </button>
            </div>

            {/* Main Center Area */}
            <div className="my-auto py-6 text-center max-w-4xl mx-auto w-full">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#F2EAE0] drop-shadow">
                Pop the Birthday Balloons! ✨
              </h3>
              <p className="text-sm md:text-base text-[#B4D2D9] mt-2 max-w-lg mx-auto">
                Tap each balloon to pop it and reveal a special birthday memory! You can easily replace these dummy images with your own photos anytime.
              </p>

              {/* Balloon Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 mt-8 items-center justify-center">
                {balloonMemories.map((item) => {
                  const isPopped = poppedBalloons.includes(item.id);
                  return (
                    <div key={item.id} className="flex flex-col items-center justify-center min-h-[300px]">
                      {!isPopped ? (
                        /* 🎈 THE UNPOPPED BALLOON */
                        <motion.div
                          onClick={() => handlePopBalloon(item.id)}
                          animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
                          transition={{ repeat: Infinity, duration: 3 + item.id * 0.5, ease: "easeInOut" }}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          className="flex flex-col items-center cursor-pointer group select-none py-4"
                          title="Click to Pop Balloon!"
                        >
                          {/* Balloon Oval Body */}
                          <div
                            className={`w-48 h-60 md:w-52 md:h-64 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] bg-gradient-to-br ${item.color} shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative border border-white/25 p-6 text-center`}
                            style={{ boxShadow: 'inset -12px -12px 25px rgba(0,0,0,0.35), 0 20px 35px rgba(0,0,0,0.4)' }}
                          >
                            {/* Shiny Highlights */}
                            <div className="w-12 h-20 bg-white/30 rounded-full rotate-[-30deg] absolute top-6 left-6 blur-[1px] pointer-events-none" />
                            <div className="w-3 h-8 bg-white/20 rounded-full rotate-[-30deg] absolute top-28 left-8 blur-[1px] pointer-events-none" />

                            {/* Badge & Instruction */}
                            <div className="bg-black/35 backdrop-blur-md border border-white/40 rounded-full px-4 py-2 text-white font-bold text-sm shadow-xl group-hover:scale-105 transition flex items-center gap-1.5 animate-bounce">
                              <span>🎈 Tap to Pop!</span>
                            </div>
                            <span className="text-xs text-white/90 mt-2 font-semibold tracking-wide">{item.badge}</span>
                          </div>

                          {/* Knot */}
                          <div className="w-6 h-4 -mt-1 bg-[#9B8EC7] rounded-b-md shadow-md z-10" />

                          {/* Wavy String */}
                          <div className="w-0.5 h-24 bg-gradient-to-b from-white/60 via-white/30 to-transparent mx-auto relative">
                            <motion.div
                              animate={{ x: [-3, 3, -3] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="absolute inset-0 w-full h-full"
                            />
                          </div>
                        </motion.div>
                      ) : (
                        /* 🖼️ THE REVEALED POLAROID PHOTO FRAME */
                        <motion.div
                          initial={{ scale: 0.3, opacity: 0, rotate: -15 }}
                          animate={{ scale: 1, opacity: 1, rotate: item.id === 1 ? -2 : 2 }}
                          transition={{ type: "spring", damping: 15, stiffness: 120 }}
                          className="bg-[#F2EAE0] text-[#211c34] p-4 pb-5 rounded-2xl shadow-2xl border-4 border-[#BDA6CE] relative group flex flex-col justify-between max-w-xs md:max-w-sm mx-auto w-full"
                        >
                          {/* Top Badge & Edit Button */}
                          <div className="flex justify-between items-center mb-2 px-1">
                            <span className="bg-[#9B8EC7] text-[#F2EAE0] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                              {item.badge} Revealed ✨
                            </span>
                            <button
                              onClick={() => handleStartEditMemory(item)}
                              className="text-xs bg-[#211c34]/10 hover:bg-[#211c34]/25 text-[#211c34] px-2.5 py-1 rounded-md transition flex items-center gap-1 font-bold cursor-pointer"
                              title="Change image URL or upload photo"
                            >
                              <Edit2 className="w-3 h-3 text-[#211c34]" />
                              <span>Change Image</span>
                            </button>
                          </div>

                          {/* The Image */}
                          <div className="relative overflow-hidden rounded-xl bg-stone-200 border border-stone-300 shadow-inner aspect-4/3 w-full group/img">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover transition duration-500 group-hover/img:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition flex items-end p-3 pointer-events-none">
                              <span className="text-white text-xs font-medium">✨ Click 'Change Image' above to replace!</span>
                            </div>
                          </div>

                          {/* Caption & Title */}
                          <div className="mt-3 text-center px-1">
                            <h4 className="text-lg font-serif font-bold text-[#211c34] leading-tight">{item.title}</h4>
                            <p className="text-xs font-sans text-stone-600 mt-1 leading-relaxed">{item.caption}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Footer Area */}
            <div className="w-full max-w-2xl mx-auto text-center pt-4 border-t border-[#BDA6CE]/30">
              {poppedBalloons.length < balloonMemories.length ? (
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#F2EAE0]/80">
                  <Sparkles className="w-4 h-4 text-[#B4D2D9] animate-spin" />
                  <span>Popped {poppedBalloons.length} of {balloonMemories.length} balloons. Pop all to unlock your special Home greeting!</span>
                </div>
              ) : (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-gradient-to-br from-[#fcf8f0] via-[#fcf5e9] to-[#f7eee1] text-stone-900 border-4 border-[#BDA6CE] rounded-3xl p-6 md:p-8 shadow-2xl relative max-w-2xl mx-auto my-3 text-left overflow-hidden"
                >
                  {/* Decorative Heart */}
                  <div className="absolute top-4 right-4 text-rose-500 animate-pulse">
                    <Heart className="w-8 h-8 fill-current" />
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-bold text-[#9B8EC7] uppercase tracking-wider mb-2">
                    <span>💌 Special Welcome Note</span>
                  </div>

                  <div className="flex flex-wrap justify-between items-center border-b border-stone-300 pb-2 mb-3 gap-2">
                    <h4 className="text-2xl md:text-3xl font-serif font-extrabold text-stone-900 flex items-center gap-2">
                      <span>Hey, Love.</span>
                      <Heart className="w-6 h-6 text-red-600 fill-current animate-bounce" />
                    </h4>
                    <span className="font-sans text-xs md:text-sm font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-300 shadow-sm">
                      🎂 August 18th, 2026
                    </span>
                  </div>

                  <p className="font-serif text-base md:text-lg text-stone-800 leading-relaxed mb-3 font-medium bg-amber-100/50 p-3.5 rounded-xl border border-amber-900/10 shadow-sm">
                    Welcom to our little, cute house on internet-a-place build just for you. one tiny detail at a time. Every room holds a memory, a surprise and some task and piece of how much u mean to me.
                  </p>

                  <p className="font-serif text-base md:text-lg text-stone-800 leading-relaxed mb-6">
                    I hope u alove it all.Take ur taketime exploring, look around and make yourself at home.
                  </p>

                  <div className="border-t border-stone-300 pt-3 flex flex-col items-end text-right font-serif">
                    <p className="text-lg font-bold text-rose-600 mb-0.5">Love you Aaho</p>
                    <p className="text-xl md:text-2xl font-extrabold text-stone-900">From your duggu. ❤️</p>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => {
                        audioEngine.playSparkle();
                        setShowBalloonIntro(false);
                      }}
                      className="bg-gradient-to-r from-[#9B8EC7] to-[#BDA6CE] hover:from-[#BDA6CE] hover:to-[#9B8EC7] text-[#211c34] px-8 py-3 rounded-full font-bold text-sm md:text-base shadow-xl hover:scale-105 transition duration-300 flex items-center gap-2 border-2 border-[#F2EAE0] cursor-pointer"
                    >
                      <Home className="w-5 h-5" />
                      <span>🏠 Enter Home Now</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* ✏️ EDIT / CHANGE BALLOON IMAGE MODAL */}
      {/* ========================================== */}
      <AnimatePresence>
        {editingMemoryId !== null && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#211c34] border-2 border-[#BDA6CE] rounded-2xl p-6 max-w-md w-full text-slate-100 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-[#BDA6CE]/30 pb-3 mb-4">
                <h3 className="text-lg font-serif font-bold text-[#F2EAE0] flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-[#B4D2D9]" />
                  <span>Replace Balloon Photo & Caption</span>
                </h3>
                <button onClick={() => setEditingMemoryId(null)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveMemory} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#B4D2D9] uppercase tracking-wider mb-1">
                    Image URL (Or Upload Photo Below)
                  </label>
                  <input
                    type="url"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#141221] border border-[#BDA6CE]/40 rounded-lg p-2.5 text-sm text-[#F2EAE0] focus:outline-none focus:border-[#F2EAE0]"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    You can paste any direct image link, or use the uploader below!
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#BDA6CE] uppercase tracking-wider mb-1">
                    Upload from your Computer / Phone
                  </label>
                  <label className="w-full border-2 border-dashed border-[#BDA6CE]/50 hover:border-[#F2EAE0] rounded-lg p-3 flex items-center justify-center gap-2 cursor-pointer bg-[#9B8EC7]/10 hover:bg-[#9B8EC7]/20 transition text-sm text-[#F2EAE0]">
                    <Upload className="w-4 h-4 text-[#B4D2D9]" />
                    <span>Choose a local image file...</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setEditImageUrl(event.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#B4D2D9] uppercase tracking-wider mb-1">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-[#141221] border border-[#BDA6CE]/40 rounded-lg p-2.5 text-sm text-[#F2EAE0] focus:outline-none focus:border-[#F2EAE0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#B4D2D9] uppercase tracking-wider mb-1">Caption</label>
                  <textarea
                    rows={2}
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    className="w-full bg-[#141221] border border-[#BDA6CE]/40 rounded-lg p-2.5 text-sm text-[#F2EAE0] focus:outline-none focus:border-[#F2EAE0] resize-none"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingMemoryId(null)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#9B8EC7] to-[#BDA6CE] hover:from-[#BDA6CE] hover:to-[#9B8EC7] text-[#211c34] font-bold text-sm shadow-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save & Replace</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* 💌 WELCOME NOTE MODAL */}
      {/* ========================================== */}
      <AnimatePresence>
        {showWelcomeNoteModal && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-[#fcf8f0] via-[#fcf5e9] to-[#f7eee1] text-stone-900 border-4 border-[#BDA6CE] rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl relative"
            >
              <div className="flex justify-between items-center border-b border-stone-300 pb-3 mb-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#9B8EC7] uppercase tracking-wider">
                  <Heart className="w-5 h-5 text-rose-500 fill-current animate-pulse" />
                  <span>Welcome Note from Duggu</span>
                </div>
                <button 
                  onClick={() => setShowWelcomeNoteModal(false)} 
                  className="text-stone-400 hover:text-stone-800 cursor-pointer p-1 rounded-full bg-stone-200/50 hover:bg-stone-200 transition"
                  title="Close note"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 font-serif text-stone-800">
                <div className="flex flex-wrap justify-between items-center border-b border-stone-300 pb-2 gap-2">
                  <h4 className="text-2xl md:text-3xl font-extrabold text-stone-900 flex items-center gap-2">
                    <span>Hey, Love.</span>
                    <Heart className="w-6 h-6 text-red-600 fill-current" />
                  </h4>
                  <span className="font-sans text-xs md:text-sm font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-300 shadow-sm">
                    🎂 August 18th, 2026
                  </span>
                </div>

                <p className="text-base md:text-lg leading-relaxed font-medium bg-amber-100/50 p-3.5 rounded-xl border border-amber-900/10 shadow-sm">
                  Welcom to our little, cute house on internet-a-place build just for you. one tiny detail at a time. Every room holds a memory, a surprise and some task and piece of how much u mean to me.
                </p>

                <p className="text-base md:text-lg leading-relaxed">
                  I hope u alove it all.Take ur taketime exploring, look around and make yourself at home.
                </p>

                <div className="border-t border-stone-300 pt-4 flex flex-col items-end text-right">
                  <p className="text-lg font-bold text-rose-600 mb-0.5">Love you Aaho</p>
                  <p className="text-2xl font-extrabold text-stone-900">From your duggu. ❤️</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowWelcomeNoteModal(false)}
                  className="bg-gradient-to-r from-[#9B8EC7] to-[#BDA6CE] hover:from-[#BDA6CE] hover:to-[#9B8EC7] text-[#211c34] px-6 py-2 rounded-full font-bold text-sm shadow-md transition cursor-pointer"
                >
                  Close Note
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* IMMERSIVE 2D ROOM BACKDROP */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
        {/* Living Room Walls (Deep Slate-Teal Wallpaper with Day/Night state) */}
        <div className={`w-full flex-grow bg-gradient-to-b transition-all duration-1000 ${isDayTime ? 'from-[#F2EAE0] via-[#B4D2D9] to-[#BDA6CE]' : 'from-[#211c34] via-[#9B8EC7] to-[#141221]'} relative overflow-hidden`}>
          {/* Subtle wallpaper pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Glowing String Lights across the ceiling */}
          <div className="absolute top-0 inset-x-0 h-8 flex justify-around items-start opacity-80 px-8">
            {[...Array(14)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-[1px] h-3 bg-[#BDA6CE]" />
                <motion.div
                  animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 + (i % 3) * 0.4 }}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-1000 ${isDayTime ? 'bg-[#BDA6CE] shadow-[#BDA6CE]/50' : 'bg-[#9B8EC7] shadow-[#9B8EC7]/80'} shadow-md`}
                />
              </div>
            ))}
          </div>

          {/* Daytime Warm Sunlight Wash Overlay */}
          <div className={`absolute inset-0 bg-amber-500/10 mix-blend-soft-light transition-opacity duration-1000 pointer-events-none ${isDayTime ? 'opacity-100' : 'opacity-0'}`} />

          {/* Interactive Cozy Window showing a starry night / sunny day */}
          <motion.div 
            onClick={handleWindowClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-32 border-4 border-slate-800 bg-slate-950 rounded-t-full overflow-hidden flex flex-col justify-end p-1.5 shadow-inner opacity-90 pointer-events-auto cursor-pointer group z-20 transition-all duration-500"
            title={isDayTime ? "Click to shift to Cozy Night" : "Click to shift to Sunny Day"}
          >
            {/* Dynamic Sky Background */}
            <div className={`absolute inset-0 transition-all duration-1000 ${isDayTime ? 'bg-gradient-to-b from-sky-400 via-sky-300 to-amber-100' : 'bg-slate-950'}`} />

            {/* Stars outside window (fades during day) */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${isDayTime ? 'opacity-0' : 'opacity-100'}`}>
              <div className="absolute top-4 left-6 w-1 h-1 bg-white rounded-full animate-pulse" />
              <div className="absolute top-8 right-10 w-0.5 h-0.5 bg-slate-200 rounded-full" />
              <div className="absolute top-10 left-24 w-1 h-1 bg-yellow-100 rounded-full animate-ping" />
            </div>

            {/* Dynamic Celestial Bodies with Framer Motion */}
            <AnimatePresence mode="wait">
              {isDayTime ? (
                /* Sun */
                <motion.div
                  key="sun"
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 24, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-8 h-8 rounded-full bg-amber-200 absolute top-3 left-20 shadow-[0_0_20px_6px_rgba(251,191,36,0.5)]"
                />
              ) : (
                /* Moon */
                <motion.div
                  key="moon"
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 24, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-6 h-6 rounded-full bg-amber-100/35 absolute top-3 left-28 shadow-lg shadow-amber-100/10"
                />
              )}
            </AnimatePresence>

            {/* Clouds (Only when day) */}
            {isDayTime && (
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <motion.div 
                  animate={{ x: [-40, 160] }}
                  transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                  className="absolute top-4 text-xs select-none"
                >
                  ☁️
                </motion.div>
                <motion.div 
                  animate={{ x: [160, -40] }}
                  transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                  className="absolute top-8 text-sm select-none opacity-50"
                >
                  ☁️
                </motion.div>
              </div>
            )}

            {/* Silhouetted mountains that shift color */}
            <div className={`w-full h-8 transition-colors duration-1000 rounded-t-full opacity-70 z-10 ${isDayTime ? 'bg-slate-700' : 'bg-slate-900'}`} />

            {/* Window Pane Lines */}
            <div className="absolute inset-0 border-r border-t border-slate-800/40 pointer-events-none z-10" />
            
            {/* Click helper cue */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[8px] bg-slate-900/95 px-1.5 py-0.5 rounded-full text-slate-200 pointer-events-none z-20">
              {isDayTime ? "🌙 Night" : "☀️ Day"}
            </div>
          </motion.div>

          {/* Sunbeam Light Cone projection when daytime is active */}
          <AnimatePresence>
            {isDayTime && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0.8 }}
                animate={{ opacity: 0.18, scaleY: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute top-40 left-1/2 -translate-x-1/2 w-64 h-[320px] bg-gradient-to-b from-amber-200/50 via-amber-100/10 to-transparent origin-top pointer-events-none z-10 mix-blend-screen filter blur-md"
                style={{
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
                }}
              />
            )}
          </AnimatePresence>

          {/* 1. PHOTO FRAMES & WALL GALLERY around the window */}
          <InteractivePhotoFrame
            id="hall-pet"
            emoji="🐱"
            title="Late Night Jam Sessions"
            description="Remember when you played the acoustic guitar until 2 AM while everyone sang along, completely forgetting we had exams the next day? Your music brings people together like nothing else!"
            date="September 2024"
            positionClasses="top-12 left-[12%]"
            rotation="-rotate-6"
            frameStyle="wood"
            caption="Jam Session"
          />

          <InteractivePhotoFrame
            id="hall-landscape"
            emoji="🏔️"
            title="Wishes Under the Stars"
            description="Sitting on the grass, looking up at the stars, talking about our biggest dreams and fears. You've always believed in a brighter tomorrow and worked tirelessly to make it happen for everyone around you!"
            date="Midsummer Night"
            positionClasses="top-12 right-[12%]"
            rotation="rotate-3"
            frameStyle="gold"
            caption="Alpine Escape"
          />

          {/* 2. MAJESTIC GRANDFATHER CLOCK (standing on left side wall background) */}
          <div className="absolute bottom-2 left-8 w-16 h-48 bg-gradient-to-b from-[#9B8EC7] to-[#211c34] border-2 border-[#BDA6CE] rounded p-1 shadow-2xl flex flex-col items-center pointer-events-auto hover:border-[#F2EAE0] transition" title="Antique Grandfather Clock">
            {/* Clock Head */}
            <div className="w-12 h-12 bg-[#F2EAE0] rounded-full border-4 border-[#BDA6CE] shadow-inner flex items-center justify-center font-serif text-[#9B8EC7] relative">
              <div className="text-[10px] font-bold">XII</div>
              {/* Hands */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-0.5 h-3 bg-slate-950 rounded origin-bottom -mt-3 transform rotate-45" />
                <div className="w-0.5 h-4 bg-slate-950 rounded origin-bottom -mt-4 transform rotate-[160deg]" />
              </div>
            </div>
            {/* Long clock body case */}
            <div className="w-8 flex-grow border border-[#9B8EC7]/60 bg-[#9B8EC7]/20 rounded mt-1.5 p-1 relative flex justify-center overflow-hidden">
              {/* Swinging golden pendulum */}
              <motion.div
                animate={{ rotate: [-20, 20, -20] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-1.5 h-20 bg-yellow-400 rounded-full origin-top relative shadow-lg"
              >
                {/* Brass disc weight */}
                <div className="absolute bottom-0 -left-1 w-3 h-3 bg-yellow-500 rounded-full border border-yellow-300" />
              </motion.div>
            </div>
            <div className="text-[6px] text-[#B4D2D9] font-serif tracking-widest uppercase mt-1">Tempus</div>
          </div>

          {/* 3. TALL SHELVING CABINET / BOOKCASE (standing on right side wall background) */}
          <div className="absolute bottom-2 right-8 w-24 h-48 bg-[#9B8EC7]/10 border-2 border-[#BDA6CE] rounded-lg p-2 flex flex-col gap-2 shadow-2xl pointer-events-auto hover:border-[#F2EAE0] transition" title="Hall Library Cabinet">
            <div className="text-[7px] text-[#B4D2D9] font-bold uppercase tracking-wider text-center border-b border-[#BDA6CE]/40 pb-1">Archive</div>
            {/* Glass panels showing neat decorative objects inside */}
            <div className="flex-grow border border-[#BDA6CE]/25 bg-slate-950/80 rounded p-1.5 flex flex-col justify-between">
              <div className="flex justify-around border-b border-slate-850 pb-1">
                <span title="Vintage Globe" className="text-xs cursor-help hover:animate-spin">🌐</span>
                <span title="Golden Trophy" className="text-xs cursor-help hover:scale-110">🏆</span>
              </div>
              <div className="flex justify-around border-b border-slate-850 pb-1">
                <span title="Mystery Chest" className="text-xs cursor-help hover:scale-110">🧳</span>
                <span title="Old Hourglass" className="text-xs cursor-help hover:animate-pulse">⏳</span>
              </div>
              <div className="flex justify-around">
                <span title="Ancient Scroll" className="text-xs cursor-help hover:scale-110">📜</span>
                <span title="Magic Crystal Ball" className="text-xs cursor-help hover:scale-110">🔮</span>
              </div>
            </div>
            <div className="text-[6px] text-slate-500 text-center font-serif">Hall Curios</div>
          </div>
        </div>

        {/* Polished Hardwood Floorboards with Cozy Rug & Plant Pots */}
        <div className="w-full h-56 bg-gradient-to-b from-[#BDA6CE] via-[#B4D2D9] to-[#F2EAE0] border-t-4 border-[#9B8EC7] relative flex items-end justify-center overflow-hidden">
          {/* Floorboard lines */}
          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(90deg,transparent_50%,rgba(255,255,255,0.1)_50%)] [background-size:20px_100%]" />
          
          {/* Large circular cozy rug in center */}
          <div className="w-[85%] h-28 bg-gradient-to-r from-[#9B8EC7]/50 via-[#BDA6CE]/60 to-[#B4D2D9]/50 rounded-full border border-[#F2EAE0]/20 blur-xxs mb-4 shadow-2xl relative z-0" />

          {/* 4. LARGE POTTED MONSTERA PLANT (Left front ground overlay) */}
          <div className="absolute bottom-4 left-[15%] flex flex-col items-center pointer-events-auto z-10 hover:brightness-110 transition" title="Potted Monstera Deliciosa">
            {/* Broad Leaves */}
            <div className="flex flex-col items-center select-none relative h-10 w-12">
              <motion.span 
                animate={{ rotate: [-2, 2, -2] }} 
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="text-3xl absolute -top-4 -left-1"
              >
                🌿
              </motion.span>
              <motion.span 
                animate={{ rotate: [3, -3, 3] }} 
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                className="text-2xl absolute -top-2 right-0"
              >
                🌱
              </motion.span>
            </div>
            {/* Clay Plant Pot */}
            <div className="w-8 h-8 bg-gradient-to-b from-[#B4D2D9] to-[#BDA6CE] border border-[#9B8EC7] rounded-b-md shadow-md flex items-center justify-center font-mono text-[7px] text-[#F2EAE0]">
              POT
            </div>
          </div>

          {/* 5. COZY SIDE TABLE WITH RECORD PLAYER (Right center ground overlay) */}
          <div className="absolute bottom-6 right-[15%] flex flex-col items-center pointer-events-auto z-10" title="Vinyl Record Table">
            {/* Record Player & Coffee Mug & Welcome Letter */}
            <div className="h-6 w-28 bg-gradient-to-b from-slate-900 to-zinc-950 border border-slate-800 rounded flex justify-around items-center px-1 shadow-md relative group">
              <span className="text-xs group-hover:rotate-[360deg] duration-1000 cursor-pointer" title="Record Vinyl Disc">📻</span>
              <span 
                onClick={() => {
                  audioEngine.playSparkle();
                  setShowWelcomeNoteModal(true);
                }}
                className="text-xs cursor-pointer animate-pulse hover:scale-125 transition" 
                title="💌 Click to read Welcome Note from Duggu!"
              >💌</span>
              <span className="text-xs animate-bounce" title="Aromatic Herb Tea">🍵</span>
              <div className="absolute -top-1 w-16 h-0.5 bg-yellow-500/20" />
            </div>
            {/* Wooden Side Table Board */}
            <div className="w-32 h-2 bg-[#9B8EC7] border border-[#BDA6CE] rounded shadow-md" />
            {/* Flared Legs */}
            <div className="flex gap-20 -mt-0.5">
              <div className="w-1 h-8 bg-[#211c34] shadow-md rotate-[-12deg]" />
              <div className="w-1 h-8 bg-[#211c34] shadow-md rotate-[12deg]" />
            </div>
          </div>
        </div>
      </div>

      {/* FOREGROUND INTERACTIVE CONTAINER */}
      <div className="relative z-10 flex flex-col flex-grow">
        {/* Navigation Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <button
            onClick={onBackToMap}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-850 text-slate-100 rounded-full border border-slate-800 text-sm font-medium transition cursor-pointer shadow-lg backdrop-blur-sm"
            id="hallBackBtn"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to House Map
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                audioEngine.playSparkle();
                setShowWelcomeNoteModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-rose-500/20 to-amber-500/20 hover:from-rose-500/40 hover:to-amber-500/40 border border-rose-300/50 text-[#F2EAE0] rounded-full text-xs font-bold transition shadow-lg cursor-pointer"
              title="Read special love note from Duggu"
            >
              <span className="animate-bounce">💌</span>
              <span>Welcome Note</span>
            </button>
            <button
              onClick={() => {
                audioEngine.playSparkle();
                setShowBalloonIntro(true);
              }}
              className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#9B8EC7]/20 to-[#BDA6CE]/20 hover:from-[#9B8EC7]/40 hover:to-[#BDA6CE]/40 border border-[#BDA6CE] text-[#F2EAE0] rounded-full text-xs font-bold transition shadow-lg cursor-pointer animate-pulse"
              title="Re-open the birthday balloons and customize images"
            >
              <span>🎈 Pop Balloons & Photos</span>
            </button>
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full text-xs text-amber-300 backdrop-blur-sm">
              📍 Grand Entry Living Room
            </div>
          </div>
        </div>

        {/* Immersive Room Hotspots Floor Plan */}
        <div className="relative flex-grow w-full min-h-[50vh] md:min-h-[55vh] mt-4 mb-2">
          {/* Flame Ambient Glow over the hearth region */}
          <AnimatePresence>
            {fireplaceActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.25 }}
                exit={{ opacity: 0 }}
                className="absolute left-6 md:left-12 bottom-6 w-36 h-36 bg-radial-gradient from-orange-600 via-orange-600/10 to-transparent pointer-events-none z-10"
              />
            )}
          </AnimatePresence>

          {/* Left: Fireplace Hearth */}
          <div className="absolute bottom-6 left-4 md:left-10 flex flex-col items-center">
            {/* Fireplace structure */}
            <div 
              onClick={() => setShowFireplaceModal(true)}
              className="w-28 h-28 md:w-36 md:h-32 bg-slate-900/90 border-2 border-slate-750/90 rounded-t-2xl relative shadow-2xl cursor-pointer overflow-hidden group flex flex-col justify-end p-1 transition-transform hover:scale-105"
            >
              {/* Brick texture lines */}
              <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(90deg,transparent_50%,rgba(255,255,255,0.15)_50%)] bg-[size:16px_100%] pointer-events-none" />
              
              {/* Flame inside hearth */}
              <div className="flex-grow flex items-end justify-center pb-2 relative z-10">
                <AnimatePresence>
                  {fireplaceActive ? (
                    <div className="relative flex justify-center items-end h-16 w-12">
                      <motion.div
                        animate={{
                          scale: [1, 1.25, 0.9, 1.15, 1],
                          y: [0, -6, 0],
                        }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                        className="absolute w-6 h-10 bg-gradient-to-t from-red-600 via-orange-500 to-amber-300 rounded-t-full filter blur-xxs"
                      />
                      <motion.div
                        animate={{
                          scale: [1, 0.85, 1.2, 0.9, 1],
                          y: [0, -10, 0],
                        }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.15, ease: 'easeInOut' }}
                        className="absolute w-4 h-7 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 rounded-t-full filter blur-xxs"
                      />
                    </div>
                  ) : (
                    <FlameKindling className="w-6 h-6 text-slate-750 group-hover:text-slate-605 transition" />
                  )}
                </AnimatePresence>
              </div>
              
              {/* Hearth log base */}
              <div className="w-full h-2 bg-amber-950 rounded" />
            </div>
            {/* Label under it */}
            <button onClick={() => setShowFireplaceModal(true)} className="mt-2.5 px-3 py-1 bg-slate-900/95 hover:bg-slate-805 rounded-full border border-slate-700/80 text-[10px] font-bold text-orange-400 animate-pulse flex items-center gap-1 shadow-md cursor-pointer">
              <Flame className="w-3.5 h-3.5" />
              Hearth (Click here)
            </button>
          </div>

          {/* Center: Velvet Sofa */}
          <div className="absolute bottom-6 left-[28%] right-[28%] md:left-[35%] md:right-[35%] flex flex-col items-center">
            {/* Sofa furniture image on floor */}
            <div 
              onClick={handleSitOnSofa}
              className="relative group cursor-pointer border-2 border-[#BDA6CE] rounded-2xl overflow-hidden shadow-2xl transition hover:scale-105 bg-[#9B8EC7]/20"
            >
              <img src={livingRoomSofa} alt="Velvet Sofa" className="w-44 md:w-52 h-24 md:h-28 object-cover mix-blend-overlay brightness-110" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition flex items-center justify-center">
                {sittingOnSofa && (
                  <span className="bg-[#9B8EC7] text-[#F2EAE0] border border-[#BDA6CE]/40 text-[9px] font-bold py-0.5 px-2 rounded-full shadow-md animate-pulse">
                    🛋️ Sitting...
                  </span>
                )}
              </div>
            </div>
            {/* Label under it */}
            <button onClick={handleSitOnSofa} className="mt-2.5 px-3 py-1 bg-slate-900/95 hover:bg-slate-805 rounded-full border border-slate-700/80 text-[10px] font-bold text-emerald-300 animate-pulse flex items-center gap-1 shadow-md cursor-pointer">
              <Armchair className="w-3.5 h-3.5 text-emerald-400" />
              Sofa (Click here)
            </button>
          </div>

          {/* Right: Welcome Desk */}
          <div className="absolute bottom-6 right-4 md:right-10 flex flex-col items-center">
            {/* Desk furniture representation */}
            <div 
              onClick={() => setShowDeskModal(true)} 
              className="w-28 h-20 md:w-32 md:h-24 bg-gradient-to-b from-[#9B8EC7]/90 to-[#211c34]/95 border-2 border-[#BDA6CE] rounded-xl relative shadow-2xl cursor-pointer flex flex-col justify-end p-2 transition hover:scale-105 group"
            >
              {/* Desk Surface items */}
              <div className="absolute inset-x-0 -top-4 flex justify-around items-end px-2">
                {/* Little Scroll */}
                <FileText className="w-5 h-5 text-[#F2EAE0] drop-shadow-md group-hover:-translate-y-1 transition-transform" />
                {/* Little Guestbook */}
                <Book className="w-6 h-6 text-[#B4D2D9] drop-shadow-md group-hover:-translate-y-1 transition-transform" />
              </div>
              {/* Desk Drawer Handles */}
              <div className="w-full flex justify-around py-1.5 opacity-60">
                <div className="w-5 h-0.5 bg-[#B4D2D9] rounded-full" />
                <div className="w-5 h-0.5 bg-[#B4D2D9] rounded-full" />
              </div>
            </div>
            {/* Label under it */}
            <button onClick={() => setShowDeskModal(true)} className="mt-2.5 px-3 py-1 bg-slate-900/95 hover:bg-slate-850 rounded-full border border-slate-700/80 text-[10px] font-bold text-amber-300 animate-pulse flex items-center gap-1 shadow-md cursor-pointer">
              <span>📂</span>
              Desk (Click here)
            </button>
          </div>
        </div>
      </div>

      {/* Fireplace Modal Overlay */}
      <AnimatePresence>
        {showFireplaceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFireplaceModal(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative overflow-hidden shadow-2xl flex flex-col gap-4 text-slate-100 max-h-[82vh]"
            >
              {/* Fireplace flame glow */}
              <AnimatePresence>
                {fireplaceActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-radial-gradient from-orange-600 via-transparent to-transparent pointer-events-none"
                  />
                )}
              </AnimatePresence>

              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                  <h3 className="text-xl font-bold">The Hearth Fireplace</h3>
                </div>
                <button
                  onClick={() => setShowFireplaceModal(false)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer transition font-sans"
                >
                  ✕ Close
                </button>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed relative z-10">
                Warm up by the fireplace, hear the logs pop, and let the warmth wash over you.
              </p>

              {/* Fireplace Graphic */}
              <div className="my-2 flex justify-center items-center h-28 relative bg-slate-950/40 rounded-xl border border-slate-800/50">
                <div className="absolute bottom-1 w-20 h-3 bg-slate-950 rounded-full blur-sm" />
                
                {/* Logs */}
                <div className="absolute bottom-3 flex justify-center items-center gap-1 z-10">
                  <div className="w-12 h-3 bg-amber-950 rounded rotate-12 transform origin-center" />
                  <div className="w-12 h-3 bg-amber-950 rounded -rotate-12 transform origin-center -translate-x-2" />
                </div>

                <AnimatePresence>
                  {fireplaceActive ? (
                    <div className="relative z-20 flex justify-center items-end h-20 w-12">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 0.9, 1.1, 1],
                          y: [0, -8, 0],
                        }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                        className="absolute w-6 h-12 bg-gradient-to-t from-red-600 via-orange-500 to-amber-300 rounded-t-full filter blur-xxs"
                      />
                      <motion.div
                        animate={{
                          scale: [1, 0.8, 1.2, 0.9, 1],
                          y: [0, -12, 0],
                        }}
                        transition={{ repeat: Infinity, duration: 1.8, delay: 0.2, ease: 'easeInOut' }}
                        className="absolute w-4 h-8 bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-200 rounded-t-full filter blur-xxs"
                      />
                    </div>
                  ) : (
                    <div className="text-slate-600 flex flex-col items-center gap-1 select-none opacity-40">
                      <FlameKindling className="w-6 h-6" />
                      <span className="text-[9px]">Cold hearth logs</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleToggleFireplace}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all duration-300 relative z-10 flex items-center justify-center gap-2 cursor-pointer ${
                  fireplaceActive
                    ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-950/50'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/50'
                }`}
                id="fireplaceToggleBtn"
              >
                <Flame className="w-4 h-4" />
                {fireplaceActive ? 'Extinguish Fire' : 'Light Hearth Fire'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Velvet Sofa Modal Overlay */}
      <AnimatePresence>
        {showSofaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSofaModal(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative overflow-hidden shadow-2xl flex flex-col gap-4 text-slate-100 max-h-[82vh]"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Armchair className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <h3 className="text-xl font-bold">Emerald Velvet Sofa</h3>
                </div>
                <button
                  onClick={() => setShowSofaModal(false)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer transition font-sans"
                >
                  ✕ Close
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 h-40">
                <img
                  src={livingRoomSofa}
                  alt="Cozy Emerald Velvet Sofa"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
                <p className="italic text-emerald-200">
                  "You sink deep into the luxurious velvet cushions. The warmth of the fireplace hearth lulls you into pure comfort..."
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  💖 <span className="text-pink-400 font-semibold">Rashi's Note:</span> Yash, I knew this emerald sofa would be your favorite nook. Happy birthday my love!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Desk Modal Overlay */}
      <AnimatePresence>
        {showDeskModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeskModal(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative overflow-hidden shadow-2xl flex flex-col gap-4 text-slate-100 max-h-[82vh]"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📂</span>
                  <h3 className="text-xl font-bold">Welcome Desk</h3>
                </div>
                <button
                  onClick={() => setShowDeskModal(false)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer transition font-sans"
                >
                  ✕ Close
                </button>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed">
                A mahogany desk displaying a welcome letter from Rashi and a birthday guestbook.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  onClick={() => {
                    setShowDeskModal(false);
                    handleReadLetter();
                  }}
                  className="bg-amber-50/5 hover:bg-amber-50/10 border border-amber-500/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer group transition-all"
                >
                  <div className="w-10 h-10 bg-amber-500/10 group-hover:bg-amber-500/20 rounded-full flex items-center justify-center mb-2 transition">
                    <FileText className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
                  </div>
                  <h4 className="font-semibold text-amber-200 text-xs">Welcome Note</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">Read scroll.</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  onClick={() => {
                    setShowDeskModal(false);
                    audioEngine.playSparkle();
                    setShowGuestbook(true);
                  }}
                  className="bg-sky-50/5 hover:bg-sky-50/10 border border-sky-500/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer group transition-all"
                >
                  <div className="w-10 h-10 bg-sky-500/10 group-hover:bg-sky-500/20 rounded-full flex items-center justify-center mb-2 transition">
                    <Book className="w-5 h-5 text-sky-400 group-hover:scale-110 transition" />
                  </div>
                  <h4 className="font-semibold text-sky-200 text-xs">The Guestbook</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">Sign and view wishes.</p>
                </motion.div>
              </div>

              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
                💡 <span className="text-amber-300 font-medium">Warm Clue:</span> Explore the Welcome Desk scroll. Inside the welcome letter, there's a clue containing a combination code digit for the attic!
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guestbook Modal Overlay */}
      <AnimatePresence>
        {showGuestbook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGuestbook(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl p-6 md:p-8 relative overflow-y-auto shadow-2xl flex flex-col gap-4 text-slate-100 max-h-[92vh]"
            >
              <Guestbook onClose={() => setShowGuestbook(false)} />
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
            onClick={() => setShowLetter(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, rotate: -1 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.95, rotate: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#f9f5eb] text-amber-950 border-4 border-amber-900/30 shadow-2xl rounded-3xl p-8 max-w-lg w-full font-serif flex flex-col justify-between max-h-[80vh] overflow-y-auto"
              style={{ fontFamily: "'Caveat', cursive, serif" }}
              id="letterModal"
            >
              <div className="space-y-6 text-xl md:text-2xl leading-relaxed">
                <div className="flex justify-between items-center border-b border-amber-900/10 pb-4">
                  <span className="font-bold text-amber-800 text-2xl">August 18th, 2026</span>
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
