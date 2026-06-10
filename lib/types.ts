export type StepType = 'date-picker' | 'single-choice' | 'multi-choice' | 'text-input';

export interface StepOption {
  id: string;
  label: string;
  icon: string; // Emoji or Lucide icon name
}

export interface CardStep {
  id: string;
  type: StepType;
  label: string;
  options?: StepOption[]; // For choice types
  required: boolean;
}

export interface CardConfig {
  version: 1;
  senderName: string;
  senderAvatar: string; // Preset avatar key
  question: string;
  theme: 'rose' | 'violet' | 'ocean' | 'sunset' | 'forest' | 'noir';
  steps: CardStep[];
  confirmation: {
    title: string;
    subtitle: string;
    confetti: boolean;
  };
}

export interface CardAnswer {
  stepId: string;
  value: string | string[]; // Date string, selected option IDs, or free text
}

// Preset Avatars for Sender
export const SENDER_AVATARS = [
  { key: 'love-letter', emoji: '💌', label: 'Love Letter' },
  { key: 'heart-face', emoji: '😍', label: 'Heart Eyes' },
  { key: 'sparkles', emoji: '✨', label: 'Sparkles' },
  { key: 'party', emoji: '🎉', label: 'Celebration' },
  { key: 'cat-heart', emoji: '😻', label: 'Cat Heart' },
  { key: 'gift', emoji: '🎁', label: 'Gift' },
] as const;

// Preset Themes for Card
export const CARD_THEMES = [
  { key: 'rose', label: 'Rose Blush', className: 'theme-rose', bg: 'bg-rose-100 dark:bg-rose-950', dot: 'bg-rose-500' },
  { key: 'violet', label: 'Sweet Violet', className: 'theme-violet', bg: 'bg-violet-100 dark:bg-violet-950', dot: 'bg-violet-500' },
  { key: 'ocean', label: 'Ocean Breeze', className: 'theme-ocean', bg: 'bg-sky-100 dark:bg-sky-950', dot: 'bg-sky-500' },
  { key: 'sunset', label: 'Warm Sunset', className: 'theme-sunset', bg: 'bg-amber-100 dark:bg-amber-950', dot: 'bg-amber-500' },
  { key: 'forest', label: 'Emerald Forest', className: 'theme-forest', bg: 'bg-emerald-100 dark:bg-emerald-950', dot: 'bg-emerald-500' },
  { key: 'noir', label: 'Midnight Noir', className: 'theme-noir', bg: 'bg-slate-200 dark:bg-slate-900', dot: 'bg-slate-800' },
] as const;
