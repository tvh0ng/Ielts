import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ExternalLink, Lightbulb, ListChecks, PenLine, TriangleAlert } from "lucide-react";
import { allLessons, courseBySlug, courses, type Lesson } from "@/lib/courses";
import { grammar, skills } from "@/lib/data";
import { Crumbs } from "@/components/ui";
import { Syllabus } from "@/components/Syllabus";
import { LessonNav, LessonQuizBlock } from "@/components/LessonActions";

export const dynamicParams = false;
export function generateStaticParams() { return courses.flatMap((c) => allLessons(c).map((l) => ({ course: c.slug, lesson: l.slug }))); }
export async function generateMetadata({ params }: { params: Promise<{ course: string; lesson: string }> }): Promise<Metadata> {
  const { course, lesson } = await params; const c = courseBySlug(course); const l = c && allLessons(c).find((x) => x.slug === lesson); if (!c || !l) return {};
  return { title: `${l.title} — ${c.title}`, description: `Bài học “${l.title}” trong khoá ${c.title}. ${c.desc.slice(0, 100)}`, alternates: { canonical: `/khoa-hoc/${course}/${lesson}` } };
}

function Body({ l, course }: { l: Lesson; course: string }) {
  if (l.kind === "article") return (
    <>
      <div className="prose-note text-[16px] leading-8" dangerouslySetInnerHTML={{ __html: l.theory }} />
      {l.language && <section className="mt-8"><h2 className="title-display text-xl">Mẫu câu & từ vựng cần nhớ</h2><div className="card mt-3 overflow-hidden"><table className="w-full text-sm"><tbody>{l.language.map(([e, v]) => <tr key={e} className="border-t border-line first:border-0"><td className="px-4 py-2.5 font-semibold">{e}</td><td className="px-4 py-2.5 text-muted">{v}</td></tr>)}</tbody></table></div></section>}
      {l.quiz && <section className="mt-8"><h2 className="title-display text-xl">Kiểm tra nhanh</h2><div className="card mt-3 p-5"><LessonQuizBlock course={course} lesson={l.slug} qs={l.quiz} /></div></section>}
      {l.practice && <section className="mt-8 rounded-2xl bg-brand-700 p-6 text-white"><h2 className="title-display text-xl">Thực hành: Writing Task {l.practice.task}</h2><p className="mt-2 whitespace-pre-wrap text-sm text-brand-100">{l.practice.prompt}</p><Link href={`/luyen-tap/writing?task=${l.practice.task}&de=${encodeURIComponent(l.practice.prompt)}`} className="btn mt-4 bg-white text-brand-800 hover:bg-brand-50"><PenLine className="size-4" />Viết bài & chấm điểm</Link></section>}
    </>
  );
  if (l.kind === "grammar") { const g = grammar[l.idx]; return (
    <div className="space-y-5">
      <div className="rounded-xl bg-surface-2 px-4 py-3 font-mono text-sm">{g.f}</div>
      <section><h2 className="font-bold">Ví dụ</h2><ul className="mt-2 space-y-2">{g.ex.map((e, i) => <li key={i} className="border-l-2 border-brand-300 pl-3 text-[15px] [&_b]:text-brand-700 dark:[&_b]:text-brand-300" dangerouslySetInnerHTML={{ __html: e }} />)}</ul></section>
      <section><h2 className="font-bold">Dùng khi nào trong IELTS</h2><p className="mt-1 text-[15px] text-muted">{g.use}</p></section>
      <Link href="/luyen-tap/writing" className="btn-ghost"><PenLine className="size-4" />Áp dụng vào một đoạn Writing</Link>
    </div>); }
  if (l.kind === "qtype") { const t = skills[l.skill].types[l.idx]; return (
    <div className="space-y-5">
      <p className="text-[16px] leading-8">{t.d}</p>
      {t.st && <section><h2 className="flex items-center gap-2 font-bold"><ListChecks className="size-4 text-brand-500" />Cách làm</h2><ol className="mt-2 list-decimal space-y-1.5 pl-6 text-[15px]">{t.st.map((x, i) => <li key={i}>{x}</li>)}</ol></section>}
      {t.tr && <section><h2 className="flex items-center gap-2 font-bold"><TriangleAlert className="size-4 text-accent-500" />Bẫy thường gặp</h2><ul className="mt-2 space-y-1.5 text-[15px]">{t.tr.map((x, i) => <li key={i} className="rounded-lg bg-surface-2 px-3 py-2">{x}</li>)}</ul></section>}
      {t.tip && <p className="flex gap-2 rounded-xl border-l-4 border-accent-500 bg-accent-400/10 px-4 py-3 text-[15px]"><Lightbulb className="mt-1 size-4 shrink-0 text-accent-500" />{t.tip}</p>}
      {t.ex && <blockquote className="rounded-xl bg-surface-2 px-4 py-3 italic">{t.ex}</blockquote>}
      <Link href={l.skill === "R" || l.skill === "L" ? "/de-thi" : l.skill === "S" ? "/luyen-tap/speaking" : "/luyen-tap/writing"} className="btn-ghost">Luyện dạng này ngay</Link>
    </div>); }
  return (
    <div className="card p-6">
      <p className="text-[16px]">{l.desc}</p>
      <Link href={l.href} className="btn-primary mt-5"><ExternalLink className="size-4" />{l.cta}</Link>
      <p className="mt-4 text-xs text-muted">Làm xong quay lại đây và bấm “Đánh dấu hoàn thành” để cập nhật tiến độ khoá học.</p>
    </div>
  );
}

export default async function Page({ params }: { params: Promise<{ course: string; lesson: string }> }) {
  const { course, lesson } = await params;
  const c = courseBySlug(course); if (!c) notFound();
  const list = allLessons(c); const i = list.findIndex((x) => x.slug === lesson); if (i < 0) notFound();
  const l = list[i]; const ch = c.chapters.find((x) => x.lessons.includes(l))!;
  const chapters = c.chapters.map((x) => ({ title: x.title, lessons: x.lessons.map(({ slug, title, minutes }) => ({ slug, title, minutes })) }));
  return (
    <>
      <Crumbs items={[["/khoa-hoc", "Khoá học"], [`/khoa-hoc/${course}`, c.title], [`/khoa-hoc/${course}/${lesson}`, l.title]]} />
      <div className="container-x mt-6 grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="order-2 lg:order-1 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:self-start lg:overflow-y-auto">
          <Link href={`/khoa-hoc/${course}`} className="block px-2 text-sm font-bold text-brand-600 dark:text-brand-300">← {c.title}</Link>
          <div className="mt-3"><Syllabus course={course} chapters={chapters} current={lesson} compact /></div>
        </aside>
        <article className="order-1 min-w-0 lg:order-2">
          <p className="eyebrow">{ch.title} · Bài {i + 1}/{list.length} · {l.minutes} phút</p>
          <h1 className="title-display mt-2 text-3xl sm:text-4xl text-balance">{l.title}</h1>
          <div className="mt-6"><Body l={l} course={course} /></div>
          <LessonNav course={course} courseTitle={c.title} lesson={lesson} title={l.title} index={i} total={list.length} prev={list[i - 1]?.slug} next={list[i + 1]?.slug} />
        </article>
      </div>
    </>
  );
}
