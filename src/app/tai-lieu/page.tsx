import Link from "next/link";
import type { Metadata } from "next";
import { notes, stripTags } from "@/lib/data";
import { Crumbs, PageHead } from "@/components/ui";

export const metadata: Metadata = { title: "Tài liệu tự học IELTS", description: "Ghi chú tự học IELTS: lịch học 4.5→5.5, cấu trúc Writing Task 1, Task 2, Speaking, từ vựng nâng cao, Listening & Grammar.", alternates: { canonical: "/tai-lieu" } };

export default function Page() {
  return (
    <>
      <Crumbs items={[["/tai-lieu", "Tài liệu"]]} />
      <PageHead eyebrow="Thư viện" title="Tài liệu tự học IELTS" desc="Ghi chú cô đọng, đọc nhanh trên điện thoại — dùng kèm lộ trình và flashcard." />
      <div className="container-x mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((n) => (
          <Link key={n.slug} href={`/tai-lieu/${n.slug}`} className="card p-6 transition hover:-translate-y-0.5 hover:border-brand-300">
            <h2 className="title-display text-xl">{n.label}</h2>
            <p className="mt-2 text-sm text-muted line-clamp-3">{stripTags(n.sections[0]?.body || "").trim().slice(0, 180)}</p>
            <p className="mt-3 text-xs font-semibold text-brand-600 dark:text-brand-300">{n.sections.length} mục →</p>
          </Link>
        ))}
      </div>
    </>
  );
}
