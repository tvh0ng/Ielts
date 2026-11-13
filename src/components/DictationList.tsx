"use client";
import Link from "next/link";
import { useState } from "react";
import type { Dictation } from "@/lib/content";
import { useStore } from "@/lib/storage";
import { Cover, themeAt } from "./Cover";
import { cn } from "@/lib/cn";

const LEVELS = ["Tất cả", "Dễ", "Trung bình", "Khó"];
export function DictationList({ items, limit }: { items: Dictation[]; limit?: number }) {
  const [lv, setLv] = useState("Tất cả");
  const [prog, , ok] = useStore<Record<string, number>>("dict-progress", {});
  const list = items.filter((d) => lv === "Tất cả" || d.level === lv).slice(0, limit);
  return (
    <>
      {!limit && <div className="mb-6 flex flex-wrap gap-2">{LEVELS.map((l) => <button key={l} onClick={() => setLv(l)} aria-pressed={lv === l} className={cn("chip px-4 py-1.5 text-sm", lv === l && "chip-on")}>{l}</button>)}</div>}
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((d) => {
          const n = ok ? prog[d.slug] ?? 0 : 0;
          return (
            <li key={d.slug}>
              <Link href={`/chep-chinh-ta/${d.slug}`} className="group block">
                <Cover label={d.part} big={d.topic} theme={themeAt(items.indexOf(d))} badge={`${d.lines.length} câu`} className="transition group-hover:-translate-y-0.5 group-hover:shadow-lg" />
                <h3 className="mt-3 font-bold group-hover:text-brand-600 dark:group-hover:text-brand-300">{d.title}</h3>
                <p className="mt-1 flex items-center gap-2 text-xs text-muted"><span className={cn("rounded px-1.5 py-0.5 font-semibold", d.level === "Dễ" ? "bg-brand-500/10 text-brand-700 dark:text-brand-200" : d.level === "Khó" ? "bg-rose-500/10 text-rose-700 dark:text-rose-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300")}>{d.level}</span>{n ? `${n}/${d.lines.length} câu` : "Chưa làm"}</p>
                {n > 0 && <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-brand-500" style={{ width: `${(n / d.lines.length) * 100}%` }} /></div>}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
