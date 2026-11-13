import Link from "next/link";
import { ArrowRight, Bot, Brain, Headphones, BookOpenText, PenLine, Mic, Map, Sparkles, Smartphone } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";
import { JsonLd } from "@/components/ui";
import { cards, roadmap, skills, stageSlug, topics, grammar, notes } from "@/lib/data";
import { SITE } from "@/lib/site";

const FAQ: [string, string][] = [
  ["IELTS Master có miễn phí không?", "Có. Toàn bộ lộ trình, 1.100+ collocation, ngữ pháp, bài tập và công cụ tính điểm đều miễn phí. Tiến độ lưu ngay trên trình duyệt của bạn, không cần đăng ký."],
  ["Tự học từ 4.5 lên 7.0 mất bao lâu?", "Thông thường cần khoảng 400–500 giờ học có định hướng. Hãy nhập band hiện tại, mục tiêu và số giờ học mỗi ngày ở Bảng học để có ước tính riêng cho bạn."],
  ["Flashcard ở đây khác gì học thuộc thông thường?", "Thẻ được lên lịch ôn theo thuật toán lặp lại ngắt quãng (giống Anki): từ bạn nhớ tốt sẽ giãn lịch ôn, từ hay quên sẽ quay lại sớm hơn — tiết kiệm thời gian mà nhớ lâu."],
  ["AI chấm Writing/Speaking chính xác đến mức nào?", "AI chấm theo 4 tiêu chí của band descriptors công khai và chỉ ra lỗi cụ thể để bạn sửa. Đây là điểm ước lượng để luyện tập, không thay thế giám khảo chính thức."],
];

const SK_ICON = { L: Headphones, R: BookOpenText, W: PenLine, S: Mic } as const;
const SK_SLUG = { L: "listening", R: "reading", W: "writing", S: "speaking" } as const;

export default function Home() {
  const stages = roadmap.map((s) => ({ id: s.id, name: s.name, range: s.range, lo: s.lo, hi: s.hi, hours: s.hours, slug: stageSlug(s) }));
  const qTypes = Object.values(skills).reduce((a, s) => a + s.types.length, 0);
  const stats = [[`${cards.length.toLocaleString("vi-VN")}+`, "collocation có ví dụ & IPA"], [`${topics.length}`, "chủ đề từ vựng"], [`${qTypes}`, "dạng bài 4 kỹ năng"], [`${grammar.length}`, "chủ điểm ngữ pháp"]];

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: SITE.url, inLanguage: "vi", description: SITE.description }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }} />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_10%_-10%,color-mix(in_oklab,var(--color-brand-300)_35%,transparent),transparent_60%),radial-gradient(700px_380px_at_100%_0%,color-mix(in_oklab,var(--color-accent-400)_22%,transparent),transparent_60%)]" />
        <div className="container-x relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <span className="chip"><Sparkles className="size-3.5 text-accent-500" /> Miễn phí · Không cần đăng ký</span>
            <h1 className="title-display mt-5 text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
              Lộ trình IELTS <span className="whitespace-nowrap text-brand-500">0 → 9.0</span>, học mỗi ngày 20 phút cũng tiến bộ.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted text-pretty">
              Biết chính xác cần học gì ở từng band, ôn từ vựng bằng flashcard thông minh và luyện Writing, Speaking có AI chấm điểm — tất cả trong một nơi.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/lo-trinh" className="btn-primary text-base px-6 py-3">Xem lộ trình của tôi <ArrowRight className="size-4" /></Link>
              <Link href="/tu-vung/on-tap" className="btn-ghost text-base px-6 py-3">Học 10 thẻ đầu tiên</Link>
            </div>
            <dl className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
              {stats.map(([v, l]) => (
                <div key={l}><dt className="sr-only">{l}</dt><dd className="title-display text-2xl">{v}</dd><dd className="text-xs text-muted">{l}</dd></div>
              ))}
            </dl>
          </div>
          <HeroCard />
        </div>
      </section>

      <div className="container-x mt-10"><Dashboard stages={stages} /></div>

      {/* ROADMAP */}
      <section className="container-x mt-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="eyebrow">Lộ trình</p><h2 className="title-display mt-1 text-3xl">6 chặng từ nền tảng tới 9.0</h2></div>
          <Link href="/lo-trinh" className="text-sm font-semibold text-brand-600 dark:text-brand-300 hover:underline">Xem chi tiết →</Link>
        </div>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roadmap.map((s, i) => (
            <li key={s.id}>
              <Link href={`/lo-trinh/${stageSlug(s)}`} className="card group flex h-full gap-4 p-5 transition hover:-translate-y-0.5 hover:border-brand-300">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-500 font-display text-lg font-extrabold text-white">{i + 1}</span>
                <span>
                  <span className="block font-display text-lg font-bold">{s.name} <span className="text-muted font-semibold text-sm">· {s.range}</span></span>
                  <span className="mt-1 block text-sm text-muted line-clamp-2">{s.summary}</span>
                  <span className="mt-2 block text-xs font-semibold text-brand-600 dark:text-brand-300">{s.weeks} · ~{s.hours} giờ</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* FEATURES */}
      <section className="container-x mt-16">
        <p className="eyebrow">Tại sao IELTS Master</p>
        <h2 className="title-display mt-1 text-3xl">Học đúng thứ cần học, nhớ lâu hơn</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            [Map, "Lộ trình theo band", "Mỗi chặng có mục tiêu điểm từng kỹ năng, ngữ pháp, dạng bài, lịch tuần mẫu, checklist và tiêu chí “qua môn”."],
            [Brain, "Flashcard lặp lại ngắt quãng", "Thuật toán như Anki: chấm Quên / Khó / Nhớ / Dễ, hệ thống tự hẹn ngày ôn. Có phát âm Anh–Anh, Anh–Mỹ và IPA."],
            [Bot, "AI chấm Writing & Speaking", "Chấm 4 tiêu chí, gạch lỗi và sửa một chạm, tạo bài mẫu band 8–9. Thu âm Speaking và chuyển lời nói thành chữ."],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof Map;
            return (
              <div key={t as string} className="card p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-200"><I className="size-5" /></span>
                <h3 className="mt-4 font-display text-lg font-bold">{t as string}</h3>
                <p className="mt-2 text-sm text-muted">{d as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SKILLS */}
      <section className="container-x mt-16">
        <p className="eyebrow">4 kỹ năng</p>
        <h2 className="title-display mt-1 text-3xl">Nắm chắc từng dạng bài</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(skills) as (keyof typeof SK_ICON)[]).map((k) => {
            const I = SK_ICON[k]; const s = skills[k];
            return (
              <Link key={k} href={`/ky-nang/${SK_SLUG[k]}`} className="card p-5 transition hover:-translate-y-0.5 hover:border-brand-300">
                <I className="size-6 text-brand-500" />
                <h3 className="mt-3 font-display text-lg font-bold">{s.name}</h3>
                <p className="mt-1 text-sm text-muted">{s.types.length} dạng bài · {s.fmt[0][0]}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* LIBRARY + PWA */}
      <section className="container-x mt-16 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="card p-6">
          <p className="eyebrow">Thư viện</p>
          <h2 className="title-display mt-1 text-2xl">Tài liệu tự học</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {notes.map((n) => <li key={n.slug}><Link href={`/tai-lieu/${n.slug}`} className="block rounded-xl bg-surface-2 px-4 py-3 text-sm font-semibold hover:bg-brand-50 dark:hover:bg-brand-900/30">{n.label}</Link></li>)}
          </ul>
        </div>
        <div className="card flex flex-col justify-between p-6 bg-brand-700 text-white border-brand-700">
          <div>
            <Smartphone className="size-7" />
            <h2 className="title-display mt-3 text-2xl">Cài như một app</h2>
            <p className="mt-2 text-sm text-brand-100">Trên điện thoại, chọn “Thêm vào màn hình chính” để mở IELTS Master toàn màn hình, nhanh như ứng dụng.</p>
          </div>
          <Link href="/tu-vung/on-tap" className="btn mt-6 bg-white text-brand-800 hover:bg-brand-50">Bắt đầu học</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x mt-16 max-w-3xl">
        <h2 className="title-display text-3xl text-center">Câu hỏi thường gặp</h2>
        <div className="mt-6 space-y-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="card group p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">{q}<span className="text-brand-500 transition group-open:rotate-45 text-xl leading-none">+</span></summary>
              <p className="mt-3 text-sm text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

function HeroCard() {
  const c = cards.find((x) => x.c === "acquire knowledge") || cards[0];
  return (
    <div className="relative mx-auto hidden w-full max-w-md sm:block" aria-hidden="true">
      <div className="absolute -inset-4 -z-10 rotate-3 rounded-3xl bg-accent-400/25" />
      <div className="card p-6 sm:p-8">
        <div className="flex items-center justify-between text-xs font-semibold text-muted"><span>Education</span><span>Thẻ 1 / 20</span></div>
        <p className="title-display mt-8 text-3xl">{c.c}</p>
        <p className="mt-1 text-sm text-muted">{c.ipa}</p>
        <div className="my-6 h-px bg-line" />
        <p className="font-semibold">{c.m}</p>
        <p className="mt-2 text-sm italic text-muted">“{c.e}”</p>
        <div className="mt-8 grid grid-cols-4 gap-2 text-center text-xs font-bold">
          <span className="rounded-lg bg-rose-100 py-2 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">Quên</span>
          <span className="rounded-lg bg-amber-100 py-2 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">Khó</span>
          <span className="rounded-lg bg-brand-100 py-2 text-brand-800 dark:bg-brand-900/50 dark:text-brand-200">Nhớ</span>
          <span className="rounded-lg bg-sky-100 py-2 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200">Dễ</span>
        </div>
      </div>
    </div>
  );
}
