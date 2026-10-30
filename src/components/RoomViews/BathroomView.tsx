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
    <div className="relative w-full h-full flex flex-col items-center justify-between p-2 sm:p-3 bg-gradient-to-b from-sky-100 via-teal-50 to-blue-100 select-none overflow-hidden">
      {/* Background Decor (Glossy Ceramic Bathroom with Bathtub & Floating Ducky) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Ceramic Wall Tile Grid Lines */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Soft Bath Steam Lighting */}
        <div className="absolute top-8 right-6 w-36 h-36 rounded-full bg-cyan-200/50 blur-3xl" />
        <div className="absolute bottom-16 left-6 w-36 h-36 rounded-full bg-sky-200/50 blur-3xl" />

        {/* Hanging Pink Bath Towel on Wall Hook */}
        <div className="absolute top-12 left-5 z-0 flex flex-col items-center opacity-85">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-600 shadow-xs" />
          <div className="w-6 h-18 bg-pink-300 rounded-b-xl shadow-md border border-pink-400/50" />
        </div>

        {/* Floating Bubble Ambient Particles */}
        <div className="absolute top-20 right-6 text-xl opacity-60 animate-bounce">🫧</div>
        <div className="absolute top-36 left-12 text-sm opacity-50 animate-pulse">🫧</div>

        {/* Bathtub Porcelain Rim & Gentle Warm Water under Pengu */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-80 h-24 rounded-full bg-gradient-to-b from-sky-200/70 to-teal-300/80 border-4 border-white shadow-xl flex items-center justify-center">
          {/* Water shine reflection */}
          <div className="w-64 h-12 rounded-full bg-sky-100/50 blur-xs" />
          {/* Cute Floating Rubber Ducky in the bath water */}
          <div className="absolute -top-2 right-12 text-2xl animate-bounce">
            🦆
          </div>
        </div>
      </div>

      {/* Top Bar with Hygiene Meter */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between gap-2 mt-0">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm border border-sky-200">
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
            animate={{ scale: [0, 1.2, 1] }}
            className="flex items-center gap-1 bg-yellow-400 text-yellow-950 px-3 py-1 rounded-full text-xs font-black shadow-md border border-yellow-200"
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
        className="relative flex-1 min-h-0 flex flex-col items-center justify-center my-auto cursor-pointer w-full max-w-sm"
      >
        {/* Falling water droplets */}
        {waterDrops.map((d) => (
          <motion.div
            key={d.id}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 90, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute z-40 w-2.5 h-4.5 rounded-full bg-sky-400 pointer-events-none"
            style={{ left: d.x, top: d.y }}
          />
        ))}

        {/* Draggable Active Tool (Sponge, Shower, Dryer, or Brush) */}
        <motion.div
          drag
          dragSnapToOrigin={true}
          whileDrag={{ scale: 1.3, zIndex: 45 }}
          onDrag={(_, info) => {
            // Dragging over Pengu body
            if (Math.abs(info.offset.y) > 20 || Math.abs(info.offset.x) > 20) {
              if (activeTool === 'sponge' && Math.random() < 0.25) {
                handleSpongeRub();
              } else if (activeTool === 'shower' && Math.random() < 0.25) {
                handleShowerSpray();
              } else if (activeTool === 'dryer' && Math.random() < 0.2) {
                handleHairdryer();
              }
            }
          }}
          className="absolute -top-4 right-8 z-30 p-2.5 bg-white/95 rounded-2xl shadow-xl border-2 border-sky-300 cursor-grab active:cursor-grabbing flex items-center justify-center gap-1 animate-pulse"
        >
          <span className="text-2xl select-none">
            {activeTool === 'sponge' && '🧽'}
            {activeTool === 'shower' && '🚿'}
            {activeTool === 'dryer' && '💨'}
            {activeTool === 'brush' && '🪮'}
          </span>
          <span className="text-[10px] font-bold text-sky-800 hidden sm:inline">
            Drag on Pengu!
          </span>
        </motion.div>

        {/* Main Pengu in Bath Mode (Clothes Off, wrapped in cute towel) */}
        <PenguCreature
          customization={petState.customization}
          stats={petState.stats}
          personality={petState.personality}
          bubbleCount={bubbleCount}
          isDrying={isDrying}
          isBathMode={true}
          scale={1.0}
        />

        {/* Tool Prompt Guidance */}
        <div className="mt-1 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-xs text-[10px] font-bold text-sky-800">
          {activeTool === 'sponge' && '🫧 Drag sponge over Pengu to lather with soap bubbles!'}
          {activeTool === 'shower' && '🚿 Drag shower head to rinse bubbles away!'}
          {activeTool === 'dryer' && '💨 Drag dryer over Pengu to fluff & blowdry fleece!'}
          {activeTool === 'brush' && '✨ Drag brush to groom plush coat!'}
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
