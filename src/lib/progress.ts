"use client";
import { readStore, writeStore } from "./storage";

export interface Activity { days: Record<string, number>; goal: number }
const key = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Ghi nhận 1 hoạt động học (ôn 1 thẻ, nộp 1 bài...) cho streak & heatmap. */
export function logActivity(n = 1) {
  const a = readStore<Activity>("activity", { days: {}, goal: 20 });
  const k = key();
  writeStore("activity", { ...a, days: { ...a.days, [k]: (a.days[k] || 0) + n } });
}

export function streakOf(a: Activity) {
  let s = 0; const d = new Date();
  if (!a.days[key(d)]) d.setDate(d.getDate() - 1);
  while (a.days[key(d)]) { s++; d.setDate(d.getDate() - 1); }
  return s;
}
export const todayCount = (a: Activity) => a.days[key()] || 0;
export const dayKey = key;
