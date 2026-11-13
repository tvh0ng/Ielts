"use client";
import { useCallback, useSyncExternalStore } from "react";

/** Namespaced, SSR-safe localStorage with cross-component sync. */
const PREFIX = "im2:";
const listeners = new Set<() => void>();
const cache = new Map<string, unknown>();

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  if (cache.has(key)) return cache.get(key) as T;
  let v: T = fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw != null) v = JSON.parse(raw) as T;
  } catch { /* storage blocked */ }
  cache.set(key, v);
  return v;
}

export function writeStore<T>(key: string, value: T) {
  cache.set(key, value);
  try { window.localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* quota / private mode */ }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key?.startsWith(PREFIX)) { cache.delete(e.key.slice(PREFIX.length)); cb(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
}

export function useStore<T>(key: string, fallback: T): [T, (v: T | ((p: T) => T)) => void, boolean] {
  const value = useSyncExternalStore(subscribe, () => read(key, fallback), () => fallback);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const set = useCallback(
    (v: T | ((p: T) => T)) => writeStore(key, typeof v === "function" ? (v as (p: T) => T)(read(key, fallback)) : v),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  return [value, set, hydrated];
}

export const readStore = read;
