"use client";
import { Check } from "lucide-react";
import { useStore } from "@/lib/storage";
import { logActivity } from "@/lib/progress";

export function Checklist({ id, items }: { id: string; items: string[] }) {
  const [ck, setCk, ok] = useStore<Record<string, boolean>>("road-ck", {});
  const done = ok ? items.filter((_, i) => ck[`${id}:${i}`]).length : 0;
  const pct = Math.round((done / items.length) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-sm"><span className="font-semibold">{done}/{items.length} hoàn thành</span><span className="text-muted tabular-nums">{pct}%</span></div>
      <div className="mt-2 h-2 rounded-full bg-surface-2 overflow-hidden"><div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} /></div>
      <ul className="mt-4 space-y-2">
        {items.map((t, i) => {
          const k = `${id}:${i}`; const on = ok && !!ck[k];
          return (
            <li key={k}>
              <button onClick={() => { setCk({ ...ck, [k]: !on }); if (!on) logActivity(); }} aria-pressed={on}
                className={`flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left text-sm transition ${on ? "border-brand-300 bg-brand-50 dark:bg-brand-900/30" : "border-line bg-surface hover:bg-surface-2"}`}>
                <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-2 ${on ? "border-brand-500 bg-brand-500 text-white" : "border-line"}`}>{on && <Check className="size-3.5" strokeWidth={3} />}</span>
                <span className={on ? "line-through decoration-brand-500/50 text-muted" : ""}>{t}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
