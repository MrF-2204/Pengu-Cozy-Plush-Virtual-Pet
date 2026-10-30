/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PetState } from '../../types/pet';
import { PenguCreature } from '../PenguCreature';
import { generateThoughtDialogue } from '../../utils/petLogic';
import { sounds } from '../../utils/sound';
import { MessageCircle, Sparkles, Heart, HelpCircle, Volume2, Award, Camera } from 'lucide-react';

interface LivingRoomProps {
  petState: PetState;
  onPet: () => void;
  onPoke: () => void;
  onOpenPersonality: () => void;
  onOpenScrapbook: () => void;
}

export const LivingRoom: React.FC<LivingRoomProps> = ({
  petState,
  onPet,
  onPoke,
  onOpenPersonality,
  onOpenScrapbook,
}) => {
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [echoInput, setEchoInput] = useState('');
  const [isTalking, setIsTalking] = useState(false);
  const [showPhotoCompare, setShowPhotoCompare] = useState(false);
  const [isPeekaboo, setIsPeekaboo] = useState(false);
  const [floatingFlower, setFloatingFlower] = useState(false);

  // Trigger dialogue when Pengu wants to talk
  const handleTalkToPengu = () => {
    const dialog = generateThoughtDialogue(
      petState.stats,
      petState.personality,
      'living'
    );
    setSpeechBubble(dialog);
    sounds.playTalkingSyllable();
    setTimeout(() => sounds.playTalkingSyllable(), 120);
    setTimeout(() => sounds.playTalkingSyllable(), 240);
  };

  // 1. Give Flower quick action
  const handleGiveFlower = () => {
    sounds.playGiggle();
    setFloatingFlower(true);
    setSpeechBubble("A beautiful flower for me?! You're the best bestie ever! 🌸💖");
    onPet();
    setTimeout(() => setFloatingFlower(false), 2200);
  };

  // 2. Play Peekaboo quick action
  const handlePlayPeekaboo = () => {
    setIsPeekaboo(true);
    sounds.playSqueak(0.9);
    setSpeechBubble("Where's Pengu? You can't see me! 🙈");

    setTimeout(() => {
      setIsPeekaboo(false);
      sounds.playGiggle();
      sounds.playPop();
      setSpeechBubble("PEEKABOO! Haha! Gotcha! 🐧✨");
      onPet();
    }, 1200);
  };

  // Talking Tom style mimic
  const handleEchoVoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!echoInput.trim()) return;

    setIsTalking(true);
    setSpeechBubble(`"${echoInput}" ~ *squeak!* 🐧🎵`);

    // Squeaky voice syllables
    for (let i = 0; i < Math.min(echoInput.length, 12); i++) {
      setTimeout(() => sounds.playTalkingSyllable(), i * 75);
    }

    setTimeout(() => {
      setIsTalking(false);
      setEchoInput('');
    }, 1200);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-2 sm:p-3 bg-gradient-to-b from-rose-100 via-pink-50 to-orange-50 select-none overflow-hidden">
      {/* Background Decor (Cozy Living Lounge with Wall Decor & Floor Rug) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft pastel wallpaper wallpaper pattern */}
        <div className="absolute top-10 left-8 w-24 h-24 rounded-full bg-pink-200/50 blur-2xl" />
        <div className="absolute top-24 right-12 w-32 h-32 rounded-full bg-amber-100/50 blur-2xl" />

        {/* Cozy Framed Photo of Real Plush Twin on the Living Room Wall */}
        <div className="absolute top-12 left-5 z-0 flex flex-col items-center opacity-85 rotate-[-4deg]">
          <div className="w-1.5 h-3 bg-pink-300 rounded-full mb-0.5" />
          <div className="w-14 h-16 bg-white p-1 rounded-lg shadow-md border-2 border-pink-200 flex flex-col items-center">
            <img
              src="/assets/aistudio/image_c27303f2.png"
              alt="Photo frame of real plushie"
              className="w-full h-10 object-cover rounded-md"
            />
            <span className="text-[7px] font-bold text-pink-700 mt-0.5 leading-none">Bestie Twin</span>
          </div>
        </div>

        {/* Hanging Fairy Garland Lights */}
        <div className="absolute top-1 right-4 flex items-center gap-3 opacity-70">
          <span className="text-yellow-300 text-xs animate-pulse">✨</span>
          <span className="text-pink-300 text-xs animate-pulse delay-100">🌸</span>
          <span className="text-yellow-300 text-xs animate-pulse delay-200">✨</span>
        </div>

        {/* Cozy Plush Floor Oval Rug underneath Pengu */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-72 h-20 rounded-full bg-gradient-to-r from-pink-200/60 via-rose-200/50 to-orange-200/60 blur-xs border border-pink-300/40 shadow-inner" />
      </div>

      {/* Top Banner / Personality & Status Tag */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between gap-2 mt-0">
        <button
          onClick={onOpenPersonality}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 shadow-md border border-pink-200 text-xs font-bold text-pink-800 hover:bg-pink-50 transition active:scale-95"
          aria-label="View Dynamic Personality"
        >
          <Award className="w-4 h-4 text-pink-500" />
          <span>{petState.personality.archetype}</span>
          <span className="bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-full text-[10px]">
            Lvl {petState.level}
          </span>
        </button>

        <button
          onClick={() => setShowPhotoCompare(!showPhotoCompare)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 shadow-md border border-pink-200 text-xs font-semibold text-pink-700 hover:bg-pink-50 transition active:scale-95"
          aria-label="Toggle Real Life Twin Reference Photo"
        >
          <Camera className="w-3.5 h-3.5 text-pink-500" />
          <span>Real Plush Twin</span>
        </button>
      </div>

      {/* Real-life photo comparison popout */}
      <AnimatePresence>
        {showPhotoCompare && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute top-16 right-4 z-30 w-52 bg-white rounded-2xl shadow-2xl p-2.5 border-2 border-pink-300"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-pink-900">Original Reference</span>
              <button
                onClick={() => setShowPhotoCompare(false)}
                className="text-xs text-slate-400 hover:text-slate-700 font-bold px-1"
              >
                ✕
              </button>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-[3/4] bg-pink-100 shadow-inner border border-pink-200">
              <img
                src="/assets/aistudio/image_c27303f2.png"
                alt="Original plush penguin in pink zippered fleece hoodie"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[10px] text-pink-700 mt-1 text-center font-medium leading-tight">
              Fluffy penguin plushie in pink fleece zippered coat!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Interactive Stage with Creature & Speech Bubble */}
      <div className="relative flex-1 min-h-0 flex flex-col items-center justify-center my-auto w-full max-w-sm">
        {/* Dynamic Thought / Speech Bubble */}
        <AnimatePresence>
          {speechBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="relative mb-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border-2 border-pink-300 max-w-[260px] text-center"
            >
              <p className="text-[11px] font-bold text-slate-800 leading-snug">
                {speechBubble}
              </p>
              {/* Pointer triangle */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-pink-300" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Creature Component */}
        <div className="relative">
          <PenguCreature
            customization={petState.customization}
            stats={petState.stats}
            personality={petState.personality}
            onPet={onPet}
            onPoke={onPoke}
            mouthOpenOverride={isTalking}
            isPeekaboo={isPeekaboo}
            scale={1.0}
          />

          {/* Floating Flower Particle Effect */}
          <AnimatePresence>
            {floatingFlower && (
              <motion.div
                initial={{ opacity: 1, scale: 0.5, y: 20 }}
                animate={{ opacity: [1, 1, 0], scale: [1, 1.3, 1.5], y: -80 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl pointer-events-none z-30"
              >
                🌸✨💖
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Tap / Pet Guidance Prompt if low interactions */}
          {petState.statsHistory.totalPets === 0 && (
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-pink-600/90 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow pointer-events-none whitespace-nowrap"
            >
              👋 Rub or tap me to pet!
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Controls Deck: 3 Quick Action Popups + Talking Tom Squeak Bar */}
      <div className="relative z-10 w-full max-w-md flex flex-col gap-1.5 pb-0.5 sm:pb-1">
        {/* The 3 Quick Interaction Buttons restored from before */}
        <div className="flex items-center justify-between gap-1.5 w-full">
          {/* 1. Give Flower */}
          <button
            onClick={handleGiveFlower}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-2xl bg-white/95 backdrop-blur-md border border-pink-200 text-pink-700 hover:bg-pink-50 shadow-sm text-[11px] font-black transition active:scale-95"
            aria-label="Give Pengu a flower"
          >
            <span>🌸</span>
            <span>Give Flower</span>
          </button>

          {/* 2. Pet His Fur */}
          <button
            onClick={() => {
              onPet();
              sounds.playSqueak(1.1);
            }}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md text-[11px] font-black transition active:scale-95 hover:brightness-105"
            aria-label="Pet Pengu's fur"
          >
            <span>💖</span>
            <span>Pet His Fur</span>
          </button>

          {/* 3. Play Peekaboo */}
          <button
            onClick={handlePlayPeekaboo}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-2xl bg-white/95 backdrop-blur-md border border-purple-200 text-purple-700 hover:bg-purple-50 shadow-sm text-[11px] font-black transition active:scale-95"
            aria-label="Play peekaboo with Pengu"
          >
            <span>🙈</span>
            <span>Play Peekaboo</span>
          </button>
        </div>

        {/* Talking Tom Echo Voice & Thoughts Bar */}
        <form
          onSubmit={handleEchoVoice}
          className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-pink-200"
        >
          {/* Quick Chat Thoughts trigger */}
          <button
            type="button"
            onClick={handleTalkToPengu}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-black transition active:scale-95 flex-shrink-0"
            aria-label="Ask what Pengu is thinking"
          >
            <MessageCircle className="w-3.5 h-3.5 text-pink-600" />
            <span className="hidden sm:inline">Thoughts</span>
          </button>

          {/* Voice Input with 16px font-size to prevent iOS Safari auto-zoom/viewport-scroll */}
          <input
            type="text"
            value={echoInput}
            onChange={(e) => setEchoInput(e.target.value)}
            onFocus={() => {
              if (window.scrollY !== 0) window.scrollTo(0, 0);
            }}
            onBlur={() => {
              window.scrollTo(0, 0);
            }}
            placeholder="Type to echo squeak!..."
            className="flex-1 min-w-0 bg-transparent text-[16px] sm:text-xs font-semibold text-slate-700 outline-none px-2 placeholder:text-slate-400"
            maxLength={60}
          />

          {/* Squeak Action */}
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-black shadow hover:brightness-105 active:scale-95 transition flex-shrink-0"
            aria-label="Make Pengu repeat speech"
          >
            Squeak!
          </button>
        </form>
      </div>
    </div>
  );
};
