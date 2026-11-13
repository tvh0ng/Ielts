import type { Metadata } from "next";
import { bands } from "@/lib/data";
import { Crumbs, PageHead } from "@/components/ui";
import { BandCalculator } from "@/components/BandCalculator";
import type { BandTable } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tính điểm IELTS Overall & bảng quy đổi band",
  description: "Công cụ tính điểm IELTS: quy đổi số câu đúng Listening, Reading (Academic/General) sang band, tính Overall đúng quy tắc làm tròn và mô tả band Writing, Speaking.",
  alternates: { canonical: "/tinh-diem" },
};

export default function Page() {
  return (
    <>
      <Crumbs items={[["/tinh-diem", "Tính điểm"]]} />
      <PageHead eyebrow="Công cụ" title="Tính điểm IELTS Overall" desc="Kéo số câu đúng Listening, Reading và chọn band Writing, Speaking để xem điểm Overall. Bảng quy đổi mang tính tham khảo — mỗi đề thật có thể lệch ±1 câu." />
      <div className="container-x mt-8"><BandCalculator conv={bands.conv} /></div>
      <div className="container-x mt-12 space-y-10">
        <Table title="Mô tả band Writing (tóm tắt)" t={bands.writing} />
        <Table title="Mô tả band Speaking (tóm tắt)" t={bands.speaking} />
        <section>
          <h2 className="title-display text-2xl">Bảng quy đổi điểm Listening & Reading</h2>
          <div className="card mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-2 text-left"><tr><th className="px-4 py-3">Band</th><th className="px-4 py-3">Listening</th><th className="px-4 py-3">Reading Academic</th><th className="px-4 py-3">Reading General</th></tr></thead>
              <tbody>{bands.conv.L.map(([lmin, b], i) => (
                <tr key={b} className="border-t border-line"><td className="px-4 py-2.5 font-bold">{b.toFixed(1)}</td><td className="px-4 py-2.5">≥ {lmin}</td><td className="px-4 py-2.5">≥ {bands.conv.RA[i][0]}</td><td className="px-4 py-2.5">≥ {bands.conv.RG[i][0]}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

function Table({ title, t }: { title: string; t: BandTable }) {
  return (
    <section>
      <h2 className="title-display text-2xl">{title}</h2>
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-surface-2 text-left"><tr>{t.head.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody>{t.rows.map((r) => <tr key={r[0]} className="border-t border-line align-top">{r.map((c, i) => <td key={i} className={i ? "px-4 py-3" : "px-4 py-3 font-display text-xl font-extrabold text-brand-600 dark:text-brand-300"}>{c}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
