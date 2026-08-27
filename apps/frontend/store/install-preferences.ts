"use client";

import { useSyncExternalStore } from "react";
import type { Platform } from "@/config/install";
import { readStorage, writeStorage } from "@/storage";

const STORAGE_KEY = "install-preferences";
const DEFAULT_PLATFORM: Platform = "Web";
const listeners = new Set<() => void>();
let cachedPlatform: Platform | null = null;

function notify(): void {
  for (const listener of listeners) listener();
}

function readPlatform(): Platform {
  if (cachedPlatform) return cachedPlatform;
  const value = readStorage<{ platform?: Platform }>(STORAGE_KEY, {});
  cachedPlatform = value.platform ?? DEFAULT_PLATFORM;
  return cachedPlatform;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setPreferredInstallPlatform(platform: Platform): void {
  cachedPlatform = platform;
  writeStorage(STORAGE_KEY, { platform });
  notify();
}

export function usePreferredInstallPlatform(): [Platform, (platform: Platform) => void] {
  const platform = useSyncExternalStore(subscribe, readPlatform, () => DEFAULT_PLATFORM);
  return [platform, setPreferredInstallPlatform];
}
