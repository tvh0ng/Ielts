import type { Feedback } from "@/lib/analyze";
import { cn } from "@/lib/cn";

const LABEL: Record<string, string> = { ta: "Task", cc: "Coherence", lr: "Lexical", gra: "Grammar", fc: "Fluency", overall: "Overall" };

export function FeedbackView({ fb, onFix, modelTitle = "Bài mẫu" }: { fb: Feedback; onFix?: (i: number) => void; modelTitle?: string }) {
  return (
    <div className="space-y-5" aria-live="polite">
      {fb.bands && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {Object.entries(fb.bands).map(([k, v]) => (
            <div key={k} className={cn("rounded-xl p-3 text-center", k === "overall" ? "bg-brand-500 text-white" : "bg-surface-2")}>
              <p className="title-display text-2xl tabular-nums">{Number(v).toFixed(1)}</p>
              <p className={cn("text-[11px] font-semibold", k === "overall" ? "text-brand-50" : "text-muted")}>{LABEL[k] || k}</p>
            </div>
          ))}
        </div>
      )}
      {fb.band != null && !fb.bands && (
        <div className="rounded-xl bg-surface-2 p-4 text-center">
          <p className="title-display text-3xl">~ {fb.band.toFixed(1)}</p>
          <p className="text-xs text-muted">Ước lượng nhanh theo quy tắc (offline) · chỉ để tham khảo</p>
        </div>
      )}
      {fb.summary && <p className="text-[15px] leading-relaxed">{fb.summary}</p>}
      {!!fb.advisory?.length && (
        <div><h3 className="font-bold">Nhận xét</h3><ul className="mt-2 space-y-1.5 text-sm">{fb.advisory.map((a, i) => <li key={i} className="rounded-lg bg-surface-2 px-3 py-2">{a}</li>)}</ul></div>
      )}
      {!!fb.issues?.length && (
        <div>
          <h3 className="font-bold">Lỗi & gợi ý sửa</h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            {fb.issues.map((it, i) => (
              <li key={i} className={cn("flex flex-wrap items-center gap-2 rounded-lg border border-line px-3 py-2", it.done && "opacity-50")}>
                <span className="rounded bg-rose-100 px-1.5 text-rose-700 line-through dark:bg-rose-900/40 dark:text-rose-200">{it.original}</span>→
                <span className="rounded bg-brand-100 px-1.5 font-semibold text-brand-800 dark:bg-brand-900/50 dark:text-brand-200">{it.suggestion}</span>
                <span className="text-muted">{it.explanation}</span>
                {onFix && !it.done && <button onClick={() => onFix(i)} className="ml-auto rounded-md bg-brand-500 px-2.5 py-1 text-xs font-bold text-white hover:bg-brand-600">Sửa</button>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!fb.tips?.length && <div><h3 className="font-bold">Gợi ý cải thiện</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{fb.tips.map((t, i) => <li key={i}>{t}</li>)}</ul></div>}
      {fb.model && <div><h3 className="font-bold">{modelTitle}</h3><div className="mt-2 whitespace-pre-wrap rounded-xl border-l-4 border-brand-500 bg-surface-2 p-4 text-[15px] leading-7">{fb.model}</div></div>}
      {fb.note && <p className="text-xs text-muted">{fb.note}</p>}
    </div>
  );
}
