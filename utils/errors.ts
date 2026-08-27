export class AppError extends Error {
  readonly code: string;
  readonly status: number;
  readonly cause?: unknown;

  constructor(message: string, options: { code?: string; status?: number; cause?: unknown } = {}) {
    super(message);
    this.name = "AppError";
    this.code = options.code ?? "APP_ERROR";
    this.status = options.status ?? 500;
    this.cause = options.cause;
  }
}

export type ErrorShape = { message: string; code: string; status: number };

export function toAppError(error: unknown, fallback = "Something went wrong."): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof Error) return new AppError(error.message || fallback, { cause: error });
  return new AppError(fallback, { cause: error });
}

export function errorShape(error: unknown, fallback = "Something went wrong."): ErrorShape {
  const normalized = toAppError(error, fallback);
  return { message: normalized.message, code: normalized.code, status: normalized.status };
}

export function isAbortError(error: unknown) {
  return error instanceof Error && (error.name === "AbortError" || error.message.toLowerCase().includes("aborted"));
}
