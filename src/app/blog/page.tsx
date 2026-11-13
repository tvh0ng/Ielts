import type { Metadata } from "next";
import { posts } from "@/lib/blog";
import { Crumbs, PageHead } from "@/components/ui";
import { PostCard } from "@/components/PostCard";

export const metadata: Metadata = { title: "Blog tự học IELTS: kinh nghiệm, mẹo làm bài, lộ trình", description: "Bài viết hướng dẫn tự học IELTS: lộ trình theo band, mẹo làm Reading, Listening, cấu trúc Writing và Speaking.", alternates: { canonical: "/blog" } };

export default function Page() {
  return (
    <>
      <Crumbs items={[["/blog", "Blog"]]} />
      <PageHead eyebrow="Blog" title="Kinh nghiệm tự học IELTS" desc="Hướng dẫn ngắn gọn, áp dụng được ngay — viết cho người tự học." />
      <div className="container-x mt-8"><ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{posts.map((p) => <li key={p.slug}><PostCard p={p} /></li>)}</ul></div>
    </>
  );
}
