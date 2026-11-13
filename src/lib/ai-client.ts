"use client";
import { useEffect, useState } from "react";

let cached: boolean | null = null;
export function useAiEnabled() {
  const [on, setOn] = useState<boolean | null>(cached);
  useEffect(() => {
    if (cached != null) return;
    fetch("/api/ai").then((r) => (r.ok ? r.json() : { enabled: false })).then((d) => { cached = !!d.enabled; setOn(cached); }).catch(() => { cached = false; setOn(false); });
  }, []);
  return on;
}

export async function callAi<T = unknown>(body: Record<string, unknown>): Promise<T> {
  const r = await fetch("/api/ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || `Lỗi ${r.status}`);
  return d as T;
}
