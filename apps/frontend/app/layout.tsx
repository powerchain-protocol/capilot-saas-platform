import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { CookieNotice } from "@/components/legal/cookies";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { RuntimeProvider } from "@/context";
import { PwaRegister } from "@/components/installer";

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
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192", media: "(prefers-color-scheme: light)" },
      { url: "/icons/icon-dark-192.png", type: "image/png", sizes: "192x192", media: "(prefers-color-scheme: dark)" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512", media: "(prefers-color-scheme: light)" },
      { url: "/icons/icon-dark-512.png", type: "image/png", sizes: "512x512", media: "(prefers-color-scheme: dark)" }
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180", media: "(prefers-color-scheme: light)" },
      { url: "/apple-icon-dark.png", type: "image/png", sizes: "180x180", media: "(prefers-color-scheme: dark)" }
    ]
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "PowerChain" },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F9F7" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1510" }
  ],
  colorScheme: "light dark"
};

const themeBootstrap = `(() => { try { const stored = localStorage.getItem("powerchain-theme"); const systemDark = matchMedia("(prefers-color-scheme: dark)").matches; const resolved = stored === "dark" || (stored !== "light" && systemDark) ? "dark" : "light"; document.documentElement.dataset.theme = resolved; document.documentElement.style.colorScheme = resolved; } catch {} })();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeBootstrap }} /></head>
      <body>
        <a className="pc-skip-link" href="#main-content">Skip to content</a>
        <RuntimeProvider>
          <ThemeProvider>
            <ToastProvider>
              <div id="main-content">{children}</div>
              <PwaRegister />
              <CookieNotice />
            </ToastProvider>
          </ThemeProvider>
        </RuntimeProvider>
      </body>
    </html>
  );
}
