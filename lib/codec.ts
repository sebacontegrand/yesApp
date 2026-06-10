import { CardConfig, CardAnswer } from './types';

/**
 * Encodes a CardConfig object into a URL-safe Base64 string.
 */
export function encodeConfig(config: CardConfig): string {
  try {
    const json = JSON.stringify(config);
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
    const config = JSON.parse(decoded) as CardConfig;
    
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
