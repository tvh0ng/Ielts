import { MENU } from "@/lib/site";
import { topics, grammar, notes, roadmap, stageSlug, skills, SKILL_SLUG } from "@/lib/data";
import { dictations, tests, samples } from "@/lib/content";
import { posts } from "@/lib/blog";

export interface SearchEntry { t: string; s: string; href: string; k: string }

/** Chỉ mục tìm kiếm tĩnh — sinh lúc build, tải lười khi mở ô tìm kiếm. */
export function buildIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];
  MENU.forEach((g) => g.items.forEach(([href, t, s]) => out.push({ t, s: s || g.h, href, k: "Trang" })));
  posts.forEach((p) => out.push({ t: p.title, s: `Blog · ${p.category}`, href: `/blog/${p.slug}`, k: "Blog" }));
  tests.forEach((t) => out.push({ t: t.title, s: `IELTS ${t.skill} · ${t.sections.map((x) => x.title).join(" · ")}`, href: `/de-thi/${t.slug}`, k: "Đề thi" }));
  dictations.forEach((d) => out.push({ t: d.title, s: `Chép chính tả · ${d.part}`, href: `/chep-chinh-ta/${d.slug}`, k: "Luyện nghe" }));
  samples.forEach((x) => out.push({ t: x.title, s: `Bài mẫu Writing Task ${x.task}`, href: `/bai-mau/${x.slug}`, k: "Bài mẫu" }));
  topics.forEach((t) => out.push({ t: t.name, s: `${t.count} collocation`, href: `/tu-vung/${t.slug}`, k: "Chủ đề" }));
  roadmap.forEach((r) => out.push({ t: `Lộ trình ${r.name} (${r.range})`, s: r.weeks, href: `/lo-trinh/${stageSlug(r)}`, k: "Lộ trình" }));
  (Object.keys(skills) as (keyof typeof skills)[]).forEach((k) => skills[k].types.forEach((q) => out.push({ t: q.t, s: `${skills[k].name} · ${q.s}`, href: `/ky-nang/${SKILL_SLUG[k]}`, k: "Dạng bài" })));
  grammar.forEach((g) => out.push({ t: g.t, s: `Ngữ pháp · ${g.lv}`, href: "/ngu-phap", k: "Ngữ pháp" }));
  notes.forEach((n) => out.push({ t: n.label, s: "Tài liệu", href: `/tai-lieu/${n.slug}`, k: "Tài liệu" }));
  return out;
}

