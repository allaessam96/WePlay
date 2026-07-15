import { describe, it, expect } from 'vitest';
import { APP_TEMPLATES, AppTemplate } from '../src/templates';

const REQUIRED_KEYS: (keyof AppTemplate)[] = [
  'emoji',
  'title',
  'industry',
  'description',
  'platform',
  'vibe',
];

describe('APP_TEMPLATES', () => {
  it('exposes a non-empty array', () => {
    expect(Array.isArray(APP_TEMPLATES)).toBe(true);
    expect(APP_TEMPLATES.length).toBeGreaterThan(0);
  });

  it('has every template populated with all required non-empty string fields', () => {
    for (const template of APP_TEMPLATES) {
      for (const key of REQUIRED_KEYS) {
        expect(typeof template[key]).toBe('string');
        expect((template[key] as string).trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('does not have any extra unexpected keys per template', () => {
    for (const template of APP_TEMPLATES) {
      expect(Object.keys(template).sort()).toEqual([...REQUIRED_KEYS].sort());
    }
  });

  it('has unique titles', () => {
    const titles = APP_TEMPLATES.map((t) => t.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('includes the sports court-booking template', () => {
    const sports = APP_TEMPLATES.find((t) => t.emoji === '⚽');
    expect(sports).toBeDefined();
    expect(sports?.industry).toContain('رياضة');
  });
});
