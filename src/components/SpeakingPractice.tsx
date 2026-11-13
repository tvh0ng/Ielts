"use client";
import { useEffect, useRef, useState } from "react";
import { BookText, ChevronRight, Loader2, Mic, Sparkles, Square, Timer, Volume2, Wand2 } from "lucide-react";
import speaking from "@/data/speaking.json";
import type { CueCard, SpeakingQA } from "@/lib/types";
import { analyzeSpeaking, type Feedback } from "@/lib/analyze";
import { callAi, useAiEnabled } from "@/lib/ai-client";
import { logActivity } from "@/lib/progress";
import { speak } from "@/lib/tts";
import { FeedbackView } from "./FeedbackView";
import { cn } from "@/lib/cn";

type Part = 1 | 2 | 3;
const P1 = speaking.p1 as SpeakingQA[], P2 = speaking.p2 as CueCard[], P3 = speaking.p3 as SpeakingQA[];
const LEN: Record<Part, number> = { 1: P1.length, 2: P2.length, 3: P3.length };

/* eslint-disable @typescript-eslint/no-explicit-any */
type SR = any;

export function SpeakingPractice() {
  const ai = useAiEnabled();
  const [part, setPart] = useState<Part>(1);
  const [idx, setIdx] = useState(0);
  const [rec, setRec] = useState(false);
  const [secs, setSecs] = useState(0);
  const [prep, setPrep] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [audio, setAudio] = useState<string | null>(null);
  const [fb, setFb] = useState<Feedback | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const mr = useRef<MediaRecorder | null>(null);
  const sr = useRef<SR>(null);
  const t0 = useRef(0);
  const dur = useRef(0);

  const q = part === 1 ? P1[idx] : part === 3 ? P3[idx] : null;
  const card = part === 2 ? P2[idx] : null;
  const qText = card ? `${card.title} You should say: ${card.bullets.join("; ")}.` : q!.q;

  useEffect(() => { if (!rec) return; const id = setInterval(() => setSecs(Math.round((Date.now() - t0.current) / 1000)), 300); return () => clearInterval(id); }, [rec]);
  useEffect(() => { if (prep == null) return; if (prep <= 0) { setPrep(null); start(); return; } const id = setTimeout(() => setPrep((p) => (p == null ? null : p - 1)), 1000); return () => clearTimeout(id); }, [prep]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => { setText(""); setAudio(null); setFb(null); setSecs(0); setErr(""); };
  const pick = (p: Part, i: number) => { stop(); setPart(p); setIdx(i % LEN[p]); setPrep(null); reset(); };

  async function start() {
    reset();
    let stream: MediaStream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch { setErr("Không truy cập được micro. Bạn vẫn có thể gõ câu trả lời vào ô bên dưới để được chấm."); return; }
    const chunks: Blob[] = [];
    try {
      const m = new MediaRecorder(stream); mr.current = m;
      m.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      m.onstop = () => { setAudio(URL.createObjectURL(new Blob(chunks, { type: chunks[0]?.type || "audio/webm" }))); stream.getTracks().forEach((t) => t.stop()); };
      m.start();
    } catch { stream.getTracks().forEach((t) => t.stop()); }
    const SRC = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SRC) {
      const r: SR = new SRC(); sr.current = r;
      r.lang = "en-GB"; r.continuous = true; r.interimResults = true;
      let fin = "";
      r.onresult = (ev: any) => { let inter = ""; for (let i = ev.resultIndex; i < ev.results.length; i++) { const x = ev.results[i]; if (x.isFinal) fin += x[0].transcript + " "; else inter += x[0].transcript; } setText((fin + inter).trim()); };
      r.onend = () => { if (sr.current === r) try { r.start(); } catch { /* */ } };
      try { r.start(); } catch { /* */ }
    } else setErr("Trình duyệt chưa hỗ trợ chuyển giọng nói thành chữ (nên dùng Chrome/Edge). Hãy gõ lại câu trả lời để được chấm.");
    t0.current = Date.now(); setRec(true);
  }
  function stop() {
    if (!rec && !mr.current) return;
    dur.current = (Date.now() - t0.current) / 1000; setRec(false);
    const r = sr.current; sr.current = null; try { r?.stop(); } catch { /* */ }
    try { if (mr.current?.state !== "inactive") mr.current?.stop(); } catch { /* */ }
    mr.current = null; logActivity(3);
  }

  const grade = async () => {
    if (!text.trim()) return;
    setBusy(true);
    const off = analyzeSpeaking(text, dur.current || secs, part);
    if (!ai) { setFb({ ...off, note: "Đang dùng đánh giá nhanh offline. Bật AI để có điểm 4 tiêu chí và câu trả lời gợi ý." }); setBusy(false); return; }
    try {
      const r = await callAi<{ json: { bands: Record<string, number>; summary: string; tips: string[]; better: string } }>({ kind: "grade-speaking", part, prompt: qText, text });
      setFb({ source: "ai", bands: r.json.bands, summary: r.json.summary, tips: r.json.tips, model: r.json.better, advisory: off.advisory });
    } catch (e) { setFb({ ...off, note: `${(e as Error).message} — hiển thị đánh giá offline.` }); }
    finally { setBusy(false); }
  };
  const sample = async () => {
    const built = card ? card.model : q!.a;
    if (!ai) { setFb({ source: "offline", model: built }); return; }
    setBusy(true);
    try { const r = await callAi<{ text: string }>({ kind: "model-speaking", part, prompt: qText }); setFb({ source: "ai", model: r.text }); }
    catch { setFb({ source: "offline", model: built }); }
    finally { setBusy(false); }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-line bg-surface p-1">
            {([1, 2, 3] as Part[]).map((p) => <button key={p} onClick={() => pick(p, 0)} aria-pressed={part === p} className={cn("btn py-1.5", part === p ? "bg-brand-500 text-white" : "text-muted")}>Part {p}</button>)}
          </div>
          <span className="text-sm text-muted">Câu {idx + 1}/{LEN[part]}</span>
          <button onClick={() => pick(part, idx + 1)} className="btn-ghost ml-auto py-2">Câu tiếp <ChevronRight className="size-4" /></button>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Part {part}{part === 2 ? " · Cue card" : ""}</p>
              <p className="title-display mt-2 text-xl sm:text-2xl">{card ? card.title : q!.q}</p>
              {card && <><p className="mt-3 text-sm font-semibold">You should say:</p><ul className="mt-1 list-disc pl-5 text-[15px]">{card.bullets.map((b) => <li key={b}>{b}</li>)}</ul></>}
            </div>
            <button onClick={() => speak(card ? card.title : q!.q)} className="grid size-10 shrink-0 place-items-center rounded-xl border border-line text-muted hover:text-ink" aria-label="Nghe câu hỏi"><Volume2 className="size-4" /></button>
          </div>

          <div className="mt-6 flex flex-col items-center gap-3">
            {prep != null ? (
              <><div className="title-display text-4xl tabular-nums text-accent-500">{prep}s</div><p className="text-sm text-muted">Thời gian chuẩn bị — ghi chú ý chính. Sẽ tự thu âm khi hết giờ.</p>
                <button className="btn-ghost" onClick={() => setPrep(0)}>Bắt đầu nói ngay</button></>
            ) : (
              <>
                <button onClick={rec ? stop : start} className={cn("grid size-20 place-items-center rounded-full text-white shadow-lg transition", rec ? "bg-rose-500 animate-pulse" : "bg-brand-500 hover:bg-brand-600")} aria-label={rec ? "Dừng thu âm" : "Bắt đầu thu âm"}>
                  {rec ? <Square className="size-7" fill="currentColor" /> : <Mic className="size-8" />}
                </button>
                <p className="font-mono text-lg tabular-nums">{String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}</p>
                <p className="text-sm text-muted">{rec ? "Đang thu… bấm để dừng" : part === 2 ? "Part 2: nói 1–2 phút" : "Bấm để trả lời"}</p>
                {part === 2 && !rec && <button className="btn-ghost py-2" onClick={() => { reset(); setPrep(60); }}><Timer className="size-4" />1 phút chuẩn bị</button>}
              </>
            )}
            {audio && <audio controls src={audio} className="w-full max-w-md" />}
          </div>
        </div>

        <div className="card overflow-hidden">
          <label htmlFor="transcript" className="block border-b border-line px-5 py-3 text-sm font-semibold">Bản ghi lời nói <span className="font-normal text-muted">(tự điền khi thu âm, có thể sửa/gõ tay)</span></label>
          <textarea id="transcript" value={text} onChange={(e) => setText(e.target.value)} className="block min-h-36 w-full resize-y bg-transparent p-5 text-[15px] leading-7 outline-none" placeholder="Your answer will appear here…" />
          {err && <p className="px-5 pb-3 text-sm text-accent-600 dark:text-accent-400">{err}</p>}
          <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-3">
            <button onClick={sample} disabled={busy} className="btn-ghost py-2"><BookText className="size-4" />Câu trả lời mẫu</button>
            <button onClick={grade} disabled={busy || !text.trim() || rec} className="btn-primary py-2">{busy ? <Loader2 className="size-4 animate-spin" /> : ai ? <Sparkles className="size-4" /> : <Wand2 className="size-4" />}{ai ? "Chấm bằng AI" : "Đánh giá nhanh"}</button>
          </div>
        </div>
      </div>
      <aside className="card p-5 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100dvh-6rem)] lg:overflow-auto">
        <h2 className="title-display text-lg">Phản hồi</h2>
        <div className="mt-4">
          {busy ? <p className="flex items-center gap-2 text-muted"><Loader2 className="size-4 animate-spin" />Đang xử lý…</p>
            : fb ? <FeedbackView fb={fb} modelTitle="Câu trả lời mẫu" />
            : <p className="text-sm text-muted">Thu âm câu trả lời rồi bấm chấm để xem tốc độ nói, từ đệm, độ đa dạng từ vựng{ai ? " và điểm 4 tiêu chí từ AI" : ""}.</p>}
        </div>
      </aside>
    </div>
  );
}
