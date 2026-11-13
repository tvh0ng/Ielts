"use client";
import Link from "next/link";
import { useState } from "react";
import { Clock, FileText, Search, Users } from "lucide-react";
import type { MockTest } from "@/lib/content";
import { useStore } from "@/lib/storage";
import type { Attempt } from "@/lib/attempts";
import { Cover } from "./Cover";
import { cn } from "@/lib/cn";

export interface TestMeta { t: MockTest; questions: number }
export function TestLibrary({ items }: { items: TestMeta[] }) {
  const [skill, setSkill] = useState("Tất cả");
  const [q, setQ] = useState("");
  const [atts, , ok] = useStore<Attempt[]>("attempts", []);
  const list = items.filter(({ t }) => (skill === "Tất cả" || t.skill === skill) && (t.title + t.sections.map((s) => s.title).join(" ")).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {["Tất cả", "Reading", "Listening"].map((s) => <button key={s} onClick={() => setSkill(s)} aria-pressed={skill === s} className={cn("chip px-4 py-1.5 text-sm", skill === s && "chip-on")}>{s === "Tất cả" ? s : `IELTS ${s}`}</button>)}
        <label className="relative ml-auto w-full sm:w-72"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm đề theo tên, chủ đề bài đọc…" className="input pl-9" aria-label="Tìm đề" /></label>
      </div>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(({ t, questions }) => {
          const mine = ok ? atts.filter((a) => a.slug === t.slug) : [];
          const best = mine.length ? Math.max(...mine.map((a) => a.band)) : null;
          return (
            <li key={t.slug} className="card flex flex-col overflow-hidden p-0">
              <Link href={`/de-thi/${t.slug}`} className="group block p-3 pb-0"><Cover label={`IELTS ${t.skill}`} big={t.title.replace(`${t.skill} `, "")} theme={t.color} className="transition group-hover:brightness-105" /></Link>
              <div className="flex flex-1 flex-col p-5 pt-4">
                <h3 className="text-lg font-bold">{t.title}</h3>
                <p className="mt-1 line-clamp-1 text-sm text-muted">{t.sections.map((s) => s.title.replace(/^Part \d · /, "")).join(" · ")}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                  <span className="inline-flex items-center gap-1"><Clock className="size-3.5" />{t.minutes} phút</span>
                  <span className="inline-flex items-center gap-1"><FileText className="size-3.5" />{t.sections.length} phần · {questions} câu</span>
                  <span className="inline-flex items-center gap-1"><Users className="size-3.5" />Band {t.level}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5"><span className="chip">#IELTS {t.skill}</span>{t.sections.flatMap((s) => s.groups.map((g) => g.type)).filter((v, i, a) => a.indexOf(v) === i).map((g) => <span key={g} className="chip">#{g === "tfng" ? "TFNG" : g === "gap" ? "Completion" : "Multiple choice"}</span>)}</div>
                <div className="mt-auto flex items-center justify-between gap-2 pt-5">
                  {best != null ? <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">Đã làm {mine.length} lần · cao nhất {best.toFixed(1)}</span> : <span className="text-xs text-muted">Chưa làm</span>}
                  <Link href={`/de-thi/${t.slug}`} className="btn-ghost py-1.5 text-xs">{mine.length ? "Làm lại" : "Chi tiết"}</Link>
                </div>
              </div>
            </li>
          );
        })}
        {!list.length && <li className="text-muted">Không có đề phù hợp.</li>}
      </ul>
    </>
  );
}
