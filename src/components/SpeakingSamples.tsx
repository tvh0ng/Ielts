"use client";
import { useState } from "react";
import { ChevronDown, Volume2 } from "lucide-react";
import type { CueCard, SpeakingQA } from "@/lib/types";
import { speak } from "@/lib/tts";
import { cn } from "@/lib/cn";

export function SpeakingSamples({ p1, p2, p3 }: { p1: SpeakingQA[]; p2: CueCard[]; p3: SpeakingQA[] }) {
  const [part, setPart] = useState<1 | 2 | 3>(1);
  const items = part === 1 ? p1.map((x) => ({ q: x.q, a: x.a, b: [] as string[] })) : part === 3 ? p3.map((x) => ({ q: x.q, a: x.a, b: [] as string[] })) : p2.map((x) => ({ q: x.title, a: x.model, b: x.bullets }));
  return (
    <>
      <div className="inline-flex rounded-xl border border-line bg-surface p-1">{([1, 2, 3] as const).map((p) => <button key={p} onClick={() => setPart(p)} aria-pressed={part === p} className={cn("btn py-1.5", part === p ? "bg-brand-500 text-white" : "text-muted")}>Part {p}</button>)}</div>
      <div className="mt-6 space-y-3">
        {items.map((x, i) => (
          <details key={part + "-" + i} className="card group p-5 [&_summary::-webkit-details-marker]:hidden" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-start gap-3 font-semibold"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-surface-2 text-sm">{i + 1}</span><span className="flex-1">{x.q}{x.b.length > 0 && <span className="mt-1 block text-sm font-normal text-muted">You should say: {x.b.join("; ")}</span>}</span><ChevronDown className="size-5 shrink-0 text-muted transition group-open:rotate-180" /></summary>
            <div className="mt-4 pl-10">
              <p className="text-[15px] leading-7">{x.a}</p>
              <button onClick={() => speak(x.a, { rate: 0.95 })} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-300 hover:underline"><Volume2 className="size-4" />Nghe đọc mẫu</button>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
