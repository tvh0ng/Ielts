"use client";
import { useMemo, useState } from "react";
import { Layers, List, Volume2 } from "lucide-react";
import { Flashcards, type StudyCard } from "./Flashcards";
import { useStore } from "@/lib/storage";
import type { SrsMap } from "@/lib/srs";
import { speak } from "@/lib/tts";
import { cn } from "@/lib/cn";

export function TopicStudy({ cards, title }: { cards: StudyCard[]; title: string }) {
  const [mode, setMode] = useState<"list" | "study">("list");
  const [srs, , ok] = useStore<SrsMap>("srs", {});
  const [studyAll, setStudyAll] = useState(false);
  const session = useMemo(() => {
    if (mode !== "study") return [];
    return studyAll ? cards : cards.filter((c) => !srs[c.key] || srs[c.key].d <= Date.now());
  }, [mode, studyAll]); // eslint-disable-line react-hooks/exhaustive-deps
  const learned = ok ? cards.filter((c) => srs[c.key]).length : 0;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-xl border border-line bg-surface p-1" role="tablist">
          <button role="tab" aria-selected={mode === "list"} onClick={() => setMode("list")} className={cn("btn py-2", mode === "list" ? "bg-brand-500 text-white" : "text-muted")}><List className="size-4" />Danh sách</button>
          <button role="tab" aria-selected={mode === "study"} onClick={() => { setStudyAll(false); setMode("study"); }} className={cn("btn py-2", mode === "study" ? "bg-brand-500 text-white" : "text-muted")}><Layers className="size-4" />Học flashcard</button>
        </div>
        <span className="text-sm text-muted ml-auto">Đã học {learned}/{cards.length}</span>
        {mode === "study" && <button className="btn-ghost py-2" onClick={() => setStudyAll((v) => !v)}>{studyAll ? "Chỉ thẻ mới & đến hạn" : "Học tất cả thẻ"}</button>}
      </div>
      <div className="mt-6">
        {mode === "study" ? (
          <Flashcards key={String(studyAll)} cards={session} title={title} emptyText="Bạn đã học hết thẻ của chủ đề này và chưa có thẻ đến hạn. Bấm “Học tất cả thẻ” để ôn lại." />
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-2 text-left text-xs uppercase tracking-wide text-muted"><tr><th className="px-4 py-3">Collocation</th><th className="px-4 py-3">Nghĩa</th><th className="hidden px-4 py-3 md:table-cell">Ví dụ</th><th className="w-12" /></tr></thead>
              <tbody>
                {cards.map((c) => (
                  <tr key={c.key} className="border-t border-line align-top">
                    <td className="px-4 py-3"><span className="font-semibold">{c.c}</span>{ok && srs[c.key] && <span className="ml-1.5 inline-block size-1.5 rounded-full bg-brand-500 align-middle" title="Đã học" />}<span className="block text-xs text-muted">{c.ipa}</span></td>
                    <td className="px-4 py-3">{c.m}<span className="mt-1 block text-xs italic text-muted md:hidden">{c.e}</span></td>
                    <td className="hidden px-4 py-3 italic text-muted md:table-cell">{c.e}</td>
                    <td className="px-2 py-2"><button onClick={() => speak(c.c)} className="grid size-9 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink" aria-label={`Nghe “${c.c}”`}><Volume2 className="size-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
