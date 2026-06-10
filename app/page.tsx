'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight, Share2, Sparkles, Lock, ShieldCheck, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LandingPage() {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);
  const [demoConfirmed, setDemoConfirmed] = useState(false);
  const [demoClickedYes, setDemoClickedYes] = useState(false);
  const demoCardRef = useRef<HTMLDivElement>(null);

  // Mini-demo escaping logic
  const handleNoHover = () => {
    if (escapeCount >= 3) return;

    if (!demoCardRef.current) return;
    const cardRect = demoCardRef.current.getBoundingClientRect();
    
    // We want to keep the button inside the boundaries of the demo card
    // The button size is roughly 80x40px, let's leave 40px padding
    const padding = 50;
    const maxX = (cardRect.width / 2) - padding;
    const minX = -(cardRect.width / 2) + padding;
    const maxY = (cardRect.height / 2) - padding;
    const minY = -(cardRect.height / 2) + padding;

    // Generate random positions that are NOT near the current one
    let newX = Math.random() * (maxX - minX) + minX;
    let newY = Math.random() * (maxY - minY) + minY;

    // Shift a bit to ensure it moves significantly
    if (Math.abs(newX - noButtonPosition.x) < 40) {
      newX += newX > 0 ? -60 : 60;
    }
    if (Math.abs(newY - noButtonPosition.y) < 40) {
      newY += newY > 0 ? -60 : 60;
    }

    setNoButtonPosition({ x: newX, y: newY });
    setEscapeCount((prev) => prev + 1);
  };

  const handleNoTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    handleNoHover();
  };

  const handleYesClick = () => {
    setDemoClickedYes(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#8b5cf6', '#3b82f6'],
    });
    setTimeout(() => {
      setDemoConfirmed(true);
    }, 800);
  };

  const resetDemo = () => {
    setEscapeCount(0);
    setNoButtonPosition({ x: 0, y: 0 });
    setDemoClickedYes(false);
    setDemoConfirmed(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 overflow-x-hidden">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform duration-200">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight bg-gradient-to-r from-rose-500 to-violet-600 bg-clip-text text-transparent">
            YesCard
          </span>
        </Link>
        <Link
          href="/create"
          className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-md hover:shadow-lg dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
        >
          Create Invitation <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 grid lg:grid-cols-12 gap-12 items-center">
        {/* Intro copy */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Fun & Interactive RSVP Link
          </div>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[1.15] tracking-tight">
            Because saying <span className="text-rose-500 underline decoration-wavy decoration-violet-500/30 underline-offset-8">NO</span> isn't an option. 😉
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
            Create custom invitations for date nights, outings, or dinners where the recipient is guided through a series of fun questions. The catch? The "NO" button literally runs away!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              href="/create"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-violet-600 text-white font-semibold text-lg hover:opacity-95 transition-opacity shadow-lg shadow-rose-500/20 hover:shadow-xl hover:shadow-rose-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              Start Creating <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-lg transition-all flex items-center justify-center gap-2"
            >
              Learn More
            </a>
          </div>

          <div className="pt-6 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4.5 h-4.5 text-emerald-500" /> No Database Needed</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4.5 h-4.5 text-violet-500" /> Fully Private URL Config</span>
            <span className="flex items-center gap-1.5"><Share2 className="w-4.5 h-4.5 text-rose-500" /> Share on WhatsApp</span>
          </div>
        </div>

        {/* Live Interactive Demo Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[380px] relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-400 to-violet-500 rounded-3xl blur-2xl opacity-20 dark:opacity-35 -z-10" />

            <div
              ref={demoCardRef}
              className="w-full aspect-[4/5] glass-panel rounded-3xl border border-white/40 dark:border-white/10 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {!demoConfirmed ? (
                  <motion.div
                    key="demo-hook"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">😻</span>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Demo invitation</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">Lucas</p>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full font-semibold">Demo</span>
                    </div>

                    {/* Question */}
                    <div className="my-auto py-4">
                      <h3 className="font-serif text-2xl md:text-3xl font-bold text-slate-800 dark:text-white leading-snug">
                        Would you like to go grab coffee with me? ☕
                      </h3>
                    </div>

                    {/* Buttons Container */}
                    <div className="relative h-36 flex flex-col items-center justify-center gap-3">
                      {/* YES Button */}
                      <motion.button
                        onClick={handleYesClick}
                        disabled={demoClickedYes}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-violet-600 text-white font-semibold text-base shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 select-none cursor-pointer flex items-center justify-center gap-2 transition-all animate-heartbeat"
                      >
                        <Heart className="w-4 h-4 fill-white" /> YES!
                      </motion.button>

                      {/* NO Button (escapes) */}
                      {escapeCount < 3 ? (
                        <motion.button
                          onHoverStart={handleNoHover}
                          onTouchStart={handleNoTouch}
                          animate={{
                            x: noButtonPosition.x,
                            y: noButtonPosition.y,
                          }}
                          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                          className="px-6 py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm font-medium select-none absolute"
                          style={{ bottom: '0px' }}
                        >
                          No
                        </motion.button>
                      ) : (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-rose-600 dark:text-rose-400 font-semibold italic text-center select-none"
                        >
                          Looks like there's only one answer 😏
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="demo-success"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="flex-grow flex flex-col items-center justify-center text-center space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-serif text-2xl font-bold text-slate-800 dark:text-white">It's a Date! 🎉</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-300 mt-2">
                        Now they would be guided through the questions you customized, like:
                      </p>
                    </div>
                    
                    <div className="w-full bg-slate-100/80 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 text-left space-y-2 text-xs text-slate-600 dark:text-slate-350">
                      <p className="flex items-center gap-2">📅 <strong className="text-slate-800 dark:text-white">Pick a date:</strong> Saturday Afternoon</p>
                      <p className="flex items-center gap-2">☕ <strong className="text-slate-800 dark:text-white">Drink type:</strong> Match Latte or Espresso?</p>
                      <p className="flex items-center gap-2">🍰 <strong className="text-slate-800 dark:text-white">Sweet treat?</strong> Definitely Tiramisu</p>
                    </div>

                    <button
                      onClick={resetDemo}
                      className="text-xs text-rose-500 dark:text-rose-400 underline font-medium cursor-pointer"
                    >
                      Try demo again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lock notice footer */}
              <div className="mt-4 pt-4 border-t border-slate-200/40 dark:border-slate-700/30 flex items-center justify-center gap-1 text-[11px] text-slate-400">
                <Lock className="w-3 h-3" /> Encoded URL configuration
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">How it works</h2>
          <p className="text-slate-600 dark:text-slate-400">Create and share custom interactive cards in just three simple steps.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white/60 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-700/50 p-8 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-lg">1</div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Build Your Setup</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Add your name, the core question, choose one of the gorgeous gradients, and select a profile icon that suits your mood.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/60 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-700/50 p-8 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center font-bold text-lg">2</div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Define YES Questions</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Customize up to 6 step actions such as inline calendar picking, single-choice tags (with custom emojis), multi-choices, or special request text inputs.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/60 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-700/50 p-8 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold text-lg">3</div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Share the Link</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Entire card configurations encode instantly into a Base64 URL parameter. Copy the link, scan the QR code, or share it deep-linked onto WhatsApp!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-semibold transition-all shadow-md cursor-pointer"
          >
            Create Your Card Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200/40 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-left">
        <div>
          <p>© 2026 YesCard. Created as a playful, interactive invitation builder.</p>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400 italic">
          <HelpCircle className="w-3.5 h-3.5" /> Note: This card is meant to be fun — you can always say no in real life 😄
        </div>
      </footer>
    </div>
  );
}
