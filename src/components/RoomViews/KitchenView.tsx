/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FoodItem, PetState } from '../../types/pet';
import { FOOD_MENU } from '../../utils/petLogic';
import { PenguCreature } from '../PenguCreature';
import { sounds } from '../../utils/sound';
import { Utensils, Plus, ShoppingBag } from 'lucide-react';

interface KitchenViewProps {
  petState: PetState;
  onFeedFood: (food: FoodItem) => void;
  onBuyFood: (food: FoodItem) => void;
}

export const KitchenView: React.FC<KitchenViewProps> = ({
  petState,
  onFeedFood,
  onBuyFood,
}) => {
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [isEating, setIsEating] = useState(false);
  const [activeReaction, setActiveReaction] = useState<'normal' | 'loved' | 'spicy' | 'freeze' | 'stuffed' | null>(null);
  const [crumbs, setCrumbs] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showShop, setShowShop] = useState(false);

  const handleFeed = (food: FoodItem) => {
    const count = petState.inventory.foods[food.id] || 0;
    if (count <= 0) {
      setShowShop(true);
      return;
    }

    if (petState.stats.hunger >= 98) {
      setActiveReaction('stuffed');
      setTimeout(() => setActiveReaction(null), 2000);
      return;
    }

    setIsEating(true);
    sounds.playNom();
    setTimeout(() => sounds.playNom(), 150);
    setTimeout(() => sounds.playNom(), 300);

    // Crumb particles
    const newCrumbs = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: 140 + Math.random() * 40,
      y: 150 + Math.random() * 30,
    }));
    setCrumbs(newCrumbs);

    setTimeout(() => {
      onFeedFood(food);
      setIsEating(false);
      setCrumbs([]);

      if (food.specialReaction === 'spicy') {
        setActiveReaction('spicy');
      } else if (food.specialReaction === 'freeze') {
        setActiveReaction('freeze');
      } else if (food.happinessGain >= 25 || petState.personality.archetype === 'Gourmet Foodie') {
        setActiveReaction('loved');
      }
      setTimeout(() => setActiveReaction(null), 2500);
    }, 500);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-100 select-none overflow-hidden">
      {/* Background Decor (Bakery & Dining Vibe) */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-12 left-10 w-28 h-28 rounded-full bg-amber-300 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-36 h-36 rounded-full bg-orange-300 blur-3xl" />
      </div>

      {/* Top Bar with Hunger Meter & Shop Button */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between gap-2 mt-1">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow border border-amber-200">
          <Utensils className="w-4 h-4 text-amber-600" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-amber-800 leading-none">
              Hunger: {petState.stats.hunger}%
            </span>
            <div className="w-24 h-2 bg-amber-100 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${petState.stats.hunger}%` }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowShop(!showShop)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow transition active:scale-95"
          aria-label="Snack Pantry Shop"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Snack Shop</span>
        </button>
      </div>

      {/* Center Stage with Pengu */}
      <div className="relative flex-1 min-h-0 flex flex-col items-center justify-center my-auto">
        {/* Dynamic Reaction Badges */}
        <AnimatePresence>
          {activeReaction === 'spicy' && (
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1.1, y: -10 }}
              exit={{ scale: 0 }}
              className="absolute -top-10 z-30 bg-red-500 text-white font-black px-4 py-1.5 rounded-full shadow-lg border-2 border-yellow-300 flex items-center gap-1.5 text-xs animate-bounce"
            >
              🔥 SPICY FIRE BREATH! 🔥
            </motion.div>
          )}
          {activeReaction === 'freeze' && (
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1.1, y: -10 }}
              exit={{ scale: 0 }}
              className="absolute -top-10 z-30 bg-cyan-500 text-white font-black px-4 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 text-xs"
            >
              ❄️ GLACIER BRAINFREEZE! ❄️
            </motion.div>
          )}
          {activeReaction === 'loved' && (
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1.1, y: -10 }}
              exit={{ scale: 0 }}
              className="absolute -top-10 z-30 bg-pink-500 text-white font-black px-4 py-1.5 rounded-full shadow-lg border-2 border-pink-200 flex items-center gap-1.5 text-xs"
            >
              💖 SO DELICIOUS!! *NOM* 💖
            </motion.div>
          )}
          {activeReaction === 'stuffed' && (
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1.1, y: -10 }}
              exit={{ scale: 0 }}
              className="absolute -top-10 z-30 bg-emerald-500 text-white font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 text-xs"
            >
              🐧 Tummy is 100% full!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flying crumbs */}
        {crumbs.map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ y: 50, x: (Math.random() - 0.5) * 80, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute z-30 w-2 h-2 rounded-full bg-amber-600 pointer-events-none"
            style={{ left: c.x, top: c.y }}
          />
        ))}

        <PenguCreature
          customization={petState.customization}
          stats={petState.stats}
          personality={petState.personality}
          isEating={isEating}
          mouthOpenOverride={Boolean(selectedFood) || isEating}
          scale={0.9}
        />
      </div>

      {/* Bottom Food Tray / Selector */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md p-2.5 rounded-2xl sm:rounded-3xl shadow-xl border border-amber-200 flex-shrink-0 pb-2">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[11px] font-black text-amber-900 flex items-center gap-1">
            <span>🍽️ Feed Pengu</span>
            <span className="text-[9px] font-normal text-amber-600">
              (Tap treat)
            </span>
          </span>
          <span className="text-[11px] font-black text-amber-700">
            🪙 {petState.coins} Coins
          </span>
        </div>

        {/* Horizontal food carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {FOOD_MENU.map((food) => {
            const count = petState.inventory.foods[food.id] || 0;
            return (
              <button
                key={food.id}
                onClick={() => handleFeed(food)}
                className={`flex-shrink-0 flex flex-col items-center justify-center p-1.5 rounded-xl border transition active:scale-95 w-16 h-17 relative ${
                  count > 0
                    ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 shadow-sm'
                    : 'bg-slate-100 border-dashed border-slate-300 opacity-60'
                }`}
                aria-label={`Feed ${food.name}`}
              >
                <span className="text-xl">{food.emoji}</span>
                <span className="text-[9px] font-bold text-slate-700 truncate w-full text-center mt-0.5">
                  {food.name.split(' ')[0]}
                </span>
                <span
                  className={`text-[8px] font-black px-1.5 rounded-full mt-0.5 ${
                    count > 0 ? 'bg-amber-500 text-white' : 'bg-slate-400 text-white'
                  }`}
                >
                  x{count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Snack Pantry Store Modal */}
      <AnimatePresence>
        {showShop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border-2 border-amber-300 max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧺</span>
                  <div>
                    <h3 className="text-sm font-black text-amber-950">Pengu's Snack Pantry</h3>
                    <p className="text-[11px] text-amber-600 font-medium">
                      Stock up on yummy treats!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowShop(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Items List */}
              <div className="overflow-y-auto py-3 space-y-2 flex-1">
                {FOOD_MENU.map((food) => {
                  const count = petState.inventory.foods[food.id] || 0;
                  const canAfford = petState.coins >= food.cost;
                  return (
                    <div
                      key={food.id}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200 hover:bg-amber-100/70 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{food.emoji}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-amber-950">{food.name}</span>
                            <span className="text-[9px] bg-amber-200 text-amber-800 font-bold px-1.5 rounded-md">
                              x{count} owned
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-tight">
                            +{food.hungerGain}% Hunger • +{food.happinessGain}% Joy
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onBuyFood(food)}
                        disabled={!canAfford}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black shadow transition active:scale-95 ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-600 text-white'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                        aria-label={`Buy ${food.name} for ${food.cost} coins`}
                      >
                        <span>🪙 {food.cost}</span>
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-amber-100 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800">
                  Your Wallet: 🪙 {petState.coins} Coins
                </span>
                <button
                  onClick={() => setShowShop(false)}
                  className="px-4 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
