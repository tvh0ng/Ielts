import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { countQuestions, tests } from "@/lib/content";
import { Crumbs } from "@/components/ui";
import { TestRunner } from "@/components/TestRunner";

export const dynamicParams = false;
export function generateStaticParams() { return tests.map((t) => ({ slug: t.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const t = tests.find((x) => x.slug === slug); if (!t) return {};
  return { title: `${t.title} — IELTS ${t.skill} online`, description: `Làm ${t.title}: ${countQuestions(t)} câu, ${t.minutes} phút, chấm điểm và giải thích đáp án.`, alternates: { canonical: `/de-thi/${slug}` } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const t = tests.find((x) => x.slug === slug); if (!t) notFound();
  return (
    <>
      <Crumbs items={[["/de-thi", "Đề thi online"], [`/de-thi/${slug}`, t.title]]} />
      <div className="container-x mt-4"><h1 className="title-display text-2xl sm:text-3xl">{t.title}</h1><p className="mt-1 text-sm text-muted">IELTS {t.skill} · {countQuestions(t)} câu · {t.minutes} phút · đồng hồ bắt đầu khi mở đề</p></div>
      <div className="container-x mt-4"><TestRunner t={t} /></div>
    </>
  );
}
