import Link from "next/link";
import type { Metadata } from "next";
import { roadmap, stageSlug } from "@/lib/data";
import { Crumbs, PageHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Lộ trình IELTS 0 → 9.0 chi tiết từng band",
  description: "Lộ trình tự học IELTS 6 chặng: Nền tảng, 5.5, 6.0, 7.0, 8.0, 9.0 — mục tiêu từng kỹ năng, ngữ pháp, dạng bài, lịch tuần và checklist.",
  alternates: { canonical: "/lo-trinh" },
};

export default function Page() {
  return (
    <>
      <Crumbs items={[["/lo-trinh", "Lộ trình"]]} />
      <PageHead eyebrow="Lộ trình" title="Lộ trình IELTS từ 0 đến 9.0" desc="Mỗi chặng cho bạn biết cần đạt bao nhiêu câu Listening/Reading, học ngữ pháp và từ vựng gì, luyện dạng bài nào — và khi nào thì sẵn sàng sang chặng tiếp." />
      <div className="container-x mt-10">
        <ol className="relative space-y-6 border-l-2 border-dashed border-brand-200 dark:border-brand-800 pl-8 sm:pl-10">
          {roadmap.map((s, i) => (
            <li key={s.id} className="relative">
              <span className="absolute -left-[3.05rem] sm:-left-[3.55rem] top-5 grid size-10 place-items-center rounded-full bg-brand-500 font-display font-extrabold text-white ring-4 ring-page">{i + 1}</span>
              <Link href={`/lo-trinh/${stageSlug(s)}`} className="card block p-6 transition hover:border-brand-300">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="title-display text-2xl">{s.name} <span className="text-base text-muted">({s.range})</span></h2>
                  <span className="chip">{s.weeks} · ~{s.hours} giờ</span>
                </div>
                <p className="mt-2 text-muted">{s.summary}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-4">
                  {s.targets.map(([sk, sc]) => (
                    <div key={sk} className="rounded-xl bg-surface-2 px-3 py-2"><p className="text-xs font-semibold text-muted">{sk}</p><p className="text-sm font-bold">{sc}</p></div>
                  ))}
                </div>
                <p className="mt-4 text-sm font-semibold text-brand-600 dark:text-brand-300">Xem lịch tuần, checklist & tiêu chí qua chặng →</p>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
