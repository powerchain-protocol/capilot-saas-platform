export function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(key); } catch { return null; }
}

export function writeStorage(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  try { window.localStorage.setItem(key, value); return true; } catch { return false; }
}

export function removeStorage(key: string): boolean {
  if (typeof window === "undefined") return false;
  try { window.localStorage.removeItem(key); return true; } catch { return false; }
}

export function readJsonStorage<T>(key: string, guard: (value: unknown) => value is T): T | null {
  const raw = readStorage(key);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return guard(parsed) ? parsed : null;
  } catch { return null; }
}
