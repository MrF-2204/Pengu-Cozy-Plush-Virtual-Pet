/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PetState } from '../../types/pet';
import { PenguCreature } from '../PenguCreature';
import { sounds } from '../../utils/sound';
import { Moon, Sun, BatteryCharging, Sparkles } from 'lucide-react';

interface BedroomViewProps {
  petState: PetState;
  onSleepToggle: (isSleeping: boolean) => void;
  onAwardCoins: (coins: number) => void;
}

export const BedroomView: React.FC<BedroomViewProps> = ({
  petState,
  onSleepToggle,
  onAwardCoins,
}) => {
  const [isSleeping, setIsSleeping] = useState(false);
  const [dreamBubbles, setDreamBubbles] = useState<
    { id: number; x: number; y: number; item: string }[]
  >([]);

  // Toggle sleep state
  const handleToggleSleep = () => {
    const nextState = !isSleeping;
    setIsSleeping(nextState);
    onSleepToggle(nextState);
    if (nextState) {
      sounds.playSqueak(0.8);
    } else {
      sounds.playLevelUp();
    }
  };

  // Generate floating dream bubbles while asleep
  useEffect(() => {
    if (!isSleeping) {
      setDreamBubbles([]);
      return;
    }

    const dreamItems = ['🐟', '🍓', '🧇', '🪙', '⭐', '🍦', '💖'];
    const interval = setInterval(() => {
      const newBubble = {
        id: Date.now(),
        x: 60 + Math.random() * 180,
        y: 260,
        item: dreamItems[Math.floor(Math.random() * dreamItems.length)],
      };
      setDreamBubbles((prev) => [...prev.slice(-4), newBubble]);
    }, 2400);

    return () => clearInterval(interval);
  }, [isSleeping]);

  // Pop a dream bubble
  const handlePopBubble = (id: number) => {
    sounds.playPop();
    sounds.playCoin();
    onAwardCoins(5);
    setDreamBubbles((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-between p-4 select-none overflow-hidden transition-colors duration-700 ${
        isSleeping
          ? 'bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 text-white'
          : 'bg-gradient-to-b from-pink-100 via-rose-50 to-indigo-100 text-slate-800'
      }`}
    >
      {/* Night Sky Stars when asleep */}
      {isSleeping && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{
                duration: 2 + (i % 3),
                repeat: Infinity,
                delay: (i * 0.2) % 2,
              }}
              className="absolute text-yellow-200 text-xs"
              style={{
                top: `${(i * 19) % 85}%`,
                left: `${(i * 23) % 92}%`,
              }}
            >
              ★
            </motion.div>
          ))}
        </div>
      )}

      {/* Top Bar with Energy Meter & Night Lamp */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between gap-2 mt-1">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full shadow border backdrop-blur ${
            isSleeping
              ? 'bg-slate-800/90 border-indigo-700'
              : 'bg-white/90 border-pink-200'
          }`}
        >
          <BatteryCharging
            className={`w-4 h-4 ${isSleeping ? 'text-indigo-400' : 'text-rose-500'}`}
          />
          <div className="flex flex-col">
            <span
              className={`text-[10px] font-bold leading-none ${
                isSleeping ? 'text-indigo-200' : 'text-rose-800'
              }`}
            >
              Energy: {petState.stats.energy}% {isSleeping && '(Recharging...)'}
            </span>
            <div className="w-24 h-2 bg-slate-200/50 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${petState.stats.energy}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bedside Lamp Toggle */}
        <button
          onClick={handleToggleSleep}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black shadow transition active:scale-95 ${
            isSleeping
              ? 'bg-amber-400 hover:bg-amber-300 text-slate-900 border-2 border-amber-300'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
          aria-label={isSleeping ? 'Turn On Lamp (Wake Up)' : 'Turn Off Lamp (Sleep)'}
        >
          {isSleeping ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span>{isSleeping ? 'Wake Up ☀️' : 'Lights Off 🌙'}</span>
        </button>
      </div>

      {/* Center Bed with Pink Duvet Quilt (matching user photo!) */}
      <div className="relative flex-1 min-h-0 flex flex-col items-center justify-center my-auto w-full max-w-sm">
        {/* Floating Dream Bubbles */}
        <AnimatePresence>
          {dreamBubbles.map((b) => (
            <motion.button
              key={b.id}
              initial={{ y: 0, opacity: 0, scale: 0.5 }}
              animate={{ y: -160, opacity: 1, scale: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 4.5, ease: 'easeOut' }}
              onClick={() => handlePopBubble(b.id)}
              className="absolute z-40 w-12 h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-center text-xl cursor-pointer hover:scale-110 active:scale-95 transition"
              style={{ left: b.x, top: b.y }}
              aria-label="Pop Dream Bubble for Coins"
            >
              <span>{b.item}</span>
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Creature in Bed */}
        <div className="relative">
          <PenguCreature
            customization={petState.customization}
            stats={petState.stats}
            personality={petState.personality}
            isSleeping={isSleeping}
            scale={0.92}
          />

          {/* Cozy Pink Quilted Bed Duvet (resembling reference photo background) */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-80 h-28 pointer-events-none">
            {/* Soft pink quilt with diagonal quilted seams */}
            <div
              className={`w-full h-full rounded-t-3xl border-t-4 transition-all duration-700 shadow-2xl relative overflow-hidden ${
                isSleeping
                  ? 'bg-gradient-to-t from-pink-900 to-pink-800 border-pink-700 opacity-95'
                  : 'bg-gradient-to-t from-pink-300 via-rose-200 to-pink-200 border-pink-300'
              }`}
            >
              {/* Quilt stitching pattern */}
              <svg className="w-full h-full opacity-40">
                <pattern
                  id="quiltPattern"
                  width="20"
                  height="20"
                  patternTransform="rotate(45 0 0)"
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    width="20"
                    height="20"
                    fill="none"
                    stroke={isSleeping ? '#be185d' : '#f472b6'}
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                </pattern>
                <rect width="100%" height="100%" fill="url(#quiltPattern)" />
              </svg>
              {/* Fluffy quilt folded lip */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-white/40 backdrop-blur-sm border-b border-pink-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bedtime Guide */}
      <div className="relative z-10 w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-3 rounded-3xl shadow-xl border border-pink-200 dark:border-indigo-800 mb-2 text-center">
        <p className="text-xs font-bold leading-relaxed">
          {isSleeping ? (
            <span className="text-indigo-300 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Pengu is in cozy dreamland! Tap floating dream bubbles for +5 coins!
            </span>
          ) : (
            <span className="text-pink-900">
              🛏️ Tuck Pengu into the fluffy pink quilt and turn off the lamp for sweet dreams!
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
