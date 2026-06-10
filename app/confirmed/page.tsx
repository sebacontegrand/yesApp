'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Share2, Sparkles, Calendar, CheckSquare, FileText, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { decodeConfig, decodeAnswers } from '@/lib/codec';
import { CardConfig, CardAnswer, CardStep, StepOption, CARD_THEMES, SENDER_AVATARS } from '@/lib/types';

function ConfirmedPageContent() {
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<CardConfig | null>(null);
  const [answers, setAnswers] = useState<CardAnswer[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Decode config and answers on mount
  useEffect(() => {
    const dataParam = searchParams.get('data');
    const answersParam = searchParams.get('answers');

    if (!dataParam) {
      setError("No invitation code provided. Check your link and try again.");
      return;
    }

    const decodedConfig = decodeConfig(dataParam);
    if (!decodedConfig) {
      setError("This invitation code is invalid or corrupted.");
      return;
    }
    setConfig(decodedConfig);

    if (answersParam) {
      const decodedAnswers = decodeAnswers(answersParam);
      setAnswers(decodedAnswers || []);
    } else {
      setAnswers([]);
    }
  }, [searchParams]);

  // Confetti burst
  useEffect(() => {
    if (config?.confirmation.confetti) {
      // Fire confetti burst
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ec4899', '#8b5cf6', '#3b82f6'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ec4899', '#8b5cf6', '#3b82f6'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [config]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950 rounded-full flex items-center justify-center text-rose-500 mx-auto text-2xl">⚠️</div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">Oops! Connection Issue</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-full bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!config || answers === null) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Loading Confirmation...</p>
        </div>
      </div>
    );
  }

  const activeTheme = CARD_THEMES.find((t) => t.key === config.theme) || CARD_THEMES[0];
  const activeAvatar = SENDER_AVATARS.find((a) => a.key === config.senderAvatar) || SENDER_AVATARS[0];

  // Helper: Retrieve text value for selected option(s)
  const renderAnswerText = (step: CardStep, answerValue: string | string[]) => {
    if (step.type === 'date-picker') {
      try {
        const [y,m,d] = (answerValue as string).split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        return dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } catch {
        return answerValue as string;
      }
    }
    
    if (step.type === 'single-choice') {
      const option = step.options?.find((o: StepOption) => o.id === answerValue);
      return option ? `${option.icon} ${option.label}` : (answerValue as string);
    }
    
    if (step.type === 'multi-choice') {
      const ids = Array.isArray(answerValue) ? answerValue : [answerValue];
      return ids
        .map((id) => {
          const option = step.options?.find((o: StepOption) => o.id === id);
          return option ? `${option.icon} ${option.label}` : id;
        })
        .join(', ');
    }
    
    return `"${answerValue}"`;
  };

  // Build WhatsApp text back to sender
  const getReplyWhatsAppLink = () => {
    let text = `Hey ${config.senderName}! I confirmed your invitation: "${config.question}"! 🎉\n\n`;
    
    if (answers && answers.length > 0) {
      text += `Here are my selections:\n`;
      answers.forEach((ans) => {
        const step = config.steps.find((s) => s.id === ans.stepId);
        if (step) {
          const formattedAns = renderAnswerText(step, ans.value);
          text += `• ${step.label}: ${formattedAns}\n`;
        }
      });
    } else {
      text += `I said YES! Can't wait! ❤️`;
    }

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  // Container motion presets
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between p-4 md:p-6 transition-all duration-500 ${activeTheme.className}`}
      style={{
        background: 'var(--theme-bg-gradient)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-bg-gradient)] to-[var(--theme-bg-gradient)] opacity-100 -z-20" />

      <div className="w-10 h-10 mx-auto" /> {/* Spacer */}

      <main className="flex-1 flex items-center justify-center py-6">
        <div className="w-full max-w-md relative">
          
          {/* Back glows */}
          <div className="absolute inset-0 bg-white/10 dark:bg-black/5 rounded-3xl blur-2xl -z-10" />

          <div className="w-full bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-white/10 p-6 md:p-8 shadow-2xl flex flex-col justify-between text-slate-800 dark:text-slate-200">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {/* Celebration animation header */}
              <motion.div variants={item} className="text-center space-y-4">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center text-white text-4xl shadow-xl shadow-rose-500/20 mx-auto">
                    {activeAvatar.emoji}
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </motion.div>
                </div>

                <div className="space-y-1.5">
                  <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                    {config.confirmation.title || "It's a date! 🎉"}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {config.confirmation.subtitle || "Can't wait to see you!"}
                  </p>
                </div>
              </motion.div>

              {/* Answers Summary Grid */}
              {answers && answers.length > 0 && (
                <motion.div variants={item} className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-widest block border-b border-slate-100 dark:border-slate-800 pb-1.5">
                    Your selections
                  </span>

                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {config.steps.map((step) => {
                      const ans = answers.find((a) => a.stepId === step.id);
                      if (!ans) return null;

                      // Display formatted text
                      const answerText = renderAnswerText(step, ans.value);

                      return (
                        <div
                          key={step.id}
                          className="p-3 bg-white/50 dark:bg-slate-950/50 border border-white/20 rounded-2xl flex items-start gap-3 shadow-sm hover:scale-[1.01] transition-transform"
                        >
                          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center flex-shrink-0 text-slate-500 dark:text-slate-400 mt-0.5">
                            {step.type === 'date-picker' ? (
                              <Calendar className="w-4 h-4 text-rose-500" />
                            ) : step.type === 'text-input' ? (
                              <FileText className="w-4 h-4 text-violet-500" />
                            ) : (
                              <CheckSquare className="w-4 h-4 text-sky-500" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide truncate">
                              {step.label}
                            </p>
                            <p className="text-xs font-semibold text-slate-800 dark:text-white mt-0.5 leading-snug">
                              {answerText}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Bottom deep-link action */}
              <motion.div variants={item} className="pt-2">
                <a
                  href={getReplyWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-full bg-gradient-to-r from-rose-500 to-violet-600 hover:opacity-95 text-white font-bold text-base shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  Share Your Excitement <Share2 className="w-4.5 h-4.5" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Security footer disclaimer */}
      <footer className="max-w-md w-full mx-auto space-y-1.5 mt-4 text-center">
        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-450 dark:text-slate-500">
          <Lock className="w-3.5 h-3.5" /> Encoded URL confirmation page
        </div>
        <p className="text-[9px] text-slate-450 dark:text-slate-500 max-w-xs mx-auto leading-relaxed">
          This card was created on YesCard. It's meant to be fun — you can always say no in real life 😄
        </p>
      </footer>
    </div>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Loading Confirmation...</p>
        </div>
      </div>
    }>
      <ConfirmedPageContent />
    </Suspense>
  );
}
