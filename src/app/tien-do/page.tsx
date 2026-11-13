import type { Metadata } from "next";
import { Crumbs, PageHead } from "@/components/ui";
import { ProgressCenter } from "@/components/ProgressCenter";

export const metadata: Metadata = { title: "Tiến độ học & sao lưu", robots: { index: false }, alternates: { canonical: "/tien-do" } };

export default function Page() {
  return (
    <>
      <Crumbs items={[["/tien-do", "Tiến độ"]]} />
      <PageHead eyebrow="Cá nhân" title="Tiến độ của bạn" desc="Tổng quan việc học, bài làm gần đây và sao lưu dữ liệu." />
      <div className="container-x mt-8"><ProgressCenter /></div>
    </>
  );
}
