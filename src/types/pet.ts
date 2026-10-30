/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PetStats {
  hunger: number; // 0 (starving) - 100 (full)
  happiness: number; // 0 (sad) - 100 (ecstatic)
  energy: number; // 0 (exhausted) - 100 (wide awake)
  hygiene: number; // 0 (dirty) - 100 (squeaky clean)
}

export type PersonalityArchetype =
  | 'Cuddlebug Sweetheart'
  | 'Sassy Drama Queen'
  | 'Gourmet Foodie'
  | 'Hyper Arcade Champion'
  | 'Sleepy Loaf'
  | 'Curious Explorer'
  | 'Fashion Diva'
  | 'Balanced Bestie';

export interface DynamicPersonality {
  cheerfulness: number; // -100 (grumpy/sassy) to +100 (bubbly/cheerful)
  gluttony: number; // 0 (picky) to 100 (foodie monster)
  playfulness: number; // 0 (chill couch potato) to 100 (hyper gamer)
  affection: number; // 0 (independent/tsundere) to 100 (super clingy)
  drama: number; // 0 (chill) to 100 (dramatic/theatrical)
  archetype: PersonalityArchetype;
  unlockedTraits: string[];
}

export type HoodieColor =
  | 'original-pink'
  | 'mint-frost'
  | 'lavender-dream'
  | 'buttercup'
  | 'midnight-navy'
  | 'berry-velvet'
  | 'matcha'
  | 'cloud-white'
  | 'caramel-latte'
  | 'arctic-cyan';

export type HoodStyle = 'classic' | 'bear_ears' | 'dino_spikes' | 'frog_eyes' | 'cat_ears';
export type ZipperCharm = 'classic' | 'star' | 'heart' | 'fish' | 'gold_ring';
export type HeadAccessory = 'none' | 'beanie' | 'party_hat' | 'flower' | 'crown' | 'chef_hat' | 'beret' | 'bow';
export type GlassesAccessory = 'none' | 'round_wire' | 'cool_shades' | 'heart_shades' | 'pixel_glasses' | 'monocle';
export type NeckAccessory = 'none' | 'red_scarf' | 'gold_chain' | 'bell_collar' | 'camera' | 'bowtie';
export type FurTone = 'classic-charcoal' | 'soft-grey' | 'pastel-lilac' | 'baby-penguin' | 'golden-canary' | 'mocha';
export type EyeStyle = 'sparkle' | 'happy_arc' | 'wink' | 'sleepy' | 'kawaii_anime';

export interface PetCustomization {
  furTone: FurTone;
  hoodieColor: HoodieColor;
  customHexHoodie?: string;
  pocketColor: string;
  zipperColor: string;
  zipperCharm: ZipperCharm;
  hoodUp: boolean;
  hoodStyle: HoodStyle;
  pattern: 'solid' | 'stripes' | 'polka_dots' | 'hearts' | 'stars';
  headAccessory: HeadAccessory;
  glasses: GlassesAccessory;
  neckAccessory: NeckAccessory;
  eyeStyle: EyeStyle;
  roomTheme: 'bedroom' | 'kitchen' | 'bathroom' | 'arcade' | 'garden';
}

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: 'sweet' | 'savory' | 'healthy' | 'special';
  hungerGain: number;
  happinessGain: number;
  cost: number;
  description: string;
  specialReaction?: 'spicy' | 'freeze' | 'sugar_rush';
}

export interface PetState {
  name: string;
  level: number;
  exp: number;
  expToNextLevel: number;
  coins: number;
  stats: PetStats;
  personality: DynamicPersonality;
  customization: PetCustomization;
  lastUpdated: number; // timestamp
  statsHistory: {
    totalPets: number;
    snacksFed: number;
    bathsTaken: number;
    gamesPlayed: number;
    bedtimes: number;
    speechEchoed: number;
  };
  inventory: {
    unlockedItems: string[];
    foods: Record<string, number>;
  };
  unlockedPolaroids: {
    id: string;
    caption: string;
    timestamp: number;
    room: string;
    outfitSummary: string;
  }[];
}

export type RoomType = 'living' | 'kitchen' | 'bathroom' | 'bedroom' | 'arcade' | 'wardrobe';
