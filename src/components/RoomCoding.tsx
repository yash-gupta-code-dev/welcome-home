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

      // Trigger multiple bursts of confetti!
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
    
    // Clear terminal and print "executing..."
    setTerminalOutput([`$ run ${file.name}`, `Executing ${file.name}...`]);

    setTimeout(() => {
      const lines = file.content.split('\n');
      // Render output with delay to simulate real shell log
      let currentIdx = 0;
      const outputs: string[] = [];

      // Custom terminal mock outputs based on script
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
      className="relative z-10 w-full max-w-5xl mx-auto px-4 py-6 text-slate-100 flex flex-col min-h-[85vh]"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-full border border-slate-700 text-sm font-medium transition cursor-pointer"
          id="codingBackBtn"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to House Map
        </button>
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-xs text-indigo-300">
          💻 Coding Lab (Tech Workshop)
        </div>
      </div>

      {/* Retro IDE Workspace */}
      <div className="bg-[#181824]/90 border border-slate-800 rounded-2xl flex flex-col flex-grow overflow-hidden shadow-2xl backdrop-blur-md">
        
        {/* IDE Top Window Bar */}
        <div className="bg-[#0f0f15] px-4 py-3 flex justify-between items-center border-b border-[#212130]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-slate-500 font-mono ml-2">YashCodeStudio — v1.0.0</span>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-slate-900/50 px-3 py-1 rounded border border-slate-800">
            Active: {activeFile.name}
          </div>
        </div>

        {/* IDE Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-grow min-h-[400px]">
          
          {/* File Explorer (Left columns) */}
          <div className="md:col-span-3 bg-[#111119] border-r border-[#212130] p-4 space-y-4">
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
          <div className="md:col-span-9 bg-[#14141f] flex flex-col relative justify-between">
            {/* Editor Tab bar */}
            <div className="bg-[#101018] px-4 py-2 border-b border-[#212130] flex items-center justify-between">
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

            {/* Code lines */}
            <div className="p-6 font-mono text-xs md:text-sm text-slate-300 leading-relaxed overflow-x-auto flex-grow select-text">
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

        {/* Bash Terminal Panel */}
        <div className="bg-[#0b0b11] border-t border-[#212130] p-4 flex flex-col h-56">
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

          {/* Command input */}
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
      </div>

      {/* Clue Panel Badge */}
      <AnimatePresence>
        {isClueFound && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 justify-center p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl text-xs md:text-sm text-emerald-300"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>
              <strong>Memory Compiled Successfully!</strong> Birthday wishes deployed. Third combination clue revealed: <strong className="font-mono text-emerald-100 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-500/20 text-md">"0"</strong>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
