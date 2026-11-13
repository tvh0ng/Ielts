import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { fmtDate, posts } from "@/lib/blog";
import { Crumbs, JsonLd } from "@/components/ui";
import { PostCard } from "@/components/PostCard";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return posts.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const p = posts.find((x) => x.slug === slug); if (!p) return {};
  return { title: p.title, description: p.excerpt, alternates: { canonical: `/blog/${slug}` }, openGraph: { type: "article", title: p.title, description: p.excerpt, publishedTime: p.date } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const p = posts.find((x) => x.slug === slug); if (!p) notFound();
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.excerpt, datePublished: p.date, inLanguage: "vi", url: `${SITE.url}/blog/${slug}`, publisher: { "@type": "Organization", name: SITE.name } }} />
      <Crumbs items={[["/blog", "Blog"], [`/blog/${slug}`, p.title]]} />
      <article className="container-x mt-6 max-w-3xl">
        <p className="eyebrow">{p.category}</p>
        <h1 className="title-display mt-2 text-3xl sm:text-4xl text-balance">{p.title}</h1>
        <p className="mt-3 text-sm text-muted">{fmtDate(p.date)} · {p.minutes} phút đọc</p>
        <p className="mt-6 text-lg text-muted">{p.excerpt}</p>
        <div className="prose-note mt-6 text-[16px] leading-8" dangerouslySetInnerHTML={{ __html: p.body }} />
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-700 p-6 text-white">
          <div><p className="title-display text-xl">Áp dụng ngay?</p><p className="text-sm text-brand-100">Làm một đề mini có chấm điểm và giải thích.</p></div>
          <Link href="/de-thi" className="btn bg-white text-brand-800 hover:bg-brand-50">Làm đề miễn phí <ArrowRight className="size-4" /></Link>
        </div>
      </article>
      <section className="container-x mt-14"><h2 className="title-display text-2xl">Bài viết khác</h2><ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{posts.filter((x) => x.slug !== slug).slice(0, 3).map((x) => <li key={x.slug}><PostCard p={x} /></li>)}</ul></section>
    </>
  );
}
