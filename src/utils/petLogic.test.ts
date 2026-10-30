/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clamp,
  calculateStatDecay,
  determineArchetype,
  updatePersonalityAfterAction,
  feedPet,
  petPet,
  washPetAction,
  awardGameRewards,
  calculateLevelAndExp,
  generateThoughtDialogue,
  FOOD_MENU,
  INITIAL_PET_STATE,
} from './petLogic';
import { DynamicPersonality } from '../types/pet';

test('clamp keeps values within 0 and 100 boundaries', () => {
  assert.equal(clamp(150), 100);
  assert.equal(clamp(-20), 0);
  assert.equal(clamp(42.4), 42);
  assert.equal(clamp(-50, -100, 100), -50);
});

test('calculateStatDecay reduces hunger, happiness, energy over time awake', () => {
  const initial = { hunger: 80, happiness: 80, energy: 80, hygiene: 80 };
  const decayed = calculateStatDecay(initial, 60, false); // 1 hour elapsed

  assert.equal(decayed.hunger, 70);
  assert.equal(decayed.happiness, 72);
  assert.equal(decayed.energy, 71);
  assert.equal(decayed.hygiene, 74);
});

test('calculateStatDecay restores energy when sleeping', () => {
  const initial = { hunger: 80, happiness: 80, energy: 40, hygiene: 80 };
  const decayed = calculateStatDecay(initial, 60, true); // 1 hour sleep

  assert.ok(decayed.energy > 40, 'Energy should increase during sleep');
  assert.equal(decayed.energy, 75);
});

test('determineArchetype properly maps personality metrics to archetypes', () => {
  const cuddlebug: DynamicPersonality = {
    cheerfulness: 50,
    gluttony: 30,
    playfulness: 30,
    affection: 85,
    drama: 20,
    archetype: 'Balanced Bestie',
    unlockedTraits: [],
  };
  assert.equal(determineArchetype(cuddlebug), 'Cuddlebug Sweetheart');

  const foodie: DynamicPersonality = {
    cheerfulness: 30,
    gluttony: 90,
    playfulness: 30,
    affection: 40,
    drama: 10,
    archetype: 'Balanced Bestie',
    unlockedTraits: [],
  };
  assert.equal(determineArchetype(foodie), 'Gourmet Foodie');

  const gamer: DynamicPersonality = {
    cheerfulness: 40,
    gluttony: 30,
    playfulness: 80,
    affection: 40,
    drama: 10,
    archetype: 'Balanced Bestie',
    unlockedTraits: [],
  };
  assert.equal(determineArchetype(gamer), 'Hyper Arcade Champion');
});

test('feedPet increases hunger and awards exp', () => {
  const testState = {
    ...INITIAL_PET_STATE,
    stats: { hunger: 50, happiness: 50, energy: 50, hygiene: 50 },
    inventory: {
      ...INITIAL_PET_STATE.inventory,
      foods: { salmon_sushi: 2 },
    },
  };
  const sushi = FOOD_MENU.find((f) => f.id === 'salmon_sushi')!;
  const result = feedPet(testState, sushi);

  assert.ok(result.state.stats.hunger > 50, 'Hunger should have increased');
  assert.equal(result.state.inventory.foods.salmon_sushi, 1, 'Inventory should decrease by 1');
  assert.equal(result.state.statsHistory.snacksFed, 1);
  assert.ok(result.state.exp > 0, 'EXP should be gained');
});

test('feedPet prevents feeding when already completely stuffed', () => {
  const stuffedState = {
    ...INITIAL_PET_STATE,
    stats: { hunger: 99, happiness: 90, energy: 90, hygiene: 90 },
  };
  const mochi = FOOD_MENU.find((f) => f.id === 'strawberry_mochi')!;
  const result = feedPet(stuffedState, mochi);

  assert.equal(result.reaction, 'stuffed');
});

test('petPet boosts happiness, affection and totalPets count', () => {
  const testState = {
    ...INITIAL_PET_STATE,
    stats: { hunger: 50, happiness: 50, energy: 50, hygiene: 50 },
  };
  const result = petPet(testState);

  assert.ok(result.state.stats.happiness > 50);
  assert.equal(result.state.statsHistory.totalPets, 1);
  assert.ok(result.heartCount >= 3);
});

test('washPetAction sets hygiene to 100', () => {
  const dirtyState = {
    ...INITIAL_PET_STATE,
    stats: { hunger: 50, happiness: 50, energy: 50, hygiene: 20 },
  };
  const result = washPetAction(dirtyState);

  assert.equal(result.stats.hygiene, 100);
  assert.equal(result.statsHistory.bathsTaken, 1);
});

test('awardGameRewards adds coins, exp and checks level up', () => {
  const testState = { ...INITIAL_PET_STATE, coins: 50, exp: 90, level: 1 };
  const { state, levelUp } = awardGameRewards(testState, 150, 45);

  assert.equal(state.coins, 95);
  assert.ok(state.exp >= 0);
  assert.equal(levelUp, true, 'Should trigger level up with enough exp');
  assert.equal(state.level, 2);
});

test('calculateLevelAndExp correctly overflows multiple levels', () => {
  const res = calculateLevelAndExp(1, 350);
  // Level 1: needs 100 -> exp left 250 -> level 2
  // Level 2: needs 200 -> exp left 50 -> level 3
  assert.equal(res.level, 3);
  assert.equal(res.exp, 50);
  assert.equal(res.expToNextLevel, 300);
});

test('generateThoughtDialogue expresses hunger when starving', () => {
  const starvingStats = { hunger: 10, happiness: 50, energy: 50, hygiene: 50 };
  const speech = generateThoughtDialogue(starvingStats, INITIAL_PET_STATE.personality, 'living');
  assert.ok(speech.includes('tummy') || speech.includes('rumbling') || speech.includes('FEED'));
});
