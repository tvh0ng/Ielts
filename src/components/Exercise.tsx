"use client";
import { useState } from "react";
import { CheckCircle2, Pause, Play, RotateCcw, XCircle } from "lucide-react";
import { EXERCISES, type GapEx, type HeadEx, type ListenEx, type TfngEx } from "@/lib/exercises";
import { logActivity } from "@/lib/progress";
import { speak, stopSpeaking } from "@/lib/tts";
import { cn } from "@/lib/cn";

type Key = keyof typeof EXERCISES;
const norm = (s: string) => s.trim().toLowerCase().replace(/[.,]$/, "").replace(/\s+/g, " ");

export function Exercise({ k }: { k: Key }) {
  const [ans, setAns] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const data = EXERCISES[k];

  let items: { q: React.ReactNode; correct: boolean; key: string; why: string; input: React.ReactNode }[] = [];
  const set = (i: number, v: string) => setAns((a) => ({ ...a, [i]: v }));

  if (k === "tfng") {
    const d = data as TfngEx;
    items = d.qs.map(([q, key, why], i) => ({
      q, key, why, correct: ans[i] === key,
      input: <div className="flex flex-wrap gap-1.5">{["TRUE", "FALSE", "NOT GIVEN"].map((o) => (
        <button key={o} disabled={checked} onClick={() => set(i, o)} aria-pressed={ans[i] === o} className={cn("chip px-3 py-1.5", ans[i] === o && "chip-on")}>{o}</button>
      ))}</div>,
    }));
  } else if (k === "headings") {
    const d = data as HeadEx;
    items = d.paras.map(([p, txt, key, why], i) => ({
      q: <><b>Đoạn {p}.</b> {txt}</>, key, why, correct: ans[i] === key,
      input: <select disabled={checked} className="input max-w-sm" value={ans[i] || ""} onChange={(e) => set(i, e.target.value)} aria-label={`Tiêu đề cho đoạn ${p}`}>
        <option value="">— Chọn tiêu đề —</option>{d.heads.map((h) => <option key={h} value={h.split(".")[0]}>{h}</option>)}
      </select>,
    }));
  } else {
    const d = data as GapEx;
    items = d.qs.map(([pre, post, keys, why], i) => ({
      q: null, key: keys[0], why, correct: keys.map(norm).includes(norm(ans[i] || "")),
      input: <label className="flex flex-wrap items-center gap-2 text-[15px]"><span>{pre}</span>
        <input disabled={checked} className="input w-44 py-1.5" value={ans[i] || ""} onChange={(e) => set(i, e.target.value)} aria-label={`Câu ${i + 1}`} /><span>{post}</span></label>,
    }));
  }

  const score = items.filter((x) => x.correct).length;
  const check = () => { setChecked(true); logActivity(items.length); };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card p-6 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100dvh-6rem)] lg:overflow-auto">
        {k === "tfng" && <><h2 className="title-display text-lg">Bài đọc</h2>{(data as TfngEx).passage.map((p, i) => <p key={i} className="mt-3 text-[15px] leading-7">{p}</p>)}</>}
        {k === "headings" && <><h2 className="title-display text-lg">Danh sách tiêu đề</h2><ul className="mt-3 space-y-2">{(data as HeadEx).heads.map((h) => <li key={h} className="rounded-lg bg-surface-2 px-3 py-2 text-sm">{h}</li>)}</ul></>}
        {k === "gap" && <><h2 className="title-display text-lg">Hướng dẫn</h2><p className="mt-2 text-sm text-muted">{(data as GapEx).note}</p>{EXERCISES.tfng.passage.map((p, i) => <p key={i} className="mt-3 text-[15px] leading-7">{p}</p>)}</>}
        {k === "listen" && <ListenPlayer d={data as ListenEx} reveal={checked} />}
      </div>
      <div>
        <ol className="space-y-3">
          {items.map((it, i) => (
            <li key={i} className={cn("card p-5", checked && (it.correct ? "border-brand-400" : "border-rose-400"))}>
              <div className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-2 text-sm font-bold">{i + 1}</span>
                <div className="flex-1 space-y-3">
                  {it.q && <p className="text-[15px]">{it.q}</p>}
                  {it.input}
                  {checked && (
                    <p className={cn("flex gap-2 rounded-lg px-3 py-2 text-sm", it.correct ? "bg-brand-50 dark:bg-brand-900/30" : "bg-rose-50 dark:bg-rose-900/20")}>
                      {it.correct ? <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-brand-600" /> : <XCircle className="size-4 shrink-0 mt-0.5 text-rose-600" />}
                      <span>{!it.correct && <><b>Đáp án: {it.key}.</b> </>}{it.why}</span>
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className="card mt-4 flex flex-wrap items-center justify-between gap-3 p-4">
          {checked ? <p className="font-bold">Kết quả: <span className="text-brand-600 dark:text-brand-300">{score}/{items.length}</span> {score === items.length ? "🎉" : ""}</p> : <p className="text-sm text-muted">Đã làm {Object.values(ans).filter(Boolean).length}/{items.length} câu</p>}
          {checked ? <button className="btn-ghost" onClick={() => { setAns({}); setChecked(false); }}><RotateCcw className="size-4" />Làm lại</button>
            : <button className="btn-primary" onClick={check}>Nộp bài</button>}
        </div>
      </div>
    </div>
  );
}

function ListenPlayer({ d, reveal }: { d: ListenEx; reveal: boolean }) {
  const [playing, setPlaying] = useState(false);
  const play = () => {
    if (playing) { stopSpeaking(); setPlaying(false); return; }
    setPlaying(true);
    let i = 0;
    const next = () => {
      if (i >= d.script.length) { setPlaying(false); return; }
      const [who, line] = d.script[i++];
      speak(line, { accent: who === "A" ? "en-GB" : "en-US", rate: 0.92, onend: () => setTimeout(next, 350) });
    };
    next();
  };
  return (
    <>
      <h2 className="title-display text-lg">Nghe hội thoại</h2>
      <p className="mt-2 text-sm text-muted">{d.note}</p>
      <button onClick={play} className="btn-accent mt-4">{playing ? <><Pause className="size-4" />Dừng</> : <><Play className="size-4" />Nghe</>}</button>
      {reveal && <div className="mt-5 space-y-2 text-sm"><p className="eyebrow">Transcript</p>{d.script.map(([w, l], i) => <p key={i}><b className="text-brand-600 dark:text-brand-300">{w}:</b> {l}</p>)}</div>}
    </>
  );
}
