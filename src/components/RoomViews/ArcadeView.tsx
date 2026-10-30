/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PetState } from '../../types/pet';
import { sounds } from '../../utils/sound';
import { Play, RotateCcw, Trophy, ArrowLeft, Gamepad2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ArcadeViewProps {
  petState: PetState;
  onFinishGame: (score: number, coinsEarned: number) => void;
}

type ActiveGame = 'none' | 'cloud_bouncer' | 'snack_catcher';

export const ArcadeView: React.FC<ArcadeViewProps> = ({
  petState,
  onFinishGame,
}) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('none');
  const [highScores, setHighScores] = useState({
    cloud_bouncer: 120,
    snack_catcher: 85,
  });

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-2 sm:p-3 bg-gradient-to-b from-purple-950 via-slate-900 to-indigo-950 text-white select-none overflow-hidden">
      {/* Background Decor (Retro Cyber Arcade Carpet & Neon Lights) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Neon Floor Grid */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#a855f7_1px,transparent_1px),linear-gradient(to_bottom,#a855f7_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-10 left-6 w-32 h-32 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-12 right-6 w-36 h-36 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute top-4 right-10 text-xl opacity-40 animate-pulse">👾</div>
        <div className="absolute top-16 left-8 text-sm opacity-40 animate-bounce">⭐</div>
      </div>
      {activeGame === 'none' ? (
        <ArcadeLobby
          petState={petState}
          highScores={highScores}
          onSelectGame={(game) => setActiveGame(game)}
        />
      ) : activeGame === 'cloud_bouncer' ? (
        <CloudBouncerGame
          onExit={() => setActiveGame('none')}
          onGameOver={(score, coins) => {
            if (score > highScores.cloud_bouncer) {
              setHighScores((prev) => ({ ...prev, cloud_bouncer: score }));
              confetti({ particleCount: 50, spread: 60 });
            }
            onFinishGame(score, coins);
          }}
        />
      ) : (
        <SnackCatcherGame
          onExit={() => setActiveGame('none')}
          onGameOver={(score, coins) => {
            if (score > highScores.snack_catcher) {
              setHighScores((prev) => ({ ...prev, snack_catcher: score }));
              confetti({ particleCount: 50, spread: 60 });
            }
            onFinishGame(score, coins);
          }}
        />
      )}
    </div>
  );
};

/* --- ARCADE LOBBY --- */
const ArcadeLobby: React.FC<{
  petState: PetState;
  highScores: { cloud_bouncer: number; snack_catcher: number };
  onSelectGame: (game: ActiveGame) => void;
}> = ({ petState, highScores, onSelectGame }) => {
  return (
    <div className="w-full max-w-md h-full flex flex-col justify-between my-auto py-2">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-1.5 rounded-full shadow border border-purple-200">
          <Gamepad2 className="w-4 h-4 text-purple-600" />
          <h2 className="text-sm font-black text-purple-900">Pengu Arcade Center</h2>
        </div>
        <p className="text-xs text-purple-700 font-semibold mt-1">
          Play mini-games to earn coins, level up, and make Pengu super happy!
        </p>
      </div>

      {/* Game Cards */}
      <div className="space-y-3 my-auto">
        {/* Game 1: Cloud Bouncer */}
        <div className="p-4 rounded-3xl bg-white/90 backdrop-blur-md shadow-xl border-2 border-purple-200 flex items-center justify-between hover:border-purple-400 transition">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-3xl shadow">
              ☁️
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">Cloud Bouncer</h3>
              <p className="text-[11px] text-slate-500">
                Bounce high on puffy clouds & collect golden coins!
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-amber-600">
                <Trophy className="w-3 h-3" />
                <span>Best: {highScores.cloud_bouncer} pts</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onSelectGame('cloud_bouncer')}
            className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md transition active:scale-95 flex items-center gap-1"
            aria-label="Play Cloud Bouncer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Play</span>
          </button>
        </div>

        {/* Game 2: Snack Catcher */}
        <div className="p-4 rounded-3xl bg-white/90 backdrop-blur-md shadow-xl border-2 border-pink-200 flex items-center justify-between hover:border-pink-400 transition">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-500 flex items-center justify-center text-3xl shadow">
              🍓
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">Snack Drop Catcher</h3>
              <p className="text-[11px] text-slate-500">
                Catch falling strawberries & mochi in Pengu's bowl!
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-amber-600">
                <Trophy className="w-3 h-3" />
                <span>Best: {highScores.snack_catcher} pts</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onSelectGame('snack_catcher')}
            className="px-4 py-2 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-black text-xs shadow-md transition active:scale-95 flex items-center gap-1"
            aria-label="Play Snack Drop Catcher"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Play</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center bg-white/70 backdrop-blur p-2.5 rounded-2xl border border-purple-200 text-xs font-bold text-purple-900">
        🪙 Wallet: {petState.coins} Coins • ⚡ Energy: {petState.stats.energy}%
      </div>
    </div>
  );
};

/* --- MINI GAME 1: CLOUD BOUNCER --- */
const CloudBouncerGame: React.FC<{
  onExit: () => void;
  onGameOver: (score: number, coins: number) => void;
}> = ({ onExit, onGameOver }) => {
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let penguinX = 140;
    let penguinY = 320;
    let vy = -9;
    const vx = 0;
    let targetX = 140;
    let currentScore = 0;
    let coinsCollected = 0;

    interface Platform {
      x: number;
      y: number;
      w: number;
      h: number;
      hasCoin?: boolean;
    }

    const platforms: Platform[] = [
      { x: 100, y: 380, w: 90, h: 14 },
      { x: 50, y: 300, w: 80, h: 14, hasCoin: true },
      { x: 180, y: 220, w: 85, h: 14 },
      { x: 80, y: 140, w: 80, h: 14, hasCoin: true },
      { x: 170, y: 60, w: 80, h: 14 },
    ];

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      targetX = Math.max(20, Math.min(270, clientX - rect.left));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') targetX = Math.max(20, targetX - 35);
      if (e.key === 'ArrowRight' || e.key === 'd') targetX = Math.min(270, targetX + 35);
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('touchmove', handlePointerMove);

    const loop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, 300, 420);

      // Smooth horizontal move towards target
      penguinX += (targetX - penguinX) * 0.2;

      // Apply gravity
      vy += 0.35;
      penguinY += vy;

      // Bounce check with platforms
      platforms.forEach((plat) => {
        if (
          vy > 0 &&
          penguinY + 22 >= plat.y &&
          penguinY + 22 <= plat.y + 16 &&
          penguinX >= plat.x - 15 &&
          penguinX <= plat.x + plat.w + 15
        ) {
          vy = -10.5;
          sounds.playJump();
        }

        // Coin check
        if (plat.hasCoin) {
          const coinX = plat.x + plat.w / 2;
          const coinY = plat.y - 15;
          const dist = Math.hypot(penguinX - coinX, penguinY - coinY);
          if (dist < 22) {
            plat.hasCoin = false;
            coinsCollected += 1;
            setCoins(coinsCollected);
            sounds.playCoin();
          }
        }
      });

      // Camera scroll up when penguin climbs high
      if (penguinY < 180) {
        const diff = 180 - penguinY;
        penguinY = 180;
        currentScore += Math.floor(diff);
        setScore(currentScore);

        platforms.forEach((plat) => {
          plat.y += diff;
          if (plat.y > 420) {
            plat.y = -10;
            plat.x = Math.random() * 200 + 10;
            plat.hasCoin = Math.random() > 0.45;
          }
        });
      }

      // Draw Platforms (Fluffy Clouds)
      platforms.forEach((plat) => {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 7);
        ctx.fill();
        ctx.stroke();

        // Draw Coin
        if (plat.hasCoin) {
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(plat.x + plat.w / 2, plat.y - 12, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#b45309';
          ctx.font = 'bold 8px sans-serif';
          ctx.fillText('$', plat.x + plat.w / 2 - 2.5, plat.y - 9);
        }
      });

      // Draw Penguin in Pink Coat
      ctx.save();
      ctx.translate(penguinX, penguinY);
      // Body
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      // Face
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -2, 10, 0, Math.PI * 2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-4, -4, 2, 0, Math.PI * 2);
      ctx.arc(4, -4, 2, 0, Math.PI * 2);
      ctx.fill();
      // Beak
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Fall / Game Over check
      if (penguinY > 430) {
        setGameOver(true);
        sounds.playSqueak(0.6);
        onGameOver(currentScore, coinsCollected * 2);
        return;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  return (
    <div className="relative w-full max-w-sm flex flex-col items-center justify-between h-full py-2">
      <div className="w-full flex items-center justify-between px-2">
        <button
          onClick={onExit}
          className="p-1.5 rounded-full bg-white/90 shadow text-slate-700 hover:bg-white text-xs font-bold flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-purple-900">Score: {score}</span>
          <span className="text-xs font-black text-amber-600">🪙 {coins}</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative my-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-300 bg-gradient-to-b from-sky-200 via-sky-100 to-indigo-100">
        <canvas
          ref={canvasRef}
          width={300}
          height={420}
          className="block touch-none"
        />

        {gameOver && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-white text-center">
            <h3 className="text-lg font-black text-amber-300">Game Over!</h3>
            <p className="text-xs font-bold mt-1">Height Reached: {score} pts</p>
            <p className="text-xs font-bold text-amber-400 mt-0.5">
              🪙 Earned: {coins * 2} Coins
            </p>
            <button
              onClick={onExit}
              className="mt-4 px-4 py-2 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-black text-xs shadow-lg transition active:scale-95"
            >
              Back to Arcade
            </button>
          </div>
        )}
      </div>

      <p className="text-[11px] font-bold text-purple-800 text-center">
        💡 Move your cursor or finger to guide Pengu onto bouncy clouds!
      </p>
    </div>
  );
};

/* --- MINI GAME 2: SNACK DROP CATCHER --- */
const SnackCatcherGame: React.FC<{
  onExit: () => void;
  onGameOver: (score: number, coins: number) => void;
}> = ({ onExit, onGameOver }) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let bowlX = 150;
    let currentScore = 0;
    let currentLives = 3;

    interface FallingItem {
      x: number;
      y: number;
      speed: number;
      type: 'treat' | 'hazard';
      emoji: string;
    }

    const items: FallingItem[] = [];
    const treats = ['🍓', '🍣', '🧇', '🍦', '🐟'];
    let spawnTimer = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      bowlX = Math.max(30, Math.min(270, clientX - rect.left));
    };

    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('touchmove', handlePointerMove);

    const loop = () => {
      ctx.clearRect(0, 0, 300, 420);

      spawnTimer++;
      if (spawnTimer % 45 === 0) {
        const isHazard = Math.random() < 0.25;
        items.push({
          x: Math.random() * 240 + 30,
          y: -20,
          speed: 2.5 + Math.random() * 2,
          type: isHazard ? 'hazard' : 'treat',
          emoji: isHazard ? '⏰' : treats[Math.floor(Math.random() * treats.length)],
        });
      }

      // Update and draw falling items
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.y += it.speed;

        // Draw Emoji
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(it.emoji, it.x, it.y);

        // Catch collision check with bowl (at y = 370)
        if (it.y >= 355 && it.y <= 385 && Math.abs(it.x - bowlX) < 32) {
          if (it.type === 'treat') {
            currentScore += 10;
            setScore(currentScore);
            sounds.playNom();
          } else {
            currentLives -= 1;
            setLives(currentLives);
            sounds.playSqueak(0.6);
            if (currentLives <= 0) {
              setGameOver(true);
              onGameOver(currentScore, Math.floor(currentScore / 2));
              return;
            }
          }
          items.splice(i, 1);
          continue;
        }

        // Missed treat check
        if (it.y > 425) {
          items.splice(i, 1);
        }
      }

      // Draw Pengu Holding Bowl
      ctx.save();
      ctx.translate(bowlX, 375);
      // Bowl
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pengu Head Peeking Behind Bowl
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.arc(0, -14, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -15, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(0, -12, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  return (
    <div className="relative w-full max-w-sm flex flex-col items-center justify-between h-full py-2">
      <div className="w-full flex items-center justify-between px-2">
        <button
          onClick={onExit}
          className="p-1.5 rounded-full bg-white/90 shadow text-slate-700 hover:bg-white text-xs font-bold flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-pink-900">Score: {score}</span>
          <span className="text-xs font-black text-rose-600">
            {'❤️'.repeat(Math.max(0, lives))}
          </span>
        </div>
      </div>

      <div className="relative my-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-pink-300 bg-gradient-to-b from-rose-100 via-pink-50 to-amber-50">
        <canvas
          ref={canvasRef}
          width={300}
          height={420}
          className="block touch-none"
        />

        {gameOver && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-white text-center">
            <h3 className="text-lg font-black text-amber-300">All Caught!</h3>
            <p className="text-xs font-bold mt-1">Total Treats: {score} pts</p>
            <p className="text-xs font-bold text-amber-400 mt-0.5">
              🪙 Earned: {Math.floor(score / 2)} Coins
            </p>
            <button
              onClick={onExit}
              className="mt-4 px-4 py-2 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-black text-xs shadow-lg transition active:scale-95"
            >
              Back to Arcade
            </button>
          </div>
        )}
      </div>

      <p className="text-[11px] font-bold text-pink-800 text-center">
        💡 Catch yummy food into Pengu's pink bowl, but dodge the alarm clocks!
      </p>
    </div>
  );
};
