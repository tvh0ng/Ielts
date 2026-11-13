import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Lightbulb, ListChecks, TriangleAlert } from "lucide-react";
import { SKILL_SLUG, SLUG_SKILL, skills } from "@/lib/data";
import { BandPill, Crumbs, PageHead } from "@/components/ui";
import type { SkillKey } from "@/lib/types";
import { cn } from "@/lib/cn";

export const dynamicParams = false;
export function generateStaticParams() { return Object.values(SKILL_SLUG).map((skill) => ({ skill })); }

export async function generateMetadata({ params }: { params: Promise<{ skill: string }> }): Promise<Metadata> {
  const k = SLUG_SKILL[(await params).skill]; if (!k) return {};
  const s = skills[k];
  return { title: `IELTS ${s.name}: ${s.types.length} dạng bài & chiến thuật`, description: `Cấu trúc bài thi IELTS ${s.name}, cách làm từng dạng bài, bẫy thường gặp và mẹo tăng band. ${s.intro.slice(0, 90)}…`, alternates: { canonical: `/ky-nang/${SKILL_SLUG[k]}` } };
}

const slug = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default async function Page({ params }: { params: Promise<{ skill: string }> }) {
  const k = SLUG_SKILL[(await params).skill]; if (!k) notFound();
  const s = skills[k];
  return (
    <>
      <Crumbs items={[["/ky-nang/listening", "Kỹ năng"], [`/ky-nang/${SKILL_SLUG[k]}`, s.name]]} />
      <PageHead eyebrow="Kỹ năng & dạng bài" title={`IELTS ${s.name}`} desc={s.intro}>
        <nav className="flex flex-wrap gap-2" aria-label="Chọn kỹ năng">
          {(Object.keys(skills) as SkillKey[]).map((x) => (
            <Link key={x} href={`/ky-nang/${SKILL_SLUG[x]}`} className={cn("chip text-sm px-4 py-1.5", x === k && "chip-on")} aria-current={x === k ? "page" : undefined}>{skills[x].icon} {skills[x].name}</Link>
          ))}
        </nav>
      </PageHead>
      <div className="container-x mt-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {s.fmt.map(([a, b]) => <div key={a + b} className="card p-4"><p className="title-display text-xl">{a}</p><p className="text-sm text-muted">{b}</p></div>)}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          <nav className="hidden lg:block lg:sticky lg:top-20 lg:self-start" aria-label="Mục lục dạng bài">
            <p className="eyebrow mb-2">{s.types.length} dạng bài</p>
            <ul className="space-y-1 text-sm">{s.types.map((t) => <li key={t.t}><a href={`#${slug(t.t)}`} className="block rounded-lg px-2 py-1.5 text-muted hover:bg-surface-2 hover:text-ink">{t.t}</a></li>)}</ul>
          </nav>
          <div className="space-y-5">
            {s.types.map((t) => (
              <article key={t.t} id={slug(t.t)} className="card scroll-mt-20 p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div><h2 className="title-display text-xl">{t.t}</h2><p className="mt-1 text-sm text-muted">{t.s}</p></div>
                  <BandPill v={`${t.lv}+`} />
                </div>
                <p className="mt-4 text-[15px]">{t.d}</p>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {t.st && <div><h3 className="flex items-center gap-2 text-sm font-bold"><ListChecks className="size-4 text-brand-500" />Cách làm</h3>
                    <ol className="mt-2 space-y-1.5 text-sm">{t.st.map((x, i) => <li key={i} className="flex gap-2"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-500/10 text-[11px] font-bold text-brand-700 dark:text-brand-200">{i + 1}</span><span>{x}</span></li>)}</ol></div>}
                  {t.tr && <div><h3 className="flex items-center gap-2 text-sm font-bold"><TriangleAlert className="size-4 text-accent-500" />Bẫy thường gặp</h3>
                    <ul className="mt-2 space-y-1.5 text-sm">{t.tr.map((x, i) => <li key={i} className="rounded-lg bg-surface-2 px-3 py-2">{x}</li>)}</ul></div>}
                </div>
                {t.tip && <p className="mt-5 flex gap-2 rounded-xl border-l-4 border-accent-500 bg-accent-400/10 px-4 py-3 text-sm"><Lightbulb className="size-4 shrink-0 mt-0.5 text-accent-500" />{t.tip}</p>}
                {t.ex && <blockquote className="mt-4 rounded-xl bg-surface-2 px-4 py-3 text-sm italic">{t.ex}</blockquote>}
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
