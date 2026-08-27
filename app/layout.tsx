import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { CookieNotice } from "@/components/legal/cookies";

export const metadata: Metadata = {
  title: { default: "PowerChain Copilot", template: "%s · PowerChain Copilot" },
  description: "AI Copilot for renewable infrastructure and governed onchain operations.",
  applicationName: "PowerChain Copilot",
  manifest: "/manifest.webmanifest",
  category: "technology",
  formatDetection: { telephone: false, address: false, email: false },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "PowerChain" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F9F7" },
    { media: "(prefers-color-scheme: dark)", color: "#143C2E" },
  ],
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="pc-skip-link" href="#main-content">Skip to content</a>
        <ToastProvider>
          <div id="main-content">{children}</div>
          <CookieNotice />
        </ToastProvider>
      </body>
    </html>
  );
}
