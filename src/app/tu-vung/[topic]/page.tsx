import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cardsOf, topicBySlug, topics } from "@/lib/data";
import { Crumbs, JsonLd, PageHead } from "@/components/ui";
import { TopicStudy } from "@/components/TopicStudy";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return topics.map((t) => ({ topic: t.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const t = topicBySlug((await params).topic); if (!t) return {};
  const sample = cardsOf(t.slug).slice(0, 4).map((c) => c.c).join(", ");
  return { title: `Từ vựng IELTS chủ đề ${t.name} (${t.count} collocation)`, description: `${t.count} collocation IELTS chủ đề ${t.name} có nghĩa, ví dụ, IPA: ${sample}… Học bằng flashcard miễn phí.`, alternates: { canonical: `/tu-vung/${t.slug}` } };
}

export default async function Page({ params }: { params: Promise<{ topic: string }> }) {
  const slug = (await params).topic;
  const t = topicBySlug(slug); if (!t) notFound();
  const list = cardsOf(slug);
  return (
    <>
      <Crumbs items={[["/tu-vung", "Từ vựng"], [`/tu-vung/${slug}`, t.name]]} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "DefinedTermSet", name: `IELTS vocabulary: ${t.name}`, url: `${SITE.url}/tu-vung/${slug}`, inLanguage: ["en", "vi"],
        hasDefinedTerm: list.slice(0, 50).map((c) => ({ "@type": "DefinedTerm", name: c.c, description: c.m })) }} />
      <PageHead eyebrow={t.group} title={`Từ vựng IELTS: ${t.name}`} desc={`${t.count} collocation thường dùng trong IELTS Speaking & Writing chủ đề ${t.name}.`} />
      <div className="container-x mt-8">
        <TopicStudy title={t.name} cards={list.map((c) => ({ key: String(c.id), c: c.c, m: c.m, e: c.e, ipa: c.ipa }))} />
      </div>
    </>
  );
}
