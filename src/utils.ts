// Shared pure helpers used across the app UI.

// Produces a compact, human-friendly representation of a URL for display in
// cards and lists. Falls back to the raw string when the input is not a valid URL.
export function getShortUrlString(fullUrl: string): string {
  try {
    const parsed = new URL(fullUrl);
    return (
      parsed.hostname +
      (parsed.pathname.length > 12
        ? parsed.pathname.slice(0, 12) + '...'
        : parsed.pathname)
    );
  } catch (_) {
    return fullUrl;
  }
}
