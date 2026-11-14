"use client";
import Link from "next/link";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { useCourseDone } from "./CourseProgress";
import { cn } from "@/lib/cn";


export function Syllabus({ course, chapters, current, compact }: { course: string; chapters: { title: string; lessons: { slug: string; title: string; minutes: number }[] }[]; current?: string; compact?: boolean }) {
  const [done, , ok] = useCourseDone();
  return (
    <ol className={cn("space-y-4", compact && "space-y-3")}>
      {chapters.map((ch) => {
        const n = ok ? ch.lessons.filter((l) => done[`${course}/${l.slug}`]).length : 0;
        return (
          <li key={ch.title}>
            <details open={!compact || ch.lessons.some((l) => l.slug === current)} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-2 py-1.5 font-bold hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
                <span className={compact ? "text-sm" : ""}>{ch.title}</span><span className="shrink-0 text-xs font-semibold text-muted">{n}/{ch.lessons.length}</span>
              </summary>
              <ul className="mt-1">
                {ch.lessons.map((l) => {
                  const d = ok && done[`${course}/${l.slug}`]; const cur = l.slug === current;
                  return (
                    <li key={l.slug}>
                      <Link href={`/khoa-hoc/${course}/${l.slug}`} aria-current={cur ? "page" : undefined}
                        className={cn("flex items-start gap-2.5 rounded-lg px-2 py-2 text-sm", cur ? "bg-brand-50 font-semibold text-brand-800 dark:bg-brand-900/40 dark:text-brand-200" : "hover:bg-surface-2")}>
                        {d ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-500" /> : cur ? <PlayCircle className="mt-0.5 size-4 shrink-0 text-brand-500" /> : <Circle className="mt-0.5 size-4 shrink-0 text-muted" />}
                        <span className="flex-1">{l.title}</span>{!compact && <span className="shrink-0 text-xs text-muted">{l.minutes}p</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </details>
          </li>
        );
      })}
    </ol>
  );
}
