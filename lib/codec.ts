import { CardConfig, CardAnswer } from './types';

/**
 * Maps CardConfig to a minified JSON object with 1-2 character keys.
 */
function toMinified(config: CardConfig): any {
  return {
    v: config.version,
    n: config.senderName,
    a: config.senderAvatar,
    q: config.question,
    t: config.theme,
    s: config.steps?.map((step) => ({
      i: step.id,
      y: step.type,
      l: step.label,
      r: step.required ? 1 : 0,
      o: step.options?.map((opt) => ({
        i: opt.id,
        l: opt.label,
        ic: opt.icon,
      })),
    })),
    c: config.confirmation
      ? {
          ti: config.confirmation.title,
          su: config.confirmation.subtitle,
          co: config.confirmation.confetti ? 1 : 0,
        }
      : undefined,
  };
}

/**
 * Reconstructs CardConfig from a minified JSON object.
 */
function fromMinified(min: any): CardConfig {
  return {
    version: min.v || 1,
    senderName: min.n || '',
    senderAvatar: min.a || 'love-letter',
    question: min.q || '',
    theme: min.t || 'rose',
    steps: (min.s || []).map((step: any) => ({
      id: step.i,
      type: step.y,
      label: step.l,
      required: step.r === 1,
      options: step.o?.map((opt: any) => ({
        id: opt.i,
        label: opt.l,
        icon: opt.ic || '✨',
      })),
    })),
    confirmation: min.c
      ? {
          title: min.c.ti || '',
          subtitle: min.c.su || '',
          confetti: min.c.co === 1,
        }
      : {
          title: "It's a date! 🎉",
          subtitle: "Can't wait! I will see you then.",
          confetti: true,
        },
  };
}

/**
 * Encodes a CardConfig object into a URL-safe Base64 string.
 */
export function encodeConfig(config: CardConfig): string {
  try {
    const minified = toMinified(config);
    const json = JSON.stringify(minified);
    let base64 = '';
    if (typeof window === 'undefined') {
      base64 = Buffer.from(json).toString('base64');
    } else {
      base64 = btoa(unescape(encodeURIComponent(json)));
    }
    // Convert to URL-safe Base64 (replace + with -, / with _, and strip padding =)
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    console.error('Failed to encode config:', e);
    return '';
  }
}

/**
 * Decodes a URL-safe Base64 string back into a CardConfig object.
 * Returns null if parsing or decoding fails.
 */
export function decodeConfig(data: string): CardConfig | null {
  try {
    if (!data) return null;
    
    // Convert URL-safe Base64 back to standard Base64 (handling spaces as + as well)
    let base64 = data.replace(/ /g, '+').replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    let decoded = '';
    if (typeof window === 'undefined') {
      decoded = Buffer.from(base64, 'base64').toString('utf-8');
    } else {
      decoded = decodeURIComponent(escape(atob(base64)));
    }
    const parsed = JSON.parse(decoded);
    
    // Support both new minified format and legacy format
    const config = parsed && typeof parsed === 'object' && 'v' in parsed
      ? fromMinified(parsed)
      : (parsed as CardConfig);
    
    // Quick validation of the structure
    if (config && typeof config === 'object' && config.version === 1 && typeof config.senderName === 'string') {
      return config;
    }
    return null;
  } catch (e) {
    console.error('Failed to decode config:', e);
    return null;
  }
}

/**
 * Encodes CardAnswer array into a URL-safe Base64 string.
 */
export function encodeAnswers(answers: CardAnswer[]): string {
  try {
    const json = JSON.stringify(answers);
    let base64 = '';
    if (typeof window === 'undefined') {
      base64 = Buffer.from(json).toString('base64');
    } else {
      base64 = btoa(unescape(encodeURIComponent(json)));
    }
    // Convert to URL-safe Base64
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    console.error('Failed to encode answers:', e);
    return '';
  }
}

/**
 * Decodes a URL-safe Base64 string back into CardAnswer array.
 */
export function decodeAnswers(data: string): CardAnswer[] | null {
  try {
    if (!data) return null;
    
    // Convert URL-safe Base64 back to standard Base64
    let base64 = data.replace(/ /g, '+').replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    let decoded = '';
    if (typeof window === 'undefined') {
      decoded = Buffer.from(base64, 'base64').toString('utf-8');
    } else {
      decoded = decodeURIComponent(escape(atob(base64)));
    }
    const answers = JSON.parse(decoded) as CardAnswer[];
    if (Array.isArray(answers)) {
      return answers;
    }
    return null;
  } catch (e) {
    console.error('Failed to decode answers:', e);
    return null;
  }
}
