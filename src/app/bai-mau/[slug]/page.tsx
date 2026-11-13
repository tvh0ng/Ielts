import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PenLine } from "lucide-react";
import { samples } from "@/lib/content";
import { Crumbs, JsonLd } from "@/components/ui";
import { SampleCard } from "@/components/SampleCard";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return samples.map((s) => ({ slug: s.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const s = samples.find((x) => x.slug === slug); if (!s) return {};
  return { title: `Bài mẫu IELTS Writing Task ${s.task}: ${s.title}`, description: `Bài mẫu band ${s.band} IELTS Writing Task ${s.task} (${s.type}) kèm dàn ý và từ vựng: ${s.prompt.split("\n")[0].slice(0, 110)}`, alternates: { canonical: `/bai-mau/${slug}` } };
}

function highlight(text: string, phrases: string[]) {
  const esc = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).sort((a, b) => b.length - a.length);
  const re = new RegExp(`(${esc.join("|")})`, "gi");
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i} className="rounded bg-accent-400/25 px-0.5 text-inherit">{part}</mark> : part));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const s = samples.find((x) => x.slug === slug); if (!s) notFound();
  const words = s.essay.split(/\s+/).length;
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: s.title, inLanguage: "en", url: `${SITE.url}/bai-mau/${slug}`, publisher: { "@type": "Organization", name: SITE.name } }} />
      <Crumbs items={[["/bai-mau", "Bài mẫu"], [`/bai-mau/${slug}`, `Task ${s.task}: ${s.type}`]]} />
      <div className="container-x mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <article className="min-w-0">
          <p className="eyebrow">Writing Task {s.task} · {s.type} · Band {s.band}</p>
          <h1 className="title-display mt-2 text-3xl sm:text-4xl text-balance">{s.title}</h1>
          <section className="card mt-6 p-6"><h2 className="font-bold">Đề bài</h2><p className="mt-2 whitespace-pre-wrap text-[15px] leading-7">{s.prompt}</p></section>
          <section className="card mt-5 p-6"><h2 className="font-bold">Dàn ý</h2><ol className="mt-3 space-y-2 text-[15px]">{s.outline.map((o, i) => <li key={i} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">{i + 1}</span>{o}</li>)}</ol></section>
          <section className="card mt-5 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-bold">Bài mẫu</h2><span className="chip">{words} từ</span></div>
            <div className="mt-4 space-y-4 font-[Georgia,serif] text-[17px] leading-8">{s.essay.split("\n\n").map((p, i) => <p key={i}>{highlight(p, s.vocab.map((v) => v[0]))}</p>)}</div>
          </section>
        </article>
        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <section className="card p-5">
            <h2 className="font-bold">Từ vựng nổi bật</h2>
            <ul className="mt-3 space-y-2.5 text-sm">{s.vocab.map(([e, v]) => <li key={e}><b className="rounded bg-accent-400/25 px-1">{e}</b><span className="block text-muted">{v}</span></li>)}</ul>
          </section>
          <Link href={`/luyen-tap/writing?mau=${s.slug}`} className="btn-primary w-full py-3"><PenLine className="size-4" />Tự viết đề này</Link>
        </aside>
      </div>
      <section className="container-x mt-14"><h2 className="title-display text-2xl">Bài mẫu khác</h2><ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{samples.filter((x) => x.slug !== slug).slice(0, 3).map((x) => <li key={x.slug}><SampleCard s={x} /></li>)}</ul></section>
    </>
  );
}
