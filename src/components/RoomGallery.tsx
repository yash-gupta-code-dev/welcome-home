/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, ChangeEvent, FormEvent, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  RotateCw,
  Camera,
  Trash2,
  Edit3,
  Maximize2,
  Grid,
  Layers,
  Play,
  Pause,
  ChevronRight,
  X,
  Search,
  Heart,
  ImageIcon,
  RefreshCw,
  Check,
  Upload,
} from 'lucide-react';
import { PolaroidPhoto } from '../types';
import { audioEngine } from '../lib/AudioEngine';

// Bundled memory photos (Me & Her)
// @ts-ignore
import dec032025_a from '../assets/images/memories/1764737978771.jpg';
// @ts-ignore
import dec032025_b from '../assets/images/memories/1764738066955.jpg';
// @ts-ignore
import oct262025_a from '../assets/images/memories/20251026_022058.jpg';
// @ts-ignore
import oct262025_b from '../assets/images/memories/20251026_022101.jpg';
// @ts-ignore
import dec172025 from '../assets/images/memories/20251217_144631.jpg';
// @ts-ignore
import img1594 from '../assets/images/memories/IMG_1594.jpg';
// @ts-ignore
import img1595 from '../assets/images/memories/IMG_1595.jpg';
// @ts-ignore
import apr282026 from '../assets/images/memories/IMG_20260428_225951.jpg';
// @ts-ignore
import jul192026 from '../assets/images/memories/IMG_20260719_135348_707.jpg';
// @ts-ignore
import img4748 from '../assets/images/memories/IMG_4748.JPG';
// @ts-ignore
import img4750 from '../assets/images/memories/IMG_4750.JPG';
// @ts-ignore
import img5221 from '../assets/images/memories/IMG_5221.JPG';
// @ts-ignore
import snap1 from '../assets/images/memories/Snapchat-1064025396.jpg';
// @ts-ignore
import snap2 from '../assets/images/memories/Snapchat-1103735988.jpg';
// @ts-ignore
import snap3 from '../assets/images/memories/Snapchat-1188122572.jpg';
// @ts-ignore
import snap4 from '../assets/images/memories/Snapchat-1301091574.jpg';
// @ts-ignore
import snap5 from '../assets/images/memories/Snapchat-1352780582.jpg';
// @ts-ignore
import snap6 from '../assets/images/memories/Snapchat-2048944325.jpg';
// @ts-ignore
import snap7 from '../assets/images/memories/Snapchat-27811911.jpg';
// @ts-ignore
import snap8 from '../assets/images/memories/Snapchat-333832073.jpg';
// @ts-ignore
import snap9 from '../assets/images/memories/Snapchat-500250538.jpg';
// @ts-ignore
import snap10 from '../assets/images/memories/Snapchat-6367359.jpg';
// @ts-ignore
import snap11 from '../assets/images/memories/Snapchat-72837434.jpg';

interface RoomGalleryProps {
  onBackToMap: () => void;
}

const DEFAULT_POLAROIDS: PolaroidPhoto[] = [
  {
    id: '1',
    title: 'First Restaurant: Shawarmaji',
    imagePlaceholder: 'bg-gradient-to-tr from-amber-300 via-orange-400 to-rose-400',
    imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80',
    emoji: '🌯',
    date: 'First Restaurant Date',
    category: 'Dates',
    description: 'Our very first restaurant together when we had shawarma from Shawarmaji! Sitting there together, clicking cute pictures of us, talking and giggling, sharing our very first bite with each other, and then you gently wiping my mouth. It was so sweet and unforgettable!',
  },
  {
    id: '2',
    title: 'First Night Out: Marine Lines & Temple',
    imagePlaceholder: 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600',
    imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
    emoji: '🌊',
    date: 'First Night Out',
    category: 'Adventures',
    description: 'Our very first night out together! We went to Marine Lines to feel the cool ocean breeze and visited Siddhivinayak Temple together for holy blessings. Walking, talking, and laughing under the city lights—a memory forever engraved in my heart.',
  },
  {
    id: '3',
    title: 'Valentine Website & Project Ohana',
    imagePlaceholder: 'bg-gradient-to-tr from-rose-400 via-purple-500 to-indigo-600',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    emoji: '💌',
    date: "Valentine's Day & Ohana",
    category: 'Coding',
    description: "When you first gifted me a heartfelt letter created as a website on Valentine's Day! And apart from that, Project Ohana featuring Stitch and Mowgli is our absolute best project. Your coding is filled with so much love, warmth, and magic!",
  },
  {
    id: '4',
    title: "Mom's Food Stall & Handmade Momos",
    imagePlaceholder: 'bg-gradient-to-tr from-yellow-400 via-amber-500 to-orange-500',
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    emoji: '🥟',
    date: 'Started This Year',
    category: 'Family',
    description: "Mom's food stall started this year, which is such a wonderful blessing that happened to us! Thank you so much for bringing momos for me from the food stall—they are the best momos ever because you made them with your own hands! ❤️",
  },
  {
    id: '5',
    title: 'Career Switch & Engineering Milestone',
    imagePlaceholder: 'bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-600',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    emoji: '🚀',
    date: 'Career Milestone',
    category: 'Milestones',
    description: 'When you made that brave career switch and worked relentlessly until you achieved stability! I am so proud of your resilience and brilliance. Wishing you an even brighter career ahead—may you always keep growing and soaring high!',
  },
];

// Real photos bundled from "Me and Her" (edit each card in the gallery to add a personal title & note)
const CUSTOM_MEMORY_PHOTOS: PolaroidPhoto[] = [
  {
    id: 'memory_dec03_1',
    title: 'Dec 03, 2025',
    imageUrl: dec032025_a,
    emoji: '❤️',
    date: 'Dec 03, 2025',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_dec03_2',
    title: 'Dec 03, 2025',
    imageUrl: dec032025_b,
    emoji: '✨',
    date: 'Dec 03, 2025',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_oct26_1',
    title: 'Oct 26, 2025',
    imageUrl: oct262025_a,
    emoji: '🌸',
    date: 'Oct 26, 2025',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_oct26_2',
    title: 'Oct 26, 2025',
    imageUrl: oct262025_b,
    emoji: '☕',
    date: 'Oct 26, 2025',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_dec17',
    title: 'Dec 17, 2025',
    imageUrl: dec172025,
    emoji: '🎂',
    date: 'Dec 17, 2025',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_img1594',
    title: 'Our Camera Roll',
    imageUrl: img1594,
    emoji: '🎉',
    date: 'From Our Album',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_img1595',
    title: 'Our Camera Roll',
    imageUrl: img1595,
    emoji: '🏖️',
    date: 'From Our Album',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_apr28',
    title: 'Apr 28, 2026',
    imageUrl: apr282026,
    emoji: '🌃',
    date: 'Apr 28, 2026',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_jul19',
    title: 'Jul 19, 2026',
    imageUrl: jul192026,
    emoji: '🥰',
    date: 'Jul 19, 2026',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_img4748',
    title: 'Our Camera Roll',
    imageUrl: img4748,
    emoji: '🐾',
    date: 'From Our Album',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_img4750',
    title: 'Our Camera Roll',
    imageUrl: img4750,
    emoji: '🌯',
    date: 'From Our Album',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_img5221',
    title: 'Our Camera Roll',
    imageUrl: img5221,
    emoji: '🌊',
    date: 'From Our Album',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_snap1',
    title: 'Snapchat Moment',
    imageUrl: snap1,
    emoji: '💌',
    date: 'From Our Album',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_snap2',
    title: 'Snapchat Moment',
    imageUrl: snap2,
    emoji: '🥟',
    date: 'From Our Album',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_snap3',
    title: 'Snapchat Moment',
    imageUrl: snap3,
    emoji: '🚀',
    date: 'From Our Album',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_snap4',
    title: 'Snapchat Moment',
    imageUrl: snap4,
    emoji: '📸',
    date: 'From Our Album',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_snap5',
    title: 'Snapchat Moment',
    imageUrl: snap5,
    emoji: '❤️',
    date: 'From Our Album',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_snap6',
    title: 'Snapchat Moment',
    imageUrl: snap6,
    emoji: '✨',
    date: 'From Our Album',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_snap7',
    title: 'Snapchat Moment',
    imageUrl: snap7,
    emoji: '🌸',
    date: 'From Our Album',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_snap8',
    title: 'Snapchat Moment',
    imageUrl: snap8,
    emoji: '☕',
    date: 'From Our Album',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_snap9',
    title: 'Snapchat Moment',
    imageUrl: snap9,
    emoji: '🎂',
    date: 'From Our Album',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_snap10',
    title: 'Snapchat Moment',
    imageUrl: snap10,
    emoji: '🎉',
    date: 'From Our Album',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
  {
    id: 'memory_snap11',
    title: 'Snapchat Moment',
    imageUrl: snap11,
    emoji: '🏖️',
    date: 'From Our Album',
    category: 'General',
    description: 'Captured together with love and cherished forever in our house of memories ❤️',
  },
];

const EMOJI_OPTIONS = ['🌯', '🌊', '💌', '🥟', '🚀', '📸', '❤️', '✨', '🌸', '☕', '🎂', '🎉', '🏖️', '🌃', '🥰', '🐾'];
const CATEGORY_OPTIONS = ['All', 'Dates', 'Adventures', 'Coding', 'Family', 'Milestones', 'General'];

// Helper to compress uploaded images for smooth localStorage persistence
const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => resolve(event.target?.result as string);
      img.src = event.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

export default function RoomGallery({ onBackToMap }: RoomGalleryProps) {
  const [photos, setPhotos] = useState<PolaroidPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('welcome_home_custom_photos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved photos', e);
    }
    return [...DEFAULT_POLAROIDS, ...CUSTOM_MEMORY_PHOTOS];
  });

  const [flippedCards, setFlippedCards] = useState<{ [id: string]: boolean }>({});
  const [viewMode, setViewMode] = useState<'polaroid' | 'grid'>('polaroid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Lightbox states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PolaroidPhoto | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(false);

  // Add / Edit form fields
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formEmoji, setFormEmoji] = useState('📸');
  const [formCategory, setFormCategory] = useState('General');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [uploadedPreview, setUploadedPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to localStorage whenever photos change
  const savePhotos = (updatedPhotos: PolaroidPhoto[]) => {
    try {
      localStorage.setItem('welcome_home_custom_photos', JSON.stringify(updatedPhotos));
    } catch (e) {
      console.warn('Storage quota exceeded; keeping memory in state', e);
    }
    setPhotos(updatedPhotos);
  };

  // Slideshow auto-advance timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSlideshowPlaying && lightboxIndex !== null && photos.length > 0) {
      timer = setInterval(() => {
        setLightboxIndex((prev) => ((prev ?? 0) + 1) % photos.length);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isSlideshowPlaying, lightboxIndex, photos.length]);

  // Handle single card 3D flip
  const handleCardClick = (id: string) => {
    audioEngine.playNote(500, 'sine', 0.1);
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Open modal to edit existing photo
  const handleOpenEditModal = (photo: PolaroidPhoto, e: MouseEvent) => {
    e.stopPropagation();
    setEditingPhoto(photo);
    setFormTitle(photo.title);
    setFormDate(photo.date);
    setFormDescription(photo.description);
    setFormEmoji(photo.emoji || '📸');
    setFormCategory(photo.category || 'General');
    setFormImageUrl(photo.imageUrl || '');
    setUploadedPreview(photo.imageUrl || '');
    setShowAddModal(true);
  };

  // Delete photo
  const handleDeletePhoto = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    audioEngine.playConfettiPop();
    const updated = photos.filter((p) => p.id !== id);
    savePhotos(updated);
    if (lightboxIndex !== null && lightboxIndex >= updated.length) {
      setLightboxIndex(updated.length > 0 ? 0 : null);
    }
  };

  // Reset to default curated memories
  const handleResetDefaults = () => {
    if (window.confirm('Reset gallery to the original curated memories?')) {
      audioEngine.playChime();
      savePhotos([...DEFAULT_POLAROIDS, ...CUSTOM_MEMORY_PHOTOS]);
    }
  };

  // Handle single file upload inside the form
  const handleSingleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await compressImageFile(file);
      setUploadedPreview(base64);
      setFormImageUrl(base64);
      if (!formTitle) {
        setFormTitle(
          file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase())
        );
      }
    }
  };

  // Submit Add / Edit Form
  const handleSavePhotoForm = (e: FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    audioEngine.playSparkle();

    const imageFinal = uploadedPreview || formImageUrl.trim() || undefined;

    if (editingPhoto) {
      // Update existing
      const updated = photos.map((p) =>
        p.id === editingPhoto.id
          ? {
              ...p,
              title: formTitle.trim(),
              date: formDate.trim() || 'Precious Moment',
              description: formDescription.trim() || 'A cherished memory in our story.',
              emoji: formEmoji,
              category: formCategory,
              imageUrl: imageFinal,
            }
          : p
      );
      savePhotos(updated);
    } else {
      // Create new
      const newPhoto: PolaroidPhoto = {
        id: 'photo_' + Date.now(),
        title: formTitle.trim(),
        date: formDate.trim() || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        description: formDescription.trim() || 'A wonderful memory with Yash & Rashi.',
        emoji: formEmoji,
        category: formCategory,
        imageUrl: imageFinal,
        imagePlaceholder: 'bg-gradient-to-tr from-pink-400 via-rose-500 to-indigo-600',
      };
      savePhotos([newPhoto, ...photos]);
    }

    setShowAddModal(false);
  };

  // Filtered photos based on search and category
  const filteredPhotos = photos.filter((photo) => {
    const matchesCategory = selectedCategory === 'All' || photo.category === selectedCategory;
    const matchesQuery =
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.date.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 md:py-6 text-slate-100 flex flex-col min-h-[88vh]"
      id="roomGalleryMain"
    >

      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/90 hover:bg-slate-700/90 rounded-full border border-slate-700 text-sm font-medium transition cursor-pointer shadow-md"
          id="galleryBackBtn"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to House Map
        </button>

        {/* Center Pill / Counter */}
        <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1.5 rounded-full text-xs text-cyan-300 shadow-sm">
          <Camera className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold">Memory Gallery</span>
          <span className="bg-cyan-500/20 px-2 py-0.5 rounded-full text-[11px] font-mono text-cyan-200">
            {photos.length} Photos
          </span>
        </div>
      </div>

      {/* Main Gallery Frame */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-md flex-grow flex flex-col justify-between relative overflow-hidden shadow-2xl">
        {/* Subtle gallery background wall grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

        {/* WALL MOUNTED GALLERY SPOTLIGHT RAIL */}
        <div className="absolute top-2 inset-x-8 h-1 bg-zinc-800 shadow-lg pointer-events-none z-0">
          <div className="absolute top-1 left-1/5 w-2 h-2 bg-cyan-400/80 rounded-full shadow-[0_0_15px_6px_rgba(34,211,238,0.4)]" />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-pink-400/80 rounded-full shadow-[0_0_15px_6px_rgba(244,114,182,0.4)]" />
          <div className="absolute top-1 right-1/5 w-2 h-2 bg-amber-400/80 rounded-full shadow-[0_0_15px_6px_rgba(251,191,36,0.4)]" />
        </div>

        {/* Toolbar: Search, Categories & View Switcher */}
        <div className="z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          {/* Search bar */}
          <div className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search memories by title or story..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/70 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* View Mode & Slideshow Toggle */}
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => {
                setLightboxIndex(0);
                setIsSlideshowPlaying(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-medium transition cursor-pointer"
              title="Start Fullscreen Slideshow"
            >
              <Play className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Slideshow</span>
            </button>

            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode('polaroid')}
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  viewMode === 'polaroid'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Hanging Polaroid Wall View"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Album Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="z-10 py-16 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-3xl mb-4 border border-slate-700">
              📸
            </div>
            <h4 className="text-lg font-bold text-slate-200 mb-1">No Memories Found</h4>
            <p className="text-xs text-slate-400 mb-4">
              {searchQuery
                ? `No photos matched "${searchQuery}".`
                : 'Start filling this gallery wall by adding your favorite photos together!'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleResetDefaults}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-full border border-slate-700 cursor-pointer transition"
              >
                Restore Defaults
              </button>
            </div>
          </div>
        )}

        {/* VIEW 1: POLAROID HANGING WALL */}
        {viewMode === 'polaroid' && filteredPhotos.length > 0 && (
          <div className="z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 justify-center items-start flex-grow py-4">
            {filteredPhotos.map((photo, idx) => {
              const isFlipped = flippedCards[photo.id];
              const rotateDeg = (idx % 2 === 0 ? 1.5 : -1.8) + ((idx % 3) * 0.4);

              return (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  className="flex flex-col items-center justify-center relative select-none"
                  style={{ transform: `rotate(${rotateDeg}deg)` }}
                >
                  {/* Cute hemp string and wooden clothes pin */}
                  <div className="absolute -top-6 w-0.5 h-6 bg-amber-900/40 z-0" />
                  <div className="absolute -top-3 w-4 h-3 bg-amber-800 rounded-xs border border-amber-950/60 z-20 flex justify-center items-center shadow-xs">
                    <div className="w-1.5 h-1.5 bg-amber-950 rounded-full" />
                  </div>

                  {/* 3D Flipping Card */}
                  <div className="w-48 h-64 perspective-1000 z-10 group">
                    <div
                      className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${
                        isFlipped ? 'rotate-y-180' : ''
                      }`}
                      onClick={() => handleCardClick(photo.id)}
                    >
                      {/* CARD FRONT (Polaroid Photo) */}
                      <div className="absolute inset-0 backface-hidden bg-[#faf8f5] text-slate-900 p-3 shadow-2xl rounded-xs flex flex-col justify-between border border-stone-300">
                        {/* Image Container */}
                        <div
                          className={`w-full h-38 rounded-xs relative overflow-hidden flex items-center justify-center ${
                            photo.imagePlaceholder || 'bg-slate-200'
                          }`}
                        >
                          {photo.imageUrl ? (
                            <img
                              src={photo.imageUrl}
                              alt={photo.title}
                              className="w-full h-full object-cover object-center"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center">
                              <span className="text-5xl filter drop-shadow-md select-none">
                                {photo.emoji || '📸'}
                              </span>
                            </div>
                          )}

                          {/* Sun glare gradient */}
                          <div className="absolute inset-0 bg-linear-to-b from-white/15 via-transparent to-black/25 pointer-events-none" />

                          {/* Quick Lightbox View Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxIndex(photos.findIndex((p) => p.id === photo.id));
                            }}
                            className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-black/80 text-white rounded-md opacity-0 group-hover:opacity-100 transition shadow cursor-pointer"
                            title="View Fullscreen"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Polaroid handwritten-style label */}
                        <div className="text-center font-serif py-1 leading-tight flex-grow flex flex-col justify-center">
                          <div className="font-bold text-xs text-slate-900 tracking-tight leading-snug line-clamp-1">
                            {photo.title}
                          </div>
                          <div className="text-[10px] text-stone-500 italic mt-0.5">{photo.date}</div>
                        </div>

                        {/* Bottom Action Footer */}
                        <div className="text-[9px] text-stone-400 font-sans flex items-center justify-between border-t border-stone-200 pt-1.5">
                          <span className="flex items-center gap-1 text-stone-500">
                            <RotateCw className="w-2.5 h-2.5" /> Flip note
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => handleOpenEditModal(photo, e)}
                              className="text-stone-400 hover:text-sky-600 transition"
                              title="Edit memory details"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => handleDeletePhoto(photo.id, e)}
                              className="text-stone-400 hover:text-red-600 transition"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* CARD BACK (Handwritten memory note) */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#fffdf0] text-slate-800 p-3.5 shadow-2xl rounded-xs border border-amber-200 flex flex-col justify-between font-serif">
                        <div className="space-y-1.5 flex-grow overflow-y-auto pr-0.5">
                          <div className="font-bold text-xs text-amber-950 border-b border-amber-900/15 pb-1 flex justify-between items-center">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3 text-red-500 fill-current" />
                              <span>Our Story</span>
                            </span>
                            <span className="text-[9px] text-amber-800/70 font-sans font-normal">
                              {photo.date}
                            </span>
                          </div>
                          <p
                            className="text-xs leading-relaxed text-stone-800 italic select-text"
                            style={{ fontFamily: "'Caveat', cursive, serif", fontSize: '15px' }}
                          >
                            {photo.description}
                          </p>
                        </div>

                        <div className="text-[9px] text-amber-800/60 font-sans text-center border-t border-amber-900/10 pt-1 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <RotateCw className="w-2.5 h-2.5" /> Flip back
                          </span>
                          <button
                            onClick={(e) => handleOpenEditModal(photo, e)}
                            className="text-amber-800 hover:text-amber-950 text-[10px] font-semibold"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: ALBUM GRID VIEW */}
        {viewMode === 'grid' && filteredPhotos.length > 0 && (
          <div className="z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-grow py-2">
            {filteredPhotos.map((photo, idx) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30"
              >
                {/* Photo frame */}
                <div
                  className="relative h-44 w-full bg-slate-900 overflow-hidden cursor-pointer"
                  onClick={() => setLightboxIndex(photos.findIndex((p) => p.id === photo.id))}
                >
                  {photo.imageUrl ? (
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        photo.imagePlaceholder || 'bg-slate-800'
                      }`}
                    >
                      <span className="text-5xl filter drop-shadow">{photo.emoji || '📸'}</span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10">
                      {photo.category || 'General'}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button
                      onClick={(e) => handleOpenEditModal(photo, e)}
                      className="p-1.5 bg-black/60 hover:bg-black/90 text-slate-200 hover:text-white rounded-lg backdrop-blur-md transition shadow cursor-pointer"
                      title="Edit details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeletePhoto(photo.id, e)}
                      className="p-1.5 bg-black/60 hover:bg-red-900/80 text-slate-200 hover:text-red-200 rounded-lg backdrop-blur-md transition shadow cursor-pointer"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Hover overlay hint */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                    <Maximize2 className="w-4 h-4" /> View Fullscreen
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-3.5 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{photo.title}</h4>
                      <span className="text-xs select-none">{photo.emoji}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {photo.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{photo.date}</span>
                    <button
                      onClick={() => handleCardClick(photo.id)}
                      className="text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                    >
                      View Note
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer info note */}
        <div className="z-10 mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>💡 Tip: Click any card to flip it over and read the memory note.</span>
          </div>
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-300 text-[11px] transition cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Reset default memories
          </button>
        </div>
      </div>

      {/* MODAL 1: ADD / EDIT PHOTO DIALOG */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-100">
                      {editingPhoto ? 'Edit Memory Details' : 'Add New Memory Photo'}
                    </h3>
                    <p className="text-xs text-slate-400">Upload your real image or customize your story note</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSavePhotoForm} className="space-y-4">
                {/* Image Upload / Preview Area */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Photo / Image
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    {/* Thumbnail preview */}
                    <div className="w-24 h-24 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden relative shrink-0">
                      {uploadedPreview || formImageUrl ? (
                        <img
                          src={uploadedPreview || formImageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-center text-slate-500 p-2">
                          <ImageIcon className="w-6 h-6 mx-auto mb-1 text-slate-600" />
                          <span className="text-[9px]">No photo</span>
                        </div>
                      )}
                    </div>

                    {/* Upload button & URL input */}
                    <div className="flex-grow w-full space-y-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleSingleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-sky-400" />
                        <span>Choose Photo From Device</span>
                      </button>

                      <div className="relative">
                        <input
                          type="url"
                          placeholder="Or paste an image URL here..."
                          value={formImageUrl}
                          onChange={(e) => {
                            setFormImageUrl(e.target.value);
                            setUploadedPreview(e.target.value);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Memory Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., First Restaurant Date at Shawarmaji"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-400"
                  />
                </div>

                {/* Date & Category Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Date / Occasion
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Summer 2024 / First Night Out"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Category Tag
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-rose-400 cursor-pointer"
                    >
                      {CATEGORY_OPTIONS.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Emoji Sticker Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Emoji Badge
                  </label>
                  <div className="flex flex-wrap gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
                    {EMOJI_OPTIONS.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setFormEmoji(em)}
                        className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition cursor-pointer ${
                          formEmoji === em
                            ? 'bg-rose-500/30 border border-rose-500 scale-110'
                            : 'hover:bg-slate-800'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Handwritten Backstory / Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Backstory / Romantic Note
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Write the sweet memory, funny story, or details of this moment..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-400"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow-lg transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingPhoto ? 'Save Changes' : 'Add to Memory Wall'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: FULLSCREEN LIGHTBOX & SLIDESHOW */}
      <AnimatePresence>
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-8"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between text-white z-10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{photos[lightboxIndex].emoji}</span>
                <div>
                  <h3 className="font-bold text-base md:text-lg font-serif">
                    {photos[lightboxIndex].title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{photos[lightboxIndex].date}</span>
                    <span>•</span>
                    <span className="text-cyan-400">
                      {photos[lightboxIndex].category || 'General'}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">
                      {lightboxIndex + 1} of {photos.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setIsSlideshowPlaying(!isSlideshowPlaying)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                    isSlideshowPlaying
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  {isSlideshowPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" /> Auto Play
                    </>
                  )}
                </button>

                <button
                  onClick={() => setLightboxIndex(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Center Image & Story Canvas */}
            <div
              className="flex-grow flex flex-col md:flex-row items-center justify-center gap-6 my-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              <button
                onClick={() =>
                  setLightboxIndex((prev) => ((prev ?? 0) - 1 + photos.length) % photos.length)
                }
                className="p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition cursor-pointer hidden sm:block"
                title="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Main Image Box */}
              <div className="max-w-2xl max-h-[60vh] md:max-h-[70vh] flex items-center justify-center relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950">
                {photos[lightboxIndex].imageUrl ? (
                  <img
                    src={photos[lightboxIndex].imageUrl}
                    alt={photos[lightboxIndex].title}
                    className="max-h-[60vh] md:max-h-[70vh] w-auto object-contain rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div
                    className={`w-96 h-96 flex flex-col items-center justify-center p-8 ${
                      photos[lightboxIndex].imagePlaceholder || 'bg-slate-800'
                    }`}
                  >
                    <span className="text-8xl drop-shadow-lg mb-2">
                      {photos[lightboxIndex].emoji}
                    </span>
                    <span className="text-lg font-serif font-bold text-white text-center">
                      {photos[lightboxIndex].title}
                    </span>
                  </div>
                )}
              </div>

              {/* Side Handwritten Parchment Note */}
              <div className="w-full max-w-sm bg-[#fffdf0] text-slate-900 p-5 rounded-2xl shadow-2xl border border-amber-200 flex flex-col justify-between max-h-[50vh] md:max-h-[70vh] overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-900/20 pb-2">
                    <span className="font-serif font-bold text-sm text-amber-950 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                      Memory Note
                    </span>
                    <span className="text-xs text-amber-800/80 font-mono">
                      {photos[lightboxIndex].date}
                    </span>
                  </div>

                  <p
                    className="text-stone-800 leading-relaxed italic"
                    style={{ fontFamily: "'Caveat', cursive, serif", fontSize: '18px' }}
                  >
                    {photos[lightboxIndex].description}
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-900/10 flex items-center justify-between text-xs text-stone-500 font-sans">
                  <span>Preserved with love ❤️</span>
                  <button
                    onClick={(e) => {
                      const cur = photos[lightboxIndex];
                      setLightboxIndex(null);
                      handleOpenEditModal(cur, e);
                    }}
                    className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
                  >
                    Edit Story
                  </button>
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={() => setLightboxIndex((prev) => ((prev ?? 0) + 1) % photos.length)}
                className="p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition cursor-pointer hidden sm:block"
                title="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Mini Thumbnails Carousel */}
            <div
              className="flex items-center justify-center gap-2 overflow-x-auto py-2 scrollbar-none z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {photos.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                    lightboxIndex === idx
                      ? 'border-cyan-400 scale-110 shadow-lg shadow-cyan-500/30'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center text-sm ${
                        p.imagePlaceholder || 'bg-slate-800'
                      }`}
                    >
                      {p.emoji}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
