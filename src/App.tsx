/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  PetState,
  RoomType,
  FoodItem,
  PetCustomization,
} from './types/pet';
import {
  INITIAL_PET_STATE,
  calculateStatDecay,
  feedPet,
  petPet,
  washPetAction,
  awardGameRewards,
  FOOD_MENU,
} from './utils/petLogic';
import { sounds } from './utils/sound';
import { LivingRoom } from './components/RoomViews/LivingRoom';
import { KitchenView } from './components/RoomViews/KitchenView';
import { BathroomView } from './components/RoomViews/BathroomView';
import { BedroomView } from './components/RoomViews/BedroomView';
import { ArcadeView } from './components/RoomViews/ArcadeView';
import { WardrobeView } from './components/RoomViews/WardrobeView';
import { PersonalityModal } from './components/Modals/PersonalityModal';
import { ScrapbookModal } from './components/Modals/ScrapbookModal';
import { ShareModal } from './components/Modals/ShareModal';
import {
  Utensils,
  Bath,
  Moon,
  Gamepad2,
  Shirt,
  Home,
  Volume2,
  VolumeX,
  Camera,
  Share2,
  Award,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'pengu_cozy_pet_state_v1';

export default function App() {
  const [petState, setPetState] = useState<PetState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Calculate decay since last session
        const elapsedMinutes = (Date.now() - (parsed.lastUpdated || Date.now())) / (1000 * 60);
        if (elapsedMinutes > 1) {
          parsed.stats = calculateStatDecay(parsed.stats, elapsedMinutes, false);
          parsed.lastUpdated = Date.now();
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_PET_STATE;
  });

  const [currentRoom, setCurrentRoom] = useState<RoomType>('living');
  const [isMuted, setIsMuted] = useState(false);
  const [showPersonalityModal, setShowPersonalityModal] = useState(false);
  const [showScrapbookModal, setShowScrapbookModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const prevLevelRef = useRef(petState.level);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(petState));
    } catch {
      // ignore
    }
  }, [petState]);

  // Periodic passive stat decay (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setPetState((prev) => ({
        ...prev,
        stats: calculateStatDecay(prev.stats, 0.5, isSleeping),
        lastUpdated: Date.now(),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, [isSleeping]);

  // Prevent mobile browser scroll jumps & window offset drift
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Level Up celebratory check
  useEffect(() => {
    if (petState.level > prevLevelRef.current) {
      sounds.playLevelUp();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      prevLevelRef.current = petState.level;
    }
  }, [petState.level]);

  // Actions
  const handlePet = () => {
    const { state } = petPet(petState);
    setPetState(state);
  };

  const handlePoke = () => {
    setPetState((prev) => ({
      ...prev,
      personality: {
        ...prev.personality,
        drama: Math.min(100, prev.personality.drama + 2),
      },
    }));
  };

  const handleFeedFood = (food: FoodItem) => {
    const { state } = feedPet(petState, food);
    setPetState(state);
  };

  const handleBuyFood = (food: FoodItem) => {
    if (petState.coins >= food.cost) {
      sounds.playCoin();
      setPetState((prev) => ({
        ...prev,
        coins: prev.coins - food.cost,
        inventory: {
          ...prev.inventory,
          foods: {
            ...prev.inventory.foods,
            [food.id]: (prev.inventory.foods[food.id] || 0) + 1,
          },
        },
      }));
    }
  };

  const handleWashComplete = () => {
    const updated = washPetAction(petState);
    setPetState(updated);
  };

  const handleFinishArcadeGame = (score: number, coinsEarned: number) => {
    const { state } = awardGameRewards(petState, score, coinsEarned);
    setPetState(state);
  };

  const handleUpdateCustomization = (updated: Partial<PetCustomization>) => {
    setPetState((prev) => ({
      ...prev,
      customization: {
        ...prev.customization,
        ...updated,
      },
      lastUpdated: Date.now(),
    }));
  };

  const handleRename = (newName: string) => {
    setPetState((prev) => ({
      ...prev,
      name: newName,
      lastUpdated: Date.now(),
    }));
  };

  const handleSavePolaroid = (caption: string) => {
    setPetState((prev) => ({
      ...prev,
      unlockedPolaroids: [
        {
          id: String(Date.now()),
          caption,
          timestamp: Date.now(),
          room: currentRoom,
          outfitSummary: prev.customization.hoodieColor,
        },
        ...prev.unlockedPolaroids,
      ],
      coins: prev.coins + 10,
    }));
  };

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 via-rose-100 to-purple-100 overflow-hidden font-sans">
      {/* Ambient soft plush blobs for desktop */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-pink-300/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-indigo-300/40 blur-3xl pointer-events-none" />

      {/* Main Mobile App Frame */}
      <div className="relative w-full h-full max-w-md mx-auto flex flex-col bg-white shadow-2xl overflow-hidden select-none md:rounded-[36px] md:h-[94vh] md:max-h-[94vh] md:border-4 md:border-pink-300/80">
      {/* Top Universal HUD Bar */}
      <header className="relative z-30 w-full bg-white/95 backdrop-blur-md px-3 pt-[max(0.4rem,env(safe-area-inset-top))] pb-1 sm:pb-1.5 border-b border-pink-100 shadow-xs flex flex-col gap-1 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Pet Name, Level & EXP */}
          <button
            onClick={() => setShowPersonalityModal(true)}
            className="flex items-center gap-2 group text-left"
            aria-label="Open Personality & Stats Profile"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white text-base font-black shadow-sm group-hover:scale-105 transition">
              🐧
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-800 tracking-tight">
                  {petState.name}
                </span>
                <span className="text-[10px] bg-pink-100 text-pink-700 font-extrabold px-1.5 py-0.2 rounded-full">
                  Lvl {petState.level}
                </span>
              </div>
              {/* EXP bar */}
              <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-pink-500 rounded-full"
                  style={{
                    width: `${(petState.exp / petState.expToNextLevel) * 100}%`,
                  }}
                />
              </div>
            </div>
          </button>

          {/* Coins, Scrapbook & Sound */}
          <div className="flex items-center gap-2">
            {/* Coins */}
            <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shadow-xs">
              <span className="text-xs font-black text-amber-900">
                🪙 {petState.coins}
              </span>
            </div>

            {/* Scrapbook Polaroid Quick Button */}
            <button
              onClick={() => setShowScrapbookModal(true)}
              className="p-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 transition active:scale-95"
              aria-label="Open Scrapbook"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95"
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 4 Core Needs Progress Meters (Pou Style) */}
        <div className="grid grid-cols-4 gap-1.5">
          {/* Hunger */}
          <div
            onClick={() => setCurrentRoom('kitchen')}
            className={`flex flex-col items-center p-1 rounded-xl cursor-pointer transition active:scale-95 ${
              currentRoom === 'kitchen' ? 'bg-amber-100/80 ring-1 ring-amber-300' : 'bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between w-full px-1 text-[9px] font-bold text-amber-800">
              <span>🍣</span>
              <span>{petState.stats.hunger}%</span>
            </div>
            <div className="w-full h-1 bg-amber-200/50 rounded-full overflow-hidden mt-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  petState.stats.hunger < 25 ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                }`}
                style={{ width: `${petState.stats.hunger}%` }}
              />
            </div>
          </div>

          {/* Joy / Happiness */}
          <div
            onClick={() => setCurrentRoom('living')}
            className={`flex flex-col items-center p-1 rounded-xl cursor-pointer transition active:scale-95 ${
              currentRoom === 'living' ? 'bg-rose-100/80 ring-1 ring-rose-300' : 'bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between w-full px-1 text-[9px] font-bold text-rose-800">
              <span>💖</span>
              <span>{petState.stats.happiness}%</span>
            </div>
            <div className="w-full h-1 bg-rose-200/50 rounded-full overflow-hidden mt-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  petState.stats.happiness < 25 ? 'bg-red-500 animate-pulse' : 'bg-rose-500'
                }`}
                style={{ width: `${petState.stats.happiness}%` }}
              />
            </div>
          </div>

          {/* Cleanliness / Hygiene */}
          <div
            onClick={() => setCurrentRoom('bathroom')}
            className={`flex flex-col items-center p-1 rounded-xl cursor-pointer transition active:scale-95 ${
              currentRoom === 'bathroom' ? 'bg-sky-100/80 ring-1 ring-sky-300' : 'bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between w-full px-1 text-[9px] font-bold text-sky-800">
              <span>🫧</span>
              <span>{petState.stats.hygiene}%</span>
            </div>
            <div className="w-full h-1 bg-sky-200/50 rounded-full overflow-hidden mt-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  petState.stats.hygiene < 25 ? 'bg-red-500 animate-pulse' : 'bg-sky-500'
                }`}
                style={{ width: `${petState.stats.hygiene}%` }}
              />
            </div>
          </div>

          {/* Energy */}
          <div
            onClick={() => setCurrentRoom('bedroom')}
            className={`flex flex-col items-center p-1 rounded-xl cursor-pointer transition active:scale-95 ${
              currentRoom === 'bedroom' ? 'bg-indigo-100/80 ring-1 ring-indigo-300' : 'bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between w-full px-1 text-[9px] font-bold text-indigo-800">
              <span>⚡</span>
              <span>{petState.stats.energy}%</span>
            </div>
            <div className="w-full h-1 bg-indigo-200/50 rounded-full overflow-hidden mt-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  petState.stats.energy < 25 ? 'bg-red-500 animate-pulse' : 'bg-indigo-500'
                }`}
                style={{ width: `${petState.stats.energy}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Room Viewport */}
      <main className="relative flex-1 min-h-0 w-full overflow-hidden flex flex-col">
        {currentRoom === 'living' && (
          <LivingRoom
            petState={petState}
            onPet={handlePet}
            onPoke={handlePoke}
            onOpenPersonality={() => setShowPersonalityModal(true)}
            onOpenScrapbook={() => setShowScrapbookModal(true)}
          />
        )}

        {currentRoom === 'kitchen' && (
          <KitchenView
            petState={petState}
            onFeedFood={handleFeedFood}
            onBuyFood={handleBuyFood}
          />
        )}

        {currentRoom === 'bathroom' && (
          <BathroomView
            petState={petState}
            onWashComplete={handleWashComplete}
          />
        )}

        {currentRoom === 'bedroom' && (
          <BedroomView
            petState={petState}
            onSleepToggle={(sleeping) => setIsSleeping(sleeping)}
            onAwardCoins={(c) =>
              setPetState((prev) => ({ ...prev, coins: prev.coins + c }))
            }
          />
        )}

        {currentRoom === 'arcade' && (
          <ArcadeView
            petState={petState}
            onFinishGame={handleFinishArcadeGame}
          />
        )}

        {currentRoom === 'wardrobe' && (
          <WardrobeView
            customization={petState.customization}
            onUpdateCustomization={handleUpdateCustomization}
            onSaveOutfit={() => setCurrentRoom('living')}
          />
        )}
      </main>

      {/* Bottom Room Navigation Bar (Classic Pou / Talking Tom Navigation) */}
      <nav
        className="relative z-30 w-full bg-white/95 backdrop-blur-md px-1 sm:px-2 pt-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] border-t border-pink-100 flex items-center justify-around flex-shrink-0 shadow-lg"
        aria-label="Room Navigation"
      >
        <button
          onClick={() => {
            sounds.playSqueak(1.0);
            setCurrentRoom('living');
          }}
          className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition active:scale-95 ${
            currentRoom === 'living'
              ? 'bg-rose-500 text-white shadow-md font-black'
              : 'text-slate-500 hover:text-rose-500 font-bold'
          }`}
          aria-label="Living Lounge"
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Lounge</span>
        </button>

        <button
          onClick={() => {
            sounds.playSqueak(1.0);
            setCurrentRoom('kitchen');
          }}
          className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition active:scale-95 ${
            currentRoom === 'kitchen'
              ? 'bg-amber-500 text-white shadow-md font-black'
              : 'text-slate-500 hover:text-amber-600 font-bold'
          }`}
          aria-label="Kitchen & Feeding"
        >
          <Utensils className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Kitchen</span>
        </button>

        <button
          onClick={() => {
            sounds.playSqueak(1.0);
            setCurrentRoom('bathroom');
          }}
          className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition active:scale-95 ${
            currentRoom === 'bathroom'
              ? 'bg-sky-500 text-white shadow-md font-black'
              : 'text-slate-500 hover:text-sky-600 font-bold'
          }`}
          aria-label="Bathroom & Grooming"
        >
          <Bath className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Bath</span>
        </button>

        <button
          onClick={() => {
            sounds.playSqueak(1.0);
            setCurrentRoom('bedroom');
          }}
          className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition active:scale-95 ${
            currentRoom === 'bedroom'
              ? 'bg-indigo-600 text-white shadow-md font-black'
              : 'text-slate-500 hover:text-indigo-600 font-bold'
          }`}
          aria-label="Bedroom & Sleep"
        >
          <Moon className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Bedroom</span>
        </button>

        <button
          onClick={() => {
            sounds.playSqueak(1.0);
            setCurrentRoom('arcade');
          }}
          className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition active:scale-95 ${
            currentRoom === 'arcade'
              ? 'bg-purple-600 text-white shadow-md font-black'
              : 'text-slate-500 hover:text-purple-600 font-bold'
          }`}
          aria-label="Arcade Mini-Games"
        >
          <Gamepad2 className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Games</span>
        </button>

        <button
          onClick={() => {
            sounds.playSqueak(1.0);
            setCurrentRoom('wardrobe');
          }}
          className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition active:scale-95 ${
            currentRoom === 'wardrobe'
              ? 'bg-pink-600 text-white shadow-md font-black'
              : 'text-slate-500 hover:text-pink-600 font-bold'
          }`}
          aria-label="Wardrobe & Customization"
        >
          <Shirt className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Dress Up</span>
        </button>
      </nav>

      {/* Modals */}
      <AnimatePresence>
        {showPersonalityModal && (
          <PersonalityModal
            petState={petState}
            onClose={() => setShowPersonalityModal(false)}
            onRename={handleRename}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScrapbookModal && (
          <ScrapbookModal
            petState={petState}
            currentRoom={currentRoom}
            onClose={() => setShowScrapbookModal(false)}
            onSavePolaroid={handleSavePolaroid}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShareModal && (
          <ShareModal onClose={() => setShowShareModal(false)} />
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
