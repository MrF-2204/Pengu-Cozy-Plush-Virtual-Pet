/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  PetCustomization,
  HoodieColor,
  HoodStyle,
  ZipperCharm,
  HeadAccessory,
  GlassesAccessory,
  NeckAccessory,
  FurTone,
  EyeStyle,
} from '../../types/pet';
import { PenguCreature } from '../PenguCreature';
import { INITIAL_STATS, INITIAL_PERSONALITY } from '../../utils/petLogic';
import { sounds } from '../../utils/sound';
import { Palette, Sparkles, RefreshCw, Shirt, Glasses, Crown, Camera } from 'lucide-react';

interface WardrobeViewProps {
  customization: PetCustomization;
  onUpdateCustomization: (updated: Partial<PetCustomization>) => void;
  onSaveOutfit: () => void;
}

type TabType = 'hoodie' | 'hood_style' | 'accessories' | 'fur_eyes';

export const WardrobeView: React.FC<WardrobeViewProps> = ({
  customization,
  onUpdateCustomization,
  onSaveOutfit,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('hoodie');

  const HOODIE_PRESETS: { id: HoodieColor; label: string; hex: string; pocket: string; zipper: string }[] = [
    { id: 'original-pink', label: 'Plushie Pink (Original)', hex: '#fbcfe8', pocket: '#ec4899', zipper: '#f472b6' },
    { id: 'mint-frost', label: 'Mint Frost', hex: '#a7f3d0', pocket: '#10b981', zipper: '#34d399' },
    { id: 'lavender-dream', label: 'Lavender Dream', hex: '#e9d5ff', pocket: '#a855f7', zipper: '#c084fc' },
    { id: 'buttercup', label: 'Buttercup', hex: '#fef08a', pocket: '#f59e0b', zipper: '#fbbf24' },
    { id: 'midnight-navy', label: 'Midnight Navy', hex: '#334155', pocket: '#0ea5e9', zipper: '#64748b' },
    { id: 'berry-velvet', label: 'Berry Velvet', hex: '#f43f5e', pocket: '#881337', zipper: '#fb7185' },
    { id: 'matcha', label: 'Matcha Green', hex: '#bbf7d0', pocket: '#15803d', zipper: '#4ade80' },
    { id: 'cloud-white', label: 'Cloud White', hex: '#f8fafc', pocket: '#94a3b8', zipper: '#cbd5e1' },
    { id: 'caramel-latte', label: 'Caramel Latte', hex: '#fed7aa', pocket: '#c2410c', zipper: '#fb923c' },
    { id: 'arctic-cyan', label: 'Arctic Cyan', hex: '#bae6fd', pocket: '#0284c7', zipper: '#38bdf8' },
  ];

  const POCKET_PRESETS = [
    { label: 'Hot Pink (Original)', color: '#ec4899' },
    { label: 'Deep Magenta', color: '#be185d' },
    { label: 'Coral Flame', color: '#f97316' },
    { label: 'Golden Amber', color: '#f59e0b' },
    { label: 'Emerald Green', color: '#10b981' },
    { label: 'Royal Violet', color: '#7c3aed' },
    { label: 'Slate Charcoal', color: '#334155' },
    { label: 'Snow White', color: '#ffffff' },
  ];

  const ZIPPER_CHARMS: { id: ZipperCharm; label: string; icon: string }[] = [
    { id: 'classic', label: 'Classic Tab', icon: '🏷️' },
    { id: 'star', label: 'Golden Star', icon: '⭐' },
    { id: 'heart', label: 'Ruby Heart', icon: '💖' },
    { id: 'fish', label: 'Penguin Fish', icon: '🐟' },
    { id: 'gold_ring', label: 'Gold Ring', icon: '💍' },
  ];

  const HOOD_STYLES: { id: HoodStyle; label: string; icon: string }[] = [
    { id: 'classic', label: 'Classic Cozy Hood', icon: '🧥' },
    { id: 'bear_ears', label: 'Teddy Bear Ears', icon: '🧸' },
    { id: 'dino_spikes', label: 'Dino Spikes', icon: '🦖' },
    { id: 'frog_eyes', label: 'Froggy Eyes', icon: '🐸' },
    { id: 'cat_ears', label: 'Kitty Ears', icon: '🐱' },
  ];

  const PATTERNS: { id: PetCustomization['pattern']; label: string }[] = [
    { id: 'solid', label: 'Fleece Plain' },
    { id: 'stripes', label: 'Knit Stripes' },
    { id: 'polka_dots', label: 'Polka Dots' },
    { id: 'stars', label: 'Starry Night' },
    { id: 'hearts', label: 'Sweet Hearts' },
  ];

  const HEADWEAR: { id: HeadAccessory; label: string; icon: string }[] = [
    { id: 'none', label: 'None', icon: '🚫' },
    { id: 'beanie', label: 'Winter Beanie', icon: '🧶' },
    { id: 'party_hat', label: 'Party Hat', icon: '🎉' },
    { id: 'crown', label: 'Royal Crown', icon: '👑' },
    { id: 'flower', label: 'Spring Blossom', icon: '🌸' },
    { id: 'chef_hat', label: 'Chef Toque', icon: '👨‍🍳' },
  ];

  const GLASSES: { id: GlassesAccessory; label: string; icon: string }[] = [
    { id: 'none', label: 'None', icon: '🚫' },
    { id: 'round_wire', label: 'Wire Spectacles', icon: '👓' },
    { id: 'cool_shades', label: 'Cool Shades', icon: '🕶️' },
    { id: 'heart_shades', label: 'Heart Shades', icon: '😎' },
    { id: 'pixel_glasses', label: '8-Bit Thug Life', icon: '👾' },
  ];

  const NECKWEAR: { id: NeckAccessory; label: string; icon: string }[] = [
    { id: 'none', label: 'None', icon: '🚫' },
    { id: 'red_scarf', label: 'Cozy Red Scarf', icon: '🧣' },
    { id: 'gold_chain', label: 'Golden Chain', icon: '⛓️' },
    { id: 'bell_collar', label: 'Jingle Bell', icon: '🔔' },
    { id: 'camera', label: 'Tourist Camera', icon: '📷' },
  ];

  const FUR_TONES: { id: FurTone; label: string; color: string }[] = [
    { id: 'classic-charcoal', label: 'Classic Charcoal (Photo Match)', color: '#475569' },
    { id: 'soft-grey', label: 'Soft Pebble Grey', color: '#64748b' },
    { id: 'pastel-lilac', label: 'Lilac Dream', color: '#a855f7' },
    { id: 'baby-penguin', label: 'Fluffy Baby Grey', color: '#94a3b8' },
    { id: 'golden-canary', label: 'Golden Canary', color: '#f59e0b' },
    { id: 'mocha', label: 'Mocha Choco', color: '#78350f' },
  ];

  const EYE_STYLES: { id: EyeStyle; label: string; icon: string }[] = [
    { id: 'sparkle', label: 'Anime Sparkle', icon: '✨' },
    { id: 'happy_arc', label: 'Happy Arcs', icon: '😊' },
    { id: 'wink', label: 'Playful Wink', icon: '😉' },
    { id: 'sleepy', label: 'Sleepy Chill', icon: '😌' },
  ];

  // Preset to reset to the exact photo reference
  const handleResetToPhoto = () => {
    sounds.playLevelUp();
    onUpdateCustomization({
      furTone: 'classic-charcoal',
      hoodieColor: 'original-pink',
      customHexHoodie: '#fbcfe8',
      pocketColor: '#ec4899',
      zipperColor: '#f472b6',
      zipperCharm: 'classic',
      hoodUp: true,
      hoodStyle: 'classic',
      pattern: 'solid',
      headAccessory: 'none',
      glasses: 'none',
      neckAccessory: 'none',
      eyeStyle: 'sparkle',
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 bg-gradient-to-b from-pink-100 via-rose-50 to-purple-100 select-none overflow-hidden">
      {/* Top Bar with One-Click Original Plush Preset */}
      <div className="w-full max-w-md flex items-center justify-between gap-2 mx-auto">
        <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full shadow border border-pink-200">
          <Palette className="w-4 h-4 text-pink-600" />
          <span className="text-xs font-black text-pink-950">Wardrobe & Style Studio</span>
        </div>

        <button
          onClick={handleResetToPhoto}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-black shadow hover:brightness-105 active:scale-95 transition"
          aria-label="Reset to original plush picture"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Match Real Plush</span>
        </button>
      </div>

      {/* Center Creature Live Dressing Room Preview */}
      <div className="relative flex-1 flex flex-col items-center justify-center min-h-[160px] max-h-[220px]">
        <PenguCreature
          customization={customization}
          stats={INITIAL_STATS}
          personality={INITIAL_PERSONALITY}
          scale={0.72}
        />
      </div>

      {/* Bottom Customization Controls Deck */}
      <div className="relative z-10 w-full max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-3 shadow-2xl border-2 border-pink-200 flex flex-col max-h-[48vh]">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-1 pb-2 border-b border-pink-100">
          <button
            onClick={() => setActiveTab('hoodie')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 ${
              activeTab === 'hoodie'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-pink-50'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Hoodie</span>
          </button>

          <button
            onClick={() => setActiveTab('hood_style')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 ${
              activeTab === 'hood_style'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-pink-50'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Hood & Charms</span>
          </button>

          <button
            onClick={() => setActiveTab('accessories')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 ${
              activeTab === 'accessories'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-pink-50'
            }`}
          >
            <Glasses className="w-3.5 h-3.5" />
            <span>Accessories</span>
          </button>

          <button
            onClick={() => setActiveTab('fur_eyes')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 ${
              activeTab === 'fur_eyes'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-pink-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fur & Eyes</span>
          </button>
        </div>

        {/* Tab 1: Hoodie Colors, Pockets & Patterns */}
        {activeTab === 'hoodie' && (
          <div className="overflow-y-auto py-2 space-y-3 flex-1 scrollbar-thin">
            {/* Hoodie Colors */}
            <div>
              <span className="text-[11px] font-bold text-slate-800">
                Fleece Hoodie Color:
              </span>
              <div className="grid grid-cols-5 gap-2 mt-1">
                {HOODIE_PRESETS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      sounds.playSqueak(1.1);
                      onUpdateCustomization({
                        hoodieColor: c.id,
                        customHexHoodie: c.hex,
                        pocketColor: c.pocket,
                        zipperColor: c.zipper,
                      });
                    }}
                    className={`h-9 rounded-xl border-2 flex items-center justify-center relative shadow-sm transition active:scale-95 ${
                      customization.hoodieColor === c.id
                        ? 'border-pink-600 ring-2 ring-pink-300 scale-105'
                        : 'border-slate-200'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={`Color ${c.label}`}
                  >
                    {customization.hoodieColor === c.id && (
                      <span className="text-xs font-black text-slate-800">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Hex Color Picker */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-pink-50 border border-pink-200">
              <span className="text-[11px] font-bold text-pink-900">
                Custom Dye Color:
              </span>
              <input
                type="color"
                value={customization.customHexHoodie || '#fbcfe8'}
                onChange={(e) => {
                  onUpdateCustomization({
                    hoodieColor: 'original-pink',
                    customHexHoodie: e.target.value,
                  });
                }}
                className="w-8 h-8 rounded-lg cursor-pointer border border-pink-300"
              />
            </div>

            {/* Pocket Welts Colors (Photo feature) */}
            <div>
              <span className="text-[11px] font-bold text-slate-800">
                Pocket Trim Welts:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {POCKET_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sounds.playSqueak(1.0);
                      onUpdateCustomization({ pocketColor: p.color });
                    }}
                    className={`w-7 h-7 rounded-full border-2 flex-shrink-0 transition active:scale-95 ${
                      customization.pocketColor === p.color
                        ? 'border-pink-600 ring-2 ring-pink-300'
                        : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: p.color }}
                    aria-label={`Pocket color ${p.label}`}
                  />
                ))}
              </div>
            </div>

            {/* Fabric Patterns */}
            <div>
              <span className="text-[11px] font-bold text-slate-800">
                Fabric Texture:
              </span>
              <div className="grid grid-cols-3 gap-1.5 mt-1">
                {PATTERNS.map((pat) => (
                  <button
                    key={pat.id}
                    onClick={() => {
                      sounds.playSqueak(1.0);
                      onUpdateCustomization({ pattern: pat.id });
                    }}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition ${
                      customization.pattern === pat.id
                        ? 'bg-pink-500 text-white border-pink-600 shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-pink-50'
                    }`}
                  >
                    {pat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Hood Style & Zipper Charm */}
        {activeTab === 'hood_style' && (
          <div className="overflow-y-auto py-2 space-y-3 flex-1 scrollbar-thin">
            {/* Hood Up / Down Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-pink-50 border border-pink-200">
              <div>
                <span className="text-xs font-black text-pink-950">Hood Status</span>
                <p className="text-[10px] text-pink-700">
                  {customization.hoodUp ? 'Pulled Up (Cozy Photo Look)' : 'Folded Down (Head Exposed)'}
                </p>
              </div>
              <button
                onClick={() => {
                  sounds.playSqueak(1.2);
                  onUpdateCustomization({ hoodUp: !customization.hoodUp });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black shadow transition ${
                  customization.hoodUp
                    ? 'bg-pink-500 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {customization.hoodUp ? 'Hood ON 🧥' : 'Hood OFF 🐧'}
              </button>
            </div>

            {/* Hood Variations */}
            <div>
              <span className="text-[11px] font-bold text-slate-800">
                Hood Shape / Ears:
              </span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {HOOD_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      sounds.playSqueak(1.1);
                      onUpdateCustomization({ hoodStyle: style.id });
                    }}
                    className={`flex items-center gap-2 p-2 rounded-2xl border text-xs font-bold transition ${
                      customization.hoodStyle === style.id
                        ? 'bg-pink-500 text-white border-pink-600 shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-pink-50'
                    }`}
                  >
                    <span className="text-base">{style.icon}</span>
                    <span className="truncate">{style.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Zipper Charms */}
            <div>
              <span className="text-[11px] font-bold text-slate-800">
                Zipper Pull Tab & Charms:
              </span>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {ZIPPER_CHARMS.map((charm) => (
                  <button
                    key={charm.id}
                    onClick={() => {
                      sounds.playSqueak(1.1);
                      onUpdateCustomization({ zipperCharm: charm.id });
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition ${
                      customization.zipperCharm === charm.id
                        ? 'bg-pink-500 text-white border-pink-600 shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-pink-50'
                    }`}
                  >
                    <span className="text-xl">{charm.icon}</span>
                    <span className="text-[9px] font-bold mt-0.5 truncate w-full text-center">
                      {charm.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Accessories */}
        {activeTab === 'accessories' && (
          <div className="overflow-y-auto py-2 space-y-3 flex-1 scrollbar-thin">
            {/* Headwear */}
            <div>
              <span className="text-[11px] font-bold text-slate-800">Hats & Crowns:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {HEADWEAR.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      sounds.playSqueak(1.0);
                      onUpdateCustomization({ headAccessory: item.id });
                    }}
                    className={`flex-shrink-0 flex flex-col items-center justify-center p-1.5 rounded-xl border w-16 transition ${
                      customization.headAccessory === item.id
                        ? 'bg-pink-500 text-white border-pink-600 shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-pink-50'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[9px] font-bold truncate w-full text-center">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Glasses */}
            <div>
              <span className="text-[11px] font-bold text-slate-800">Glasses & Shades:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {GLASSES.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      sounds.playSqueak(1.0);
                      onUpdateCustomization({ glasses: item.id });
                    }}
                    className={`flex-shrink-0 flex flex-col items-center justify-center p-1.5 rounded-xl border w-16 transition ${
                      customization.glasses === item.id
                        ? 'bg-pink-500 text-white border-pink-600 shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-pink-50'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[9px] font-bold truncate w-full text-center">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Neck Accessories */}
            <div>
              <span className="text-[11px] font-bold text-slate-800">Neckwear:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {NECKWEAR.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      sounds.playSqueak(1.0);
                      onUpdateCustomization({ neckAccessory: item.id });
                    }}
                    className={`flex-shrink-0 flex flex-col items-center justify-center p-1.5 rounded-xl border w-16 transition ${
                      customization.neckAccessory === item.id
                        ? 'bg-pink-500 text-white border-pink-600 shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-pink-50'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[9px] font-bold truncate w-full text-center">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Fur Tones & Eyes */}
        {activeTab === 'fur_eyes' && (
          <div className="overflow-y-auto py-2 space-y-3 flex-1 scrollbar-thin">
            {/* Fur Tones */}
            <div>
              <span className="text-[11px] font-bold text-slate-800">
                Penguin Fur Color Tone:
              </span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {FUR_TONES.map((fur) => (
                  <button
                    key={fur.id}
                    onClick={() => {
                      sounds.playSqueak(1.1);
                      onUpdateCustomization({ furTone: fur.id });
                    }}
                    className={`flex items-center gap-2 p-2 rounded-2xl border text-xs font-bold transition ${
                      customization.furTone === fur.id
                        ? 'bg-pink-500 text-white border-pink-600 shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-pink-50'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: fur.color }}
                    />
                    <span className="truncate">{fur.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Eye Style */}
            <div>
              <span className="text-[11px] font-bold text-slate-800">
                Eye Expressions:
              </span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {EYE_STYLES.map((eye) => (
                  <button
                    key={eye.id}
                    onClick={() => {
                      sounds.playSqueak(1.1);
                      onUpdateCustomization({ eyeStyle: eye.id });
                    }}
                    className={`flex items-center gap-2 p-2 rounded-2xl border text-xs font-bold transition ${
                      customization.eyeStyle === eye.id
                        ? 'bg-pink-500 text-white border-pink-600 shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-pink-50'
                    }`}
                  >
                    <span className="text-base">{eye.icon}</span>
                    <span>{eye.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Save & Apply Button */}
        <div className="pt-2 border-t border-pink-100 flex items-center justify-between">
          <span className="text-[11px] font-bold text-pink-700">
            Outfit automatically applied! ✨
          </span>
          <button
            onClick={() => {
              sounds.playLevelUp();
              onSaveOutfit();
            }}
            className="px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-black shadow transition active:scale-95"
          >
            Done Dressing
          </button>
        </div>
      </div>
    </div>
  );
};
