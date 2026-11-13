"use client";
import { useState } from "react";
import type { GrammarItem } from "@/lib/types";
import { cn } from "@/lib/cn";

const LV = ["Tất cả", "Nền tảng", "5.5", "6.0", "7.0", "8.0", "9.0"];
export function GrammarList({ items }: { items: GrammarItem[] }) {
  const [lv, setLv] = useState("Tất cả");
  const [q, setQ] = useState("");
  const list = items.filter((g) => (lv === "Tất cả" || g.lv === lv) && (!q || (g.t + g.f + g.use).toLowerCase().includes(q.toLowerCase())));
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {LV.map((l) => <button key={l} onClick={() => setLv(l)} className={cn("chip text-sm px-4 py-1.5", lv === l && "chip-on")} aria-pressed={lv === l}>{l === "Tất cả" || l === "Nền tảng" ? l : `Band ${l}`}</button>)}
        <input type="search" className="input ml-auto max-w-xs" placeholder="Tìm chủ điểm…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Tìm chủ điểm ngữ pháp" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {list.map((g) => (
          <article key={g.t} className="card p-6">
            <span className="chip">{g.lv === "Nền tảng" ? g.lv : `Band ${g.lv}`}</span>
            <h2 className="title-display mt-3 text-lg">{g.t}</h2>
            <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 font-mono text-[13px]">{g.f}</p>
            <ul className="mt-3 space-y-1.5 text-sm">{g.ex.map((e, i) => <li key={i} className="border-l-2 border-brand-300 pl-3 [&_b]:text-brand-700 dark:[&_b]:text-brand-300" dangerouslySetInnerHTML={{ __html: e }} />)}</ul>
            <p className="mt-3 text-sm text-muted">{g.use}</p>
          </article>
        ))}
        {!list.length && <p className="text-muted">Không có chủ điểm phù hợp.</p>}
      </div>
    </>
  );
}
