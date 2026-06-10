'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Lock } from 'lucide-react';
import { decodeConfig, encodeAnswers } from '@/lib/codec';
import { CardConfig, CardAnswer, SENDER_AVATARS, CARD_THEMES } from '@/lib/types';

function CardViewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [config, setConfig] = useState<CardConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Steps navigation state
  // 'hook' -> step index (0, 1, ... n-1)
  const [currentStep, setCurrentStep] = useState<Readonly<'hook' | number>>('hook');
  const [answers, setAnswers] = useState<CardAnswer[]>([]);
  
  // Escaping NO button states
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calendar Picker state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Decode config on mount
  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (!dataParam) {
      setError("No invitation code provided. Check your link and try again.");
      return;
    }
    
    const decoded = decodeConfig(dataParam);
    if (!decoded) {
      setError("This invitation code is invalid or corrupted. Ask the sender to re-create it.");
      return;
    }
    
    setConfig(decoded);
  }, [searchParams]);

  const escapeNoButton = () => {
    if (escapeCount >= 3) return;

    // Keep button bounds within safe viewport margin
    const maxX = window.innerWidth / 2 - 70;
    const minX = -window.innerWidth / 2 + 70;
    const maxY = window.innerHeight / 2 - 80;
    const minY = -window.innerHeight / 2 + 80;

    let newX = Math.random() * (maxX - minX) + minX;
    let newY = Math.random() * (maxY - minY) + minY;

    // Shift to guarantee movement
    if (Math.abs(newX - noButtonPosition.x) < 50) {
      newX += newX > 0 ? -70 : 70;
    }
    if (Math.abs(newY - noButtonPosition.y) < 50) {
      newY += newY > 0 ? -70 : 70;
    }

    setNoButtonPosition({ x: newX, y: newY });
    setEscapeCount((prev) => prev + 1);
  };

  // NO button touch proximity tracking (Mobile Escape)
  useEffect(() => {
    if (currentStep !== 'hook' || escapeCount >= 3) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (!noButtonRef.current || !containerRef.current) return;
      
      const touch = e.touches[0];
      const btnRect = noButtonRef.current.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;
      
      const distance = Math.hypot(touch.clientX - btnCenterX, touch.clientY - btnCenterY);
      
      // Trigger teleport if finger is within 80px
      if (distance < 80) {
        escapeNoButton();
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => document.removeEventListener('touchmove', handleTouchMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, escapeCount, noButtonPosition]);

  const handleNoHover = () => {
    escapeNoButton();
  };

  const handleYes = () => {
    if (!config) return;
    if (config.steps.length > 0) {
      setCurrentStep(0);
    } else {
      // Direct redirect if there are no follow-up steps
      const configParam = searchParams.get('data') || '';
      const encodedAnswers = encodeAnswers([]);
      router.push(`/confirmed?data=${configParam}&answers=${encodedAnswers}`);
    }
  };

  // Answers state management
  const getAnswerForStep = (stepId: string) => {
    return answers.find((a) => a.stepId === stepId)?.value;
  };

  const saveAnswer = (stepId: string, value: string | string[]) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.stepId !== stepId);
      return [...filtered, { stepId, value }];
    });
  };

  const handleNextStep = () => {
    if (!config) return;
    if (typeof currentStep === 'number') {
      if (currentStep < config.steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Completed all steps! Encode answers and redirect
        const configParam = searchParams.get('data') || '';
        const encodedAnswers = encodeAnswers(answers);
        router.push(`/confirmed?data=${configParam}&answers=${encodedAnswers}`);
      }
    }
  };

  const handlePrevStep = () => {
    if (typeof currentStep === 'number') {
      if (currentStep === 0) {
        setCurrentStep('hook');
        // Reset escape state if they go back to the hook screen
        setEscapeCount(0);
        setNoButtonPosition({ x: 0, y: 0 });
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

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

  if (!config) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Loading Invitation...</p>
        </div>
      </div>
    );
  }

  // Setup theme styling details
  const activeTheme = CARD_THEMES.find((t) => t.key === config.theme) || CARD_THEMES[0];
  const activeAvatar = SENDER_AVATARS.find((a) => a.key === config.senderAvatar) || SENDER_AVATARS[0];
  
  // Current step details
  const stepConfig = typeof currentStep === 'number' ? config.steps[currentStep] : null;
  const currentStepAnswer = stepConfig ? getAnswerForStep(stepConfig.id) : undefined;
  
  const isStepValid = () => {
    if (!stepConfig) return false;
    if (!stepConfig.required) return true;
    
    if (stepConfig.type === 'multi-choice') {
      return Array.isArray(currentStepAnswer) && currentStepAnswer.length > 0;
    }
    if (stepConfig.type === 'date-picker') {
      return typeof currentStepAnswer === 'string' && currentStepAnswer.trim().length > 0;
    }
    if (stepConfig.type === 'text-input') {
      return typeof currentStepAnswer === 'string' && currentStepAnswer.trim().length > 0;
    }
    return currentStepAnswer !== undefined && currentStepAnswer !== '';
  };

  // Custom Inline Calendar Generator
  const renderCalendar = (stepId: string) => {
    const selectedDateStr = getAnswerForStep(stepId) as string | undefined;
    const selectedDate = selectedDateStr ? new Date(selectedDateStr) : null;
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Days array
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Pad prev month days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    // Days of month
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(year, month, d));
    }
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleDateSelect = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      saveAnswer(stepId, `${y}-${m}-${d}`);
    };

    const changeMonth = (offset: number) => {
      setCurrentMonth(new Date(year, month + offset, 1));
    };

    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
      <div className="bg-white/60 dark:bg-slate-900/60 border border-white/20 p-4 rounded-2xl shadow-sm text-slate-800 dark:text-white">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-sm font-bold"
          >
            ←
          </button>
          <span className="text-sm font-bold font-serif">{monthNames[month]} {year}</span>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-sm font-bold"
          >
            →
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-slate-400 font-medium">
          {weekDays.map((wd) => (
            <div key={wd}>{wd}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="aspect-square" />;
            
            const isSelected = selectedDate && 
              day.getDate() === selectedDate.getDate() && 
              day.getMonth() === selectedDate.getMonth() && 
              day.getFullYear() === selectedDate.getFullYear();
              
            const isPast = day < new Date(new Date().setHours(0,0,0,0));
            
            return (
              <button
                key={day.toISOString()}
                type="button"
                disabled={isPast}
                onClick={() => handleDateSelect(day)}
                className={`aspect-square text-xs rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/25'
                    : isPast
                    ? 'text-slate-350 dark:text-slate-700 cursor-not-allowed opacity-40'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 font-semibold text-slate-700 dark:text-slate-200'
                }`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen flex flex-col justify-between p-4 md:p-6 transition-all duration-500 selection:bg-rose-500/20 ${activeTheme.className}`}
      style={{
        background: 'var(--theme-bg-gradient)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-bg-gradient)] to-[var(--theme-bg-gradient)] opacity-100 -z-20" />
      
      {/* Header (Top progress / navigation) */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between py-2">
        {currentStep !== 'hook' ? (
          <button
            onClick={handlePrevStep}
            className="w-10 h-10 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-white/30 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-950 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
        ) : (
          <div className="w-10 h-10" />
        )}
        
        {/* Progress dots bar */}
        {currentStep !== 'hook' && (
          <div className="flex gap-1.5 items-center">
            {config.steps.map((st, idx) => (
              <div
                key={st.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep === idx
                    ? 'w-6 bg-rose-500'
                    : idx < currentStep
                    ? 'w-2 bg-rose-450 opacity-60'
                    : 'w-2 bg-slate-300/40 dark:bg-slate-700/40'
                }`}
              />
            ))}
          </div>
        )}
        <div className="w-10 h-10" />
      </header>

      {/* Main invitation panel */}
      <main className="flex-1 flex items-center justify-center py-6">
        <div className="w-full max-w-md relative">
          
          {/* Conf Glow backing */}
          <div className="absolute inset-0 bg-white/10 dark:bg-black/5 rounded-3xl blur-2xl -z-10" />
          
          <div className="w-full bg-white/80 dark:bg-slate-900/75 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-white/10 p-6 md:p-8 shadow-xl overflow-hidden min-h-[360px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {currentStep === 'hook' ? (
                <motion.div
                  key="hook-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, x: -80 }}
                  transition={{ duration: 0.25 }}
                  className="flex-1 flex flex-col justify-between space-y-8"
                >
                  {/* Sender Intro */}
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{activeAvatar.emoji}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-none">invitation from</p>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {config.senderName}
                      </h4>
                    </div>
                  </div>

                  {/* Hook Invitation Question */}
                  <div className="py-4">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                      {config.question}
                    </h2>
                  </div>

                  {/* Buttons logic */}
                  <div className="relative h-36 flex flex-col items-center justify-center gap-3">
                    {/* YES button with pulse */}
                    <button
                      onClick={handleYes}
                      className="w-full py-4 rounded-full bg-gradient-to-r from-rose-500 to-violet-600 text-white font-bold text-base shadow-lg shadow-rose-500/20 hover:shadow-xl hover:shadow-rose-500/35 flex items-center justify-center gap-2 transition-all cursor-pointer select-none animate-heartbeat"
                    >
                      <Heart className="w-5 h-5 fill-white" /> YES!
                    </button>

                    {/* Teleporting NO button */}
                    {escapeCount < 3 ? (
                      <motion.button
                        ref={noButtonRef}
                        onHoverStart={handleNoHover}
                        onClick={escapeNoButton}
                        animate={{
                          x: noButtonPosition.x,
                          y: noButtonPosition.y,
                        }}
                        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                        className="px-6 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800 text-slate-500 dark:text-slate-450 text-sm font-semibold select-none absolute cursor-default"
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
                // Step sequence UI
                <motion.div
                  key={`step-${currentStep}`}
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="flex-1 flex flex-col justify-between space-y-6"
                >
                  {/* Step Label */}
                  <div>
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block mb-1">
                      QUESTION {currentStep + 1} OF {config.steps.length}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                      {stepConfig?.label}
                    </h3>
                  </div>

                  {/* Input Renderer */}
                  <div className="flex-1">
                    {stepConfig?.type === 'date-picker' && renderCalendar(stepConfig.id)}

                    {/* Single and Multi choice renderer */}
                    {(stepConfig?.type === 'single-choice' || stepConfig?.type === 'multi-choice') && (
                      <div className="grid grid-cols-2 gap-3">
                        {stepConfig.options?.map((opt) => {
                          const isSelected = stepConfig.type === 'multi-choice'
                            ? Array.isArray(currentStepAnswer) && currentStepAnswer.includes(opt.id)
                            : currentStepAnswer === opt.id;
                            
                          const handleSelect = () => {
                            if (stepConfig.type === 'multi-choice') {
                              const activeList = Array.isArray(currentStepAnswer) ? [...currentStepAnswer] : [];
                              if (activeList.includes(opt.id)) {
                                saveAnswer(stepConfig.id, activeList.filter((x) => x !== opt.id));
                              } else {
                                saveAnswer(stepConfig.id, [...activeList, opt.id]);
                              }
                            } else {
                              saveAnswer(stepConfig.id, opt.id);
                            }
                          };

                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={handleSelect}
                              className={`p-4 rounded-2xl border text-left flex flex-col justify-between aspect-square transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-450 scale-[1.03] shadow-md shadow-rose-500/5'
                                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-800 dark:text-slate-200 shadow-sm'
                              }`}
                            >
                              <span className="text-3xl">{opt.icon || '✨'}</span>
                              <span className="font-semibold text-xs leading-tight truncate">{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Text Input render */}
                    {stepConfig?.type === 'text-input' && (
                      <div className="space-y-1.5">
                        <textarea
                          placeholder="Type your answer here..."
                          maxLength={200}
                          value={(currentStepAnswer as string) || ''}
                          onChange={(e) => saveAnswer(stepConfig.id, e.target.value)}
                          className="w-full h-32 px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-medium text-sm resize-none"
                        />
                        <div className="text-right text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          {((currentStepAnswer as string) || '').length} / 200 characters
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation trigger button */}
                  <div>
                    <button
                      onClick={handleNextStep}
                      disabled={!isStepValid()}
                      className="w-full py-4 rounded-full bg-gradient-to-r from-rose-500 to-violet-600 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {currentStep === config.steps.length - 1 ? 'Confirm Invite 🎉' : 'Next →'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer lock and disclaimers */}
      <footer className="max-w-md w-full mx-auto space-y-2 mt-4 text-center">
        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
          <Lock className="w-3.5 h-3.5" /> Sent privately via encrypted URL
        </div>
        <p className="text-[9px] text-slate-450 dark:text-slate-500 max-w-xs mx-auto leading-relaxed">
          This card was created on YesCard. It's meant to be fun — you can always say no in real life 😄
        </p>
      </footer>
    </div>
  );
}

export default function CardViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Loading Invitation...</p>
        </div>
      </div>
    }>
      <CardViewContent />
    </Suspense>
  );
}
