"use client";
import { memo, useEffect, useRef, useState } from "react";
import { Highlighter as HlIcon, Layers, Eraser } from "lucide-react";
import { readStore, writeStore } from "@/lib/storage";
import type { UserCard } from "./ReviewSession";

/**
 * Bọc nội dung bài đọc: bôi đen để tô sáng hoặc lưu thành flashcard (giống tính năng highlight khi làm đề).
 * Nội dung con được memo để React không ghi đè các <mark> người dùng tạo.
 */
const Static = memo(function Static({ children }: { children: React.ReactNode }) { return <>{children}</>; }, () => true);

export function Highlighter({ children, source }: { children: React.ReactNode; source: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number; text: string; sentence: string } | null>(null);
  const [toast, setToast] = useState("");
  const range = useRef<Range | null>(null);

  useEffect(() => {
    const onUp = () => setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !box.current) { setPos(null); return; }
      const r = sel.getRangeAt(0);
      if (!box.current.contains(r.commonAncestorContainer)) { setPos(null); return; }
      const text = sel.toString().trim();
      if (!text || text.length > 80) { setPos(null); return; }
      const rect = r.getBoundingClientRect(); const host = box.current.getBoundingClientRect();
      const para = (r.startContainer.parentElement?.closest("p")?.textContent || "").replace(/^[A-H](?=[A-Z])/, "");
      const sentence = para.split(/(?<=[.!?])\s+/).find((s) => s.includes(text)) || "";
      range.current = r.cloneRange();
      setPos({ x: rect.left - host.left + rect.width / 2, y: rect.top - host.top, text, sentence });
    }, 0);
    document.addEventListener("mouseup", onUp); document.addEventListener("touchend", onUp);
    return () => { document.removeEventListener("mouseup", onUp); document.removeEventListener("touchend", onUp); };
  }, []);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2200); };
  const mark = () => {
    const r = range.current; if (!r) return;
    try { const m = document.createElement("mark"); m.className = "rounded bg-amber-200/80 px-0.5 text-inherit dark:bg-amber-500/40"; r.surroundContents(m); }
    catch { flash("Chỉ tô được trong một đoạn văn."); }
    window.getSelection()?.removeAllRanges(); setPos(null);
  };
  const save = () => {
    if (!pos) return;
    const meaning = window.prompt(`Nghĩa của “${pos.text}” là gì?`, "");
    if (meaning == null) return;
    const list = readStore<UserCard[]>("user-cards", []);
    writeStore("user-cards", [{ key: `u:${Date.now().toString(36)}`, c: pos.text, m: meaning || "(chưa có nghĩa)", e: pos.sentence, ipa: "", topic: source }, ...list]);
    mark(); flash("Đã lưu vào Thẻ của tôi ✓");
  };
  const clear = () => { box.current?.querySelectorAll("mark").forEach((m) => m.replaceWith(...Array.from(m.childNodes))); flash("Đã xoá tô sáng"); };

  return (
    <div ref={box} className="relative">
      <div className="mb-3 flex items-center justify-between gap-2 text-xs text-muted"><span>Bôi đen từ/cụm từ để tô sáng hoặc lưu thành flashcard.</span><button onClick={clear} className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-surface-2"><Eraser className="size-3.5" />Xoá tô</button></div>
      <Static>{children}</Static>
      {pos && (
        <div className="absolute z-20 flex -translate-x-1/2 -translate-y-full gap-1 rounded-xl border border-line bg-surface p-1 shadow-xl" style={{ left: pos.x, top: pos.y - 6 }} onMouseDown={(e) => e.preventDefault()}>
          <button onClick={mark} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:bg-surface-2"><HlIcon className="size-3.5 text-amber-500" />Tô sáng</button>
          <button onClick={save} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:bg-surface-2"><Layers className="size-3.5 text-brand-500" />Lưu flashcard</button>
        </div>
      )}
      {toast && <p role="status" className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-page shadow-lg md:bottom-8">{toast}</p>}
    </div>
  );
}
