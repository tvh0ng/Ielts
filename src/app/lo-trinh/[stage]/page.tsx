import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AlertTriangle, ArrowLeft, ArrowRight, Flag } from "lucide-react";
import { roadmap, stageBySlug, stageSlug, topicByName } from "@/lib/data";
import { Crumbs, PageHead, SkillTag } from "@/components/ui";
import { Checklist } from "@/components/Checklist";

export const dynamicParams = false;
export function generateStaticParams() { return roadmap.map((s) => ({ stage: stageSlug(s) })); }

export async function generateMetadata({ params }: { params: Promise<{ stage: string }> }): Promise<Metadata> {
  const s = stageBySlug((await params).stage);
  if (!s) return {};
  return { title: `Lộ trình IELTS ${s.range}: ${s.name}`, description: s.summary, alternates: { canonical: `/lo-trinh/${stageSlug(s)}` } };
}

export default async function Page({ params }: { params: Promise<{ stage: string }> }) {
  const slug = (await params).stage;
  const s = stageBySlug(slug); if (!s) notFound();
  const i = roadmap.indexOf(s); const prev = roadmap[i - 1], next = roadmap[i + 1];
  return (
    <>
      <Crumbs items={[["/lo-trinh", "Lộ trình"], [`/lo-trinh/${slug}`, s.name]]} />
      <PageHead eyebrow={`Chặng ${i + 1} / ${roadmap.length} · ${s.weeks} · ~${s.hours} giờ`} title={`${s.name}: ${s.range}`} desc={s.summary} />
      <div className="container-x mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="title-display text-xl">Mục tiêu từng kỹ năng</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {s.targets.map(([sk, sc, d]) => (
                <div key={sk} className="rounded-xl bg-surface-2 p-4"><p className="text-xs font-bold text-muted uppercase tracking-wide">{sk}</p><p className="mt-1 font-display text-lg font-bold">{sc}</p><p className="mt-1 text-sm text-muted">{d}</p></div>
              ))}
            </div>
          </section>
          <section className="card p-6 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="title-display text-xl">Ngữ pháp trọng tâm</h2>
              <ul className="mt-3 space-y-2 text-sm">{s.grammar.map((g) => <li key={g} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500" />{g}</li>)}</ul>
              <Link href="/ngu-phap" className="mt-3 inline-block text-sm font-semibold text-brand-600 dark:text-brand-300">Học ngữ pháp →</Link>
            </div>
            <div>
              <h2 className="title-display text-xl">Dạng bài cần luyện</h2>
              <ul className="mt-3 space-y-2 text-sm">{s.types.map(([k, t]) => <li key={k + t} className="flex items-center gap-2"><SkillTag k={k} />{t}</li>)}</ul>
              <h3 className="mt-5 font-bold">Chủ đề từ vựng</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {s.vocab.map((v) => { const t = topicByName(v); return t ? <Link key={v} href={`/tu-vung/${t.slug}`} className="chip hover:border-brand-400 hover:text-ink">{v}</Link> : <span key={v} className="chip">{v}</span>; })}
              </div>
            </div>
          </section>
          <section className="card p-6">
            <h2 className="title-display text-xl">Lịch tuần mẫu</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm"><tbody>
                {s.week.map(([d, t]) => <tr key={d} className="border-t border-line first:border-0"><th className="w-20 py-2.5 pr-3 text-left font-bold text-brand-600 dark:text-brand-300 align-top">{d}</th><td className="py-2.5">{t}</td></tr>)}
              </tbody></table>
            </div>
          </section>
          <section className="card p-6 border-accent-400/50">
            <h2 className="title-display text-xl flex items-center gap-2"><AlertTriangle className="size-5 text-accent-500" />Lỗi hay gặp ở chặng này</h2>
            <ul className="mt-3 space-y-2 text-sm">{s.mistakes.map((m) => <li key={m} className="rounded-lg bg-surface-2 px-3 py-2">{m}</li>)}</ul>
          </section>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <section className="card p-6"><h2 className="title-display text-xl mb-4">Checklist</h2><Checklist id={s.id} items={s.checklist} /></section>
          <section className="card p-6 bg-brand-50 dark:bg-brand-900/30 border-brand-200 dark:border-brand-800">
            <h2 className="font-display font-bold flex items-center gap-2"><Flag className="size-4 text-brand-600" />Sẵn sàng qua chặng khi</h2>
            <p className="mt-2 text-sm">{s.exit}</p>
          </section>
          <div className="flex justify-between gap-2">
            {prev ? <Link className="btn-ghost" href={`/lo-trinh/${stageSlug(prev)}`}><ArrowLeft className="size-4" />{prev.name}</Link> : <span />}
            {next && <Link className="btn-primary" href={`/lo-trinh/${stageSlug(next)}`}>{next.name}<ArrowRight className="size-4" /></Link>}
          </div>
        </aside>
      </div>
    </>
  );
}
