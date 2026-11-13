"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Eye, Languages, Lightbulb, PartyPopper, Play, RotateCcw, Snail } from "lucide-react";
import type { Dictation as D } from "@/lib/content";
import { speak, stopSpeaking } from "@/lib/tts";
import { useStore } from "@/lib/storage";
import { logActivity } from "@/lib/progress";
import { logRecent } from "@/lib/recent";
import { cn } from "@/lib/cn";

const tok = (s: string) => s.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9'\s-]/g, " ").split(/\s+/).filter(Boolean);

/** So khớp từng từ của câu đúng với bài gõ (theo thứ tự). */
function diff(target: string, typed: string) {
  const words = target.split(/\s+/);
  const t = tok(typed);
  let j = 0;
  return words.map((w) => {
    const norm = tok(w)[0] ?? "";
    if (!norm) return { w, ok: true };
    const k = t.indexOf(norm, j);
    if (k !== -1 && k - j <= 2) { j = k + 1; return { w, ok: true }; }
    return { w, ok: false };
  });
}

export function Dictation({ d }: { d: D }) {
  const [prog, setProg] = useStore<Record<string, number>>("dict-progress", {});
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [showVi, setShowVi] = useState(false);
  const [hints, setHints] = useState(0);
  const input = useRef<HTMLTextAreaElement>(null);
  const total = d.lines.length;
  const done = prog[d.slug] ?? 0;
  const finished = i >= total;
  const [en, vi] = d.lines[Math.min(i, total - 1)];

  useEffect(() => { const start = Math.min(prog[d.slug] ?? 0, total - 1); setI(start >= total ? 0 : start); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const play = useCallback((rate = 0.9) => speak(en, { accent: "en-GB", rate }), [en]);
  useEffect(() => { if (!finished) { const t = setTimeout(() => play(), 250); input.current?.focus(); return () => { clearTimeout(t); stopSpeaking(); }; } }, [i]); // eslint-disable-line react-hooks/exhaustive-deps

  const res = useMemo(() => diff(en, typed), [en, typed]);
  const allOk = res.every((r) => r.ok);

  const check = () => {
    setChecked(true);
    if (allOk) {
      const n = Math.max(done, i + 1);
      setProg({ ...prog, [d.slug]: n });
      logActivity();
      logRecent({ key: `dict:${d.slug}`, kind: "Chép chính tả", title: d.title, href: `/chep-chinh-ta/${d.slug}`, done: n, total });
    }
  };
  const go = (n: number) => { setI(n); setTyped(""); setChecked(false); setReveal(false); setHints(0); };
  const hint = () => { const words = en.split(/\s+/); const n = Math.min(words.length, hints + 1); setHints(n); setTyped(words.slice(0, n).join(" ") + " "); setChecked(false); input.current?.focus(); };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (checked && (allOk || reveal)) go(i + 1); else check(); }
    else if (e.key === "Control") { e.preventDefault(); play(); }
  };

  if (finished) return (
    <div className="card mx-auto max-w-2xl p-10 text-center">
      <PartyPopper className="mx-auto size-12 text-accent-500" />
      <h2 className="title-display mt-3 text-3xl">Hoàn thành bài nghe!</h2>
      <p className="mt-2 text-muted">Bạn đã chép đúng {total}/{total} câu. Hãy nghe lại toàn bài và shadowing (nói đuổi) theo transcript.</p>
      <div className="mt-6 space-y-2 text-left text-[15px]">{d.lines.map(([e, v], k) => <p key={k} className="rounded-lg bg-surface-2 px-4 py-2"><b>{e}</b><span className="block text-sm text-muted">{v}</span></p>)}</div>
      <div className="mt-6 flex justify-center gap-2"><button className="btn-ghost" onClick={() => { setProg({ ...prog, [d.slug]: 0 }); go(0); }}><RotateCcw className="size-4" />Làm lại</button><Link href="/chep-chinh-ta" className="btn-primary">Bài khác</Link></div>
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="card p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-muted">Câu {i + 1}/{total}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${(done / total) * 100}%` }} /></div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button onClick={() => play()} className="btn-primary"><Play className="size-4" fill="currentColor" />Nghe</button>
          <button onClick={() => play(0.65)} className="btn-ghost"><Snail className="size-4" />Nghe chậm</button>
          <span className="ml-auto hidden text-xs text-muted sm:block"><kbd className="rounded border border-line px-1.5">Ctrl</kbd> nghe lại · <kbd className="rounded border border-line px-1.5">Enter</kbd> kiểm tra</span>
        </div>

        <textarea ref={input} value={typed} onChange={(e) => { setTyped(e.target.value); setChecked(false); }} onKeyDown={onKey} rows={3}
          className="input mt-4 resize-none text-lg leading-relaxed" placeholder="Gõ lại những gì bạn nghe được…" aria-label="Câu bạn nghe được" spellCheck={false} autoCapitalize="off" autoCorrect="off" />

        {checked && (
          <div className={cn("mt-4 rounded-xl border p-4", allOk ? "border-brand-300 bg-brand-50 dark:bg-brand-900/30" : "border-line bg-surface-2")} aria-live="polite">
            <p className="text-[17px] leading-8">
              {res.map((r, k) => <span key={k} className={cn("mr-1.5", r.ok ? "text-brand-700 dark:text-brand-300 font-semibold" : reveal ? "text-rose-600 underline decoration-2" : "rounded bg-rose-100 px-0.5 text-rose-400 select-none dark:bg-rose-900/40")}>{r.ok || reveal ? r.w : r.w.replace(/./g, "•")}</span>)}
            </p>
            <p className="mt-2 text-sm font-semibold">{allOk ? "Chính xác! Nhấn Enter để sang câu tiếp." : `Đúng ${res.filter((r) => r.ok).length}/${res.length} từ — nghe lại phần bị che.`}</p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={hint} className="btn-ghost py-2"><Lightbulb className="size-4" />Gợi ý 1 từ</button>
          <button onClick={() => { setChecked(true); setReveal(true); }} className="btn-ghost py-2"><Eye className="size-4" />Xem đáp án</button>
          <button onClick={() => setShowVi((v) => !v)} className="btn-ghost py-2" aria-pressed={showVi}><Languages className="size-4" />Dịch</button>
          <div className="ml-auto flex gap-2">
            <button onClick={() => go(Math.max(0, i - 1))} disabled={i === 0} className="btn-ghost py-2" aria-label="Câu trước"><ChevronLeft className="size-4" /></button>
            {checked && (allOk || reveal) ? <button onClick={() => go(i + 1)} className="btn-primary py-2">Câu tiếp <ChevronRight className="size-4" /></button>
              : <button onClick={check} className="btn-primary py-2" disabled={!typed.trim()}>Kiểm tra</button>}
          </div>
        </div>
        {showVi && <p className="mt-4 rounded-lg bg-surface-2 px-4 py-3 text-sm text-muted">{vi}</p>}
      </div>

      <aside className="card p-5 lg:sticky lg:top-20 lg:self-start">
        <h2 className="font-bold">Transcript</h2>
        <ol className="mt-3 space-y-1.5 text-sm">
          {d.lines.map(([e], k) => (
            <li key={k}>
              <button onClick={() => go(k)} className={cn("w-full rounded-lg px-3 py-2 text-left", k === i ? "bg-brand-50 font-semibold text-brand-800 dark:bg-brand-900/40 dark:text-brand-200" : "hover:bg-surface-2")}>
                <span className="mr-1 text-muted">{k + 1}.</span>{k < done ? e : e.replace(/[A-Za-z]/g, "•").slice(0, 46) + "…"}
              </button>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
