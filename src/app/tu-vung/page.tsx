import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, PlusCircle } from "lucide-react";
import { cards, topics } from "@/lib/data";
import { Crumbs, PageHead } from "@/components/ui";
import { TopicGrid } from "@/components/TopicGrid";

export const metadata: Metadata = {
  title: "1.100+ collocation IELTS theo chủ đề (có flashcard)",
  description: `Từ vựng IELTS theo ${topics.length} chủ đề: ${cards.length} collocation có nghĩa tiếng Việt, ví dụ, phiên âm IPA và flashcard lặp lại ngắt quãng.`,
  alternates: { canonical: "/tu-vung" },
};

export default function Page() {
  const ids: Record<string, number[]> = {};
  for (const c of cards) (ids[c.t] ||= []).push(c.id);
  return (
    <>
      <Crumbs items={[["/tu-vung", "Từ vựng"]]} />
      <PageHead eyebrow="Từ vựng" title="Collocation IELTS theo chủ đề" desc={`${cards.length.toLocaleString("vi-VN")} cụm từ có nghĩa, ví dụ và IPA. Học bằng flashcard lặp lại ngắt quãng — hệ thống tự nhắc bạn ôn đúng lúc sắp quên.`}>
        <div className="flex flex-wrap gap-2">
          <Link href="/tu-vung/on-tap" className="btn-primary">Ôn tập hôm nay <ArrowRight className="size-4" /></Link>
          <Link href="/tu-vung/cua-toi" className="btn-ghost"><PlusCircle className="size-4" />Thẻ của tôi</Link>
        </div>
      </PageHead>
      <div className="container-x mt-8"><TopicGrid topics={topics} ids={ids} /></div>
    </>
  );
}
