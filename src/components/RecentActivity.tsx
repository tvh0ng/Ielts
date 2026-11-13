"use client";
import Link from "next/link";
import { History, Play } from "lucide-react";
import { useStore } from "@/lib/storage";
import type { RecentItem } from "@/lib/recent";

export function RecentActivity({ title = "Bài làm gần đây", limit = 3 }: { title?: string; limit?: number }) {
  const [items, , ok] = useStore<RecentItem[]>("recent", []);
  if (!ok || !items.length) return null;
  return (
    <section>
      <h2 className="title-display flex items-center gap-2 text-2xl"><History className="size-5 text-brand-500" />{title}</h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, limit).map((r) => (
          <li key={r.key} className="card p-5">
            <p className="font-bold leading-snug">{r.title}</p>
            <p className="mt-0.5 text-xs text-muted">{r.kind} · {new Date(r.ts).toLocaleDateString("vi-VN")}</p>
            <div className="mt-3 flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-brand-500" style={{ width: `${(r.done / r.total) * 100}%` }} /></div><span className="text-xs tabular-nums text-muted">{r.done}/{r.total}</span></div>
            <Link href={r.href} className="btn-ghost mt-4 py-1.5 text-xs"><Play className="size-3.5" />{r.done >= r.total ? "Xem lại" : "Làm tiếp"}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
