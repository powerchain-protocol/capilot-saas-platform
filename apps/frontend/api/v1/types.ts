export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = { ok: false; error: { message: string; code: string } };
export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export type ServiceHealth = {
  key: string;
  name: string;
  category: string;
  configured: boolean;
  description: string;
};

export type SecuritySession = {
  ip: string;
  masked: boolean;
  role: string;
  persistent: boolean;
  expiresAt: string;
};
