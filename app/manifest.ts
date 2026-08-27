import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "PowerChain Copilot",
    short_name: "PowerChain",
    description: "AI Copilot for renewable infrastructure and governed onchain operations.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F7F9F7",
    theme_color: "#143C2E",
    categories: ["business", "productivity", "finance", "utilities"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Open Copilot", short_name: "Copilot", url: "/dashboard" },
      { name: "Install PowerChain", short_name: "Install", url: "/install" },
    ],
  };
}
