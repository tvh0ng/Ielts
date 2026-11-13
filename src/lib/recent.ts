"use client";
import { readStore, writeStore } from "./storage";

export interface RecentItem { key: string; kind: string; title: string; href: string; done: number; total: number; ts: number }

/** Ghi lại bài đang làm để hiện ở mục "Bài làm gần đây". */
export function logRecent(item: Omit<RecentItem, "ts">) {
  const list = readStore<RecentItem[]>("recent", []).filter((x) => x.key !== item.key);
  writeStore("recent", [{ ...item, ts: Date.now() }, ...list].slice(0, 12));
}
