import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EXERCISES, EX_META } from "@/lib/exercises";
import { Crumbs, PageHead } from "@/components/ui";
import { Exercise } from "@/components/Exercise";

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(EX_META).map((ex) => ({ ex })); }
export async function generateMetadata({ params }: { params: Promise<{ ex: string }> }): Promise<Metadata> {
  const m = EX_META[(await params).ex]; if (!m) return {};
  return { title: `Bài tập IELTS ${EXERCISES[m.key].title}`, description: m.desc, alternates: { canonical: `/luyen-tap/${m.slug}` } };
}

export default async function Page({ params }: { params: Promise<{ ex: string }> }) {
  const m = EX_META[(await params).ex]; if (!m) notFound();
  const d = EXERCISES[m.key];
  return (
    <>
      <Crumbs items={[["/luyen-tap", "Luyện tập"], [`/luyen-tap/${m.slug}`, d.title]]} />
      <PageHead eyebrow={`Band ${d.lv}`} title={d.title} desc={m.desc} />
      <div className="container-x mt-8"><Exercise k={m.key} /></div>
    </>
  );
}
