'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import {
  Heart,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  Check,
  Share2,
  Layers,
  Sparkles,
  HelpCircle,
  GripVertical,
  Heading,
  Eye,
  Lock
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CardConfig, CardStep, StepOption, StepType, SENDER_AVATARS, CARD_THEMES } from '@/lib/types';
import { encodeConfig } from '@/lib/codec';

export default function CreatorPage() {
  const [mounted, setMounted] = useState(false);
  const [wizardStep, setWizardStep] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  // Initial template config
  const [config, setConfig] = useState<CardConfig>({
    version: 1,
    senderName: '',
    senderAvatar: 'love-letter',
    question: 'Do you want to go out with me?',
    theme: 'rose',
    steps: [
      {
        id: '1',
        type: 'date-picker',
        label: 'Pick a date 📅',
        required: true,
      },
    ],
    confirmation: {
      title: "It's a date! 🎉",
      subtitle: "Can't wait! I will see you then.",
      confetti: true,
    },
  });

  // Share URL state
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin;
      const encoded = encodeConfig(config);
      setShareUrl(`${baseUrl}/card?data=${encoded}`);
    }
  }, [config]);

  // Handle Drag & Drop reordering of questionnaire steps
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(config.steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setConfig({ ...config, steps: items });
  };

  // Step creators
  const addStep = () => {
    if (config.steps.length >= 6) return;
    const newStepId = Math.random().toString(36).substring(2, 9);
    const newStep: CardStep = {
      id: newStepId,
      type: 'single-choice',
      label: 'Where should we go?',
      required: true,
      options: [
        { id: '1', label: 'Coffee', icon: '☕' },
        { id: '2', label: 'Dinner', icon: '🍕' },
      ],
    };
    setConfig({ ...config, steps: [...config.steps, newStep] });
  };

  const removeStep = (id: string) => {
    const filtered = config.steps.filter((s) => s.id !== id);
    setConfig({ ...config, steps: filtered });
  };

  const updateStepType = (id: string, type: StepType) => {
    const updated = config.steps.map((s) => {
      if (s.id !== id) return s;
      
      const newStep: CardStep = { ...s, type };
      // Assign default options for choice types if they don't exist
      if ((type === 'single-choice' || type === 'multi-choice') && (!s.options || s.options.length === 0)) {
        newStep.options = [
          { id: '1', label: 'Option 1', icon: '✨' },
          { id: '2', label: 'Option 2', icon: '✨' },
        ];
      } else if (type === 'date-picker' || type === 'text-input') {
        delete newStep.options;
      }
      return newStep;
    });
    setConfig({ ...config, steps: updated });
  };

  const updateStepLabel = (id: string, label: string) => {
    const updated = config.steps.map((s) => (s.id === id ? { ...s, label } : s));
    setConfig({ ...config, steps: updated });
  };

  const addOption = (stepId: string) => {
    const updated = config.steps.map((s) => {
      if (s.id !== stepId) return s;
      const options = s.options ? [...s.options] : [];
      const newOptionId = Math.random().toString(36).substring(2, 5);
      options.push({
        id: newOptionId,
        label: `New Option`,
        icon: '🌟',
      });
      return { ...s, options };
    });
    setConfig({ ...config, steps: updated });
  };

  const removeOption = (stepId: string, optionId: string) => {
    const updated = config.steps.map((s) => {
      if (s.id !== stepId) return s;
      const options = s.options ? s.options.filter((o) => o.id !== optionId) : [];
      return { ...s, options };
    });
    setConfig({ ...config, steps: updated });
  };

  const updateOption = (stepId: string, optionId: string, field: keyof StepOption, value: string) => {
    const updated = config.steps.map((s) => {
      if (s.id !== stepId) return s;
      const options = s.options ? s.options.map((o) => (o.id === optionId ? { ...o, [field]: value } : o)) : [];
      return { ...s, options };
    });
    setConfig({ ...config, steps: updated });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWhatsAppLink = () => {
    const sender = config.senderName || 'Someone';
    const text = encodeURIComponent(
      `Hey! ${sender} sent you a special invitation link. You can check it out here:\n\n${shareUrl}`
    );
    return `https://wa.me/?text=${text}`;
  };

  const selectedTheme = CARD_THEMES.find((t) => t.key === config.theme) || CARD_THEMES[0];
  const selectedAvatar = SENDER_AVATARS.find((a) => a.key === config.senderAvatar) || SENDER_AVATARS[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-rose-500/10">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight bg-gradient-to-r from-rose-500 to-violet-600 bg-clip-text text-transparent">
            YesCard
          </span>
        </Link>
        <span className="text-xs text-slate-400 font-medium">Card Builder</span>
      </header>

      {/* Main Grid: Builder Form & Mobile Live Preview */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Builder Panels */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
            
            {/* Steps Navigation Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Step {wizardStep + 1} of 4</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((stepIdx) => (
                  <button
                    key={stepIdx}
                    onClick={() => setWizardStep(stepIdx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      wizardStep === stepIdx ? 'w-6 bg-rose-500' : 'w-2 bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* WIZARD STEP 1: IDENTITY & THEME */}
            {wizardStep === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
                    <Heading className="w-5 h-5 text-rose-500" /> Card Identity
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Set the basic header info for your invitation card.</p>
                </div>

                <div className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label htmlFor="sender-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="sender-name"
                      type="text"
                      placeholder="e.g. Lucas"
                      value={config.senderName}
                      onChange={(e) => setConfig({ ...config, senderName: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-medium text-sm"
                    />
                  </div>

                  {/* Question Input */}
                  <div>
                    <label htmlFor="question" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Main Question <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="question"
                      type="text"
                      placeholder="Do you want to go out with me?"
                      value={config.question}
                      onChange={(e) => setConfig({ ...config, question: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-medium text-sm"
                    />
                  </div>

                  {/* Preset Avatar Selector */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Sender Avatar Key Icon
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {SENDER_AVATARS.map((avatar) => (
                        <button
                          key={avatar.key}
                          type="button"
                          onClick={() => setConfig({ ...config, senderAvatar: avatar.key })}
                          className={`aspect-square rounded-2xl border flex flex-col items-center justify-center text-xl transition-all cursor-pointer ${
                            config.senderAvatar === avatar.key
                              ? 'border-rose-500 bg-rose-500/10 text-rose-600 scale-105 shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                          title={avatar.label}
                        >
                          <span>{avatar.emoji}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card Theme Picker */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Gradient Card Theme
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {CARD_THEMES.map((theme) => (
                        <button
                          key={theme.key}
                          type="button"
                          onClick={() => setConfig({ ...config, theme: theme.key })}
                          className={`py-3.5 px-2.5 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                            config.theme === theme.key
                              ? 'border-rose-500 bg-rose-500/5 text-rose-600 scale-105'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full ${theme.bg} border border-slate-300/40`} />
                          <span className="truncate max-w-full text-[10px]">{theme.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WIZARD STEP 2: DEFINE YES SEQUENCE FLOW */}
            {wizardStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-violet-500" /> Questionnaire Steps
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Define steps they complete after clicking YES.</p>
                  </div>
                  <button
                    onClick={addStep}
                    disabled={config.steps.length >= 6}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white font-semibold text-xs rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Step
                  </button>
                </div>

                {!mounted ? (
                  <p className="text-sm text-slate-400 italic">Loading layout components...</p>
                ) : (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="steps-droppable">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-4 max-h-[420px] overflow-y-auto pr-1"
                        >
                          {config.steps.length === 0 && (
                            <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-bounce" />
                              <p className="text-sm font-semibold text-slate-400">No custom steps yet.</p>
                              <p className="text-xs text-slate-400 mt-1">They will land straight on the confirmation card.</p>
                            </div>
                          )}

                          {config.steps.map((step, index) => (
                            <Draggable key={step.id} draggableId={step.id} index={index}>
                              {(draggableProvided) => (
                                <div
                                  ref={draggableProvided.innerRef}
                                  {...draggableProvided.draggableProps}
                                  className="border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-2xl space-y-3 relative group"
                                >
                                  {/* Step Index & Controls */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div
                                        {...draggableProvided.dragHandleProps}
                                        className="text-slate-450 hover:text-slate-600 cursor-grab active:cursor-grabbing p-1"
                                      >
                                        <GripVertical className="w-4 h-4" />
                                      </div>
                                      <span className="text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 w-5 h-5 rounded-full flex items-center justify-center">
                                        {index + 1}
                                      </span>
                                      <select
                                        value={step.type}
                                        onChange={(e) => updateStepType(step.id, e.target.value as StepType)}
                                        className="text-xs font-bold border-0 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-0 cursor-pointer"
                                      >
                                        <option value="date-picker">📅 Date Picker</option>
                                        <option value="single-choice">⚪ Single Choice</option>
                                        <option value="multi-choice">☑️ Multi Choice</option>
                                        <option value="text-input">✍️ Free Text</option>
                                      </select>
                                    </div>

                                    <button
                                      onClick={() => removeStep(step.id)}
                                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                      title="Delete Step"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>

                                  {/* Step Label Input */}
                                  <div>
                                    <input
                                      type="text"
                                      placeholder="e.g. Choose a date"
                                      value={step.label}
                                      onChange={(e) => updateStepLabel(step.id, e.target.value)}
                                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-violet-500 font-medium text-xs"
                                    />
                                  </div>

                                  {/* Choice Options Editor */}
                                  {(step.type === 'single-choice' || step.type === 'multi-choice') && (
                                    <div className="space-y-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-800/50">
                                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                        <span>OPTIONS:</span>
                                        <button
                                          onClick={() => addOption(step.id)}
                                          className="text-violet-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                                        >
                                          + Add option
                                        </button>
                                      </div>

                                      <div className="space-y-1.5">
                                        {step.options?.map((opt) => (
                                          <div key={opt.id} className="flex gap-1.5 items-center">
                                            {/* Icon Emoji Input */}
                                            <input
                                              type="text"
                                              maxLength={2}
                                              value={opt.icon}
                                              onChange={(e) => updateOption(step.id, opt.id, 'icon', e.target.value)}
                                              className="w-10 text-center py-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-xs"
                                              placeholder="✨"
                                            />
                                            {/* Label Input */}
                                            <input
                                              type="text"
                                              value={opt.label}
                                              onChange={(e) => updateOption(step.id, opt.id, 'label', e.target.value)}
                                              className="flex-1 px-2.5 py-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-xs"
                                              placeholder="Option name"
                                            />
                                            {/* Remove option button */}
                                            <button
                                              onClick={() => removeOption(step.id, opt.id)}
                                              disabled={(step.options || []).length <= 2}
                                              className="text-slate-400 hover:text-rose-600 disabled:opacity-40 p-1 cursor-pointer"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </div>
            )}

            {/* WIZARD STEP 3: CONFIRMATION SCREEN */}
            {wizardStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" /> Confirmation Card
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure what they see after completing all steps.</p>
                </div>

                <div className="space-y-4">
                  {/* Conf Title */}
                  <div>
                    <label htmlFor="conf-title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Celebration Title
                    </label>
                    <input
                      id="conf-title"
                      type="text"
                      placeholder="It's a date! 🎉"
                      value={config.confirmation.title}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          confirmation: { ...config.confirmation, title: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-medium text-sm"
                    />
                  </div>

                  {/* Conf Subtitle */}
                  <div>
                    <label htmlFor="conf-subtitle" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Celebration Subtitle
                    </label>
                    <input
                      id="conf-subtitle"
                      type="text"
                      placeholder="Can't wait to see you!"
                      value={config.confirmation.subtitle}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          confirmation: { ...config.confirmation, subtitle: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-medium text-sm"
                    />
                  </div>

                  {/* Confetti Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Confetti Celebration</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Burst a colorful spray of confetti on screen entry.</p>
                    </div>
                    <button
                      onClick={() =>
                        setConfig({
                          ...config,
                          confirmation: { ...config.confirmation, confetti: !config.confirmation.confetti },
                        })
                      }
                      className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                        config.confirmation.confetti ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          config.confirmation.confetti ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* WIZARD STEP 4: SHARE CARD */}
            {wizardStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-indigo-500" /> Share Invitation
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your card is ready to send. No database saves needed!</p>
                </div>

                <div className="space-y-6">
                  {/* Share QR Code and Link */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex-shrink-0">
                      {shareUrl ? <QRCodeSVG value={shareUrl} size={130} /> : <div className="w-32 h-32 bg-slate-200" />}
                    </div>

                    <div className="flex-1 space-y-3 text-center sm:text-left w-full">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Invitation Link</h4>
                      <div className="flex gap-2 w-full">
                        <input
                          type="text"
                          readOnly
                          value={shareUrl}
                          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 truncate focus:outline-none"
                        />
                        <button
                          onClick={handleCopyLink}
                          className="px-3.5 py-2 bg-slate-950 hover:bg-slate-850 dark:bg-white dark:text-slate-950 text-white rounded-xl text-xs font-semibold flex items-center justify-center cursor-pointer transition-colors"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        This long link encodes your card's custom name, themes, emojis, and questions in safe Base64.
                      </p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors text-center"
                    >
                      <Share2 className="w-4.5 h-4.5" /> Share on WhatsApp
                    </a>
                    <button
                      onClick={handleCopyLink}
                      className="py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-500" /> Link Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copy Direct Link
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-850">
              <button
                disabled={wizardStep === 0}
                onClick={() => setWizardStep((prev) => prev - 1)}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {wizardStep < 3 ? (
                <button
                  onClick={() => setWizardStep((prev) => prev + 1)}
                  disabled={wizardStep === 0 && !config.senderName.trim()}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href={`/card?data=${encodeConfig(config)}`}
                  target="_blank"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-violet-600 text-white font-semibold text-xs rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Test invitation <Eye className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Mobile Live Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-24 w-full max-w-[340px] flex flex-col items-center space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Live Card Preview
            </span>
            
            {/* Phone Frame Mockup */}
            <div className="w-full aspect-[9/18.5] bg-slate-900 border-[8px] border-slate-800 dark:border-slate-700 rounded-[36px] shadow-2xl overflow-hidden relative flex flex-col ring-4 ring-slate-900/10">
              
              {/* Phone Camera Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full z-30" />

              {/* Real-time Theme Colors Wrapper */}
              <div className={`flex-1 flex flex-col overflow-y-auto px-4 pt-10 pb-4 relative ${selectedTheme.className}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-bg-gradient)] to-[var(--theme-bg-gradient)] opacity-100 z-0" style={{ background: 'var(--theme-bg-gradient)' }} />
                
                {/* Embedded Invite Card Preview */}
                <div className="flex-1 flex flex-col justify-between glass-panel rounded-2xl p-5 border border-white/30 relative z-10 text-slate-800 shadow-lg">
                  {/* Hook view preview */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{selectedAvatar.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">invitation</p>
                        <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                          {config.senderName || 'Sender Name'}
                        </p>
                      </div>
                    </div>

                    <div className="my-auto py-3">
                      <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-white leading-snug">
                        {config.question || 'Do you want to go out with me?'}
                      </h3>
                    </div>

                    {/* Pre-render steps summaries indicator if present */}
                    {config.steps.length > 0 && (
                      <div className="mb-4 bg-white/40 dark:bg-black/20 p-2.5 rounded-xl border border-white/20 text-[10px] space-y-1">
                        <span className="font-bold text-[9px] uppercase tracking-wider text-slate-500 block mb-0.5">Yes Flow Steps:</span>
                        {config.steps.map((st) => (
                          <div key={st.id} className="truncate flex items-center gap-1.5 text-slate-600 dark:text-slate-350">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span className="font-medium text-slate-800 dark:text-white">{st.type === 'date-picker' ? '📅' : '💬'}</span> {st.label || 'Step Label'}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Dummy Buttons */}
                    <div className="space-y-2 text-center relative">
                      <div className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-violet-600 text-white font-bold text-xs rounded-full shadow-md animate-heartbeat flex items-center justify-center gap-1">
                        <Heart className="w-3.5 h-3.5 fill-white" /> YES!
                      </div>
                      <div className="inline-block px-4 py-1.5 border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-400 text-[11px] rounded-full font-medium">
                        No
                      </div>
                    </div>
                  </div>

                  {/* Footers disclaimer */}
                  <div className="mt-3 pt-3 border-t border-slate-200/30 text-[9px] text-slate-400 text-center flex items-center justify-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Sent privately by {config.senderName || 'Sender'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
