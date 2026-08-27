export type PollOptions<T> = {
  intervalMs?: number;
  signal?: AbortSignal;
  onValue: (value: T) => void;
  onError?: (error: unknown) => void;
};

export async function withFallback<T>(primary: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await primary();
  } catch {
    return fallback();
  }
}

export function startPolling<T>(loader: () => Promise<T>, options: PollOptions<T>): () => void {
  const intervalMs = Math.max(5_000, options.intervalMs ?? 15_000);
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const tick = async (): Promise<void> => {
    if (cancelled || options.signal?.aborted) return;
    try {
      options.onValue(await loader());
    } catch (error) {
      options.onError?.(error);
    } finally {
      if (!cancelled && !options.signal?.aborted) timer = setTimeout(() => { void tick(); }, intervalMs);
    }
  };

  void tick();
  return () => {
    cancelled = true;
    if (timer) clearTimeout(timer);
  };
}
