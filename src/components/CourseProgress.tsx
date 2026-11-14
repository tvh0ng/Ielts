"use client";
import Link from "next/link";
import { useStore } from "@/lib/storage";

export type DoneMap = Record<string, boolean>;
export function useCourseDone() { return useStore<DoneMap>("course-done", {}); }

/** Thẻ khoá học trong danh mục: % hoàn thành + “Tiếp tục bài học”. */
export function CourseCardProgress({ course, lessons }: { course: string; lessons: { slug: string; title: string; chapter: string }[] }) {
  const [done, , ok] = useCourseDone();
  const n = ok ? lessons.filter((l) => done[`${course}/${l.slug}`]).length : 0;
  const pct = Math.round((n / lessons.length) * 100);
  const next = lessons.find((l) => !(ok && done[`${course}/${l.slug}`])) || lessons[0];
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-sm"><b className="tabular-nums">{pct}%</b><span className="text-xs text-muted">{n}/{lessons.length} bài</span></div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} /></div>
      <p className="mt-3 text-sm"><b>{n ? "Tiếp tục bài học:" : "Bắt đầu với:"}</b> <Link href={`/khoa-hoc/${course}/${next.slug}`} className="text-muted hover:text-ink hover:underline">{next.chapter.replace(/^Chương \d+ · /, "")} - {next.title}</Link></p>
    </div>
  );
}
