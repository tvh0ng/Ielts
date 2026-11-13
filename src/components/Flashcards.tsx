"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Keyboard, PartyPopper, RotateCcw, Settings2, Shuffle, Volume2 } from "lucide-react";
import { useStore } from "@/lib/storage";
import { preview, schedule, type Grade, type SrsMap } from "@/lib/srs";
import { logActivity } from "@/lib/progress";
import { speak, type Accent } from "@/lib/tts";
import { cn } from "@/lib/cn";

export interface StudyCard { key: string; c: string; m: string; e: string; ipa: string; topic?: string }
export interface StudySettings { accent: Accent; rate: number; autoSpeak: boolean; reverse: boolean; newPerDay: number }
export const DEFAULT_SETTINGS: StudySettings = { accent: "en-GB", rate: 0.9, autoSpeak: true, reverse: false, newPerDay: 20 };

const GRADES: { g: Grade; label: string; cls: string; kb: string }[] = [
  { g: 0, label: "Quên", kb: "1", cls: "bg-rose-500 hover:bg-rose-600 shadow-[0_4px_0_0_#be123c]" },
  { g: 1, label: "Khó", kb: "2", cls: "bg-amber-500 hover:bg-amber-600 shadow-[0_4px_0_0_#b45309]" },
  { g: 2, label: "Nhớ", kb: "3", cls: "bg-brand-500 hover:bg-brand-600 shadow-[0_4px_0_0_var(--color-brand-700)]" },
  { g: 3, label: "Dễ", kb: "4", cls: "bg-sky-500 hover:bg-sky-600 shadow-[0_4px_0_0_#0369a1]" },
];

export function Flashcards({ cards, title, backHref = "/tu-vung", emptyText }: { cards: StudyCard[]; title: string; backHref?: string; emptyText?: string }) {
  const [srs, setSrs] = useStore<SrsMap>("srs", {});
  const [set, setSet] = useStore<StudySettings>("study-settings", DEFAULT_SETTINGS);
  const [queue, setQueue] = useState<StudyCard[]>(cards);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState({ done: 0, again: 0 });
  const [showSet, setShowSet] = useState(false);
  const total = cards.length;

  useEffect(() => { setQueue(cards); setStats({ done: 0, again: 0 }); setFlipped(false); }, [cards]);

  const card = queue[0];
  const say = useCallback((t: string) => speak(t, { accent: set.accent, rate: set.rate }), [set.accent, set.rate]);

  useEffect(() => {
    if (card && set.autoSpeak && !set.reverse && !flipped) say(card.c);
  }, [card?.key, flipped]); // eslint-disable-line react-hooks/exhaustive-deps

  const grade = useCallback((g: Grade) => {
    if (!card) return;
    setSrs((m) => ({ ...m, [card.key]: schedule(m[card.key], g) }));
    logActivity();
    setStats((s) => ({ done: s.done + (g === 0 ? 0 : 1), again: s.again + (g === 0 ? 1 : 0) }));
    setQueue((q) => {
      const rest = q.slice(1);
      if (g === 0) { const pos = Math.min(rest.length, 4); return [...rest.slice(0, pos), q[0], ...rest.slice(pos)]; }
      return rest;
    });
    setFlipped(false);
  }, [card, setSrs]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input,textarea,select")) return;
      if (e.code === "Space" || e.key === "Enter") { e.preventDefault(); setFlipped((f) => !f); }
      else if (flipped && ["1", "2", "3", "4"].includes(e.key)) grade((+e.key - 1) as Grade);
      else if (e.key.toLowerCase() === "s" && card) say(card.c);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, grade, card, say]);

  const pv = useMemo(() => (card ? preview(srs[card.key]) : null), [card, srs]);
  const pct = total ? Math.round((stats.done / total) * 100) : 0;

  if (!total) return (
    <div className="card p-10 text-center">
      <PartyPopper className="mx-auto size-10 text-accent-500" />
      <p className="title-display mt-3 text-2xl">Không còn thẻ nào!</p>
      <p className="mt-2 text-muted">{emptyText || "Bạn đã ôn hết thẻ đến hạn. Quay lại sau nhé."}</p>
      <Link href={backHref} className="btn-primary mt-6">Chọn chủ đề khác</Link>
    </div>
  );

  if (!card) return (
    <div className="card p-10 text-center">
      <PartyPopper className="mx-auto size-12 text-accent-500" />
      <p className="title-display mt-3 text-3xl">Hoàn thành phiên học!</p>
      <p className="mt-2 text-muted">{stats.done} thẻ đã ôn · {stats.again} lần “Quên”. Hệ thống đã hẹn lịch ôn cho từng thẻ.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button className="btn-ghost" onClick={() => { setQueue(cards); setStats({ done: 0, again: 0 }); }}><RotateCcw className="size-4" />Học lại</button>
        <Link href={backHref} className="btn-primary">Chủ đề khác</Link>
      </div>
    </div>
  );

  const front = set.reverse ? card.m : card.c;
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Tiến độ phiên học">
          <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm font-semibold tabular-nums text-muted">{stats.done}/{total}</span>
        <button onClick={() => setQueue((q) => [...q].sort(() => Math.random() - 0.5))} className="grid size-9 place-items-center rounded-lg border border-line text-muted hover:text-ink" aria-label="Xáo trộn"><Shuffle className="size-4" /></button>
        <button onClick={() => setShowSet((v) => !v)} className="grid size-9 place-items-center rounded-lg border border-line text-muted hover:text-ink" aria-label="Cài đặt" aria-expanded={showSet}><Settings2 className="size-4" /></button>
      </div>

      {showSet && (
        <div className="card mt-3 grid gap-3 p-4 text-sm sm:grid-cols-2">
          <label className="font-semibold text-muted">Giọng đọc
            <select className="input mt-1" value={set.accent} onChange={(e) => setSet({ ...set, accent: e.target.value as Accent })}><option value="en-GB">Anh – Anh</option><option value="en-US">Anh – Mỹ</option></select>
          </label>
          <label className="font-semibold text-muted">Tốc độ đọc: {set.rate.toFixed(2)}×
            <input type="range" min={0.6} max={1.2} step={0.05} value={set.rate} onChange={(e) => setSet({ ...set, rate: +e.target.value })} className="mt-3 w-full accent-brand-500" />
          </label>
          <label className="flex items-center gap-2"><input type="checkbox" className="size-4 accent-brand-500" checked={set.autoSpeak} onChange={(e) => setSet({ ...set, autoSpeak: e.target.checked })} />Tự đọc khi lật thẻ mới</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="size-4 accent-brand-500" checked={set.reverse} onChange={(e) => setSet({ ...set, reverse: e.target.checked })} />Đảo chiều: Việt → Anh</label>
        </div>
      )}

      <p className="mt-5 text-center text-xs font-semibold uppercase tracking-wider text-muted">{card.topic || title}</p>
      <div className={cn("flip mt-3", flipped && "on")}>
        <div className="flip-inner relative grid min-h-[320px] sm:min-h-[340px]">
          <button onClick={() => setFlipped(true)} className="flip-face card col-start-1 row-start-1 flex flex-col items-center justify-center p-8 text-center" aria-label="Lật thẻ" tabIndex={flipped ? -1 : 0}>
            <span className="title-display text-3xl sm:text-4xl text-balance">{front}</span>
            {!set.reverse && card.ipa && <span className="mt-3 text-muted">{card.ipa}</span>}
            <span className="mt-8 text-xs text-muted">Chạm hoặc nhấn <kbd className="rounded border border-line px-1.5">Space</kbd> để lật</span>
          </button>
          <div className="flip-face flip-back card col-start-1 row-start-1 flex flex-col items-center justify-center p-8 text-center" aria-hidden={!flipped}>
            <span className="title-display text-2xl sm:text-3xl text-balance">{card.c}</span>
            {card.ipa && <span className="mt-1 text-sm text-muted">{card.ipa}</span>}
            <span className="mt-4 text-lg font-semibold text-brand-700 dark:text-brand-300">{card.m}</span>
            {card.e && <p className="mt-4 max-w-md text-[15px] italic text-muted">“{card.e}”</p>}
            {card.e && <button onClick={() => say(card.e)} className="mt-3 text-xs font-semibold text-brand-600 dark:text-brand-300 hover:underline">▶ Nghe câu ví dụ</button>}
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <button onClick={() => say(card.c)} className="btn-ghost"><Volume2 className="size-4" />Nghe phát âm</button>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-3">
        {flipped ? GRADES.map((x) => (
          <button key={x.g} onClick={() => grade(x.g)} className={cn("btn flex-col gap-0 py-3 text-white active:translate-y-[2px] active:shadow-none", x.cls)}>
            <span>{x.label}</span><span className="text-[11px] font-medium opacity-85">{pv?.[x.g]}</span>
          </button>
        )) : <button onClick={() => setFlipped(true)} className="btn-primary col-span-4 py-3.5 text-base">Hiện đáp án</button>}
      </div>
      <p className="mt-4 hidden items-center justify-center gap-1.5 text-xs text-muted sm:flex"><Keyboard className="size-3.5" />Space: lật · 1–4: chấm · S: nghe</p>
    </div>
  );
}
