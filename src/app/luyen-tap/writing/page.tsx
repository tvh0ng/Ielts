import type { Metadata } from "next";
import { Crumbs, PageHead } from "@/components/ui";
import { WritingPractice } from "@/components/WritingPractice";

export const metadata: Metadata = {
  title: "Luyện IELTS Writing Task 1 & 2 — chấm điểm bằng AI",
  description: "Viết IELTS Writing có đồng hồ, đếm từ, chấm AI theo 4 tiêu chí (Task, Coherence, Lexical, Grammar), sửa lỗi một chạm và bài mẫu band 9.",
  alternates: { canonical: "/luyen-tap/writing" },
};

export default function Page() {
  return (
    <>
      <Crumbs items={[["/luyen-tap", "Luyện tập"], ["/luyen-tap/writing", "Writing"]]} />
      <PageHead eyebrow="Luyện tập" title="Luyện IELTS Writing" desc="Task 1: 20 phút, ≥150 từ · Task 2: 40 phút, ≥250 từ. Viết như thi thật rồi nhận phản hồi chi tiết." />
      <div className="container-x mt-8"><WritingPractice /></div>
    </>
  );
}
