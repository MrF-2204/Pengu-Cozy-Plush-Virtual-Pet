/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PetStats,
  DynamicPersonality,
  PersonalityArchetype,
  FoodItem,
  PetState,
  RoomType,
  PetCustomization,
} from '../types/pet';

export const FOOD_MENU: FoodItem[] = [
  {
    id: 'salmon_sushi',
    name: 'Fresh Salmon Nigiri',
    emoji: '🍣',
    category: 'savory',
    hungerGain: 35,
    happinessGain: 20,
    cost: 15,
    description: 'A penguin plushie classic! Tender fresh salmon on sushi rice.',
  },
  {
    id: 'strawberry_mochi',
    name: 'Strawberry Mochi',
    emoji: '🍓',
    category: 'sweet',
    hungerGain: 25,
    happinessGain: 30,
    cost: 20,
    description: 'Chewy, sweet, and matching Pengu’s pink jacket.',
    specialReaction: 'sugar_rush',
  },
  {
    id: 'ice_cream_cone',
    name: 'Glacier Soft Serve',
    emoji: '🍦',
    category: 'sweet',
    hungerGain: 20,
    happinessGain: 25,
    cost: 18,
    description: 'Chilly vanilla swirl that penguins adore.',
    specialReaction: 'freeze',
  },
  {
    id: 'crispy_waffle',
    name: 'Honey Butter Waffle',
    emoji: '🧇',
    category: 'sweet',
    hungerGain: 40,
    happinessGain: 22,
    cost: 22,
    description: 'Golden honeycomb waffle with melting sweet butter.',
  },
  {
    id: 'french_fries',
    name: 'Crispy Sea Salt Fries',
    emoji: '🍟',
    category: 'savory',
    hungerGain: 30,
    happinessGain: 15,
    cost: 14,
    description: 'Irresistibly crunchy golden potato sticks.',
  },
  {
    id: 'hot_cocoa',
    name: 'Marshmallow Hot Cocoa',
    emoji: '☕',
    category: 'sweet',
    hungerGain: 20,
    happinessGain: 28,
    cost: 16,
    description: 'Warming hug in a mug topped with plush marshmallows.',
  },
  {
    id: 'spicy_ramen',
    name: 'Dragon Pepper Ramen',
    emoji: '🍜',
    category: 'special',
    hungerGain: 45,
    happinessGain: 10,
    cost: 25,
    description: 'Super spicy noodles! Might give Pengu fire breath!',
    specialReaction: 'spicy',
  },
  {
    id: 'watermelon_slice',
    name: 'Chilled Watermelon',
    emoji: '🍉',
    category: 'healthy',
    hungerGain: 22,
    happinessGain: 18,
    cost: 12,
    description: 'Juicy, refreshing slice to hydrate your plush friend.',
  },
  {
    id: 'fish_cracker',
    name: 'Crispy Goldfish Snack',
    emoji: '🐟',
    category: 'savory',
    hungerGain: 15,
    happinessGain: 12,
    cost: 8,
    description: 'Bite-sized fishies for a quick crunch.',
  },
];

export const INITIAL_CUSTOMIZATION: PetCustomization = {
  furTone: 'classic-charcoal',
  hoodieColor: 'original-pink',
  customHexHoodie: '#fbcfe8', // delicate fluffy pastel pink matching the photo
  pocketColor: '#ec4899', // bright magenta pocket trim matching the photo
  zipperColor: '#f472b6', // soft pink zipper slider
  zipperCharm: 'classic',
  hoodUp: true,
  hoodStyle: 'classic',
  pattern: 'solid',
  headAccessory: 'none',
  glasses: 'none',
  neckAccessory: 'none',
  eyeStyle: 'sparkle',
  roomTheme: 'bedroom',
};

export const INITIAL_STATS: PetStats = {
  hunger: 85,
  happiness: 90,
  energy: 85,
  hygiene: 90,
};

export const INITIAL_PERSONALITY: DynamicPersonality = {
  cheerfulness: 30,
  gluttony: 40,
  playfulness: 50,
  affection: 60,
  drama: 20,
  archetype: 'Balanced Bestie',
  unlockedTraits: ['Plushie Hugger', 'Zipper Enthusiast'],
};

export const INITIAL_PET_STATE: PetState = {
  name: 'Pengu',
  level: 1,
  exp: 0,
  expToNextLevel: 100,
  coins: 150,
  stats: INITIAL_STATS,
  personality: INITIAL_PERSONALITY,
  customization: INITIAL_CUSTOMIZATION,
  lastUpdated: Date.now(),
  statsHistory: {
    totalPets: 0,
    snacksFed: 0,
    bathsTaken: 0,
    gamesPlayed: 0,
    bedtimes: 0,
    speechEchoed: 0,
  },
  inventory: {
    unlockedItems: [
      'original-pink',
      'classic-charcoal',
      'classic',
      'none',
      'solid',
      'sparkle',
    ],
    foods: {
      salmon_sushi: 2,
      strawberry_mochi: 2,
      hot_cocoa: 2,
      watermelon_slice: 3,
    },
  },
  unlockedPolaroids: [],
};

export function clamp(value: number, min: number = 0, max: number = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function calculateStatDecay(
  stats: PetStats,
  elapsedMinutes: number,
  isSleeping: boolean = false
): PetStats {
  if (elapsedMinutes <= 0) return { ...stats };

  // Rate per hour:
  // Hunger: -12/hr awake, -4/hr sleeping
  // Happiness: -10/hr awake, -2/hr sleeping
  // Energy: -15/hr awake, +30/hr sleeping
  // Hygiene: -6/hr
  const hours = elapsedMinutes / 60;

  if (isSleeping) {
    return {
      hunger: clamp(stats.hunger - hours * 5),
      happiness: clamp(stats.happiness - hours * 2),
      energy: clamp(stats.energy + hours * 35),
      hygiene: clamp(stats.hygiene - hours * 3),
    };
  }

  return {
    hunger: clamp(stats.hunger - hours * 10),
    happiness: clamp(stats.happiness - hours * 8),
    energy: clamp(stats.energy - hours * 9),
    hygiene: clamp(stats.hygiene - hours * 6),
  };
}

export function determineArchetype(p: DynamicPersonality): PersonalityArchetype {
  if (p.affection >= 75 && p.cheerfulness >= 20) return 'Cuddlebug Sweetheart';
  if (p.playfulness >= 75) return 'Hyper Arcade Champion';
  if (p.gluttony >= 75) return 'Gourmet Foodie';
  if (p.drama >= 70 || p.cheerfulness <= -40) return 'Sassy Drama Queen';
  if (p.cheerfulness >= 70) return 'Curious Explorer';
  return 'Balanced Bestie';
}

export function updatePersonalityAfterAction(
  personality: DynamicPersonality,
  action: 'pet' | 'feed' | 'wash' | 'game' | 'sleep' | 'poke' | 'dress_up',
  context?: { foodCategory?: string; gameScore?: number }
): DynamicPersonality {
  const next = { ...personality };
  const traits = new Set(next.unlockedTraits);

  switch (action) {
    case 'pet':
      next.affection = clamp(next.affection + 2);
      next.cheerfulness = clamp(next.cheerfulness + 3, -100, 100);
      next.drama = clamp(next.drama - 1);
      if (next.affection >= 80) traits.add('Certified Cuddlebug');
      break;

    case 'feed':
      next.gluttony = clamp(next.gluttony + (context?.foodCategory === 'sweet' ? 3 : 2));
      next.cheerfulness = clamp(next.cheerfulness + 2, -100, 100);
      if (context?.foodCategory === 'special') {
        next.drama = clamp(next.drama + 4);
        traits.add('Spice Daredevil');
      }
      if (next.gluttony >= 80) traits.add('Snack Connoisseur');
      break;

    case 'wash':
      next.cheerfulness = clamp(next.cheerfulness + 2, -100, 100);
      traits.add('Bubble Master');
      break;

    case 'game':
      next.playfulness = clamp(next.playfulness + 4);
      next.cheerfulness = clamp(next.cheerfulness + 3, -100, 100);
      if ((context?.gameScore || 0) > 50) traits.add('Mini-Game Pro');
      break;

    case 'sleep':
      next.drama = clamp(next.drama - 2);
      break;

    case 'poke':
      next.drama = clamp(next.drama + 3);
      next.cheerfulness = clamp(next.cheerfulness - 2, -100, 100);
      if (next.drama >= 70) traits.add('Easily Startled');
      break;

    case 'dress_up':
      traits.add('Runway Ready');
      next.cheerfulness = clamp(next.cheerfulness + 4, -100, 100);
      break;
  }

  next.unlockedTraits = Array.from(traits);
  next.archetype = determineArchetype(next);
  return next;
}

export function feedPet(
  current: PetState,
  food: FoodItem
): { state: PetState; reaction: 'loved' | 'spicy' | 'freeze' | 'stuffed' | 'normal' } {
  if (current.stats.hunger >= 98) {
    return { state: current, reaction: 'stuffed' };
  }

  // Bonus happiness if Foodie
  const isFoodie = current.personality.archetype === 'Gourmet Foodie';
  const bonusHappiness = isFoodie ? 10 : 0;

  const newStats: PetStats = {
    ...current.stats,
    hunger: clamp(current.stats.hunger + food.hungerGain),
    happiness: clamp(current.stats.happiness + food.happinessGain + bonusHappiness),
  };

  const newPersonality = updatePersonalityAfterAction(current.personality, 'feed', {
    foodCategory: food.category,
  });

  const expGained = Math.round(food.hungerGain / 2);
  const { level, exp, expToNextLevel } = calculateLevelAndExp(
    current.level,
    current.exp + expGained
  );

  let reaction: 'loved' | 'spicy' | 'freeze' | 'stuffed' | 'normal' = 'normal';
  if (food.specialReaction === 'spicy') reaction = 'spicy';
  else if (food.specialReaction === 'freeze') reaction = 'freeze';
  else if (food.happinessGain >= 25 || isFoodie) reaction = 'loved';

  // Decrement food inventory
  const updatedFoods = { ...current.inventory.foods };
  if (updatedFoods[food.id] > 0) {
    updatedFoods[food.id] -= 1;
  }

  return {
    reaction,
    state: {
      ...current,
      level,
      exp,
      expToNextLevel,
      stats: newStats,
      personality: newPersonality,
      inventory: {
        ...current.inventory,
        foods: updatedFoods,
      },
      statsHistory: {
        ...current.statsHistory,
        snacksFed: current.statsHistory.snacksFed + 1,
      },
      lastUpdated: Date.now(),
    },
  };
}

export function petPet(current: PetState): { state: PetState; heartCount: number } {
  const newStats: PetStats = {
    ...current.stats,
    happiness: clamp(current.stats.happiness + 6),
  };

  const newPersonality = updatePersonalityAfterAction(current.personality, 'pet');
  const { level, exp, expToNextLevel } = calculateLevelAndExp(current.level, current.exp + 5);

  return {
    heartCount: Math.floor(Math.random() * 3) + 3,
    state: {
      ...current,
      level,
      exp,
      expToNextLevel,
      stats: newStats,
      personality: newPersonality,
      statsHistory: {
        ...current.statsHistory,
        totalPets: current.statsHistory.totalPets + 1,
      },
      lastUpdated: Date.now(),
    },
  };
}

export function washPetAction(current: PetState): PetState {
  const newStats: PetStats = {
    ...current.stats,
    hygiene: 100,
    happiness: clamp(current.stats.happiness + 8),
  };

  const newPersonality = updatePersonalityAfterAction(current.personality, 'wash');
  const { level, exp, expToNextLevel } = calculateLevelAndExp(current.level, current.exp + 15);

  return {
    ...current,
    level,
    exp,
    expToNextLevel,
    stats: newStats,
    personality: newPersonality,
    statsHistory: {
      ...current.statsHistory,
      bathsTaken: current.statsHistory.bathsTaken + 1,
    },
    lastUpdated: Date.now(),
  };
}

export function awardGameRewards(
  current: PetState,
  score: number,
  coinsEarned: number
): { state: PetState; levelUp: boolean } {
  const expGained = Math.max(10, Math.floor(score / 3));
  const prevLevel = current.level;
  const { level, exp, expToNextLevel } = calculateLevelAndExp(
    current.level,
    current.exp + expGained
  );

  const newStats: PetStats = {
    ...current.stats,
    happiness: clamp(current.stats.happiness + Math.min(25, Math.floor(score / 5))),
    energy: clamp(current.stats.energy - 12),
  };

  const newPersonality = updatePersonalityAfterAction(current.personality, 'game', {
    gameScore: score,
  });

  return {
    levelUp: level > prevLevel,
    state: {
      ...current,
      level,
      exp,
      expToNextLevel,
      coins: current.coins + coinsEarned,
      stats: newStats,
      personality: newPersonality,
      statsHistory: {
        ...current.statsHistory,
        gamesPlayed: current.statsHistory.gamesPlayed + 1,
      },
      lastUpdated: Date.now(),
    },
  };
}

export function calculateLevelAndExp(
  currentLevel: number,
  totalExp: number
): { level: number; exp: number; expToNextLevel: number } {
  let level = currentLevel;
  let exp = totalExp;
  let expToNextLevel = level * 100;

  while (exp >= expToNextLevel) {
    exp -= expToNextLevel;
    level += 1;
    expToNextLevel = level * 100;
  }

  return { level, exp, expToNextLevel };
}

export function generateThoughtDialogue(
  stats: PetStats,
  personality: DynamicPersonality,
  room: RoomType
): string {
  // Urgent physical needs first
  if (stats.hunger < 25) {
    if (personality.archetype === 'Sassy Drama Queen') {
      return 'Excuse me?! My tummy is making opera noises! FEED ME STAT! 😾';
    }
    if (personality.archetype === 'Gourmet Foodie') {
      return 'I dream of salmon nigiri and warm crispy waffles... please? 🍣✨';
    }
    return 'My tummy is rumbling so much... can we visit the kitchen? 🥺';
  }

  if (stats.energy < 20) {
    if (personality.archetype === 'Sleepy Loaf') {
      return 'Already 99% in dreamland... just pull the duvet over me... 😴💤';
    }
    return 'So... sleepy... my penguin flippers can barely flap... 🥱';
  }

  if (stats.hygiene < 25) {
    if (personality.drama > 50) {
      return 'A tragedy has occurred! My plush fleece is smudged! Emergency bubble bath! 🧼';
    }
    return 'I feel a bit dusty and sticky... time for warm bubbles? 🛁';
  }

  if (stats.happiness < 30) {
    if (personality.cheerfulness < 0) {
      return 'Hmph! Nobody gave me cuddles or played with me today... *pouts* 🐧';
    }
    return 'Could you give me a cozy tummy pet? It would make my day! 💖';
  }

  // Room specific and personality based dialogues
  switch (room) {
    case 'kitchen':
      if (personality.archetype === 'Gourmet Foodie') {
        return 'The scent of delicious treats! What gourmet delight shall we sample? 🍓';
      }
      return 'Is it snack time?! I promise I will eat every single crumb! 🍽️';

    case 'bathroom':
      return 'Rubber ducky mode activated! Scrub behind the wings please! 🫧';

    case 'bedroom':
      return 'Look at that comfy duvet! It feels just like my warm plushie nest! 🛏️✨';

    case 'arcade':
      if (personality.archetype === 'Hyper Arcade Champion') {
        return 'Let’s crush the high score! My flippers are warmed up and ready! 🎮⚡';
      }
      return 'Games time! Let’s bounce and collect golden coins together! 🕹️';

    case 'wardrobe':
      return 'Do you like my pink zippered hoodie? It has real fleece pockets! 👗✨';

    case 'living':
    default:
      if (personality.archetype === 'Cuddlebug Sweetheart') {
        return 'You’re my favorite person in the whole wide universe! *squeak* 🥰';
      }
      if (personality.archetype === 'Sassy Drama Queen') {
        return 'Look at me, looking fabulous as usual. You may admire my plush perfection! 💅';
      }
      if (personality.archetype === 'Curious Explorer') {
        return 'What adventure are we embarking on today, friend? 🧭✨';
      }
      return 'Soft, cuddly, and ready for whatever we do next! 🐧💕';
  }
}
