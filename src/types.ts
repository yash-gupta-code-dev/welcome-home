/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RoomId =
  | 'welcome'
  | 'map'
  | 'hall'
  | 'kitchen'
  | 'coding'
  | 'music'
  | 'gallery'
  | 'garden'
  | 'letter'
  | 'attic';

export interface GameState {
  currentRoom: RoomId;
  cluesFound: {
    hall: boolean;     // Clue 1: '1'
    kitchen: boolean;  // Clue 2: '2'
    coding: boolean;   // Clue 3: '0'
    music: boolean;    // Clue 4: '9'
  };
  chestUnlocked: boolean;
  activeMusic: boolean;
  bakedCake: {
    completed: boolean;
    frosting: string;
    toppings: string[];
    candlesLit: boolean;
    candlesBlown: boolean;
  };
  gardenWishes: {
    plantedCount: number;
    wateredCount: number;
    flowersBloomed: string[];
  };
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  avatar: string;
}

export interface PolaroidPhoto {
  id: string;
  title: string;
  imagePlaceholder: string; // CSS style or color accent for the mock photo
  description: string;
  date: string;
  emoji: string;
}

export interface CodeFile {
  name: string;
  language: string;
  content: string;
}

export interface MusicKey {
  note: string;
  frequency: number;
  keyboardKey: string;
  memory: string;
  color: string;
}
