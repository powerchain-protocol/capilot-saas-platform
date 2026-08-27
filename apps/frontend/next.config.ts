import type { NextConfig } from "next";

// Next.js telemetry is intentionally disabled for local, CI and Vercel builds.
// Vercel also receives NEXT_TELEMETRY_DISABLED=1 from vercel.json/build env.
process.env.NEXT_TELEMETRY_DISABLED = "1";

const allowedDevOrigins = ["localhost", "127.0.0.1"];

function toServerActionOrigin(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    return new URL(trimmed).host;
  } catch {
    return trimmed.replace(/^https?:\/\//, "").split("/")[0] ?? "";
  }
}

const serverActionOrigins = (process.env.POWERCHAIN_TRUSTED_ORIGINS ?? "")
  .split(",")
  .map(toServerActionOrigin)
  .filter(Boolean);

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }]
    : [])
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  allowedDevOrigins,
  transpilePackages: ["@powerchain/ai", "@powerchain/shared", "@powerchain/supabase"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons"],
    serverActions: serverActionOrigins.length > 0 ? { allowedOrigins: serverActionOrigins } : undefined
  },
  async headers() {
    return [
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }, { key: "X-Content-Type-Options", value: "nosniff" }] },
      { source: "/:path*", headers: securityHeaders }
    ];
  }
};

export default nextConfig;
