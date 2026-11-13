"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Pause, Play, RotateCcw, Send, XCircle } from "lucide-react";
import type { MockTest, TestQuestion } from "@/lib/content";
import bandsJson from "@/data/bands.json";
import { rawToBand } from "@/lib/analyze";
import { useStore } from "@/lib/storage";
import { logActivity } from "@/lib/progress";
import { logRecent } from "@/lib/recent";
import { speak, stopSpeaking } from "@/lib/tts";
import { cn } from "@/lib/cn";

interface Saved { a: Record<number, string>; start: number; done?: boolean; score?: number }
const norm = (s: string) => s.trim().toLowerCase().replace(/[.,]$/, "").replace(/\s+/g, " ");
const isRight = (q: TestQuestion, v?: string) => !!v && q.answer.map(norm).includes(norm(v));
const conv = bandsJson.conv as unknown as Record<"L" | "RA", [number, number][]>;

export function TestRunner({ t }: { t: MockTest }) {
  const [saved, setSaved, ok] = useStore<Saved | null>(`test:${t.slug}`, null);
  const [sec, setSec] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  // Đánh số câu liên tục toàn bài
  const flat = useMemo(() => {
    const out: { q: TestQuestion; sec: number; type: string; n: number }[] = [];
    t.sections.forEach((s, si) => s.groups.forEach((g) => g.questions.forEach((q) => out.push({ q, sec: si, type: g.type, n: out.length }))));
    return out;
  }, [t]);
  const total = flat.length;

  useEffect(() => { if (ok && !saved) setSaved({ a: {}, start: Date.now() }); }, [ok]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (saved?.done) return; const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, [saved?.done]);
  const timeUp = !!saved && !saved.done && now - saved.start >= t.minutes * 60_000;
  useEffect(() => { if (timeUp) submitRef.current?.(true); }, [timeUp]);
  const submitRef = useRef<((f?: boolean) => void) | null>(null);

  if (!ok || !saved) return <div className="card p-16 text-center text-muted">Đang tải đề…</div>;

  const a = saved.a;
  const left = Math.max(0, t.minutes * 60 - Math.floor((now - saved.start) / 1000));
  const answered = Object.values(a).filter((v) => v?.trim()).length;
  const setA = (n: number, v: string) => setSaved({ ...saved, a: { ...a, [n]: v } });

  const submit = (force = false) => {
    if (!force && answered < total && !confirm(`Bạn mới làm ${answered}/${total} câu. Nộp bài?`)) return;
    const score = flat.filter((x) => isRight(x.q, a[x.n])).length;
    setSaved({ ...saved, done: true, score });
    logActivity(total);
    logRecent({ key: `test:${t.slug}`, kind: "Đề thi", title: t.title, href: `/de-thi/${t.slug}`, done: total, total });
    stopSpeaking(); window.scrollTo({ top: 0, behavior: "smooth" });
  };
  submitRef.current = submit;

  if (saved.done) {
    const score = saved.score ?? 0;
    const band = rawToBand(conv[t.skill === "Listening" ? "L" : "RA"], Math.round((score / total) * 40));
    return (
      <div className="space-y-6">
        <div className="card grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="grid size-32 place-items-center rounded-2xl bg-brand-600 text-white"><div className="text-center"><p className="title-display text-5xl">{band.toFixed(1)}</p><p className="text-xs text-brand-100">band ước tính</p></div></div>
          <div>
            <h2 className="title-display text-2xl">Kết quả: {score}/{total} câu đúng</h2>
            <p className="mt-1 text-muted">Quy đổi tương đương {Math.round((score / total) * 40)}/40 câu theo thang {t.skill}. Xem giải thích từng câu bên dưới để rút kinh nghiệm.</p>
            <div className="mt-4 flex flex-wrap gap-2"><button className="btn-ghost" onClick={() => setSaved({ a: {}, start: Date.now() })}><RotateCcw className="size-4" />Làm lại</button><Link href="/de-thi" className="btn-primary">Đề khác</Link></div>
          </div>
        </div>
        {t.sections.map((s, si) => (
          <section key={si} className="card p-6">
            <h3 className="font-bold">{s.title}</h3>
            <ol className="mt-4 space-y-2">
              {flat.filter((x) => x.sec === si).map((x) => {
                const r = isRight(x.q, a[x.n]);
                return (
                  <li key={x.n} className={cn("rounded-xl border p-4 text-sm", r ? "border-brand-300 bg-brand-50/60 dark:bg-brand-900/20" : "border-rose-300 bg-rose-50/60 dark:bg-rose-900/10")}>
                    <p className="flex gap-2 font-medium">{r ? <CheckCircle2 className="size-4 shrink-0 text-brand-600 mt-0.5" /> : <XCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />}<span><b>{x.n + 1}.</b> {x.q.q}</span></p>
                    <p className="mt-2 pl-6">Bạn chọn: <b>{a[x.n] || "—"}</b> · Đáp án: <b className="text-brand-700 dark:text-brand-300">{x.q.answer[0].toUpperCase() === x.q.answer[0] ? x.q.answer[0] : x.q.answer.join(" / ")}</b></p>
                    <p className="mt-1 pl-6 text-muted">{x.q.why}</p>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    );
  }

  const s = t.sections[sec];
  return (
    <div className="pb-24">
      <div className="sticky top-16 z-30 -mx-4 mb-4 flex items-center gap-3 border-b border-line bg-surface/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border">
        <div className="min-w-0"><p className="truncate text-sm font-bold">{s.title}</p><p className="text-xs text-muted">Phần {sec + 1}/{t.sections.length} · đã làm {answered}/{total}</p></div>
        <span className={cn("ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono font-bold tabular-nums", left < 120 ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200" : "bg-surface-2")}><Clock className="size-4" />{String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}</span>
        <button onClick={() => submit()} className="btn-primary whitespace-nowrap py-2"><Send className="size-4" />Nộp bài</button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-6 lg:sticky lg:top-36 lg:max-h-[calc(100dvh-10rem)] lg:self-start lg:overflow-auto">
          {s.script ? <ScriptPlayer key={sec} script={s.script} /> : (
            <>
              <h2 className="title-display text-xl">{s.title}</h2>
              {s.paras!.map((p, k) => { const m = p.match(/^([A-H]) (.*)$/); return <p key={k} className="mt-3 text-[15px] leading-7">{m ? <><b className="mr-1 text-brand-600 dark:text-brand-300">{m[1]}</b>{m[2]}</> : p}</p>; })}
            </>
          )}
        </div>
        <div className="space-y-5">
          {s.groups.map((g, gi) => (
            <div key={gi} className="card p-5">
              <p className="rounded-lg bg-surface-2 px-3 py-2 text-sm font-semibold">{g.instruction}</p>
              <ol className="mt-4 space-y-4">
                {g.questions.map((q) => {
                  const n = flat.find((x) => x.q === q)!.n;
                  return (
                    <li key={n} id={`q${n + 1}`} className="scroll-mt-40">
                      <p className="text-[15px]"><b className="mr-1.5 inline-grid size-6 place-items-center rounded-md bg-brand-500 text-xs text-white">{n + 1}</b>{g.type === "gap" ? q.q.split("___")[0] : q.q}</p>
                      <div className="mt-2 pl-8">
                        {g.type === "tfng" && <div className="flex flex-wrap gap-1.5">{["TRUE", "FALSE", "NOT GIVEN"].map((o) => <button key={o} onClick={() => setA(n, o)} aria-pressed={a[n] === o} className={cn("chip px-3 py-1.5", a[n] === o && "chip-on")}>{o}</button>)}</div>}
                        {g.type === "mcq" && <div className="space-y-1.5">{q.options!.map((o) => { const v = o.split(" ")[0]; return (
                          <label key={o} className={cn("flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm", a[n] === v ? "border-brand-500 bg-brand-50 dark:bg-brand-900/30" : "border-line hover:bg-surface-2")}>
                            <input type="radio" name={`q${n}`} checked={a[n] === v} onChange={() => setA(n, v)} className="mt-0.5 accent-brand-500" />{o}
                          </label>); })}</div>}
                        {g.type === "gap" && <label className="flex flex-wrap items-center gap-2 text-[15px]"><input value={a[n] || ""} onChange={(e) => setA(n, e.target.value)} className="input w-48 py-1.5" aria-label={`Câu ${n + 1}`} autoComplete="off" spellCheck={false} />{q.q.split("___")[1]}</label>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-[calc(56px+env(safe-area-inset-bottom))] z-30 border-t border-line bg-surface/95 backdrop-blur md:bottom-0" aria-label="Danh sách câu hỏi">
        <div className="container-x flex items-center gap-3 overflow-x-auto py-2.5">
          {t.sections.map((ss, si) => (
            <div key={si} className="flex shrink-0 items-center gap-1.5">
              <button onClick={() => setSec(si)} className={cn("rounded-md px-2 py-1 text-xs font-bold", si === sec ? "bg-ink text-page" : "text-muted hover:bg-surface-2")}>Phần {si + 1}</button>
              {flat.filter((x) => x.sec === si).map((x) => (
                <a key={x.n} href={`#q${x.n + 1}`} onClick={() => setSec(si)} className={cn("grid size-7 place-items-center rounded-md border text-xs font-semibold", a[x.n]?.trim() ? "border-brand-500 bg-brand-500 text-white" : "border-line")}>{x.n + 1}</a>
              ))}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}

function ScriptPlayer({ script }: { script: [string, string][] }) {
  const [on, setOn] = useState(false);
  const [line, setLine] = useState(-1);
  useEffect(() => () => { stopSpeaking(); }, []);
  const play = () => {
    if (on) { stopSpeaking(); setOn(false); return; }
    setOn(true); let i = 0;
    const next = () => { if (i >= script.length) { setOn(false); setLine(-1); return; } const [w, l] = script[i]; setLine(i); i++; speak(l, { accent: w === "A" ? "en-GB" : "en-US", rate: 0.92, onend: () => setTimeout(next, 400) }); };
    next();
  };
  return (
    <div>
      <h2 className="title-display text-xl">Audio</h2>
      <p className="mt-1 text-sm text-muted">Trong phòng thi bạn chỉ được nghe một lần. Hãy đọc câu hỏi trước khi bấm nghe.</p>
      <div className="mt-5 flex items-center gap-4 rounded-2xl bg-surface-2 p-4">
        <button onClick={play} className="grid size-14 shrink-0 place-items-center rounded-full bg-brand-500 text-white hover:bg-brand-600" aria-label={on ? "Dừng" : "Phát audio"}>{on ? <Pause className="size-6" fill="currentColor" /> : <Play className="size-6 translate-x-0.5" fill="currentColor" />}</button>
        <div className="flex-1"><div className="h-2 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${line < 0 ? 0 : ((line + 1) / script.length) * 100}%` }} /></div><p className="mt-1.5 text-xs text-muted">{on ? `Đang phát đoạn ${line + 1}/${script.length}` : "Sẵn sàng"}</p></div>
      </div>
    </div>
  );
}
