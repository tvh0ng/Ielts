import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BookOpen, CheckCircle2, Clock, Signal } from "lucide-react";
import { courseBySlug, courseMinutes, courses, lessonCount } from "@/lib/courses";
import { Crumbs, JsonLd } from "@/components/ui";
import { Cover } from "@/components/Cover";
import { Syllabus } from "@/components/Syllabus";
import { CourseCardProgress } from "@/components/CourseProgress";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return courses.map((c) => ({ course: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ course: string }> }): Promise<Metadata> {
  const c = courseBySlug((await params).course); if (!c) return {};
  return { title: `Khoá học ${c.title}`, description: c.desc, alternates: { canonical: `/khoa-hoc/${c.slug}` } };
}
const strip = (ch: { title: string; lessons: { slug: string; title: string; minutes: number }[] }[]) => ch.map((c) => ({ title: c.title, lessons: c.lessons.map(({ slug, title, minutes }) => ({ slug, title, minutes })) }));

export default async function Page({ params }: { params: Promise<{ course: string }> }) {
  const c = courseBySlug((await params).course); if (!c) notFound();
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Course", name: c.title, description: c.desc, inLanguage: "vi", url: `${SITE.url}/khoa-hoc/${c.slug}`, provider: { "@type": "Organization", name: SITE.name, sameAs: SITE.url } }} />
      <Crumbs items={[["/khoa-hoc", "Khoá học"], [`/khoa-hoc/${c.slug}`, c.title]]} />
      <div className="container-x mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <p className="eyebrow">{c.short}</p>
          <h1 className="title-display mt-2 text-3xl sm:text-4xl">{c.title}</h1>
          <p className="mt-3 max-w-2xl text-muted sm:text-lg">{c.desc}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted"><span className="inline-flex items-center gap-1.5"><BookOpen className="size-4" />{lessonCount(c)} bài học · {c.chapters.length} chương</span><span className="inline-flex items-center gap-1.5"><Clock className="size-4" />~{Math.round(courseMinutes(c) / 60)} giờ</span><span className="inline-flex items-center gap-1.5"><Signal className="size-4" />Band {c.level}</span></div>
          <section className="card mt-6 p-6"><h2 className="font-bold">Bạn sẽ đạt được</h2><ul className="mt-3 grid gap-2 sm:grid-cols-3">{c.outcomes.map((o) => <li key={o} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-500" />{o}</li>)}</ul></section>
          <section className="mt-8"><h2 className="title-display text-2xl">Chương trình học</h2><div className="card mt-4 p-4"><Syllabus course={c.slug} chapters={strip(c.chapters)} /></div></section>
        </div>
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="card p-4">
            <Cover label={c.short} big={c.title} theme={c.theme} />
            <div className="px-1"><CourseCardProgress course={c.slug} lessons={c.chapters.flatMap((ch) => ch.lessons.map((l) => ({ slug: l.slug, title: l.title, chapter: ch.title })))} /></div>
          </div>
        </aside>
      </div>
    </>
  );
}
