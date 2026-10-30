/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PetCustomization, PetStats, DynamicPersonality } from '../types/pet';
import { sounds } from '../utils/sound';

interface PenguCreatureProps {
  customization: PetCustomization;
  stats: PetStats;
  personality: DynamicPersonality;
  isSleeping?: boolean;
  isEating?: boolean;
  isWashing?: boolean;
  isDrying?: boolean;
  onPet?: () => void;
  onPoke?: () => void;
  bubbleCount?: number;
  mouthOpenOverride?: boolean;
  scale?: number;
  isPeekaboo?: boolean;
  isBathMode?: boolean;
  isRefusing?: boolean;
}

export const PenguCreature: React.FC<PenguCreatureProps> = ({
  customization,
  stats,
  personality,
  isSleeping = false,
  isEating = false,
  isWashing = false,
  isDrying = false,
  onPet,
  onPoke,
  bubbleCount = 0,
  mouthOpenOverride = false,
  scale = 1.0,
  isPeekaboo = false,
  isBathMode = false,
  isRefusing = false,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isJiggling, setIsJiggling] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPetTime = useRef<number>(0);

  // Blinking loop
  useEffect(() => {
    if (isSleeping) return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3500 + Math.random() * 2500);

    return () => clearInterval(interval);
  }, [isSleeping]);

  // Pointer tracking for interactive eye looking
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isSleeping || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = Math.max(-12, Math.min(12, (e.clientX - centerX) / 15));
    const dy = Math.max(-8, Math.min(8, (e.clientY - centerY) / 15));
    setPointerOffset({ x: dx, y: dy });
  };

  // Petting interaction (rubbing with mouse or touch)
  const handlePetMove = (e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastPetTime.current > 180) {
      lastPetTime.current = now;
      sounds.playSqueak(1.1 + Math.random() * 0.3);
      setIsJiggling(true);
      setTimeout(() => setIsJiggling(false), 300);

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newHeart = {
          id: now,
          x: e.clientX - rect.left + (Math.random() * 40 - 20),
          y: e.clientY - rect.top - 20,
        };
        setHearts((prev) => [...prev.slice(-6), newHeart]);
      }
      onPet?.();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    sounds.playSqueak(0.9);
    setIsJiggling(true);
    setTimeout(() => setIsJiggling(false), 250);
    onPoke?.();
  };

  // Hoodie Colors Palette
  const hoodieColors = useMemo(() => {
    switch (customization.hoodieColor) {
      case 'mint-frost':
        return {
          base: '#a7f3d0',
          shade: '#6ee7b7',
          pocket: '#10b981',
          zipper: '#34d399',
        };
      case 'lavender-dream':
        return {
          base: '#e9d5ff',
          shade: '#d8b4fe',
          pocket: '#a855f7',
          zipper: '#c084fc',
        };
      case 'buttercup':
        return {
          base: '#fef08a',
          shade: '#fde047',
          pocket: '#f59e0b',
          zipper: '#fbbf24',
        };
      case 'midnight-navy':
        return {
          base: '#334155',
          shade: '#1e293b',
          pocket: '#0ea5e9',
          zipper: '#64748b',
        };
      case 'berry-velvet':
        return {
          base: '#f43f5e',
          shade: '#e11d48',
          pocket: '#881337',
          zipper: '#fb7185',
        };
      case 'matcha':
        return {
          base: '#bbf7d0',
          shade: '#86efac',
          pocket: '#15803d',
          zipper: '#4ade80',
        };
      case 'cloud-white':
        return {
          base: '#f8fafc',
          shade: '#e2e8f0',
          pocket: '#94a3b8',
          zipper: '#cbd5e1',
        };
      case 'caramel-latte':
        return {
          base: '#fed7aa',
          shade: '#fdba74',
          pocket: '#c2410c',
          zipper: '#fb923c',
        };
      case 'arctic-cyan':
        return {
          base: '#bae6fd',
          shade: '#7dd3fc',
          pocket: '#0284c7',
          zipper: '#38bdf8',
        };
      case 'original-pink':
      default:
        // Exact match to user's uploaded plush picture!
        return {
          base: customization.customHexHoodie || '#fbcfe8',
          shade: '#f472b6',
          pocket: customization.pocketColor || '#ec4899',
          zipper: customization.zipperColor || '#f472b6',
        };
    }
  }, [customization]);

  // Fur Tones
  const furPalette = useMemo(() => {
    switch (customization.furTone) {
      case 'soft-grey':
        return { head: '#64748b', crown: '#475569', belly: '#f8fafc' };
      case 'pastel-lilac':
        return { head: '#a855f7', crown: '#7e22ce', belly: '#faf5ff' };
      case 'baby-penguin':
        return { head: '#94a3b8', crown: '#64748b', belly: '#ffffff' };
      case 'golden-canary':
        return { head: '#f59e0b', crown: '#d97706', belly: '#fef3c7' };
      case 'mocha':
        return { head: '#78350f', crown: '#451a03', belly: '#fef3c7' };
      case 'classic-charcoal':
      default:
        // Charcoal plush head like in the user's photo
        return { head: '#475569', crown: '#334155', belly: '#ffffff' };
    }
  }, [customization.furTone]);

  const isMouthOpen = mouthOpenOverride || isEating;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      className="relative flex flex-col items-center justify-center cursor-pointer select-none"
      style={{ transform: `scale(${scale})` }}
      aria-label="Interactive Penguin Plushie"
      role="button"
      tabIndex={0}
    >
      {/* Floating Hearts from Petting */}
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 1, scale: 0.6, y: 0 }}
            animate={{ opacity: 0, scale: 1.4, y: -65 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute pointer-events-none text-2xl z-40"
            style={{ left: h.x, top: h.y }}
          >
            💖
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Penguin Body Container with Bounce, Breathe, Refuse, and Squish Animations */}
      <motion.div
        animate={{
          scale: isJiggling ? [1, 1.08, 0.94, 1.02, 1] : 1,
          rotate: isRefusing
            ? [-14, 14, -12, 12, -6, 6, 0]
            : isJiggling
            ? [-2, 2, -1, 1, 0]
            : isDrying
            ? [-4, 4, -4, 4, 0]
            : 0,
          y: isSleeping ? [0, 4, 0] : [0, -6, 0],
        }}
        transition={{
          y: { duration: isSleeping ? 3.5 : 2.8, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 0.3 },
          rotate: {
            duration: isRefusing ? 0.6 : isDrying ? 0.2 : 0.3,
            repeat: isDrying ? Infinity : 0,
          },
        }}
        onMouseMove={handlePetMove}
        className="relative flex flex-col items-center justify-center w-56 h-68 sm:w-64 sm:h-76 max-h-[36vh] sm:max-h-[42vh] aspect-[320/380]"
      >
        {/* SVG Drawing of the Plushie */}
        <svg
          viewBox="0 0 320 380"
          className="w-full h-full drop-shadow-2xl overflow-visible"
        >
          <defs>
            {/* Fleece Texture Filter */}
            <filter id="plushFleece" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" />
              <feComposite in2="SourceGraphic" in="gl" operator="in" />
            </filter>

            {/* 3D Soft Radial Gradients for Volumetric Plush Depth */}
            <radialGradient id="pinkFleeceGrad" cx="38%" cy="32%" r="72%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="25%" stopColor={hoodieColors.base} />
              <stop offset="80%" stopColor={hoodieColors.shade} />
              <stop offset="100%" stopColor="#9d174d" stopOpacity="0.5" />
            </radialGradient>

            {/* Natural Fluffy Charcoal Body (When Clothes are Off in Bath) */}
            <radialGradient id="naturalPlushBody" cx="40%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="40%" stopColor="#334155" />
              <stop offset="85%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>

            {/* Cute Bath Towel Gradient */}
            <linearGradient id="bathTowelGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>

            {/* 3D Spherical Highlight on Hoodie */}
            <radialGradient id="volumetricHighlight" cx="35%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>

            {/* Plush White Cheeks & Belly */}
            <radialGradient id="plushWhiteCheeks" cx="45%" cy="38%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="75%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </radialGradient>

            {/* 3D Shiny Beak Gradient */}
            <radialGradient id="orangeBeakGrad" cx="38%" cy="28%" r="65%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="35%" stopColor="#fb923c" />
              <stop offset="80%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#9a3412" />
            </radialGradient>

            {/* 3D Plush Feet Gradient */}
            <radialGradient id="orangeFootGrad" cx="42%" cy="28%" r="70%">
              <stop offset="0%" stopColor="#ffedd5" />
              <stop offset="30%" stopColor="#fb923c" />
              <stop offset="85%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#9a3412" />
            </radialGradient>

            {/* Pattern Masks */}
            {customization.pattern === 'stripes' && (
              <pattern id="pattern-stripes" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(255,255,255,0.3)" strokeWidth="6" />
              </pattern>
            )}
            {customization.pattern === 'polka_dots' && (
              <pattern id="pattern-dots" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="12" cy="12" r="4" fill="rgba(255,255,255,0.35)" />
              </pattern>
            )}
            {customization.pattern === 'stars' && (
              <pattern id="pattern-stars" width="30" height="30" patternUnits="userSpaceOnUse">
                <polygon points="15,4 18,12 26,12 20,17 22,25 15,20 8,25 10,17 4,12 12,12" fill="rgba(255,255,255,0.3)" />
              </pattern>
            )}
            {customization.pattern === 'hearts' && (
              <pattern id="pattern-hearts" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 14,8 A 3,3 0 0,0 8,11 A 3,3 0 0,0 14,19 A 3,3 0 0,0 20,11 A 3,3 0 0,0 14,8" fill="rgba(255,255,255,0.3)" />
              </pattern>
            )}
          </defs>

          {/* Ground Soft Shadow */}
          <ellipse cx="160" cy="365" rx="100" ry="14" fill="#0f172a" opacity="0.25" />

          {/* Plush Chubby Webbed Orange Feet */}
          {/* Left Foot */}
          <g className="transition-transform duration-300">
            <ellipse
              cx="110"
              cy="342"
              rx="28"
              ry="18"
              fill="url(#orangeFootGrad)"
              className="drop-shadow-md"
            />
            {/* Foot Plush Welts/Toes */}
            <path
              d="M 92 346 C 98 354, 122 354, 128 346"
              stroke="#c2410c"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
          </g>

          {/* Right Foot */}
          <g className="transition-transform duration-300">
            <ellipse
              cx="210"
              cy="342"
              rx="28"
              ry="18"
              fill="url(#orangeFootGrad)"
              className="drop-shadow-md"
            />
            <path
              d="M 192 346 C 198 354, 222 354, 228 346"
              stroke="#c2410c"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
          </g>

          {/* Wings / Flippers (Behind or Side) */}
          {/* Left Wing */}
          <motion.g
            animate={
              isPeekaboo
                ? { rotate: 78, x: 42, y: -65 }
                : {
                    rotate: isJiggling ? -14 : isDrying ? [-12, -4, -12] : [-2, -6, -2],
                    y: isJiggling ? -4 : 0,
                    x: 0,
                  }
            }
            transition={{
              repeat: isPeekaboo ? 0 : Infinity,
              duration: isPeekaboo ? 0.3 : 1.8,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '70px 200px' }}
          >
            <ellipse
              cx="60"
              cy="210"
              rx="26"
              ry="45"
              transform="rotate(-25 60 210)"
              fill={isBathMode ? 'url(#naturalPlushBody)' : 'url(#pinkFleeceGrad)'}
              stroke={isBathMode ? '#334155' : '#f472b6'}
              strokeWidth="1.5"
            />
            {/* Fluffy wing tip */}
            <circle cx="44" cy="235" r="14" fill="#ffffff" opacity="0.4" />
          </motion.g>

          {/* Right Wing */}
          <motion.g
            animate={
              isPeekaboo
                ? { rotate: -78, x: -42, y: -65 }
                : {
                    rotate: isJiggling ? 14 : isDrying ? [12, 4, 12] : [2, 6, 2],
                    y: isJiggling ? -4 : 0,
                    x: 0,
                  }
            }
            transition={{
              repeat: isPeekaboo ? 0 : Infinity,
              duration: isPeekaboo ? 0.3 : 1.8,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '250px 200px' }}
          >
            <ellipse
              cx="260"
              cy="210"
              rx="26"
              ry="45"
              transform="rotate(25 260 210)"
              fill={isBathMode ? 'url(#naturalPlushBody)' : 'url(#pinkFleeceGrad)'}
              stroke={isBathMode ? '#334155' : '#f472b6'}
              strokeWidth="1.5"
            />
            {/* Fluffy wing tip */}
            <circle cx="276" cy="235" r="14" fill="#ffffff" opacity="0.4" />
          </motion.g>

          {/* Main Round Body */}
          {isBathMode ? (
            /* Clothes Off: Natural Fluffy Penguin Body with Bath Towel */
            <g>
              {/* Charcoal Plush Body */}
              <ellipse
                cx="160"
                cy="245"
                rx="102"
                ry="98"
                fill="url(#naturalPlushBody)"
                stroke="#1e293b"
                strokeWidth="3"
                className="filter drop-shadow-sm"
              />

              {/* Big Fluffy White Tummy */}
              <ellipse
                cx="160"
                cy="252"
                rx="74"
                ry="68"
                fill="url(#plushWhiteCheeks)"
                stroke="#f1f5f9"
                strokeWidth="2"
              />

              {/* Cute Wrapped Bath Towel around the waist */}
              <path
                d="M 88 280 Q 160 298 232 280 L 226 338 Q 160 348 94 338 Z"
                fill="url(#bathTowelGrad)"
                stroke="#0369a1"
                strokeWidth="2"
              />
              {/* Bath Towel Fold / Knot */}
              <path
                d="M 146 284 Q 160 270 174 284 Q 160 294 146 284 Z"
                fill="#7dd3fc"
                stroke="#0284c7"
                strokeWidth="1.5"
              />
              <line
                x1="94"
                y1="330"
                x2="226"
                y2="330"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeDasharray="3,3"
                opacity="0.7"
              />
            </g>
          ) : (
            /* Clothes On: Fleece Hoodie with Zipper, Pockets & Volumetric 3D Shading */
            <g>
              <ellipse
                cx="160"
                cy="245"
                rx="102"
                ry="98"
                fill="url(#pinkFleeceGrad)"
                stroke={hoodieColors.shade}
                strokeWidth="3"
                className="filter drop-shadow-sm"
              />

              {/* 3D Volumetric Soft Highlight */}
              <ellipse
                cx="140"
                cy="210"
                rx="65"
                ry="45"
                fill="url(#volumetricHighlight)"
              />

              {/* Custom pattern overlay if active */}
              {customization.pattern === 'stripes' && (
                <ellipse cx="160" cy="245" rx="102" ry="98" fill="url(#pattern-stripes)" />
              )}
              {customization.pattern === 'polka_dots' && (
                <ellipse cx="160" cy="245" rx="102" ry="98" fill="url(#pattern-dots)" />
              )}
              {customization.pattern === 'stars' && (
                <ellipse cx="160" cy="245" rx="102" ry="98" fill="url(#pattern-stars)" />
              )}
              {customization.pattern === 'hearts' && (
                <ellipse cx="160" cy="245" rx="102" ry="98" fill="url(#pattern-hearts)" />
              )}

              {/* Soft White Plush Belly peaking at the bottom */}
              <ellipse
                cx="160"
                cy="318"
                rx="64"
                ry="24"
                fill="url(#plushWhiteCheeks)"
                opacity="0.9"
              />

              {/* Zipper Line down the center */}
              <line
                x1="160"
                y1="162"
                x2="160"
                y2="330"
                stroke={hoodieColors.zipper}
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Zipper Teeth texture */}
              <line
                x1="160"
                y1="164"
                x2="160"
                y2="328"
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="2,3"
                opacity="0.8"
              />

              {/* Realistic Zipper Puller Slider matching reference photo */}
              <g transform="translate(160, 185)">
                <rect
                  x="-6"
                  y="-10"
                  width="12"
                  height="16"
                  rx="4"
                  fill={hoodieColors.zipper}
                  stroke="#ffffff"
                  strokeWidth="1.2"
                />
                {/* Zipper Charm / Pull Tab */}
                {customization.zipperCharm === 'star' ? (
                  <polygon
                    points="0,6 3,14 11,14 5,19 7,27 0,22 -7,27 -5,19 -11,14 -3,14"
                    fill="#fbbf24"
                    stroke="#d97706"
                    strokeWidth="1"
                  />
                ) : customization.zipperCharm === 'heart' ? (
                  <path
                    d="M 0 10 C -6 4, -10 12, 0 20 C 10 12, 6 4, 0 10"
                    fill="#f43f5e"
                    stroke="#be123c"
                    strokeWidth="1"
                  />
                ) : customization.zipperCharm === 'fish' ? (
                  <path
                    d="M -4 8 Q 4 14 0 24 Q -4 18 -4 8 M 0 24 L -4 28 L 4 28 Z"
                    fill="#38bdf8"
                    stroke="#0284c7"
                    strokeWidth="1"
                  />
                ) : customization.zipperCharm === 'gold_ring' ? (
                  <circle
                    cx="0"
                    cy="14"
                    r="7"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                  />
                ) : (
                  // Classic pull tab like in the photo
                  <rect
                    x="-3.5"
                    y="6"
                    width="7"
                    height="15"
                    rx="3.5"
                    fill={hoodieColors.zipper}
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                )}
              </g>

              {/* Deep Pink Angled Pocket Welts matching the photo! */}
              {/* Left Pocket Welt */}
              <path
                d="M 98 250 L 82 284"
                stroke={hoodieColors.pocket}
                strokeWidth="12"
                strokeLinecap="round"
                className="filter drop-shadow-sm"
              />
              <path
                d="M 98 250 L 82 284"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4,3"
              />

              {/* Right Pocket Welt */}
              <path
                d="M 222 250 L 238 284"
                stroke={hoodieColors.pocket}
                strokeWidth="12"
                strokeLinecap="round"
                className="filter drop-shadow-sm"
              />
              <path
                d="M 222 250 L 238 284"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4,3"
              />
            </g>
          )}

          {/* PENGUIN HEAD & HOOD */}
          {/* Rubber ducky perched on head in bath mode */}
          {isBathMode && (
            <g transform="translate(160, 50) scale(0.95)" className="drop-shadow-md">
              <ellipse cx="0" cy="8" rx="16" ry="11" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
              <circle cx="10" cy="-2" r="9" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
              <polygon points="18,-2 26,0 18,3" fill="#ea580c" />
              <circle cx="12" cy="-4" r="1.8" fill="#0f172a" />
              <circle cx="13" cy="-5" r="0.6" fill="#ffffff" />
            </g>
          )}

          {/* Hood Outer Border (if hood is up and not in bath) */}
          {!isBathMode && customization.hoodUp && (
            <g>
              {/* Optional Hood Ears/Spikes */}
              {customization.hoodStyle === 'bear_ears' && (
                <>
                  <circle cx="85" cy="80" r="22" fill={hoodieColors.base} stroke={hoodieColors.shade} strokeWidth="3" />
                  <circle cx="85" cy="80" r="12" fill={hoodieColors.pocket} opacity="0.6" />
                  <circle cx="235" cy="80" r="22" fill={hoodieColors.base} stroke={hoodieColors.shade} strokeWidth="3" />
                  <circle cx="235" cy="80" r="12" fill={hoodieColors.pocket} opacity="0.6" />
                </>
              )}
              {customization.hoodStyle === 'dino_spikes' && (
                <>
                  <polygon points="160,30 148,54 172,54" fill="#10b981" />
                  <polygon points="120,45 110,65 130,65" fill="#10b981" />
                  <polygon points="200,45 190,65 210,65" fill="#10b981" />
                </>
              )}
              {customization.hoodStyle === 'cat_ears' && (
                <>
                  <polygon points="90,40 65,95 115,90" fill={hoodieColors.base} stroke={hoodieColors.shade} strokeWidth="3" />
                  <polygon points="90,52 75,90 105,87" fill="#f43f5e" opacity="0.6" />
                  <polygon points="230,40 205,90 255,95" fill={hoodieColors.base} stroke={hoodieColors.shade} strokeWidth="3" />
                  <polygon points="230,52 215,87 245,90" fill="#f43f5e" opacity="0.6" />
                </>
              )}
              {customization.hoodStyle === 'frog_eyes' && (
                <>
                  <circle cx="100" cy="60" r="20" fill="#22c55e" stroke="#16a34a" strokeWidth="3" />
                  <circle cx="100" cy="60" r="8" fill="#ffffff" />
                  <circle cx="100" cy="60" r="4" fill="#000000" />
                  <circle cx="220" cy="60" r="20" fill="#22c55e" stroke="#16a34a" strokeWidth="3" />
                  <circle cx="220" cy="60" r="8" fill="#ffffff" />
                  <circle cx="220" cy="60" r="4" fill="#000000" />
                </>
              )}

              {/* Cozy Hood Silhouette */}
              <circle
                cx="160"
                cy="125"
                r="86"
                fill="url(#pinkFleeceGrad)"
                stroke={hoodieColors.shade}
                strokeWidth="4"
              />

              {/* White Sherpa / Plush Fleece Inner Rim lining the face, just like in photo */}
              <ellipse
                cx="160"
                cy="128"
                rx="76"
                ry="72"
                fill="#ffffff"
                stroke="#e2e8f0"
                strokeWidth="4"
                strokeDasharray="6,4"
              />
            </g>
          )}

          {/* Penguin Head (Dark charcoal under hood as in the user photo) */}
          <ellipse
            cx="160"
            cy="125"
            rx="68"
            ry="64"
            fill={furPalette.head}
            className="filter drop-shadow-sm"
          />

          {/* Charcoal Crown / Forehead Texture */}
          <path
            d="M 102 110 C 130 92, 190 92, 218 110 C 218 135, 102 135, 102 110 Z"
            fill={furPalette.crown}
            opacity="0.65"
          />

          {/* Fluffy White Face Mask & Cheeks framing the eyes & beak (photo match!) */}
          <path
            d="M 106 130 C 96 155, 120 180, 160 178 C 200 180, 224 155, 214 130 C 206 115, 185 125, 160 125 C 135 125, 114 115, 106 130 Z"
            fill="url(#plushWhiteCheeks)"
            stroke="#f1f5f9"
            strokeWidth="2"
          />

          {/* Kawaii Cheeks / Blush */}
          <ellipse cx="118" cy="152" rx="10" ry="7" fill="#f43f5e" opacity={stats.happiness > 60 ? 0.45 : 0.2} />
          <ellipse cx="202" cy="152" rx="10" ry="7" fill="#f43f5e" opacity={stats.happiness > 60 ? 0.45 : 0.2} />

          {/* EYES */}
          <g transform={`translate(${pointerOffset.x * 0.4}, ${pointerOffset.y * 0.4})`}>
            {isRefusing ? (
              // Grumpy Refusal Squint (>.<) for TANAKKKK / NOOOO
              <>
                <path
                  d="M 124 130 L 142 138 L 124 146"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M 196 130 L 178 138 L 196 146"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </>
            ) : isSleeping ? (
              // Sleepy Happy Closed Arcs
              <>
                <path d="M 124 136 Q 134 144 144 136" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M 176 136 Q 186 144 196 136" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              </>
            ) : isBlinking ? (
              // Blink Slits
              <>
                <line x1="126" y1="135" x2="144" y2="135" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="176" y1="135" x2="194" y2="135" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
              </>
            ) : customization.eyeStyle === 'happy_arc' ? (
              // Happy Arc Eyes
              <>
                <path d="M 125 138 Q 135 128 145 138" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M 175 138 Q 185 128 195 138" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" fill="none" />
              </>
            ) : customization.eyeStyle === 'wink' ? (
              // Playful Wink
              <>
                <ellipse cx="135" cy="135" rx="8" ry="10" fill="#0f172a" />
                <circle cx="132" cy="131" r="3" fill="#ffffff" />
                <path d="M 175 136 Q 185 142 195 136" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" fill="none" />
              </>
            ) : customization.eyeStyle === 'sleepy' ? (
              // Half-closed Sleepy Eyes
              <>
                <ellipse cx="135" cy="136" rx="8" ry="7" fill="#0f172a" />
                <circle cx="132" cy="133" r="2.5" fill="#ffffff" />
                <path d="M 126 131 L 144 131" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
                <ellipse cx="185" cy="136" rx="8" ry="7" fill="#0f172a" />
                <circle cx="182" cy="133" r="2.5" fill="#ffffff" />
                <path d="M 176 131 L 194 131" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : (
              // 3D Beaded Anime Eyes with rich specular catchlights
              <>
                {/* Left Eye */}
                <ellipse cx="135" cy="134" rx="9.5" ry="11.5" fill="#090d16" />
                <circle cx="132" cy="129.5" r="3.8" fill="#ffffff" />
                <circle cx="138" cy="138" r="2" fill="#ffffff" opacity="0.85" />
                <circle cx="130" cy="136" r="1.2" fill="#ffffff" opacity="0.6" />

                {/* Right Eye */}
                <ellipse cx="185" cy="134" rx="9.5" ry="11.5" fill="#090d16" />
                <circle cx="182" cy="129.5" r="3.8" fill="#ffffff" />
                <circle cx="188" cy="138" r="2" fill="#ffffff" opacity="0.85" />
                <circle cx="180" cy="136" r="1.2" fill="#ffffff" opacity="0.6" />
              </>
            )}
          </g>

          {/* Glasses & Eyewear */}
          {customization.glasses === 'round_wire' && (
            <g>
              <circle cx="135" cy="134" r="16" fill="rgba(255,255,255,0.2)" stroke="#d97706" strokeWidth="2.5" />
              <circle cx="185" cy="134" r="16" fill="rgba(255,255,255,0.2)" stroke="#d97706" strokeWidth="2.5" />
              <line x1="151" y1="134" x2="169" y2="134" stroke="#d97706" strokeWidth="2.5" />
            </g>
          )}
          {customization.glasses === 'cool_shades' && (
            <g>
              <polygon points="116,124 152,124 148,146 122,146" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              <polygon points="168,124 204,124 198,146 172,146" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              <line x1="152" y1="126" x2="168" y2="126" stroke="#0f172a" strokeWidth="3" />
            </g>
          )}
          {customization.glasses === 'heart_shades' && (
            <g>
              <path d="M 135 126 C 122 118, 115 134, 135 146 C 155 134, 148 118, 135 126" fill="#f43f5e" opacity="0.85" />
              <path d="M 185 126 C 172 118, 165 134, 185 146 C 205 134, 198 118, 185 126" fill="#f43f5e" opacity="0.85" />
              <line x1="148" y1="128" x2="172" y2="128" stroke="#be123c" strokeWidth="2.5" />
            </g>
          )}
          {customization.glasses === 'pixel_glasses' && (
            <g fill="#000000">
              <rect x="118" y="128" width="32" height="14" />
              <rect x="170" y="128" width="32" height="14" />
              <rect x="150" y="130" width="20" height="4" />
              <rect x="122" y="130" width="6" height="4" fill="#ffffff" />
              <rect x="174" y="130" width="6" height="4" fill="#ffffff" />
            </g>
          )}

          {/* PLUSH ORANGE BEAK (Signature feature from user picture!) */}
          <g>
            {isRefusing ? (
              // Grumpy Pouting Closed Beak
              <g>
                <ellipse
                  cx="160"
                  cy="150"
                  rx="20"
                  ry="13"
                  fill="url(#orangeBeakGrad)"
                  stroke="#c2410c"
                  strokeWidth="1.5"
                  className="filter drop-shadow-md"
                />
                {/* Grumpy mouth line */}
                <path
                  d="M 150 155 Q 160 148 170 155"
                  stroke="#9a3412"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            ) : isMouthOpen ? (
              // Open Mouth (Eating, Talking, or Anticipating Food)
              <g>
                {/* Upper Beak */}
                <ellipse
                  cx="160"
                  cy="146"
                  rx="22"
                  ry="12"
                  fill="url(#orangeBeakGrad)"
                  stroke="#c2410c"
                  strokeWidth="1.5"
                  className="filter drop-shadow-sm"
                />
                {/* Open Mouth Interior */}
                <ellipse cx="160" cy="156" rx="16" ry="10" fill="#881337" />
                {/* Cute Pink Tongue */}
                <circle cx="160" cy="160" r="8" fill="#fb7185" />
                {/* Lower Beak */}
                <path
                  d="M 144 158 Q 160 170 176 158"
                  stroke="#ea580c"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            ) : (
              // Cute Round Plush Beak (exact match to the photo)
              <ellipse
                cx="160"
                cy="148"
                rx="22"
                ry="15"
                fill="url(#orangeBeakGrad)"
                stroke="#c2410c"
                strokeWidth="1.5"
                className="filter drop-shadow-md"
              />
            )}
            {/* Beak Highlight / Plush Soft Sheen */}
            <ellipse cx="157" cy="144" rx="10" ry="5" fill="#fed7aa" opacity="0.6" />
          </g>

          {/* Head Accessories (Hats, Crown, Chef Toque) */}
          {customization.headAccessory === 'beanie' && (
            <g transform="translate(160, 48)">
              <ellipse cx="0" cy="20" rx="46" ry="18" fill="#3b82f6" />
              <path d="M -44 20 Q 0 -15 44 20 Z" fill="#2563eb" />
              <circle cx="0" cy="-14" r="14" fill="#f8fafc" />
            </g>
          )}
          {customization.headAccessory === 'party_hat' && (
            <g transform="translate(160, 52)">
              <polygon points="0,-40 -20,15 20,15" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
              <circle cx="0" cy="-40" r="6" fill="#ec4899" />
              <circle cx="-6" cy="-10" r="4" fill="#3b82f6" />
              <circle cx="5" cy="2" r="4" fill="#10b981" />
            </g>
          )}
          {customization.headAccessory === 'crown' && (
            <g transform="translate(160, 48)">
              <polygon points="-28,14 -32,-12 -12,0 0,-18 12,0 32,-12 28,14" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              <circle cx="0" cy="-18" r="3" fill="#ef4444" />
              <circle cx="-32" cy="-12" r="3" fill="#3b82f6" />
              <circle cx="32" cy="-12" r="3" fill="#10b981" />
            </g>
          )}
          {customization.headAccessory === 'flower' && (
            <g transform="translate(195, 68)">
              <circle cx="-8" cy="0" r="7" fill="#fb7185" />
              <circle cx="8" cy="0" r="7" fill="#fb7185" />
              <circle cx="0" cy="-8" r="7" fill="#fb7185" />
              <circle cx="0" cy="8" r="7" fill="#fb7185" />
              <circle cx="0" cy="0" r="6" fill="#fde047" />
            </g>
          )}
          {customization.headAccessory === 'chef_hat' && (
            <g transform="translate(160, 44)">
              <ellipse cx="0" cy="18" rx="36" ry="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
              <path d="M -30 18 C -45 0, -35 -25, 0 -25 C 35 -25, 45 0, 30 18 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            </g>
          )}

          {/* Neck Accessories */}
          {customization.neckAccessory === 'red_scarf' && (
            <g transform="translate(160, 180)">
              <ellipse cx="0" cy="0" rx="60" ry="14" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
              <rect x="25" y="0" width="18" height="42" rx="4" fill="#dc2626" transform="rotate(15 25 0)" />
            </g>
          )}
          {customization.neckAccessory === 'gold_chain' && (
            <g transform="translate(160, 182)">
              <path d="M -45 -4 Q 0 20 45 -4" fill="none" stroke="#f59e0b" strokeWidth="5" strokeDasharray="6,4" />
              <circle cx="0" cy="14" r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
            </g>
          )}
          {customization.neckAccessory === 'bell_collar' && (
            <g transform="translate(160, 178)">
              <path d="M -50 0 Q 0 16 50 0" fill="none" stroke="#e11d48" strokeWidth="6" strokeLinecap="round" />
              <circle cx="0" cy="10" r="8" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
              <circle cx="0" cy="11" r="2" fill="#78350f" />
            </g>
          )}
          {customization.neckAccessory === 'camera' && (
            <g transform="translate(160, 220)">
              <path d="M -25 -40 L -12 0 L 12 0 L 25 -40" fill="none" stroke="#334155" strokeWidth="2.5" />
              <rect x="-18" y="-4" width="36" height="24" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
              <circle cx="0" cy="8" r="8" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
            </g>
          )}

          {/* Bathroom Soap Foam / Bubbles Overlay */}
          {bubbleCount > 0 && (
            <g>
              {Array.from({ length: bubbleCount }).map((_, i) => {
                const bx = 110 + (i * 27) % 110;
                const by = 160 + (i * 31) % 120;
                const r = 10 + (i % 3) * 4;
                return (
                  <g key={i}>
                    <circle
                      cx={bx}
                      cy={by}
                      r={r}
                      fill="rgba(255, 255, 255, 0.85)"
                      stroke="#93c5fd"
                      strokeWidth="1.5"
                    />
                    <circle cx={bx - r * 0.3} cy={by - r * 0.3} r={r * 0.25} fill="#ffffff" />
                  </g>
                );
              })}
            </g>
          )}

          {/* Sparkles when super clean and happy! */}
          {stats.hygiene > 85 && stats.happiness > 70 && !isSleeping && (
            <g className="animate-pulse">
              <polygon points="60,110 63,118 71,121 63,124 60,132 57,124 49,121 57,118" fill="#fde047" />
              <polygon points="265,140 267,146 273,148 267,150 265,156 263,150 257,148 263,146" fill="#fde047" />
              <polygon points="240,290 242,295 247,297 242,299 240,304 238,299 233,297 238,295" fill="#fde047" />
            </g>
          )}
        </svg>

        {/* Bedroom Snoring Zzz Floating Bubbles */}
        {isSleeping && (
          <div className="absolute top-2 right-12 pointer-events-none flex flex-col items-center">
            <motion.div
              animate={{ y: [-10, -45], x: [0, 15], opacity: [0, 1, 0], scale: [0.8, 1.3] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
              className="text-indigo-400 font-bold text-2xl drop-shadow"
            >
              Zzz...
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
