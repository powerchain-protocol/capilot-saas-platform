export const API_VERSION = "v1" as const;
export const API_PREFIX = `/api/${API_VERSION}` as const;
export const WS_PREFIX = `/ws/${API_VERSION}` as const;
export const APP_VERSION = "1.0.0" as const;
export const SESSION_COOKIE = "pc_session" as const;
export const STANDARD_SESSION_MS = 12 * 60 * 60 * 1000;
export const REMEMBERED_SESSION_MS = 30 * 24 * 60 * 60 * 1000;
export const MAX_MESSAGE_LENGTH = 2_000;
