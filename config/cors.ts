const configured = process.env.CORS_ALLOWED_ORIGINS?.split(",").map((value) => value.trim()).filter(Boolean) ?? [];

export const corsConfig = {
  allowedOrigins: configured,
  allowedMethods: ["GET", "POST", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  exposedHeaders: ["X-Request-ID", "X-RateLimit-Limit", "X-RateLimit-Remaining"],
  allowCredentials: true,
  maxAgeSeconds: 600,
} as const;
