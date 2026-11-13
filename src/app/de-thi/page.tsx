import type { Metadata } from "next";
import { tests } from "@/lib/content";
import { Crumbs, PageHead } from "@/components/ui";
import { TestCard } from "@/components/TestCard";

export const metadata: Metadata = {
  title: "IELTS Online Test miễn phí: Reading & Listening có giải thích",
  description: "Làm đề IELTS Reading, Listening online có bấm giờ, bảng câu hỏi như thi trên máy, chấm điểm, quy đổi band và giải thích chi tiết từng câu.",
  alternates: { canonical: "/de-thi" },
};

export default function Page() {
  return (
    <>
      <Crumbs items={[["/de-thi", "Đề thi online"]]} />
      <PageHead eyebrow="IELTS Online Test" title="Làm đề IELTS online" desc="Giao diện như thi trên máy tính: bấm giờ, đánh dấu câu đã làm, nộp bài là có ngay điểm, band ước tính và giải thích từng đáp án." />
      <div className="container-x mt-8"><ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{tests.map((t) => <li key={t.slug}><TestCard t={t} /></li>)}</ul></div>
    </>
  );
}
