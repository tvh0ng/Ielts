"use client";
import { useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import type { QuizQ } from "@/lib/courses";
import { cn } from "@/lib/cn";

export function LessonQuiz({ qs, onPass }: { qs: QuizQ[]; onPass?: () => void }) {
  const [a, setA] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const score = qs.filter((q, i) => a[i] === q.answer).length;
  return (
    <div className="space-y-4">
      {qs.map((q, i) => (
        <div key={i}>
          <p className="font-semibold">{i + 1}. {q.q}</p>
          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {q.options.map((o, k) => {
              const sel = a[i] === k; const right = checked && k === q.answer; const wrong = checked && sel && k !== q.answer;
              return <button key={k} disabled={checked} onClick={() => setA({ ...a, [i]: k })} className={cn("rounded-lg border px-3 py-2 text-left text-sm transition", right ? "border-brand-500 bg-brand-50 dark:bg-brand-900/30" : wrong ? "border-rose-400 bg-rose-50 dark:bg-rose-900/20" : sel ? "border-brand-500" : "border-line hover:bg-surface-2")}>{o}</button>;
            })}
          </div>
          {checked && <p className={cn("mt-2 flex gap-2 text-sm", a[i] === q.answer ? "text-brand-700 dark:text-brand-300" : "text-rose-600")}>{a[i] === q.answer ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> : <XCircle className="mt-0.5 size-4 shrink-0" />}<span className="text-ink">{q.why}</span></p>}
        </div>
      ))}
      <div className="flex items-center gap-3">
        {checked ? <><b>{score}/{qs.length} câu đúng</b><button onClick={() => { setA({}); setChecked(false); }} className="btn-ghost py-1.5 text-sm"><RotateCcw className="size-4" />Làm lại</button></>
          : <button onClick={() => { setChecked(true); if (qs.every((q, i) => a[i] === q.answer)) onPass?.(); }} disabled={Object.keys(a).length < qs.length} className="btn-primary py-2">Kiểm tra</button>}
      </div>
    </div>
  );
}
