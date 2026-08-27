"use client";

import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/constants/storage";
import { readStorage, writeStorage } from "@/storage/browser";

export type ThemePreference = "light" | "dark" | "system";
export type UiPreferences = { theme: ThemePreference };

const DEFAULTS: UiPreferences = { theme: "system" };
let state: UiPreferences = DEFAULTS;
const listeners = new Set<() => void>();
let hydrated = false;

function emit(): void { for (const listener of listeners) listener(); }
function subscribe(listener: () => void): () => void { listeners.add(listener); return () => listeners.delete(listener); }
function snapshot(): UiPreferences { return state; }
function serverSnapshot(): UiPreferences { return DEFAULTS; }

export function hydratePreferences(): UiPreferences {
  if (hydrated || typeof window === "undefined") return state;
  hydrated = true;
  const stored = readStorage(STORAGE_KEYS.theme);
  if (stored === "light" || stored === "dark" || stored === "system") state = { ...state, theme: stored };
  return state;
}

export function setThemePreference(theme: ThemePreference): void {
  state = { ...state, theme };
  writeStorage(STORAGE_KEYS.theme, theme);
  emit();
}

export function useUiPreferences(): UiPreferences {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
