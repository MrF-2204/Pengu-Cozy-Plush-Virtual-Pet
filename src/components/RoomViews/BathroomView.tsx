/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PetState } from '../../types/pet';
import { PenguCreature } from '../PenguCreature';
import { sounds } from '../../utils/sound';
import { Sparkles, Droplets, Wind, Smile } from 'lucide-react';

interface BathroomViewProps {
  petState: PetState;
  onWashComplete: () => void;
}

type BathTool = 'sponge' | 'shower' | 'dryer' | 'brush';

export const BathroomView: React.FC<BathroomViewProps> = ({
  petState,
  onWashComplete,
}) => {
  const [activeTool, setActiveTool] = useState<BathTool>('sponge');
  const [bubbleCount, setBubbleCount] = useState<number>(0);
  const [isDrying, setIsDrying] = useState<boolean>(false);
  const [cleanSparkles, setCleanSparkles] = useState<boolean>(false);
  const [waterDrops, setWaterDrops] = useState<{ id: number; x: number; y: number }[]>([]);

  // Sponge interaction
  const handleSpongeRub = () => {
    sounds.playPop();
    setBubbleCount((prev) => Math.min(18, prev + 2));
  };

  // Shower wash away
  const handleShowerSpray = () => {
    sounds.playPop();
    // Create water stream droplets
    const newDrops = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: 100 + Math.random() * 120,
      y: 120 + Math.random() * 80,
    }));
    setWaterDrops(newDrops);
    setTimeout(() => setWaterDrops([]), 600);

    setBubbleCount((prev) => {
      const next = Math.max(0, prev - 4);
      if (next === 0 && bubbleCount > 0) {
        triggerClean();
      }
      return next;
    });
  };

  // Hairdryer fluff
  const handleHairdryer = () => {
    sounds.playSqueak(1.2);
    setIsDrying(true);
    setTimeout(() => {
      setIsDrying(false);
      triggerClean();
    }, 700);
  };

  // Soft brush groom
  const handleBrush = () => {
    sounds.playSqueak(1.3);
    triggerClean();
  };

  const triggerClean = () => {
    setCleanSparkles(true);
    onWashComplete();
    setTimeout(() => setCleanSparkles(false), 2500);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 bg-gradient-to-b from-sky-50 via-teal-50 to-blue-100 select-none overflow-hidden">
      {/* Background Decor (Sparkling Bubble Bath) */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-cyan-200 blur-3xl" />
        <div className="absolute bottom-16 left-12 w-32 h-32 rounded-full bg-sky-200 blur-3xl" />
      </div>

      {/* Top Bar with Hygiene Meter */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between gap-2 mt-1">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow border border-sky-200">
          <Droplets className="w-4 h-4 text-sky-600" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-sky-800 leading-none">
              Cleanliness: {petState.stats.hygiene}%
            </span>
            <div className="w-24 h-2 bg-sky-100 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-teal-500 rounded-full transition-all duration-300"
                style={{ width: `${petState.stats.hygiene}%` }}
              />
            </div>
          </div>
        </div>

        {cleanSparkles && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 bg-yellow-400 text-yellow-950 px-3 py-1 rounded-full text-xs font-black shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Squeaky Clean!</span>
          </motion.div>
        )}
      </div>

      {/* Center Stage with Bathtub / Sprays */}
      <div
        onClick={() => {
          if (activeTool === 'sponge') handleSpongeRub();
          else if (activeTool === 'shower') handleShowerSpray();
          else if (activeTool === 'dryer') handleHairdryer();
          else if (activeTool === 'brush') handleBrush();
        }}
        className="relative flex-1 min-h-0 flex flex-col items-center justify-center my-auto cursor-pointer"
      >
        {/* Falling water droplets */}
        {waterDrops.map((d) => (
          <motion.div
            key={d.id}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 90, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute z-40 w-2 h-4 rounded-full bg-sky-400 pointer-events-none"
            style={{ left: d.x, top: d.y }}
          />
        ))}

        <PenguCreature
          customization={petState.customization}
          stats={petState.stats}
          personality={petState.personality}
          bubbleCount={bubbleCount}
          isDrying={isDrying}
          scale={0.9}
        />

        {/* Tool Prompt Guidance */}
        <div className="mt-1 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow text-[10px] font-bold text-sky-800">
          {activeTool === 'sponge' && '🫧 Tap Pengu to lather with soap bubbles!'}
          {activeTool === 'shower' && '🚿 Tap Pengu to rinse bubbles away!'}
          {activeTool === 'dryer' && '💨 Tap Pengu to fluff & blowdry fleece!'}
          {activeTool === 'brush' && '✨ Tap Pengu to brush plush coat!'}
        </div>
      </div>

      {/* Bottom Bath Tools Toolbar */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md p-2.5 rounded-3xl shadow-xl border border-sky-200 mb-2 flex items-center justify-around gap-2">
        <button
          onClick={() => setActiveTool('sponge')}
          className={`flex-1 flex flex-col items-center py-2 px-1 rounded-2xl transition active:scale-95 ${
            activeTool === 'sponge'
              ? 'bg-sky-500 text-white shadow-md font-black'
              : 'bg-sky-50 text-sky-800 hover:bg-sky-100 font-bold'
          }`}
          aria-label="Soap Sponge"
        >
          <span className="text-xl">🧽</span>
          <span className="text-[10px] mt-0.5">Soap Sponge</span>
        </button>

        <button
          onClick={() => {
            setActiveTool('shower');
            handleShowerSpray();
          }}
          className={`flex-1 flex flex-col items-center py-2 px-1 rounded-2xl transition active:scale-95 ${
            activeTool === 'shower'
              ? 'bg-sky-500 text-white shadow-md font-black'
              : 'bg-sky-50 text-sky-800 hover:bg-sky-100 font-bold'
          }`}
          aria-label="Shower Rinser"
        >
          <span className="text-xl">🚿</span>
          <span className="text-[10px] mt-0.5">Shower Head</span>
        </button>

        <button
          onClick={() => {
            setActiveTool('dryer');
            handleHairdryer();
          }}
          className={`flex-1 flex flex-col items-center py-2 px-1 rounded-2xl transition active:scale-95 ${
            activeTool === 'dryer'
              ? 'bg-sky-500 text-white shadow-md font-black'
              : 'bg-sky-50 text-sky-800 hover:bg-sky-100 font-bold'
          }`}
          aria-label="Hairdryer"
        >
          <span className="text-xl">💨</span>
          <span className="text-[10px] mt-0.5">Fleece Dryer</span>
        </button>

        <button
          onClick={() => {
            setActiveTool('brush');
            handleBrush();
          }}
          className={`flex-1 flex flex-col items-center py-2 px-1 rounded-2xl transition active:scale-95 ${
            activeTool === 'brush'
              ? 'bg-sky-500 text-white shadow-md font-black'
              : 'bg-sky-50 text-sky-800 hover:bg-sky-100 font-bold'
          }`}
          aria-label="Plush Brush"
        >
          <span className="text-xl">🪮</span>
          <span className="text-[10px] mt-0.5">Groom Brush</span>
        </button>
      </div>
    </div>
  );
};
