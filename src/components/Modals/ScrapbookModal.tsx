/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PetState, RoomType } from '../../types/pet';
import { PenguCreature } from '../PenguCreature';
import { sounds } from '../../utils/sound';
import { Camera, Sparkles, Heart, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScrapbookModalProps {
  petState: PetState;
  currentRoom: RoomType;
  onClose: () => void;
  onSavePolaroid: (caption: string) => void;
}

export const ScrapbookModal: React.FC<ScrapbookModalProps> = ({
  petState,
  currentRoom,
  onClose,
  onSavePolaroid,
}) => {
  const [captionInput, setCaptionInput] = useState(`Cozy moments with ${petState.name}!`);
  const [isFlashing, setIsFlashing] = useState(false);
  const [showFlashSuccess, setShowFlashSuccess] = useState(false);

  const handleSnapPhoto = () => {
    setIsFlashing(true);
    sounds.playLevelUp();
    confetti({ particleCount: 30, spread: 50 });

    setTimeout(() => {
      setIsFlashing(false);
      setShowFlashSuccess(true);
      onSavePolaroid(captionInput || `Cute ${petState.name}`);
      setTimeout(() => setShowFlashSuccess(false), 2000);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none"
    >
      {/* Screen flash effect */}
      <AnimatePresence>
        {isFlashing && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-[60] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg bg-amber-50 rounded-3xl p-5 shadow-2xl border-4 border-amber-200 max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-200">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-700" />
            <div>
              <h2 className="text-sm font-black text-amber-950">Polaroid Scrapbook & Photo Booth</h2>
              <p className="text-[11px] text-amber-700 font-semibold">
                Compare with the real-life plush twin & snap memories!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto py-3 space-y-4 flex-1 scrollbar-thin">
          {/* Side by side: Real Life Plush vs In-Game Plushie! */}
          <div className="grid grid-cols-2 gap-3">
            {/* Real Life Inspiration Photo */}
            <div className="bg-white p-2.5 rounded-2xl shadow-md border-2 border-pink-200 flex flex-col items-center">
              <span className="text-[11px] font-black text-pink-700 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Real Life Plushie
              </span>
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-pink-100 border border-pink-300 relative shadow-inner">
                <img
                  src="/assets/aistudio/image_c27303f2.png"
                  alt="Original plush penguin in pink fleece coat"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[10px] text-pink-900 font-bold mt-1.5 text-center leading-tight">
                Fluffy penguin in zippered pink fleece hoodie!
              </p>
            </div>

            {/* In-Game Digital Pet Polaroid */}
            <div className="bg-white p-2.5 rounded-2xl shadow-md border-2 border-indigo-200 flex flex-col items-center relative">
              <span className="text-[11px] font-black text-indigo-700 mb-1 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> Digital Twin
              </span>
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-b from-rose-100 to-pink-50 border border-indigo-200 flex items-center justify-center relative">
                <PenguCreature
                  customization={petState.customization}
                  stats={petState.stats}
                  personality={petState.personality}
                  scale={0.65}
                />
              </div>
              <p className="text-[10px] text-indigo-950 font-bold mt-1.5 text-center leading-tight">
                {petState.name} ({petState.personality.archetype})
              </p>
            </div>
          </div>

          {/* Snap New Photo Action */}
          <div className="bg-white/80 p-3 rounded-2xl border border-amber-300 space-y-2">
            <span className="text-xs font-black text-amber-950">Add Scrapbook Caption:</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={captionInput}
                onChange={(e) => setCaptionInput(e.target.value)}
                placeholder="Write a sweet memory..."
                className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none"
                maxLength={45}
              />
              <button
                onClick={handleSnapPhoto}
                className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow flex items-center gap-1 active:scale-95 transition"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Snap!</span>
              </button>
            </div>
            {showFlashSuccess && (
              <p className="text-[11px] font-bold text-emerald-600 text-center animate-pulse">
                📸 Saved to your scrapbook memory collection!
              </p>
            )}
          </div>

          {/* Scrapbook Album Collection */}
          <div>
            <h4 className="text-xs font-black text-amber-950 mb-2 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
              <span>Saved Memories ({petState.unlockedPolaroids.length})</span>
            </h4>

            {petState.unlockedPolaroids.length === 0 ? (
              <div className="text-center py-6 bg-white/50 rounded-2xl border border-dashed border-amber-300">
                <span className="text-3xl">📷</span>
                <p className="text-xs font-bold text-amber-800 mt-1">
                  No snapshots taken yet!
                </p>
                <p className="text-[10px] text-amber-600">
                  Click 'Snap!' above to print your first keepsake polaroid!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {petState.unlockedPolaroids.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white p-2 rounded-xl shadow border border-amber-200"
                  >
                    <div className="bg-pink-100 rounded-lg p-2 text-center text-xl">
                      🐧✨
                    </div>
                    <p className="text-[10px] font-bold text-slate-800 mt-1 truncate">
                      "{p.caption}"
                    </p>
                    <p className="text-[9px] text-slate-400">
                      {new Date(p.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-amber-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-black text-xs shadow transition active:scale-95"
          >
            Back to Game
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
