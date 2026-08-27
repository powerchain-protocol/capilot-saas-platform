import { APP_VERSION } from "@/config/app";
import type { InstallSource } from "@/config/rules";

export type Platform = "macOS" | "Windows" | "iOS" | "Android" | "Web";

export type InstallSourceOption = {
  id: InstallSource;
  label: string;
  description: string;
  configured: boolean;
  href: string;
  external: boolean;
};

const githubReleaseUrl =
  process.env.NEXT_PUBLIC_GITHUB_RELEASE_URL ??
  "https://github.com/powerchain-protocol/capilot-frontend/releases";
const driveReleaseUrl = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_RELEASE_URL ?? "";
const appStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL ?? "";
const googlePlayUrl = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ?? "";

export const installConfig = {
  version: APP_VERSION,
  githubReleaseUrl,
  driveReleaseUrl,
  appStoreUrl,
  googlePlayUrl,
  platforms: ["macOS", "Windows", "iOS", "Android", "Web"] as Platform[],
} as const;

export function getInstallSources(platform: Platform): InstallSourceOption[] {
  if (platform === "Web") {
    return [
      {
        id: "web",
        label: "Open Web App",
        description: "No installation required. Sign in from a modern browser.",
        configured: true,
        href: "/sign-in",
        external: false,
      },
    ];
  }

  const sources: InstallSourceOption[] = [
    {
      id: "github",
      label: "GitHub Releases",
      description: "Signed release artifacts and checksums published with release notes.",
      configured: Boolean(githubReleaseUrl),
      href: githubReleaseUrl,
      external: true,
    },
    {
      id: "drive",
      label: "Google Drive",
      description: "Managed distribution channel for approved beta and enterprise builds.",
      configured: Boolean(driveReleaseUrl),
      href: driveReleaseUrl || `/contact?intent=${encodeURIComponent(`${platform.toLowerCase()}-drive-access`)}`,
      external: Boolean(driveReleaseUrl),
    },
  ];

  if (platform === "iOS") {
    sources.unshift({
      id: "store",
      label: "App Store",
      description: "Preferred managed installation and automatic update channel.",
      configured: Boolean(appStoreUrl),
      href: appStoreUrl || "/contact?intent=ios-beta",
      external: Boolean(appStoreUrl),
    });
  }

  if (platform === "Android") {
    sources.unshift({
      id: "store",
      label: "Google Play",
      description: "Preferred managed installation and automatic update channel.",
      configured: Boolean(googlePlayUrl),
      href: googlePlayUrl || "/contact?intent=android-beta",
      external: Boolean(googlePlayUrl),
    });
  }

  return sources;
}
