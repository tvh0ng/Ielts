import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { dictations } from "@/lib/content";
import { Crumbs } from "@/components/ui";
import { Dictation } from "@/components/Dictation";

export const dynamicParams = false;
export function generateStaticParams() { return dictations.map((d) => ({ slug: d.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const d = dictations.find((x) => x.slug === slug); if (!d) return {};
  return { title: `Chép chính tả: ${d.title}`, description: `Bài nghe chép chính tả “${d.title}” (${d.part}, ${d.level}) — ${d.lines.length} câu có transcript và bản dịch.`, alternates: { canonical: `/chep-chinh-ta/${slug}` } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const d = dictations.find((x) => x.slug === slug); if (!d) notFound();
  return (
    <>
      <Crumbs items={[["/chep-chinh-ta", "Chép chính tả"], [`/chep-chinh-ta/${slug}`, d.title]]} />
      <div className="container-x mt-6"><p className="eyebrow">{d.part} · {d.level}</p><h1 className="title-display mt-1 text-3xl sm:text-4xl">{d.title}</h1></div>
      <div className="container-x mt-6"><Dictation d={d} /></div>
    </>
  );
}
