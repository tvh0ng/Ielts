import type { Metadata } from "next";
import { Crumbs, PageHead } from "@/components/ui";
import { SpeakingPractice } from "@/components/SpeakingPractice";

export const metadata: Metadata = {
  title: "Luyện IELTS Speaking Part 1, 2, 3 — thu âm & chấm AI",
  description: "Luyện nói IELTS: thu âm, chuyển giọng nói thành chữ, đo tốc độ & từ đệm, chấm AI theo tiêu chí và câu trả lời mẫu band 8.",
  alternates: { canonical: "/luyen-tap/speaking" },
};

export default function Page() {
  return (
    <>
      <Crumbs items={[["/luyen-tap", "Luyện tập"], ["/luyen-tap/speaking", "Speaking"]]} />
      <PageHead eyebrow="Luyện tập" title="Luyện IELTS Speaking" desc="Trả lời như phòng thi thật. File ghi âm chỉ lưu trên máy bạn; khi bấm chấm AI, chỉ bản ghi chữ được gửi đi." />
      <div className="container-x mt-8"><SpeakingPractice /></div>
    </>
  );
}
