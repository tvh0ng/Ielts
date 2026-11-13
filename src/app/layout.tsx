import type { Metadata, Viewport } from "next";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource-variable/bricolage-grotesque/index.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE, MENU } from "@/lib/site";
import { topics, grammar, notes, roadmap, stageSlug, skills, SKILL_SLUG } from "@/lib/data";
import { dictations, tests, samples } from "@/lib/content";
import type { SearchEntry } from "@/components/SearchPalette";


export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["IELTS", "lộ trình IELTS", "tự học IELTS", "từ vựng IELTS", "collocation", "IELTS Writing", "IELTS Speaking", "band 7.0", "flashcard"],
  openGraph: { type: "website", locale: SITE.locale, siteName: SITE.name, title: `${SITE.name} — ${SITE.tagline}`, description: SITE.description, url: SITE.url },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f4f7f6" }, { media: "(prefers-color-scheme: dark)", color: "#0c1719" }],
};

const themeScript = `try{var t=localStorage.getItem('im2:theme');t=t?JSON.parse(t):'system';if(t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

function buildIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];
  MENU.forEach((g) => g.items.forEach(([href, t, s]) => out.push({ t, s: s || g.h, href, k: "Trang" })));
  tests.forEach((t) => out.push({ t: t.title, s: `IELTS ${t.skill} · ${t.minutes} phút`, href: `/de-thi/${t.slug}`, k: "Đề thi" }));
  dictations.forEach((d) => out.push({ t: d.title, s: `Chép chính tả · ${d.part}`, href: `/chep-chinh-ta/${d.slug}`, k: "Luyện nghe" }));
  samples.forEach((x) => out.push({ t: x.title, s: `Bài mẫu Writing Task ${x.task}`, href: `/bai-mau/${x.slug}`, k: "Bài mẫu" }));
  topics.forEach((t) => out.push({ t: t.name, s: `${t.count} collocation`, href: `/tu-vung/${t.slug}`, k: "Chủ đề" }));
  roadmap.forEach((r) => out.push({ t: `Lộ trình ${r.name} (${r.range})`, s: r.weeks, href: `/lo-trinh/${stageSlug(r)}`, k: "Lộ trình" }));
  (Object.keys(skills) as (keyof typeof skills)[]).forEach((k) => skills[k].types.forEach((q) => out.push({ t: q.t, s: `${skills[k].name} · ${q.s}`, href: `/ky-nang/${SKILL_SLUG[k]}`, k: "Dạng bài" })));
  grammar.forEach((g) => out.push({ t: g.t, s: `Ngữ pháp · ${g.lv}`, href: "/ngu-phap", k: "Ngữ pháp" }));
  notes.forEach((n) => out.push({ t: n.label, s: "Tài liệu", href: `/tai-lieu/${n.slug}`, k: "Tài liệu" }));
  return out;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh font-sans flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 btn-primary">Bỏ qua tới nội dung</a>
        <Header index={buildIndex()} topicName={Object.fromEntries(topics.map((t) => [t.slug, t.name]))} />
        <main id="main" className="flex-1 pb-24 md:pb-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
