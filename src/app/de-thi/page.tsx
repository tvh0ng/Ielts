import type { Metadata } from "next";
import { countQuestions, tests } from "@/lib/content";
import { Crumbs, PageHead } from "@/components/ui";
import { TestLibrary } from "@/components/TestLibrary";

export const metadata: Metadata = {
  title: "Thư viện đề thi IELTS online miễn phí: Reading & Listening",
  description: "Làm đề IELTS Reading, Listening online: chế độ luyện tập từng phần hoặc full test, bấm giờ, tô sáng và lưu từ vựng, chấm điểm, quy đổi band, giải thích từng câu.",
  alternates: { canonical: "/de-thi" },
};

export default function Page() {
  return (
    <>
      <Crumbs items={[["/de-thi", "Đề thi online"]]} />
      <PageHead eyebrow="IELTS Online Test" title="Thư viện đề thi online" desc="Chọn luyện tập từng phần hoặc làm full test như thi trên máy. Nộp bài là có ngay điểm, band ước tính, giải thích đáp án và thống kê theo dạng câu hỏi." />
      <div className="container-x mt-8"><TestLibrary items={tests.map((t) => ({ t, questions: countQuestions(t) }))} /></div>
    </>
  );
}
