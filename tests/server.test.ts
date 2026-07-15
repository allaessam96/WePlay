import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app, buildMockBlueprint } from '../server';

describe('buildMockBlueprint', () => {
  it('flags the result as a mock', () => {
    expect(buildMockBlueprint('idea').isMock).toBe(true);
  });

  it('derives the Arabic app name from the first 15 chars of the idea', () => {
    const idea = 'a'.repeat(30);
    const result = buildMockBlueprint(idea);
    expect(result.appNameAr).toBe(`${'a'.repeat(15)} الذكي`);
  });

  it('produces the full set of blueprint sections', () => {
    const result = buildMockBlueprint('متجر');
    expect(result.mvpFeatures).toHaveLength(3);
    expect(result.successIndicators).toHaveLength(3);
    expect(result.roadmap).toHaveLength(3);
    expect(result.wireframeLayout.components).toHaveLength(5);
  });

  it('uses only allowed component types and colSpans', () => {
    const allowedTypes = ['header', 'hero', 'grid', 'list', 'input', 'metrics', 'chart', 'map', 'footer'];
    const allowedSpans = ['1', '2', '3', '4', 'full'];
    for (const c of buildMockBlueprint('x').wireframeLayout.components) {
      expect(allowedTypes).toContain(c.type);
      expect(allowedSpans).toContain(c.colSpan);
    }
  });

  it('gives every mvp feature valid impact/complexity values', () => {
    const allowed = ['High', 'Medium', 'Low'];
    for (const f of buildMockBlueprint('x').mvpFeatures) {
      expect(allowed).toContain(f.impact);
      expect(allowed).toContain(f.complexity);
      expect(f.title.length).toBeGreaterThan(0);
      expect(f.description.length).toBeGreaterThan(0);
    }
  });
});

describe('POST /api/generate-blueprint', () => {
  it('returns 400 when appIdea is missing', async () => {
    const res = await request(app).post('/api/generate-blueprint').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it('returns 400 when appIdea is an empty string', async () => {
    const res = await request(app)
      .post('/api/generate-blueprint')
      .send({ appIdea: '' });
    expect(res.status).toBe(400);
  });

  it('returns the mock blueprint when no API key is configured', async () => {
    // Tests run without GEMINI_API_KEY, so the server is in developer mock mode.
    const res = await request(app)
      .post('/api/generate-blueprint')
      .send({ appIdea: 'تطبيق حجز ملاعب', platform: 'ويب', vibe: 'حيوي', industry: 'رياضة' });
    expect(res.status).toBe(200);
    expect(res.body.isMock).toBe(true);
    expect(res.body.appNameEn).toBe('Smart App Blueprint');
    expect(res.body.wireframeLayout.components).toHaveLength(5);
  });
});
