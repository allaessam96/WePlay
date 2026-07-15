import { describe, it, expect } from 'vitest';
import { getShortUrlString } from '../src/utils';

describe('getShortUrlString', () => {
  it('returns hostname with a short pathname unchanged', () => {
    expect(getShortUrlString('https://example.com/abc')).toBe('example.com/abc');
  });

  it('returns hostname with root pathname', () => {
    expect(getShortUrlString('https://example.com')).toBe('example.com/');
  });

  it('truncates long pathnames to 12 chars plus ellipsis', () => {
    expect(getShortUrlString('https://example.com/this-is-a-very-long-path')).toBe(
      'example.com/this-is-a-v...'
    );
  });

  it('keeps a pathname exactly 12 chars long without truncation', () => {
    // pathname is "/abcdefghijk" => length 12, not > 12
    expect(getShortUrlString('https://example.com/abcdefghijk')).toBe(
      'example.com/abcdefghijk'
    );
  });

  it('truncates a pathname of 13 chars', () => {
    // pathname is "/abcdefghijkl" => length 13, > 12
    expect(getShortUrlString('https://example.com/abcdefghijkl')).toBe(
      'example.com/abcdefghijk...'
    );
  });

  it('preserves subdomains in the hostname', () => {
    expect(getShortUrlString('https://sub.example.co.uk/x')).toBe(
      'sub.example.co.uk/x'
    );
  });

  it('handles non-http schemes', () => {
    expect(getShortUrlString('ftp://files.example.com/data')).toBe(
      'files.example.com/data'
    );
  });

  it('returns the raw string when the input is not a valid URL', () => {
    expect(getShortUrlString('not a url')).toBe('not a url');
  });

  it('returns the raw string for an empty input', () => {
    expect(getShortUrlString('')).toBe('');
  });
});
