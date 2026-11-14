import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, Clock } from "lucide-react";
import { courses, courseMinutes, lessonCount } from "@/lib/courses";
import { Crumbs, PageHead } from "@/components/ui";
import { Cover } from "@/components/Cover";
import { CourseCardProgress } from "@/components/CourseProgress";

export const metadata: Metadata = {
  title: "Khoá học IELTS online: Nền tảng, Listening, Reading, Writing, Speaking",
  description: "5 khoá học IELTS có lộ trình theo chương: ngữ pháp nền tảng, Listening, Reading, Writing và Speaking chuyên sâu — bài học, trắc nghiệm, thực hành có chấm điểm.",
  alternates: { canonical: "/khoa-hoc" },
};

export default function Page() {
  return (
    <>
      <Crumbs items={[["/khoa-hoc", "Khoá học"]]} />
      <PageHead eyebrow="Chương trình học" title="Khoá học IELTS" desc="Học theo chương, theo dõi tiến độ từng bài. Mỗi khoá kết hợp lý thuyết, bài tập, chép chính tả, flashcard và đề luyện có chấm điểm." />
      <div className="container-x mt-8">
        <h2 className="title-display text-2xl">IELTS Academic</h2>
        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <li key={c.slug} className="card flex flex-col p-4">
              <Link href={`/khoa-hoc/${c.slug}`} className="group"><Cover label={c.short} big={c.title} theme={c.theme} badge={`Band ${c.level}`} className="transition group-hover:brightness-105" /></Link>
              <div className="flex flex-1 flex-col px-1 pt-4">
                <Link href={`/khoa-hoc/${c.slug}`} className="text-lg font-bold hover:text-brand-600 dark:hover:text-brand-300">{c.title}</Link>
                <p className="mt-1 flex gap-4 text-xs text-muted"><span className="inline-flex items-center gap-1"><BookOpen className="size-3.5" />{lessonCount(c)} bài học</span><span className="inline-flex items-center gap-1"><Clock className="size-3.5" />~{Math.round(courseMinutes(c) / 60)} giờ</span></p>
                <CourseCardProgress course={c.slug} lessons={c.chapters.flatMap((ch) => ch.lessons.map((l) => ({ slug: l.slug, title: l.title, chapter: ch.title })))} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
