import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE } from "@/lib/site";

export function PageHead({ eyebrow, title, desc, children }: { eyebrow?: string; title: string; desc?: string; children?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden border-b border-line bg-hero">
      <svg aria-hidden className="pointer-events-none absolute -right-16 -top-20 size-80 text-accent-400/20" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" /><circle cx="50" cy="50" r="24" fill="none" stroke="currentColor" strokeWidth="8" /></svg>
      <div className="container-x relative py-10 sm:py-14">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="title-display mt-2 text-3xl sm:text-4xl md:text-5xl text-balance">{title}</h1>
        {desc && <p className="mt-3 max-w-2xl text-muted sm:text-lg text-pretty">{desc}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}

export function Crumbs({ items }: { items: [string, string][] }) {
  const all: [string, string][] = [["/", "Trang chủ"], ...items];
  const ld = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: all.map(([href, name], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE.url + href })),
  };
  return (
    <nav aria-label="Breadcrumb" className="container-x pt-5 text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {all.map(([href, name], i) => (
          <li key={href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3" />}
            {i < all.length - 1 ? <Link href={href} className="hover:text-ink">{name}</Link> : <span aria-current="page" className="text-ink font-medium">{name}</span>}
          </li>
        ))}
      </ol>
      <JsonLd data={ld} />
    </nav>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

const SK_COLORS: Record<string, string> = {
  L: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
  R: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
  W: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  S: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
};
export const SK_NAME: Record<string, string> = { L: "Listening", R: "Reading", W: "Writing", S: "Speaking" };
export function SkillTag({ k }: { k: string }) {
  return <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${SK_COLORS[k]}`}>{SK_NAME[k]}</span>;
}

export function BandPill({ v }: { v: string }) {
  return <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[11px] font-bold text-brand-700 dark:text-brand-200">Band {v}</span>;
}
