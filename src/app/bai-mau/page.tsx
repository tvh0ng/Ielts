import Link from "next/link";
import type { Metadata } from "next";
import { Mic } from "lucide-react";
import { samples, speakingBank } from "@/lib/content";
import { Crumbs, PageHead } from "@/components/ui";
import { SampleCard } from "@/components/SampleCard";
import { Cover } from "@/components/Cover";

export const metadata: Metadata = {
  title: "Bài mẫu IELTS Writing & Speaking band 8.0+",
  description: "Tổng hợp bài mẫu IELTS Writing Task 1, Task 2 và Speaking Part 1–3 band 8.0+ có dàn ý, từ vựng hay và bản đọc mẫu.",
  alternates: { canonical: "/bai-mau" },
};

export default function Page() {
  const t1 = samples.filter((s) => s.task === 1), t2 = samples.filter((s) => s.task === 2);
  const sp = speakingBank.p1.length + speakingBank.p2.length + speakingBank.p3.length;
  return (
    <>
      <Crumbs items={[["/bai-mau", "Bài mẫu"]]} />
      <PageHead eyebrow="Bài mẫu" title="Bài mẫu IELTS Writing & Speaking" desc="Đọc bài band 8.0+ kèm dàn ý và từ vựng được tô sáng, sau đó tự viết lại cùng đề và nhận phản hồi." />
      <div className="container-x mt-8 space-y-12">
        <section><h2 className="title-display text-2xl">Writing Task 2</h2><ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{t2.map((s) => <li key={s.slug}><SampleCard s={s} /></li>)}</ul></section>
        <section><h2 className="title-display text-2xl">Writing Task 1</h2><ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{t1.map((s) => <li key={s.slug}><SampleCard s={s} /></li>)}</ul></section>
        <section>
          <h2 className="title-display text-2xl">Speaking</h2>
          <Link href="/bai-mau/speaking" className="group mt-5 grid gap-5 sm:grid-cols-[320px_1fr] sm:items-center">
            <Cover label="IELTS Speaking" big="Part 1 · 2 · 3" theme="rose" badge={`${sp} câu trả lời mẫu`} className="transition group-hover:-translate-y-0.5" />
            <div><h3 className="text-xl font-bold flex items-center gap-2"><Mic className="size-5 text-rose-500" />Câu trả lời mẫu Speaking</h3><p className="mt-1 text-muted">{speakingBank.p1.length} câu Part 1, {speakingBank.p2.length} cue card Part 2, {speakingBank.p3.length} câu Part 3 — có nút nghe đọc mẫu.</p><span className="mt-2 inline-block font-semibold text-brand-600 dark:text-brand-300">Xem tất cả →</span></div>
          </Link>
        </section>
      </div>
    </>
  );
}
