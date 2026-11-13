import type { Metadata } from "next";
import { Crumbs } from "@/components/ui";
import { ReviewSession } from "@/components/ReviewSession";

export const metadata: Metadata = {
  title: "Ôn tập flashcard hôm nay",
  description: "Phiên ôn từ vựng IELTS hằng ngày: thẻ đến hạn + thẻ mới theo thuật toán lặp lại ngắt quãng.",
  alternates: { canonical: "/tu-vung/on-tap" },
};

export default function Page() {
  return (
    <>
      <Crumbs items={[["/tu-vung", "Từ vựng"], ["/tu-vung/on-tap", "Ôn tập hôm nay"]]} />
      <div className="container-x mt-6"><h1 className="title-display text-3xl">Ôn tập hôm nay</h1><p className="mt-1 text-muted">Thẻ đến hạn được ưu tiên trước, sau đó là thẻ mới.</p></div>
      <div className="container-x mt-6"><ReviewSession /></div>
    </>
  );
}
