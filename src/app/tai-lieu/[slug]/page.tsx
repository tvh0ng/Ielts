import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { notes, stripTags } from "@/lib/data";
import { Crumbs } from "@/components/ui";

export const dynamicParams = false;
export function generateStaticParams() { return notes.map((n) => ({ slug: n.slug })); }
const clean = (s: string) => s.replace(/^[^\p{L}\d]+/u, "").trim();

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const n = notes.find((x) => x.slug === slug); if (!n) return {};
  return { title: `${clean(n.label)} — tài liệu IELTS`, description: stripTags(n.sections[0]?.body || "").replace(/\s+/g, " ").trim().slice(0, 155), alternates: { canonical: `/tai-lieu/${n.slug}` } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const n = notes.find((x) => x.slug === slug); if (!n) notFound();
  const id = (i: number) => `muc-${i + 1}`;
  return (
    <>
      <Crumbs items={[["/tai-lieu", "Tài liệu"], [`/tai-lieu/${n.slug}`, clean(n.label)]]} />
      <div className="container-x mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <p className="eyebrow">Mục lục</p>
          <ol className="mt-2 space-y-1 text-sm">{n.sections.map((s, i) => <li key={i}><a href={`#${id(i)}`} className="block rounded-lg px-2 py-1.5 text-muted hover:bg-surface-2 hover:text-ink">{s.h}</a></li>)}</ol>
          <div className="mt-6 hidden lg:block"><p className="eyebrow">Tài liệu khác</p>
            <ul className="mt-2 space-y-1 text-sm">{notes.filter((x) => x.slug !== n.slug).map((x) => <li key={x.slug}><Link href={`/tai-lieu/${x.slug}`} className="block rounded-lg px-2 py-1.5 text-muted hover:bg-surface-2 hover:text-ink">{x.label}</Link></li>)}</ul></div>
        </aside>
        <article className="min-w-0">
          <h1 className="title-display text-3xl sm:text-4xl">{n.label}</h1>
          {n.sections.map((s, i) => (
            <section key={i} id={id(i)} className="card mt-6 scroll-mt-20 p-6 sm:p-8">
              <h2 className="title-display text-2xl">{s.h}</h2>
              <div className="prose-note mt-2" dangerouslySetInnerHTML={{ __html: s.body }} />
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
