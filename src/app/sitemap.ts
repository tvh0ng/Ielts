import type { MetadataRoute } from "next";
import { SKILL_SLUG, notes, roadmap, stageSlug, topics } from "@/lib/data";
import { EX_META } from "@/lib/exercises";
import { dictations, samples, tests } from "@/lib/content";
import { posts } from "@/lib/blog";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const u = (p: string, priority = 0.6, changeFrequency: "weekly" | "monthly" = "monthly") => ({ url: SITE.url + p, lastModified: now, changeFrequency, priority });
  return [
    u("/", 1, "weekly"), u("/lo-trinh", 0.9), u("/tu-vung", 0.9, "weekly"), u("/ngu-phap", 0.8), u("/luyen-tap", 0.8),
    u("/luyen-tap/writing", 0.8), u("/luyen-tap/speaking", 0.8), u("/tinh-diem", 0.8), u("/tai-lieu", 0.7),
    ...roadmap.map((s) => u(`/lo-trinh/${stageSlug(s)}`, 0.8)),
    ...Object.values(SKILL_SLUG).map((s) => u(`/ky-nang/${s}`, 0.8)),
    ...topics.map((t) => u(`/tu-vung/${t.slug}`, 0.7)),
    ...Object.keys(EX_META).map((e) => u(`/luyen-tap/${e}`, 0.6)),
    u("/de-thi", 0.9, "weekly"), u("/chep-chinh-ta", 0.9, "weekly"), u("/bai-mau", 0.9, "weekly"), u("/bai-mau/speaking", 0.7),
    ...tests.map((t) => u(`/de-thi/${t.slug}`, 0.8)),
    ...dictations.map((d) => u(`/chep-chinh-ta/${d.slug}`, 0.7)),
    ...samples.map((s) => u(`/bai-mau/${s.slug}`, 0.7)),
    u("/blog", 0.8, "weekly"), u("/nang-cap", 0.5),
    ...posts.map((p) => u(`/blog/${p.slug}`, 0.7)),
    ...notes.map((n) => u(`/tai-lieu/${n.slug}`, 0.6)),
  ];
}
