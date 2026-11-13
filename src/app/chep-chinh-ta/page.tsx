import type { Metadata } from "next";
import { dictations } from "@/lib/content";
import { Crumbs, PageHead } from "@/components/ui";
import { DictationList } from "@/components/DictationList";

export const metadata: Metadata = {
  title: "Chép chính tả tiếng Anh (Dictation) luyện nghe IELTS",
  description: "Luyện nghe chép chính tả tiếng Anh theo từng câu: nghe, gõ lại, kiểm tra từng từ, gợi ý, xem transcript và bản dịch. Bài theo dạng IELTS Listening Part 1–4.",
  alternates: { canonical: "/chep-chinh-ta" },
};

export default function Page() {
  return (
    <>
      <Crumbs items={[["/chep-chinh-ta", "Chép chính tả"]]} />
      <PageHead eyebrow="Luyện nghe" title="Chép chính tả tiếng Anh" desc="Nghe từng câu, gõ lại, hệ thống chấm từng từ và che phần bạn nghe sai. Cách luyện tai hiệu quả nhất để lên band Listening — mỗi ngày 15 phút." />
      <div className="container-x mt-8"><DictationList items={dictations} /></div>
      <section className="container-x mt-14 grid gap-4 md:grid-cols-3">
        {[["1. Nghe trọn câu", "Nghe 1–2 lần, chưa gõ vội. Dùng “Nghe chậm” khi câu có nối âm."], ["2. Gõ & kiểm tra", "Từ đúng hiện màu xanh; từ sai bị che lại để bạn nghe tiếp, không lộ đáp án."], ["3. Shadowing", "Khi xong bài, đọc to theo transcript để luyện phát âm và ngữ điệu."]].map(([h, p]) => (
          <div key={h} className="card p-5"><h2 className="font-bold">{h}</h2><p className="mt-1 text-sm text-muted">{p}</p></div>
        ))}
      </section>
    </>
  );
}
