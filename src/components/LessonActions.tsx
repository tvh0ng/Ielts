"use client";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useCourseDone } from "./CourseProgress";
import { LessonQuiz } from "./LessonQuiz";
import type { QuizQ } from "@/lib/courses";
import { logActivity } from "@/lib/progress";
import { logRecent } from "@/lib/recent";

export function LessonQuizBlock({ course, lesson, qs }: { course: string; lesson: string; qs: QuizQ[] }) {
  const [done, setDone] = useCourseDone();
  return <LessonQuiz qs={qs} onPass={() => setDone({ ...done, [`${course}/${lesson}`]: true })} />;
}

export function LessonNav({ course, courseTitle, lesson, title, index, total, prev, next }: { course: string; courseTitle: string; lesson: string; title: string; index: number; total: number; prev?: string; next?: string }) {
  const [done, setDone, ok] = useCourseDone();
  const key = `${course}/${lesson}`; const isDone = ok && !!done[key];
  useEffect(() => { logRecent({ key: `course:${course}`, kind: "Khoá học", title: `${courseTitle}: ${title}`, href: `/khoa-hoc/${course}/${lesson}`, done: index + 1, total }); }, [course, courseTitle, lesson, title, index, total]);
  const mark = () => { if (!isDone) logActivity(2); setDone({ ...done, [key]: !isDone }); };
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-line pt-6">
      {prev ? <Link href={`/khoa-hoc/${course}/${prev}`} className="btn-ghost"><ArrowLeft className="size-4" />Bài trước</Link> : <span />}
      <button onClick={mark} className={isDone ? "btn-ghost ml-auto border-brand-400 text-brand-700 dark:text-brand-300" : "btn-ghost ml-auto"} aria-pressed={isDone}><Check className="size-4" />{isDone ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}</button>
      {next ? <Link href={`/khoa-hoc/${course}/${next}`} onClick={() => !isDone && setDone({ ...done, [key]: true })} className="btn-primary">Bài tiếp <ArrowRight className="size-4" /></Link> : <Link href={`/khoa-hoc/${course}`} onClick={() => setDone({ ...done, [key]: true })} className="btn-primary">Hoàn thành khoá</Link>}
    </div>
  );
}
