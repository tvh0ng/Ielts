import Link from "next/link";
import type { Metadata } from "next";
import { speakingBank } from "@/lib/content";
import { Crumbs, PageHead } from "@/components/ui";
import { SpeakingSamples } from "@/components/SpeakingSamples";

export const metadata: Metadata = { title: "Câu trả lời mẫu IELTS Speaking Part 1, 2, 3", description: "Câu trả lời mẫu IELTS Speaking tự nhiên cho Part 1, cue card Part 2 và câu hỏi thảo luận Part 3, có bản đọc mẫu.", alternates: { canonical: "/bai-mau/speaking" } };

export default function Page() {
  return (
    <>
      <Crumbs items={[["/bai-mau", "Bài mẫu"], ["/bai-mau/speaking", "Speaking"]]} />
      <PageHead eyebrow="Bài mẫu" title="Câu trả lời mẫu IELTS Speaking" desc="Đọc, nghe rồi tự trả lời lại bằng lời của bạn.">
        <Link href="/luyen-tap/speaking" className="btn-primary">Luyện nói & chấm điểm</Link>
      </PageHead>
      <div className="container-x mt-8 max-w-4xl"><SpeakingSamples {...speakingBank} /></div>
    </>
  );
}
