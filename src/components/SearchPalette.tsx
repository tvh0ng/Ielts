"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search } from "lucide-react";
import type { Card } from "@/lib/types";
import { cn } from "@/lib/cn";

export interface SearchEntry { t: string; s: string; href: string; k: string }
const strip = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");
let cardsCache: Card[] | null = null;

export function SearchPalette({ open, onClose, index, topicName }: { open: boolean; onClose: () => void; index: SearchEntry[]; topicName: Record<string, string> }) {
  const [q, setQ] = useState("");
  const [cards, setCards] = useState<Card[] | null>(cardsCache);
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => { if (open) { setQ(""); setSel(0); setTimeout(() => input.current?.focus(), 30); if (!cardsCache) fetch("/data/cards.json").then((r) => r.json()).then((c) => { cardsCache = c; setCards(c); }); } }, [open]);

  const results = useMemo(() => {
    const n = strip(q.trim()); if (!n) return index.filter((x) => x.k === "Trang").slice(0, 8);
    const pages = index.filter((x) => strip(x.t + " " + x.s).includes(n)).slice(0, 8);
    const words = (cards || []).filter((c) => strip(c.c + " " + c.m).includes(n)).slice(0, 8)
      .map((c) => ({ t: c.c, s: `${c.m} · ${topicName[c.t]}`, href: `/tu-vung/${c.t}`, k: "Từ vựng" }));
    return [...pages, ...words];
  }, [q, cards, index, topicName]);

  if (!open) return null;
  const go = (href: string) => { onClose(); router.push(href); };
  return (
    <div className="fixed inset-0 z-50 grid place-items-start bg-black/40 px-4 pt-[12vh]" onClick={onClose}>
      <div role="dialog" aria-label="Tìm kiếm" onClick={(e) => e.stopPropagation()} className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-5 text-muted" />
          <input ref={input} autoFocus value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={(e) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)); } if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); } if (e.key === "Enter" && results[sel]) go(results[sel].href); }}
            placeholder="Tìm bài học, đề thi, từ vựng (vd: environment, ô nhiễm)…" className="h-14 flex-1 bg-transparent text-[15px] outline-none" aria-label="Từ khoá" />
          <kbd className="hidden rounded border border-line px-1.5 text-xs text-muted sm:block">Esc</kbd>
        </div>
        <ul className="max-h-[55vh] overflow-y-auto p-2">
          {results.map((r, i) => (
            <li key={r.href + r.t}>
              <button onMouseEnter={() => setSel(i)} onClick={() => go(r.href)} className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left", i === sel && "bg-surface-2")}>
                <span className="w-16 shrink-0 text-[11px] font-bold uppercase tracking-wide text-muted">{r.k}</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{r.t}</span><span className="block truncate text-xs text-muted">{r.s}</span></span>
                {i === sel && <CornerDownLeft className="size-4 text-muted" />}
              </button>
            </li>
          ))}
          {!results.length && <li className="px-3 py-8 text-center text-sm text-muted">Không tìm thấy kết quả cho “{q}”.</li>}
        </ul>
      </div>
    </div>
  );
}
