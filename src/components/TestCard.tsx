import Link from "next/link";
import { countQuestions, type MockTest } from "@/lib/content";
import { Cover } from "./Cover";

export function TestCard({ t }: { t: MockTest }) {
  return (
    <Link href={`/de-thi/${t.slug}`} className="group block">
      <Cover label={`IELTS ${t.skill}`} big={t.title.replace(`${t.skill} `, "")} theme={t.color} badge={`${countQuestions(t)} câu · ${t.minutes} phút`} className="transition group-hover:-translate-y-0.5 group-hover:shadow-lg" />
      <h3 className="mt-3 text-lg font-bold">{t.title}</h3>
      <p className="mt-1 text-sm text-muted">{t.sections.length} phần · Band {t.level}</p>
      <span className="mt-1 inline-block text-sm font-semibold text-brand-600 dark:text-brand-300">Làm bài →</span>
    </Link>
  );
}
