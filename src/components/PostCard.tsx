import Link from "next/link";
import { fmtDate, type Post } from "@/lib/blog";
import { Cover, type CoverTheme } from "./Cover";

const THEME: Record<string, CoverTheme> = { "Lộ trình": "teal", Reading: "violet", Writing: "amber", Listening: "sky", Speaking: "rose" };
export function PostCard({ p }: { p: Post }) {
  return (
    <Link href={`/blog/${p.slug}`} className="group block">
      <Cover label={p.category} big={p.title.split(":")[0].slice(0, 44)} theme={THEME[p.category] || "lime"} className="transition group-hover:-translate-y-0.5 group-hover:shadow-lg [&_span:last-child]:text-xl" />
      <p className="mt-3 text-xs text-muted">{p.category} · {fmtDate(p.date)} · {p.minutes} phút đọc</p>
      <h3 className="mt-1 font-bold leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-300">{p.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{p.excerpt}</p>
    </Link>
  );
}
