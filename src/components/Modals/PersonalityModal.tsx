/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PetState } from '../../types/pet';
import { Award, Sparkles, Heart, Flame, Gamepad2, Coffee, Edit3 } from 'lucide-react';

interface PersonalityModalProps {
  petState: PetState;
  onClose: () => void;
  onRename: (newName: string) => void;
}

export const PersonalityModal: React.FC<PersonalityModalProps> = ({
  petState,
  onClose,
  onRename,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(petState.name);
  const p = petState.personality;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onRename(nameInput.trim());
      setIsEditingName(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border-2 border-pink-300 max-h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-pink-600" />
            <div>
              <h2 className="text-sm font-black text-slate-900">Dynamic Personality Profile</h2>
              <p className="text-[11px] text-pink-600 font-semibold">
                Evolves dynamically with how you treat Pengu!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="overflow-y-auto py-3 pb-4 space-y-4 flex-1 scrollbar-thin">
          {/* Pet Name & Archetype Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md flex items-center justify-between">
            <div>
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="bg-white text-slate-900 font-black text-sm px-2 py-0.5 rounded-lg outline-none max-w-[140px]"
                    autoFocus
                  />
                  <button type="submit" className="text-xs bg-pink-700 px-2 py-1 rounded-md font-bold">
                    Save
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black tracking-wide">{petState.name}</h3>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="opacity-80 hover:opacity-100 transition p-0.5"
                    aria-label="Rename pet"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-1.5 mt-1">
                <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full text-xs font-bold">
                  {p.archetype}
                </span>
                <span className="text-[11px] text-pink-100">Level {petState.level}</span>
              </div>
            </div>
            <span className="text-3xl">🐧✨</span>
          </div>

          {/* Personality Sliders */}
          <div className="space-y-3 bg-pink-50/50 p-3.5 rounded-2xl border border-pink-100">
            <h4 className="text-xs font-black text-slate-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Core Trait Sliders</span>
            </h4>

            {/* Slider 1: Cheerfulness */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  <SmileIcon /> Grumpy / Sassy
                </span>
                <span className="text-pink-600">{p.cheerfulness > 0 ? `+${p.cheerfulness}` : p.cheerfulness}</span>
                <span className="flex items-center gap-1">Bubbly Joy ✨</span>
              </div>
              <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, (p.cheerfulness + 100) / 2)}%` }}
                />
              </div>
            </div>

            {/* Slider 2: Affection */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500" /> Affection & Cuddle Needs
                </span>
                <span className="text-rose-600">{p.affection}%</span>
              </div>
              <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${p.affection}%` }}
                />
              </div>
            </div>

            {/* Slider 3: Gluttony */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  <Coffee className="w-3 h-3 text-amber-600" /> Foodie Appetite
                </span>
                <span className="text-amber-600">{p.gluttony}%</span>
              </div>
              <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${p.gluttony}%` }}
                />
              </div>
            </div>

            {/* Slider 4: Playfulness */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  <Gamepad2 className="w-3 h-3 text-purple-600" /> Arcade Playfulness
                </span>
                <span className="text-purple-600">{p.playfulness}%</span>
              </div>
              <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${p.playfulness}%` }}
                />
              </div>
            </div>

            {/* Slider 5: Drama */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500" /> Drama & Sass Level
                </span>
                <span className="text-orange-600">{p.drama}%</span>
              </div>
              <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${p.drama}%` }}
                />
              </div>
            </div>
          </div>

          {/* Unlocked Personality Badges */}
          <div>
            <h4 className="text-xs font-black text-slate-800 mb-2">
              Unlocked Special Traits ({p.unlockedTraits.length}):
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {p.unlockedTraits.map((trait, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-pink-100 text-pink-800 text-xs font-bold border border-pink-200 flex items-center gap-1"
                >
                  <span>✨</span>
                  <span>{trait}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Lifetime Care Stats */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
            <h4 className="font-black text-slate-700 mb-1">Bonding History:</h4>
            <div className="grid grid-cols-2 gap-2 text-slate-600 font-semibold text-[11px]">
              <div>💖 Cuddles: {petState.statsHistory.totalPets}</div>
              <div>🍱 Snacks Fed: {petState.statsHistory.snacksFed}</div>
              <div>🛁 Bubble Baths: {petState.statsHistory.bathsTaken}</div>
              <div>🎮 Games Played: {petState.statsHistory.gamesPlayed}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-pink-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-black text-xs shadow transition active:scale-95"
          >
            Close Profile
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SmileIcon = () => <span>😾</span>;
