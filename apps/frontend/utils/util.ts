export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}

export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message = "Request timed out") {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(message), timeoutMs);
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => controller.signal.addEventListener("abort", () => reject(new Error(message)), { once: true })),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export function compact<T>(items: Array<T | null | undefined | false>): T[] {
  return items.filter(Boolean) as T[];
}
