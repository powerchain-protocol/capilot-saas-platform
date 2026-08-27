export const STORAGE_NAMESPACE = "powerchain:copilot" as const;

export function storageKey(name: string): string {
  return `${STORAGE_NAMESPACE}:${name}`;
}

export function readStorage<T>(name: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(storageKey(name));
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(name: string, value: T): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(storageKey(name), JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(name: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.removeItem(storageKey(name));
    return true;
  } catch {
    return false;
  }
}
