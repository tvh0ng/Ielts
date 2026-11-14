import Link from "next/link";
import { ArrowRight, Bot, ChevronRight, FileCheck2, Headphones, Layers, Map, NotebookPen, Sparkles } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";
import { RecentActivity } from "@/components/RecentActivity";
import { DictationList } from "@/components/DictationList";
import { TestCard } from "@/components/TestCard";
import { SampleCard } from "@/components/SampleCard";
import { Cover, themeAt } from "@/components/Cover";
import { JsonLd } from "@/components/ui";
import { cards, roadmap, stageSlug, topics } from "@/lib/data";
import { dictations, samples, tests } from "@/lib/content";
import { SITE } from "@/lib/site";
import { posts } from "@/lib/blog";
import { courses, lessonCount } from "@/lib/courses";
import { PostCard } from "@/components/PostCard";

const FAQ: [string, string][] = [
  ["IELTS Master có miễn phí không?", "Có. Đề thi online, chép chính tả, 1.100+ collocation, bài mẫu, lộ trình và công cụ tính điểm đều miễn phí. Tiến độ lưu ngay trên trình duyệt, không cần đăng ký."],
  ["Tự học từ 4.5 lên 7.0 mất bao lâu?", "Thông thường cần khoảng 400–500 giờ học có định hướng. Nhập band hiện tại, mục tiêu và số giờ học mỗi ngày ở Bảng học để có ước tính riêng cho bạn."],
  ["Chép chính tả giúp gì cho IELTS Listening?", "Chép từng câu buộc bạn nghe rõ từng âm, nối âm và dạng số nhiều — đúng những lỗi khiến thí sinh mất điểm ở Part 1 và Part 4."],
  ["AI chấm Writing/Speaking chính xác đến mức nào?", "AI chấm theo 4 tiêu chí của band descriptors công khai và chỉ ra lỗi cụ thể để bạn sửa. Đây là điểm ước lượng để luyện tập, không thay thế giám khảo chính thức."],
];

const FEATURES = [
  { Icon: FileCheck2, t: "IELTS Online Test", d: "Làm đề Reading, Listening như thi trên máy: bấm giờ, chấm điểm, giải thích từng câu.", href: "/de-thi", c: "bg-violet-500/10 text-violet-600 dark:text-violet-300" },
  { Icon: Headphones, t: "Chép chính tả", d: "Nghe từng câu, gõ lại, hệ thống chấm từng từ. Có bản dịch và transcript.", href: "/chep-chinh-ta", c: "bg-sky-500/10 text-sky-600 dark:text-sky-300" },
  { Icon: Layers, t: "Flashcard thông minh", d: "1.100+ collocation theo 62 chủ đề, ôn theo lịch lặp lại ngắt quãng như Anki.", href: "/tu-vung", c: "bg-brand-500/10 text-brand-600 dark:text-brand-300" },
  { Icon: NotebookPen, t: "Bài mẫu Writing & Speaking", d: "Bài band 8.0+ có dàn ý, từ vựng được tô sáng và bản đọc mẫu.", href: "/bai-mau", c: "bg-amber-500/10 text-amber-600 dark:text-amber-300" },
  { Icon: Bot, t: "AI chấm bài", d: "Chấm Writing, Speaking theo 4 tiêu chí, gạch lỗi và sửa một chạm.", href: "/luyen-tap", c: "bg-rose-500/10 text-rose-600 dark:text-rose-300" },
  { Icon: Map, t: "Lộ trình 0 → 9.0", d: "Biết chính xác cần học gì ở từng band, có checklist và lịch tuần.", href: "/lo-trinh", c: "bg-lime-500/10 text-lime-700 dark:text-lime-300" },
];

function Row({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <section className="container-x mt-16">
      <div className="flex items-end justify-between gap-3">
        <h2 className="title-display text-2xl sm:text-3xl">{title}</h2>
        <Link href={href} className="inline-flex items-center gap-0.5 text-sm font-semibold text-muted hover:text-ink">Xem thêm <ChevronRight className="size-4" /></Link>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function Home() {
  const stages = roadmap.map((s) => ({ id: s.id, name: s.name, range: s.range, lo: s.lo, hi: s.hi, hours: s.hours, slug: stageSlug(s) }));
  const fan = [
    { label: "IELTS Reading", big: "Mini Test 1", theme: "violet" as const },
    { label: "Chép chính tả", big: "Part 4", theme: "sky" as const },
    { label: "Writing Task 2", big: "Band 8.0", theme: "amber" as const },
    { label: "Collocation", big: "1.100+ thẻ", theme: "teal" as const },
    { label: "IELTS Listening", big: "Mini Test 1", theme: "rose" as const },
  ];

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: SITE.url, inLanguage: "vi", description: SITE.description }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="container-x grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative z-10">
            <span className="chip"><Sparkles className="size-3.5 text-accent-500" /> 100% miễn phí · Không cần đăng ký</span>
            <h1 className="title-display mt-5 text-4xl leading-[1.08] sm:text-5xl lg:text-[3.6rem]">
              Nền tảng tự học<br />
              <span className="relative inline-block">IELTS 4 kỹ năng<svg aria-hidden className="absolute left-0 top-[88%] w-full text-accent-400" height="10" viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M2 9c40-6 120-8 196-3" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></svg></span><br />
              <span className="text-brand-500">hiệu quả & miễn phí</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted text-pretty">Làm đề online có chấm điểm, luyện nghe chép chính tả, học từ vựng bằng flashcard thông minh và nhận phản hồi Writing, Speaking từ AI — theo lộ trình rõ ràng từ 0 đến 9.0.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/de-thi" className="btn-primary px-6 py-3 text-base">Làm đề miễn phí <ArrowRight className="size-4" /></Link>
              <Link href="/lo-trinh" className="btn-ghost px-6 py-3 text-base">Xem lộ trình</Link>
            </div>
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {[[`${cards.length.toLocaleString("vi-VN")}+`, "collocation"], [`${topics.length}`, "chủ đề"], [`${dictations.length}`, "bài chép chính tả"], [`${tests.length}`, "đề online"]].map(([v, l]) => (
                <div key={l}><dd className="title-display text-3xl">{v}</dd><dt className="text-sm text-muted">{l}</dt></div>
              ))}
            </dl>
          </div>
          <div className="relative hidden lg:block" aria-hidden="true">
            <div className="relative grid grid-cols-2 gap-5">
              {fan.slice(0, 4).map((f, i) => (
                <div key={i} style={{ transform: `translateY(${i % 2 ? 48 : 0}px) rotate(${i % 2 ? 3 : -3}deg)` }}>
                  <Cover label={f.label} big={f.big} theme={f.theme} className="shadow-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container-x mt-16">
        <h2 className="title-display text-2xl sm:text-3xl">Mọi thứ bạn cần để tự học IELTS</h2>
        <ul className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, t, d, href, c }) => (
            <li key={t}>
              <Link href={href} className="group block">
                <span className={`grid size-12 place-items-center rounded-full ${c}`}><Icon className="size-5" /></span>
                <h3 className="mt-4 text-lg font-bold group-hover:text-brand-600 dark:group-hover:text-brand-300">{t}</h3>
                <p className="mt-1.5 text-sm text-muted">{d}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="container-x mt-16"><RecentActivity /></div>

      <div className="container-x mt-12"><Dashboard stages={stages} /></div>

      <Row title="Khoá học IELTS" href="/khoa-hoc">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {courses.map((c) => (
            <li key={c.slug}><Link href={`/khoa-hoc/${c.slug}`} className="group block">
              <Cover label={c.short} big={c.title.replace("IELTS ", "")} theme={c.theme} className="transition group-hover:-translate-y-0.5 group-hover:shadow-lg [&_span:last-child]:text-xl" />
              <h3 className="mt-3 font-bold group-hover:text-brand-600 dark:group-hover:text-brand-300">{c.title}</h3>
              <p className="text-xs text-muted">{lessonCount(c)} bài · Band {c.level}</p>
            </Link></li>
          ))}
        </ul>
      </Row>

      <Row title="IELTS Online Test" href="/de-thi">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{tests.slice(0, 6).map((t) => <li key={t.slug}><TestCard t={t} /></li>)}</ul>
      </Row>

      <Row title="Luyện nghe chép chính tả" href="/chep-chinh-ta">
        <DictationList items={dictations} limit={4} />
      </Row>

      <Row title="Từ vựng theo chủ đề" href="/tu-vung">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {topics.filter((t) => t.group === "Chủ đề").slice(0, 12).map((t, i) => (
            <li key={t.slug}>
              <Link href={`/tu-vung/${t.slug}`} className="group block">
                <Cover label={`${t.count} cụm từ`} big={t.name} theme={themeAt(i)} className="aspect-square transition group-hover:-translate-y-0.5 [&_span:last-child]:text-lg" />
              </Link>
            </li>
          ))}
        </ul>
      </Row>

      <Row title="Bài mẫu Writing band 8.0+" href="/bai-mau">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{samples.map((s) => <li key={s.slug}><SampleCard s={s} /></li>)}</ul>
      </Row>

      <Row title="Kinh nghiệm tự học" href="/blog">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{posts.slice(0, 4).map((p) => <li key={p.slug}><PostCard p={p} /></li>)}</ul>
      </Row>

      <Row title="Lộ trình 0 → 9.0" href="/lo-trinh">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {roadmap.map((s, i) => (
            <li key={s.id}><Link href={`/lo-trinh/${stageSlug(s)}`} className="card block h-full p-4 transition hover:border-brand-300">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-300">Chặng {i + 1}</span>
              <span className="mt-1 block font-bold">{s.name}</span><span className="block text-xs text-muted">{s.range} · {s.weeks}</span>
            </Link></li>
          ))}
        </ol>
      </Row>

      <section className="container-x mt-16">
        <div className="relative overflow-hidden rounded-3xl bg-brand-700 px-6 py-10 text-white sm:px-12">
          <svg aria-hidden className="absolute -right-10 -top-10 size-64 text-white/10" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" /><circle cx="50" cy="50" r="24" fill="none" stroke="currentColor" strokeWidth="8" /></svg>
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div><h2 className="title-display text-3xl">Bắt đầu với 20 phút mỗi ngày</h2><p className="mt-2 max-w-xl text-brand-100">10 thẻ từ vựng, 1 bài chép chính tả và 1 đoạn Writing — đều đặn là cách nhanh nhất để lên band.</p></div>
            <Link href="/tu-vung/on-tap" className="btn bg-white px-6 py-3 text-base text-brand-800 hover:bg-brand-50">Học ngay <ArrowRight className="size-4" /></Link>
          </div>
        </div>
      </section>

      <section className="container-x mt-16 max-w-3xl">
        <h2 className="title-display text-center text-3xl">Câu hỏi thường gặp</h2>
        <div className="mt-6 space-y-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="card group p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">{q}<span className="text-xl leading-none text-brand-500 transition group-open:rotate-45">+</span></summary>
              <p className="mt-3 text-sm text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
