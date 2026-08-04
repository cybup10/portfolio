// Simple in-memory rate limiter for login attempts.
// Fine for a single-instance/self-hosted deployment. If you deploy to a
// multi-instance serverless platform, swap this for a shared store
// (e.g. Redis/Upstash) since in-memory state isn't shared across instances.

type Attempt = { count: number; firstAttempt: number };

const attempts = new Map<string, Attempt>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record) return false;

  if (now - record.firstAttempt > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }

  return record.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(key: string) {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now - record.firstAttempt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttempt: now });
    return;
  }

  record.count += 1;
}

export function clearAttempts(key: string) {
  attempts.delete(key);
}
