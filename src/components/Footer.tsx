import Link from "next/link";
import { Logo } from "./Logo";
import { SITE } from "@/lib/site";

const cols = [
  { h: "Luyện thi", links: [["/de-thi", "IELTS Online Test"], ["/chep-chinh-ta", "Chép chính tả"], ["/luyen-tap/writing", "Luyện Writing (AI)"], ["/luyen-tap/speaking", "Luyện Speaking (AI)"]] },
  { h: "Học", links: [["/lo-trinh", "Lộ trình 0 → 9.0"], ["/tu-vung", "1.100+ collocation"], ["/bai-mau", "Bài mẫu band 8.0+"], ["/ngu-phap", "Ngữ pháp theo band"]] },
  { h: "Công cụ", links: [["/tinh-diem", "Tính điểm band"], ["/ky-nang/listening", "Dạng bài 4 kỹ năng"], ["/tai-lieu", "Tài liệu tự học"], ["/tien-do", "Kết quả & tiến độ"], ["/blog", "Blog"], ["/nang-cap", "Bảng giá"]] },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="container-x grid gap-10 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">{SITE.description}</p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <h2 className="text-sm font-bold">{c.h}</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {c.links.map(([href, label]) => <li key={href}><Link className="hover:text-ink" href={href}>{label}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <p className="container-x py-5 text-xs text-muted">© {new Date().getFullYear()} {SITE.name}. IELTS là thương hiệu của British Council, IDP và Cambridge University Press &amp; Assessment; website này không liên kết với các tổ chức trên. Mô tả band là bản diễn giải tóm tắt.</p>
      </div>
    </footer>
  );
}
