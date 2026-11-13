import Link from "next/link";
import type { WritingSample } from "@/lib/content";
import { Cover } from "./Cover";

export function SampleCard({ s }: { s: WritingSample }) {
  return (
    <Link href={`/bai-mau/${s.slug}`} className="group block">
      <Cover label={`Writing Task ${s.task} · ${s.type}`} big={`Band ${s.band}`} theme={s.task === 1 ? "sky" : "amber"} className="transition group-hover:-translate-y-0.5 group-hover:shadow-lg" />
      <h3 className="mt-3 font-bold leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-300">{s.title}</h3>
      <p className="mt-1 text-xs text-muted">Dàn ý · bài mẫu · {s.vocab.length} từ vựng hay</p>
    </Link>
  );
}
