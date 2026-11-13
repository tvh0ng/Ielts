"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useStore } from "@/lib/storage";
import type { SrsMap } from "@/lib/srs";
import type { Topic } from "@/lib/types";
import { cn } from "@/lib/cn";

const GROUPS = ["Chủ đề", "Writing", "Academic", "Speaking"] as const;
const GROUP_LABEL: Record<string, string> = { "Chủ đề": "Chủ đề đời sống & xã hội", Writing: "Ngôn ngữ cho Writing", Academic: "Từ vựng học thuật", Speaking: "Cụm diễn đạt cho Speaking" };

export function TopicGrid({ topics, ids }: { topics: Topic[]; ids: Record<string, number[]> }) {
  const [srs, , ok] = useStore<SrsMap>("srs", {});
  const [q, setQ] = useState("");
  const [g, setG] = useState<string>("all");
  const learned = useMemo(() => {
    const r: Record<string, number> = {};
    for (const t of topics) r[t.slug] = ok ? ids[t.slug].filter((id) => srs[String(id)]).length : 0;
    return r;
  }, [srs, ok, topics, ids]);
  const list = topics.filter((t) => (g === "all" || t.group === g) && t.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {["all", ...GROUPS].map((x) => <button key={x} onClick={() => setG(x)} aria-pressed={g === x} className={cn("chip text-sm px-4 py-1.5", g === x && "chip-on")}>{x === "all" ? "Tất cả" : x}</button>)}
        <label className="relative ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm chủ đề…" className="input pl-9" aria-label="Tìm chủ đề" />
        </label>
      </div>
      {GROUPS.filter((gr) => list.some((t) => t.group === gr)).map((gr) => (
        <section key={gr} className="mt-8">
          <h2 className="title-display text-xl">{GROUP_LABEL[gr]}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.filter((t) => t.group === gr).map((t) => {
              const n = learned[t.slug] || 0; const pct = Math.round((n / t.count) * 100);
              return (
                <li key={t.slug}>
                  <Link href={`/tu-vung/${t.slug}`} className="card block p-4 transition hover:-translate-y-0.5 hover:border-brand-300">
                    <span className="block font-semibold">{t.name.replace(/^(Writing|Academic|Speaking) · /, "")}</span>
                    <span className="mt-1 block text-xs text-muted">{t.count} cụm · đã học {n}</span>
                    <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-surface-2"><span className="block h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} /></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
