import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpenText, Headphones, Mic, PenLine } from "lucide-react";
import { EXERCISES, EX_META } from "@/lib/exercises";
import { Crumbs, PageHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Luyện tập IELTS: Writing, Speaking chấm AI & bài tập Reading, Listening",
  description: "Luyện IELTS Writing Task 1, 2 và Speaking Part 1–3 có AI chấm điểm theo 4 tiêu chí; bài tập Reading TFNG, Matching headings, Listening form completion.",
  alternates: { canonical: "/luyen-tap" },
};

export default function Page() {
  return (
    <>
      <Crumbs items={[["/luyen-tap", "Luyện tập"]]} />
      <PageHead eyebrow="Luyện tập" title="Luyện tập & chấm điểm" desc="Viết bài, thu âm câu trả lời và nhận phản hồi theo tiêu chí chấm IELTS. Làm bài tập ngắn để quen từng dạng câu hỏi." />
      <div className="container-x mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/luyen-tap/writing" className="card group p-6 transition hover:border-brand-300">
          <PenLine className="size-7 text-accent-500" />
          <h2 className="title-display mt-3 text-2xl">Luyện Writing</h2>
          <p className="mt-2 text-muted">Task 1 & Task 2 có đồng hồ bấm giờ, đếm từ, chấm AI 4 tiêu chí, gạch lỗi & sửa một chạm, bài mẫu band 9.</p>
          <span className="mt-4 inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-300">Bắt đầu viết <ArrowRight className="size-4 transition group-hover:translate-x-1" /></span>
        </Link>
        <Link href="/luyen-tap/speaking" className="card group p-6 transition hover:border-brand-300">
          <Mic className="size-7 text-rose-500" />
          <h2 className="title-display mt-3 text-2xl">Luyện Speaking</h2>
          <p className="mt-2 text-muted">Part 1–3 có thu âm, chuyển giọng nói thành chữ, đo tốc độ nói, từ đệm và chấm AI kèm câu trả lời mẫu.</p>
          <span className="mt-4 inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-300">Bắt đầu nói <ArrowRight className="size-4 transition group-hover:translate-x-1" /></span>
        </Link>
      </div>
      <div className="container-x mt-10">
        <h2 className="title-display text-2xl">Bài tập theo dạng câu hỏi</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Object.values(EX_META).map((m) => {
            const d = EXERCISES[m.key]; const Icon = m.key === "listen" ? Headphones : BookOpenText;
            return (
              <Link key={m.slug} href={`/luyen-tap/${m.slug}`} className="card flex gap-4 p-5 transition hover:border-brand-300">
                <Icon className="size-6 shrink-0 text-brand-500" />
                <span><span className="block font-bold">{d.title}</span><span className="mt-1 block text-sm text-muted">{m.desc}</span><span className="chip mt-2">Band {d.lv}</span></span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
