const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidEmail(raw: string): boolean {
  const s = normalizeEmail(raw);
  return s.length > 3 && s.length < 320 && EMAIL_RE.test(s);
}
