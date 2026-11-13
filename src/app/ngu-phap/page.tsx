import type { Metadata } from "next";
import { grammar } from "@/lib/data";
import { Crumbs, PageHead } from "@/components/ui";
import { GrammarList } from "@/components/GrammarList";

export const metadata: Metadata = {
  title: "Ngữ pháp IELTS theo band (Nền tảng → 9.0)",
  description: `${grammar.length} chủ điểm ngữ pháp IELTS xếp theo band: công thức, ví dụ học thuật và cách dùng trong Writing, Speaking.`,
  alternates: { canonical: "/ngu-phap" },
};

export default function Page() {
  return (
    <>
      <Crumbs items={[["/ngu-phap", "Ngữ pháp"]]} />
      <PageHead eyebrow="Ngữ pháp" title="Ngữ pháp IELTS theo từng band" desc="Học đúng cấu trúc bạn cần cho band mục tiêu — mỗi chủ điểm có công thức, ví dụ chuẩn văn phong IELTS và cách áp dụng." />
      <div className="container-x mt-8"><GrammarList items={grammar} /></div>
    </>
  );
}
