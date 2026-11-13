"use client";
import { Flame } from "lucide-react";
import { useStore } from "@/lib/storage";
import { streakOf, type Activity } from "@/lib/progress";

export function StreakBadge() {
  const [a, , ok] = useStore<Activity>("activity", { days: {}, goal: 20 });
  if (!ok) return null;
  const s = streakOf(a);
  return (
    <span title="Chuỗi ngày học liên tiếp" className={`inline-flex h-10 items-center gap-1 rounded-xl border border-line px-3 text-sm font-bold ${s ? "text-accent-500" : "text-muted"}`}>
      <Flame className="size-4" fill={s ? "currentColor" : "none"} /> {s}
    </span>
  );
}
