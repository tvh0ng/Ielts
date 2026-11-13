"use client";
import { readStore, writeStore } from "./storage";

export interface Attempt { slug: string; title: string; skill: string; score: number; total: number; band: number; secs: number; ts: number; full: boolean; byType: Record<string, [number, number]> }
export const TYPE_LABEL: Record<string, string> = { tfng: "True / False / Not Given", mcq: "Multiple choice / Matching", gap: "Completion (điền từ)" };

export function saveAttempt(a: Attempt) {
  writeStore("attempts", [a, ...readStore<Attempt[]>("attempts", [])].slice(0, 100));
}
