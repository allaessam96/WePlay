// Shared utilities extracted from repeated patterns across the app.

// LocalStorage keys used throughout the app.
export const STORAGE_KEYS = {
  users: 'adv_users_v1',
  currentUser: 'adv_current_user_v1',
  support: 'adv_support_messages_v1',
  links: 'adv_links_v1',
  dishes: 'adv_dishes_v1',
  photos: 'adv_photos_v1',
} as const;

// Read and JSON-parse a value from localStorage, returning `fallback` when the
// key is absent or the stored value is not valid JSON.
export function loadFromStorage<T>(key: string, fallback: T): T {
  const saved = localStorage.getItem(key);
  if (!saved) return fallback;
  try {
    return JSON.parse(saved) as T;
  } catch {
    console.error(`Failed to parse localStorage key: ${key}`);
    return fallback;
  }
}

// JSON-stringify and persist a value to localStorage.
export function saveToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Arabic (Egypt) locale time stamp used for item creation times.
export function formatArabicTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
}

// Arabic (Egypt) locale date stamp used for account creation times.
export function formatArabicDate(date: Date = new Date()): string {
  return date.toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' });
}

// Preset emoji icons are stored inline with this prefix instead of an image URL.
export const PRESET_ICON_PREFIX = 'PRESET_ICON:';

export function presetIcon(emoji: string): string {
  return `${PRESET_ICON_PREFIX}${emoji}`;
}

export function isPresetIcon(value: string): boolean {
  return value.startsWith(PRESET_ICON_PREFIX);
}

export function getPresetEmoji(value: string): string {
  return value.slice(PRESET_ICON_PREFIX.length);
}

// Create a Web Audio context, returning null when the browser has no support.
export function createAudioContext(): AudioContext | null {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  return new AudioCtx();
}

// Produce a short, human-readable label for a full URL (host + trimmed path).
export function getShortUrlString(fullUrl: string): string {
  try {
    const parsed = new URL(fullUrl);
    return (
      parsed.hostname +
      (parsed.pathname.length > 12 ? parsed.pathname.slice(0, 12) + '...' : parsed.pathname)
    );
  } catch {
    return fullUrl;
  }
}
