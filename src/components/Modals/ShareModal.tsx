/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Github, Copy, Check, ExternalLink, Globe, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShareModalProps {
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedGitCmd, setCopiedGitCmd] = useState(false);

  // The deployed shareable URL for this applet
  const shareUrl =
    typeof window !== 'undefined' && window.location.origin.includes('run.app')
      ? window.location.href
      : 'https://ais-pre-vujgu6brcblyu4zseduvw6-480915987355.asia-southeast1.run.app';

  const gitCommands = `# 1. Initialize git in your local project folder
git init
git add .
git commit -m "feat: Pengu Cozy Plush Virtual Pet game"

# 2. Add your GitHub repository link and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pengu-virtual-pet.git
git push -u origin main`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    confetti({ particleCount: 40, spread: 60 });
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pengu: Cozy Plush Virtual Pet',
          text: 'Play with Pengu, an adorable plush penguin virtual pet inspired by Pou & Talking Tom! 🐧💖',
          url: shareUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyGit = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedGitCmd(true);
    setTimeout(() => setCopiedGitCmd(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border-2 border-pink-300 max-h-[88vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-pink-100 text-pink-600">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">Share & Save Project</h2>
              <p className="text-[11px] text-pink-600 font-semibold">
                Invite friends to play or save your code to GitHub!
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

        {/* Content */}
        <div className="overflow-y-auto py-3 space-y-4 flex-1 scrollbar-thin">
          {/* Section 1: Share Game Live Link */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-black text-pink-950">
              <Globe className="w-4 h-4 text-pink-600" />
              <span>Share Game Online</span>
              <span className="text-[9px] bg-pink-200 text-pink-800 px-2 py-0.5 rounded-full font-bold">
                Live Anywhere
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Anyone with this link can open and play with Pengu on their phone, tablet, or PC!
            </p>

            {/* Share link box */}
            <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-pink-200">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 text-[11px] font-semibold text-slate-700 bg-transparent outline-none truncate select-all"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow transition active:scale-95 flex-shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={handleNativeShare}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-black shadow flex items-center justify-center gap-1.5 hover:brightness-105 transition active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Send Link (WhatsApp, iMessage, Socials)</span>
            </button>
          </div>

          {/* Section 2: Save to GitHub */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 border border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-white">
                <Github className="w-4 h-4" />
                <span>Save Code to GitHub</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-semibold">
                Version Control
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug">
              Yes, you can easily save this entire codebase to your GitHub account!
            </p>

            {/* Step instructions */}
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-start gap-1.5">
                <span className="text-pink-400 font-bold">1.</span>
                <span>Create a new empty repository on <strong>github.com</strong> (e.g. <code>pengu-pet</code>).</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-pink-400 font-bold">2.</span>
                <span>Download or clone this project, open terminal, and run:</span>
              </div>
            </div>

            {/* Code block */}
            <div className="relative bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[10px] text-emerald-400 overflow-x-auto">
              <pre className="whitespace-pre">{gitCommands}</pre>
              <button
                onClick={handleCopyGit}
                className="absolute top-2 right-2 flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded-md text-[10px] font-bold"
              >
                {copiedGitCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedGitCmd ? 'Copied' : 'Copy Git'}</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              Tip: You can also deploy your GitHub repository for free on <strong>GitHub Pages</strong> or <strong>Vercel</strong> in 1 click!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-pink-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-black text-xs shadow transition active:scale-95"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
