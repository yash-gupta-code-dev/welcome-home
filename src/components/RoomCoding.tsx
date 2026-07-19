/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Folder, FileCode, Terminal, Play, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CodeFile } from '../types';
import { audioEngine } from '../lib/AudioEngine';
import InteractivePhotoFrame from './InteractivePhotoFrame';

interface RoomCodingProps {
  onBackToMap: () => void;
  onClueFound: (room: 'hall' | 'kitchen' | 'coding' | 'music') => void;
  isClueFound: boolean;
}

const FILES: CodeFile[] = [
  {
    name: 'birthday.sh',
    language: 'bash',
    content: `#!/bin/bash
# Yash's Birthday script loader v1.0.0
echo "Initializing Celebration Sequence..."
sleep 0.5

echo "🎂 Loading 100% organic custom ASCII birthday cake..."
echo "      *   *   *   *      "
echo "    |   |   |   |    "
echo "  [===============]  "
echo "  [  HAPPY B-DAY  ]  "
echo "  [===============]  "
echo "  [               ]  "
echo "  =================  "

echo "Deploying hugs..."
echo "Hugs deployed. Love level: INFINITE."
`,
  },
  {
    name: 'wish_compiler.js',
    language: 'javascript',
    content: `// Rashi's Wish Compiler 2026
const Boyfriend = {
  name: "Yash",
  role: "Legendary Engineer & Musician",
  attributes: ["Creative", "Brilliant", "Unstoppable"]
};

function compileWishes() {
  console.log("Compiling warm wishes for Yash...");
  const wishes = [
    "May your code compile on the first attempt.",
    "May your bugs always be minor typo fixes.",
    "May your coffee be hot and your servers cool.",
    "Wishing you limitless joy, peace, and coding breakthroughs!"
  ];
  
  wishes.forEach((wish, i) => {
    console.log(\`[COMPILING WISH \${i+1}/4] \${wish} ... [OK]\`);
  });
  
  console.log("\\n✨ STACK OVERFLOW REVEAL: Magic Attic safe clue digit: \\"0\\"");
}

compileWishes();
`,
  },
  {
    name: 'secrets_exposed.py',
    language: 'python',
    content: `# Yash's Childhood Memory Leak Scraper
import time

class MemoryLeakScraper:
    def __init__(self):
        self.secrets = [
            "Sneaking an extra plate of food from mom's food stall when she wasn't looking.",
            "Sneaking under the blankets with a flashlight to play retro games till 3 AM.",
            "Your secret superpower: finding the exact line of bug I couldn't see in 4 hours.",
            "I've always looked up to your persistence. You're an incredible inspiration."
        ]

    def scrape_memories(self):
        print("Decrypting memory database...")
        for idx, secret in enumerate(self.secrets):
            print(f"[SECT-{idx+1}] Decrypting: {secret}")
            time.sleep(0.3)
        print("Scrape complete. Yash status: certified BEST BOYFRIEND ❤️")

MemoryLeakScraper().scrape_memories()
`,
  },
  {
    name: 'package.json',
    language: 'json',
    content: `{
  "name": "yash-birthday-engine",
  "version": "12.9.2026",
  "description": "An interactive framework of pure love and code",
  "main": "wish_compiler.js",
  "scripts": {
    "start": "node wish_compiler.js",
    "test": "echo \\"Error: Our connection cannot be tested\\" && exit 0"
  },
  "dependencies": {
    "hugs": "^99.9.9",
    "coffee": "^10.0.0",
    "memories": "latest"
  }
}
`,
  },
];

export default function RoomCoding({ onBackToMap, onClueFound, isClueFound }: RoomCodingProps) {
  const [activeFile, setActiveFile] = useState<CodeFile>(FILES[0]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Welcome to Yash & Rashi's Bash Shell (v3.2.0)",
    'Type commands or click files to execute them below.',
    'Ready for input...',
  ]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [commandInput, setCommandInput] = useState('');

  // Hotspot modal state
  const [showIdeModal, setShowIdeModal] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalOutput]);

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    setCommandInput('');
    setTerminalOutput((prev) => [...prev, `yash-shell $ ${cmd}`]);

    const lowerCmd = cmd.toLowerCase();

    if (lowerCmd === 'engineer') {
      audioEngine.playChime();
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { x: 0.3, y: 0.5 }
        });
      }, 250);
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { x: 0.7, y: 0.5 }
        });
      }, 500);

      setTerminalOutput((prev) => [
        ...prev,
        '🎉 [SUCCESS] HIDDEN COMMAND UNLOCKED: "engineer"',
        '🎉 CONFETTI DEPLOYED! Celebrating Yash: The Legendary Engineer! 🚀',
        '❤️ "Behind every line of amazing code, there is a brilliant mind and a beautiful heart." — Rashi',
      ]);
    } else if (lowerCmd === 'help') {
      setTerminalOutput((prev) => [
        ...prev,
        'Available commands:',
        '  help       - Show this help menu',
        '  clear      - Clear the terminal screen',
        '  run <file> - Run an explorer script (e.g., run birthday.sh)',
        '  engineer   - ??? (A special command for Yash)',
      ]);
    } else if (lowerCmd === 'clear') {
      setTerminalOutput([]);
    } else if (lowerCmd.startsWith('run ')) {
      const fileName = cmd.substring(4).trim();
      const fileToRun = FILES.find(f => f.name.toLowerCase() === fileName.toLowerCase());
      if (fileToRun) {
        handleRunFile(fileToRun);
      } else {
        setTerminalOutput((prev) => [...prev, `run: file not found: ${fileName}`]);
      }
    } else {
      setTerminalOutput((prev) => [
        ...prev,
        `yash-shell: command not found: ${cmd}. Type 'help' for available commands.`,
      ]);
    }
  };

  const handleRunFile = (file: CodeFile) => {
    if (isExecuting) return;
    setIsExecuting(true);
    audioEngine.playNote(220, 'sawtooth', 0.1);
    
    setTerminalOutput([`$ run ${file.name}`, `Executing ${file.name}...`]);

    setTimeout(() => {
      const outputs: string[] = [];

      if (file.name === 'birthday.sh') {
        audioEngine.playChime();
        outputs.push(
          'Initializing Celebration Sequence...',
          '🎂 Loading 100% organic custom ASCII birthday cake...',
          '      *   *   *   *',
          '    |   |   |   |  ',
          '  [===============]',
          '  [  HAPPY B-DAY  ]',
          '  [===============]',
          '  [               ]',
          '  =================',
          'Deploying hugs...',
          'Hugs deployed. Love level: INFINITE.'
        );
      } else if (file.name === 'wish_compiler.js') {
        audioEngine.playSparkle();
        onClueFound('coding');
        outputs.push(
          'Compiling warm wishes for Yash...',
          '[COMPILING WISH 1/4] May your code compile on the first attempt. ... [OK]',
          '[COMPILING WISH 2/4] May your bugs always be minor typo fixes. ... [OK]',
          '[COMPILING WISH 3/4] May your coffee be hot and your servers cool. ... [OK]',
          '[COMPILING WISH 4/4] Wishing you limitless joy, peace, and breakthroughs! ... [OK]',
          '',
          '✨ STACK OVERFLOW REVEAL: Magic Attic safe clue digit is: "0"'
        );
      } else if (file.name === 'secrets_exposed.py') {
        audioEngine.playNote(300, 'square', 0.25);
        outputs.push(
          'Decrypting memory database...',
          "[SECT-1] Decrypting: Sneaking an extra plate of food from mom's food stall when she wasn't looking.",
          '[SECT-2] Decrypting: Sneaking under the blankets with a flashlight to play retro games till 3 AM.',
          "[SECT-3] Decrypting: Your secret superpower: finding the exact line of bug I couldn't see in 4 hours.",
          "[SECT-4] Decrypting: I've always looked up to your persistence. You're an incredible inspiration.",
          'Scrape complete. Yash status: certified BEST BOYFRIEND ❤️'
        );
      } else {
        outputs.push(
          '{',
          '  "name": "yash-birthday-engine",',
          '  "version": "12.9.2026",',
          '  "dependencies": {',
          '    "hugs": "^99.9.9",',
          '    "coffee": "^10.0.0",',
          '    "memories": "latest"',
          '  }',
          '}'
        );
      }

      setTerminalOutput((prev) => [...prev, ...outputs]);
      setIsExecuting(false);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 w-full max-w-5xl mx-auto p-6 md:p-8 text-slate-100 flex flex-col min-h-[85vh] rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950"
    >
      {/* IMMERSIVE 2D CODING ROOM WALLS & DESK BACKGROUND */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
        {/* Coding Room Wall with Neon Glow */}
        <div className="w-full flex-grow bg-gradient-to-b from-[#211c34] via-[#9B8EC7] to-[#141221] relative overflow-hidden">
          {/* Subtle horizontal shelving and code grids */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
          
          {/* Cyberpunk LED glow lines */}
          <div className="absolute top-4 left-1/4 w-1/2 h-[1px] bg-[#B4D2D9]/40 shadow-[0_0_8px_2px_rgba(180,210,217,0.5)]" />

          {/* 1. TALL SERVER CABINET / SERVER RACK CUPBOARD (standing on left) */}
          <div className="absolute bottom-2 left-6 w-24 h-48 bg-[#9B8EC7]/10 border-2 border-[#BDA6CE] rounded-lg p-2 flex flex-col gap-1.5 shadow-[0_0_15px_rgba(155,142,199,0.15)] pointer-events-auto hover:border-[#F2EAE0] transition duration-300">
            <div className="text-[7px] text-[#B4D2D9] font-mono tracking-widest text-center border-b border-[#BDA6CE]/30 pb-1 font-bold">SERVER-01</div>
            {/* Server Shelves with flashing LEDs */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-6 bg-slate-950/80 rounded border border-[#BDA6CE]/30 flex items-center justify-between px-1.5 font-mono text-[5px]">
                <div className="flex items-center gap-1">
                  {/* Flashing LEDs */}
                  <span className={`w-1 h-1 rounded-full ${i % 2 === 0 ? 'bg-[#B4D2D9] animate-pulse' : 'bg-[#BDA6CE]'}`} />
                  <span className={`w-1 h-1 rounded-full ${i % 3 === 0 ? 'bg-[#9B8EC7] animate-pulse' : 'bg-slate-700'}`} />
                  <span className={`w-1 h-1 rounded-full ${i % 2 !== 0 ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`} />
                </div>
                {/* Simulated drive rails */}
                <div className="flex gap-0.5">
                  <div className="w-2 h-1 bg-slate-800 rounded-sm" />
                  <div className="w-2 h-1 bg-slate-800 rounded-sm" />
                  <div className="w-2 h-1 bg-[#B4D2D9]/70 rounded-sm animate-pulse" />
                </div>
              </div>
            ))}
            <div className="text-[6px] text-slate-500 text-center font-mono mt-auto">99.8% Uptime</div>
          </div>

          {/* 2. PROGRAMMING WALL ART & PHOTO FRAMES (Interactive memories for Yash) */}
          <div className="absolute top-6 right-12 flex gap-6 pointer-events-auto">
            <InteractivePhotoFrame
              id="coding-sunrise"
              emoji="💻"
              title="Debugging Till Sunrise"
              description="When we spent 8 hours hunting down a single missing semicolon. You refused to sleep until it was fixed, and when the terminal finally went green, you did a victory dance around the room."
              date="March 2025"
              positionClasses="relative"
              rotation="rotate-2"
              frameStyle="charcoal"
              caption="Sunrise"
            />

            <InteractivePhotoFrame
              id="coding-arcade"
              emoji="🕹️"
              title="Retro Highscores"
              description="That legendary session where you smashed the highscore on our favorite classic arcade emulator. Your focus is legendary, whether it's programming or conquering virtual worlds!"
              date="January 2025"
              positionClasses="relative"
              rotation="-rotate-3"
              frameStyle="gold"
              caption="Highscore"
            />
          </div>

          {/* 3. TECH SHELF / BOOKCASE (On right wall) */}
          <div className="absolute top-32 right-12 flex flex-col gap-1 pointer-events-auto">
            <div className="w-44 h-2.5 bg-slate-800 rounded shadow relative">
              {/* Shelved books represented in colorful columns */}
              <div className="absolute -top-6 right-2 flex items-end gap-0.5">
                {/* Book 1 (Red) */}
                <div className="w-3 h-6 bg-rose-700 border-r border-rose-800 rounded-t shadow cursor-help" title="C Programming (K&R)" />
                {/* Book 2 (Green) */}
                <div className="w-2.5 h-7 bg-emerald-700 border-r border-emerald-800 rounded-t shadow cursor-help" title="Algorithms (CLRS)" />
                {/* Book 3 (Slanted blue) */}
                <div className="w-3 h-6 bg-blue-600 border-r border-blue-700 rounded-t shadow origin-bottom rotate-6 cursor-help" title="TypeScript Handbook" />
                {/* Thin Book 4 (Gold) */}
                <div className="w-1.5 h-5 bg-amber-500 border-r border-amber-600 rounded-t shadow cursor-help" title="JS: The Good Parts" />
                {/* Controller accessory */}
                <div className="text-xs ml-3 pb-0.5 cursor-pointer hover:animate-bounce" title="Retro Controller">🎮</div>
              </div>
            </div>
            <div className="text-[7px] font-mono text-slate-500 text-right pr-2">Reference Books</div>
          </div>

          {/* 4. WALL GADGETS */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-6 opacity-60">
            {/* Analog Clock styled digitally */}
            <div className="px-3 py-1 bg-slate-950/90 border border-indigo-900/40 rounded-full font-mono text-[9px] text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.15)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span>LOG: DEPLOYED</span>
            </div>
          </div>
        </div>

        {/* Polished Tech Desktop Counter with Cozy Chair & Warm Desk Lamp */}
        <div className="w-full h-44 bg-gradient-to-b from-[#BDA6CE] via-[#B4D2D9] to-[#F2EAE0] border-t-4 border-[#9B8EC7] relative overflow-hidden">
          {/* Table under glow perspective */}
          <div className="absolute inset-x-0 top-0 h-1 bg-[#B4D2D9]/35" />

          {/* 5. COZY GAMING/CODING CHAIR (2D Vector styled) */}
          <div className="absolute bottom-2 left-1/3 -translate-x-6 flex flex-col items-center pointer-events-auto select-none z-10" title="Ergonomic Coder Throne">
            {/* Headrest */}
            <div className="w-8 h-6 bg-[#9B8EC7] border border-[#BDA6CE] rounded shadow-md" />
            {/* Neck support */}
            <div className="w-2 h-2 bg-slate-950 border-x border-slate-800" />
            {/* Chair Backrest */}
            <div className="w-12 h-14 bg-gradient-to-b from-[#9B8EC7] to-[#211c34] border border-[#BDA6CE] rounded-lg shadow-md flex items-center justify-between p-1.5 relative">
              {/* Neon color trim panels */}
              <div className="w-1 h-10 bg-[#B4D2D9] rounded shadow-sm animate-pulse" />
              <div className="w-1 h-10 bg-[#B4D2D9] rounded shadow-sm animate-pulse" />
            </div>
            {/* Seat cushion */}
            <div className="w-14 h-3 bg-[#BDA6CE] border border-[#9B8EC7] rounded-b shadow-md" />
            {/* Hydraulic base stem */}
            <div className="w-1.5 h-10 bg-zinc-850" />
            {/* Castors (feet) */}
            <div className="flex gap-6 -mt-1.5">
              <div className="w-2 h-2 bg-slate-950 rounded-full border border-slate-800" />
              <div className="w-2 h-2 bg-slate-950 rounded-full border border-slate-800" />
            </div>
          </div>

          {/* 6. PIXAR-STYLE DESK LAMP & WARM RADIAL GLOW */}
          <div className="absolute -top-1 right-24 flex flex-col items-center pointer-events-auto z-10">
            {/* Lamp Head slanted downwards */}
            <div className="w-8 h-6 bg-amber-500 rounded-t-full border border-amber-600 shadow-md rotate-[40deg] origin-bottom relative flex justify-center items-center">
              {/* Bulb with intense glow effect */}
              <div className="absolute bottom-0 w-4 h-2 bg-amber-100 rounded-full shadow-[0_0_20px_10px_rgba(251,191,36,0.6)]" />
            </div>
            {/* Lamp Arm segments */}
            <div className="w-1 h-10 bg-slate-500 shadow rotate-[-15deg] -mt-1" />
            <div className="w-1 h-10 bg-slate-500 shadow rotate-[35deg] -mt-2" />
            {/* Lamp Base */}
            <div className="w-8 h-2 bg-slate-700 rounded-full" />
            <div className="text-[6px] text-amber-300 font-bold mt-1 uppercase">Desk Lamp</div>

            {/* Glowing yellow light cone layered behind elements */}
            <div className="absolute top-4 -right-16 w-56 h-36 bg-gradient-to-b from-amber-400/20 to-transparent rounded-full filter blur-xl opacity-60 mix-blend-screen pointer-events-none" />
          </div>

          {/* Scattered mugs & hardware details */}
          <div className="absolute bottom-4 right-1/4 flex gap-3 pointer-events-auto select-none text-xs">
            <span title="Caffeine Injection Mug" className="cursor-help hover:animate-bounce">☕</span>
            <span title="Wired Gaming Mouse" className="cursor-help hover:scale-110">🖱️</span>
            <span title="Crunchy Chips Code Snack" className="cursor-help hover:animate-bounce">🍿</span>
          </div>
        </div>
      </div>

      {/* FOREGROUND NAVIGATION */}
      <div className="relative z-10 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBackToMap}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-850 text-slate-100 rounded-full border border-slate-800 text-sm font-medium transition cursor-pointer shadow-lg backdrop-blur-sm"
            id="codingBackBtn"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to House Map
          </button>
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-xs text-indigo-300 backdrop-blur-sm">
            💻 Coding Lab (Tech Workshop)
          </div>
        </div>

        {/* Dynamic Center Stage Hotspots */}
        <div className="relative flex-grow w-full min-h-[45vh] md:min-h-[50vh] mt-4 mb-2 flex items-center justify-center">
          
          {/* Centerpiece Hotspot: Dual Widescreen Monitors Desk Setup */}
          <div className="flex flex-col items-center">
            {/* Widescreen Desk Setup Visual */}
            <div 
              onClick={() => {
                audioEngine.init();
                setShowIdeModal(true);
              }}
              className="w-48 h-32 md:w-56 md:h-36 bg-[#211c34] border-2 border-[#BDA6CE] rounded-2xl relative shadow-[0_0_25px_rgba(180,210,217,0.25)] cursor-pointer group hover:scale-105 transition-transform p-3 flex flex-col justify-between"
            >
              {/* Twin monitor frames split screen */}
              <div className="flex-grow flex gap-2 relative">
                {/* Left Screen: File trees representation */}
                <div className="flex-grow bg-[#141221] border border-[#BDA6CE]/40 rounded-lg p-1.5 flex flex-col gap-1 overflow-hidden relative">
                  <div className="flex justify-between items-center border-b border-[#BDA6CE]/20 pb-0.5">
                    <span className="text-[6px] text-[#B4D2D9] font-mono">FILES</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9B8EC7]" />
                  </div>
                  <div className="space-y-1 mt-1">
                    <div className="w-full h-1 bg-[#BDA6CE]/20 rounded" />
                    <div className="w-3/4 h-1 bg-[#9B8EC7]/40 rounded" />
                    <div className="w-5/6 h-1 bg-[#BDA6CE]/20 rounded" />
                  </div>
                  {/* Glowing cyber grid decoration */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(180,210,217,0.06),_rgba(189,166,206,0.02),_rgba(155,142,199,0.06))] bg-[size:100%_4px,_6px_100%] pointer-events-none" />
                </div>

                {/* Right Screen: IDE Editor with ASCII code flow */}
                <div className="flex-grow bg-[#141221] border border-[#BDA6CE]/40 rounded-lg p-1.5 flex flex-col gap-1 overflow-hidden relative">
                  <div className="flex justify-between items-center border-b border-[#BDA6CE]/20 pb-0.5">
                    <span className="text-[6px] text-[#BDA6CE] font-mono">EDITOR</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B4D2D9] animate-pulse" />
                  </div>
                  {isClueFound ? (
                    <div className="flex flex-col items-center justify-center flex-grow">
                      <span className="text-emerald-400 text-[8px] font-mono animate-bounce">SUCCESS</span>
                      <span className="text-[10px] select-none">🏆</span>
                    </div>
                  ) : (
                    <div className="space-y-1 mt-1 font-mono text-[5px] text-emerald-500/60 leading-tight">
                      <div>const code = 101;</div>
                      <div className="text-amber-400/65">run()</div>
                    </div>
                  )}
                  {/* CRT flicker effect overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20" />
                </div>
              </div>

              {/* Glowing Custom Cyber Mechanical Keyboard on desk */}
              <div className="h-4 bg-[#141424] border border-slate-800 rounded-lg mt-2 relative flex items-center justify-center">
                <div className="w-1/2 h-1 bg-gradient-to-r from-pink-500 via-indigo-500 to-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              </div>

              {/* Steaming Mug & Coffee Mug overlay decoration */}
              <span className="absolute -right-4 -bottom-1.5 text-xl select-none z-10 animate-bounce">☕</span>
            </div>

            {/* Glowing developer station label */}
            <button 
              onClick={() => {
                audioEngine.init();
                setShowIdeModal(true);
              }}
              className="mt-3.5 px-3 py-1 bg-slate-900/95 hover:bg-slate-800 rounded-full border border-slate-700/80 text-[10px] font-bold text-indigo-400 animate-pulse flex items-center gap-1 shadow-md cursor-pointer"
            >
              💻 Code Workspace (Click here)
            </button>
          </div>
        </div>

        {/* Clue Panel Badge */}
        <AnimatePresence>
          {isClueFound && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 justify-center p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl text-xs md:text-sm text-emerald-300 backdrop-blur-sm shadow-lg"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>
                <strong>Memory Compiled Successfully!</strong> Birthday wishes deployed. Third combination clue revealed: <strong className="font-mono text-emerald-100 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-500/20 text-md">"0"</strong>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cyberpunk Retro IDE Workspace Modal Overlay */}
      <AnimatePresence>
        {showIdeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowIdeModal(false)}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#181824] border border-slate-850 rounded-2xl w-full max-w-4xl max-h-[82vh] flex flex-col overflow-hidden shadow-2xl text-slate-100"
            >
              {/* IDE Top Window Bar */}
              <div className="bg-[#0f0f15] px-4 py-3 flex justify-between items-center border-b border-[#212130]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs text-slate-500 font-mono ml-2">YashCodeStudio — v1.0.0</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-[10px] font-mono text-slate-400 bg-slate-900/50 px-2 py-1 rounded border border-slate-800 hidden md:block">
                    Active: {activeFile.name}
                  </div>
                  <button
                    onClick={() => setShowIdeModal(false)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer transition font-sans"
                  >
                    ✕ Close
                  </button>
                </div>
              </div>

              {/* IDE Body split layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 flex-grow min-h-[300px] overflow-y-auto md:overflow-y-hidden">
                
                {/* File Explorer (Left column) */}
                <div className="md:col-span-3 bg-[#111119] border-r border-[#212130] p-4 space-y-4 flex flex-col justify-start">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <Folder className="w-4 h-4 text-indigo-400" />
                    Explorer
                  </div>

                  <div className="space-y-1">
                    {FILES.map((file) => (
                      <button
                        key={file.name}
                        onClick={() => {
                          audioEngine.playNote(600, 'sine', 0.05);
                          setActiveFile(file);
                        }}
                        className={`w-full p-2.5 rounded-lg text-left text-xs font-mono flex items-center gap-2 transition cursor-pointer ${
                          activeFile.name === file.name
                            ? 'bg-[#29293f] text-indigo-300 font-bold border-l-2 border-indigo-500'
                            : 'hover:bg-[#1a1a27] text-slate-400'
                        }`}
                        id={`file-${file.name}`}
                      >
                        <FileCode className={`w-3.5 h-3.5 ${activeFile.name === file.name ? 'text-indigo-400' : 'text-slate-500'}`} />
                        {file.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Code Viewer Panel (Right columns) */}
                <div className="md:col-span-9 bg-[#14141f] flex flex-col relative justify-between overflow-y-auto">
                  {/* Editor Tab bar */}
                  <div className="bg-[#101018] px-4 py-2 border-b border-[#212130] flex items-center justify-between sticky top-0 z-10">
                    <div className="text-xs font-mono text-indigo-400 flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5" />
                      {activeFile.name}
                    </div>
                    <button
                      onClick={() => handleRunFile(activeFile)}
                      disabled={isExecuting}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer transition disabled:opacity-50"
                      id="ideRunBtn"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {isExecuting ? 'Running...' : 'Run Script'}
                    </button>
                  </div>

                  {/* Code line render panel */}
                  <div className="p-6 font-mono text-xs md:text-sm text-slate-300 leading-relaxed overflow-x-auto flex-grow select-text bg-[#14141f]/95">
                    <pre>
                      {activeFile.content.split('\n').map((line, idx) => (
                        <div key={idx} className="flex hover:bg-[#1f1f2e]/20 px-2 rounded">
                          <span className="text-slate-600 w-6 select-none border-r border-[#212130] mr-4 text-right pr-2">
                            {idx + 1}
                          </span>
                          <span className={
                            line.startsWith('#') || line.startsWith('//')
                              ? 'text-emerald-500 italic'
                              : line.includes('echo') || line.includes('console.log') || line.includes('print(')
                              ? 'text-amber-300 font-semibold'
                              : 'text-slate-300'
                          }>
                            {line}
                          </span>
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Bash Terminal Panel at the bottom */}
              <div className="bg-[#0b0b11] border-t border-[#212130] p-4 flex flex-col h-48 shrink-0">
                <div className="flex items-center gap-2 border-b border-[#1c1c2b] pb-2 mb-2 text-slate-400 text-xs font-mono select-none">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Bash Shell Emulator</span>
                </div>

                {/* Terminal stream */}
                <div className="flex-grow overflow-y-auto font-mono text-xs text-emerald-400 space-y-1.5 leading-relaxed select-text mb-2">
                  {terminalOutput.map((outLine, idx) => (
                    <div key={idx} className="whitespace-pre-wrap">
                      {outLine}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>

                {/* Command input form */}
                <form onSubmit={handleSendCommand} className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 border-t border-[#1c1c2b]/30 pt-2 shrink-0">
                  <span className="text-emerald-500 select-none">yash-shell $</span>
                  <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    className="flex-grow bg-transparent border-none outline-none focus:ring-0 text-emerald-400 font-mono caret-emerald-400"
                    placeholder="type 'help' or 'engineer'..."
                    disabled={isExecuting}
                    autoFocus
                    id="terminalInput"
                  />
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
