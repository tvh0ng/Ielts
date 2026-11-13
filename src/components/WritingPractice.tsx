"use client";
import { useEffect, useRef, useState } from "react";
import { BookText, Dices, Loader2, Pause, Play, RotateCcw, Sparkles, Wand2 } from "lucide-react";
import writing from "@/data/writing.json";
import samplesJson from "@/data/samples.json";
import { analyzeWriting, type Feedback } from "@/lib/analyze";
import { callAi, useAiEnabled } from "@/lib/ai-client";
import { useStore } from "@/lib/storage";
import { logActivity } from "@/lib/progress";
import { FeedbackView } from "./FeedbackView";
import { cn } from "@/lib/cn";

type Task = 1 | 2;
const BANK: Record<Task, string[]> = { 1: writing.t1, 2: writing.t2 };
const MODELS = writing.models as Record<string, string>;
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export function WritingPractice() {
  const ai = useAiEnabled();
  const [task, setTask] = useStore<Task>("w-task", 2);
  const [prompt, setPrompt] = useStore<string>("w-prompt", "");
  const [essay, setEssay, ok] = useStore<string>("w-essay", "");
  const [fb, setFb] = useState<Feedback | null>(null);
  const [busy, setBusy] = useState(false);
  const [secs, setSecs] = useState(task === 1 ? 1200 : 2400);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const target = task === 1 ? 150 : 250;
  const wc = (essay.match(/[A-Za-z0-9'’]+/g) || []).length;

  useEffect(() => {
    if (!ok) return;
    const mau = new URLSearchParams(window.location.search).get("mau");
    const s = (samplesJson as { slug: string; task: Task; prompt: string }[]).find((x) => x.slug === mau);
    if (s) { setTask(s.task); setPrompt(s.prompt); setSecs(s.task === 1 ? 1200 : 2400); if (prompt !== s.prompt) setEssay(""); return; }
    if (!prompt) setPrompt(BANK[task][0]);
  }, [ok]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => setSecs((s) => { if (s <= 1) { setRunning(false); return 0; } return s - 1; }), 1000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [running]);

  const switchTask = (t: Task) => { setTask(t); setPrompt(BANK[t][Math.floor(Math.random() * BANK[t].length)]); setSecs(t === 1 ? 1200 : 2400); setRunning(false); setFb(null); };
  const random = () => { const b = BANK[task]; let p = prompt; while (b.length > 1 && p === prompt) p = b[Math.floor(Math.random() * b.length)]; setPrompt(p); setSecs(task === 1 ? 1200 : 2400); setRunning(false); setFb(null); };

  const grade = async () => {
    if (!essay.trim()) return;
    setBusy(true); setRunning(false); logActivity(5);
    const offline = analyzeWriting(essay, task);
    if (!ai) { setFb({ ...offline, note: "Đang dùng chấm nhanh offline. Bật AI bằng cách cấu hình ANTHROPIC_API_KEY trên server." }); setBusy(false); return; }
    try {
      const r = await callAi<{ json: { bands: Record<string, number>; summary: string; errors: { original: string; suggestion: string; explanation: string }[] } }>({ kind: "grade-writing", task, prompt, text: essay });
      setFb({ source: "ai", bands: r.json.bands, summary: r.json.summary, issues: (r.json.errors || []).filter((e) => essay.includes(e.original)), advisory: offline.advisory });
    } catch (e) {
      setFb({ ...offline, note: `${(e as Error).message} — hiển thị chấm nhanh offline.` });
    } finally { setBusy(false); }
  };
  const model = async () => {
    setBusy(true);
    if (!ai) { setFb({ source: "offline", model: MODELS[String(task)], note: "Khung bài offline. Bật AI để tạo bài mẫu band 9 cho đúng đề." }); setBusy(false); return; }
    try { const r = await callAi<{ text: string }>({ kind: "model-writing", task, prompt }); setFb({ source: "ai", model: r.text }); }
    catch (e) { setFb({ source: "offline", model: MODELS[String(task)], note: (e as Error).message }); }
    finally { setBusy(false); }
  };
  const fix = (i: number) => {
    if (!fb?.issues) return; const it = fb.issues[i];
    setEssay(essay.replace(it.original, it.suggestion));
    setFb({ ...fb, issues: fb.issues.map((x, j) => (j === i ? { ...x, done: true } : x)) });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-line bg-surface p-1">
            {([1, 2] as Task[]).map((t) => <button key={t} onClick={() => switchTask(t)} aria-pressed={task === t} className={cn("btn py-1.5", task === t ? "bg-brand-500 text-white" : "text-muted")}>Task {t}</button>)}
          </div>
          <button onClick={random} className="btn-ghost py-2"><Dices className="size-4" />Đề ngẫu nhiên</button>
          <div className={cn("ml-auto flex items-center gap-1 rounded-xl border border-line bg-surface px-2 py-1 font-mono text-lg tabular-nums", secs < 300 && "text-rose-600")}>
            {fmt(secs)}
            <button onClick={() => setRunning((r) => !r)} className="grid size-8 place-items-center rounded-lg hover:bg-surface-2" aria-label={running ? "Tạm dừng" : "Bắt đầu bấm giờ"}>{running ? <Pause className="size-4" /> : <Play className="size-4" />}</button>
            <button onClick={() => { setRunning(false); setSecs(task === 1 ? 1200 : 2400); }} className="grid size-8 place-items-center rounded-lg hover:bg-surface-2" aria-label="Đặt lại giờ"><RotateCcw className="size-4" /></button>
          </div>
        </div>
        <div className="card p-5"><p className="eyebrow">Đề bài · Task {task}</p><p className="mt-2 whitespace-pre-wrap text-[15px] leading-7">{prompt}</p></div>
        <div className="card overflow-hidden">
          <textarea value={essay} onChange={(e) => { setEssay(e.target.value); if (!running && secs === (task === 1 ? 1200 : 2400) && e.target.value.length === 1) setRunning(true); }}
            placeholder="Bắt đầu viết bài của bạn ở đây… (đồng hồ tự chạy khi bạn gõ chữ đầu tiên)" spellCheck={false}
            className="block min-h-[420px] w-full resize-y bg-transparent p-5 text-[15px] leading-7 outline-none" aria-label="Bài viết" />
          <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-3">
            <span className={cn("text-sm font-semibold tabular-nums", wc >= target ? "text-brand-600 dark:text-brand-300" : "text-muted")}>{wc} / {target} từ</span>
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.min(100, (wc / target) * 100)}%` }} /></div>
            <div className="ml-auto flex flex-wrap gap-2">
              <button onClick={model} disabled={busy} className="btn-ghost py-2"><BookText className="size-4" />Bài mẫu</button>
              <button onClick={grade} disabled={busy || !essay.trim()} className="btn-primary py-2">{busy ? <Loader2 className="size-4 animate-spin" /> : ai ? <Sparkles className="size-4" /> : <Wand2 className="size-4" />}{ai ? "Chấm bằng AI" : "Chấm nhanh"}</button>
            </div>
          </div>
        </div>
      </div>
      <aside className="card p-5 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100dvh-6rem)] lg:overflow-auto">
        <h2 className="title-display text-lg flex items-center gap-2">Phản hồi {ai && <span className="chip text-brand-600"><Sparkles className="size-3" />AI</span>}</h2>
        <div className="mt-4">
          {busy ? <p className="flex items-center gap-2 text-muted"><Loader2 className="size-4 animate-spin" />Đang xử lý…</p>
            : fb ? <FeedbackView fb={fb} onFix={fix} />
            : <div className="text-sm text-muted space-y-2"><p>Viết xong bấm <b>{ai ? "Chấm bằng AI" : "Chấm nhanh"}</b> để nhận điểm 4 tiêu chí và danh sách lỗi.</p><p>Bài viết được tự lưu trên trình duyệt.</p></div>}
        </div>
      </aside>
    </div>
  );
}
