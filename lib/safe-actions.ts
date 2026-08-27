import { AppError, errorShape, toAppError } from "@/utils/errors";

export type SafeActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { message: string; code: string; status: number } };

export async function safeAction<T>(action: () => Promise<T>, fallbackMessage = "Action failed."): Promise<SafeActionResult<T>> {
  try {
    return { ok: true, data: await action() };
  } catch (error) {
    return { ok: false, error: errorShape(error, fallbackMessage) };
  }
}

export function assertAction(condition: unknown, message: string, code = "ACTION_REJECTED", status = 400): asserts condition {
  if (!condition) throw new AppError(message, { code, status });
}

export function actionError(error: unknown, fallbackMessage = "Action failed.") {
  return toAppError(error, fallbackMessage);
}
