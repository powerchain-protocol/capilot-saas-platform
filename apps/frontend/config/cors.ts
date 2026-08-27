import { trustedConfig } from "@/config/trusted";

export const corsConfig = {
  allowedOrigins: trustedConfig.origins,
  allowedMethods: ["GET", "POST", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  exposedHeaders: ["X-Request-ID", "X-RateLimit-Limit", "X-RateLimit-Remaining"],
  allowCredentials: true,
  maxAgeSeconds: 600
} as const;
