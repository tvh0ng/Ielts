import type { Metadata } from "next";
import { Crumbs, PageHead } from "@/components/ui";
import { MyCards } from "@/components/MyCards";

export const metadata: Metadata = { title: "Thẻ từ vựng của tôi", description: "Tạo, nhập và xuất bộ thẻ từ vựng IELTS của riêng bạn.", alternates: { canonical: "/tu-vung/cua-toi" }, robots: { index: false } };

export default function Page() {
  return (
    <>
      <Crumbs items={[["/tu-vung", "Từ vựng"], ["/tu-vung/cua-toi", "Thẻ của tôi"]]} />
      <PageHead eyebrow="Từ vựng" title="Thẻ của tôi" desc="Thêm từ bạn gặp khi luyện đề. Thẻ của bạn được đưa vào phiên Ôn tập hằng ngày cùng thuật toán lặp lại ngắt quãng." />
      <div className="container-x mt-8"><MyCards /></div>
    </>
  );
}
