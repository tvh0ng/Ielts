import Link from "next/link";
import type { Metadata } from "next";
import { Check, Clock3, Minus } from "lucide-react";
import { CHECKOUT_URL, CONTACT_EMAIL, PLANS, vnd } from "@/lib/plans";
import { Crumbs, PageHead } from "@/components/ui";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Bảng giá & gói Pro", description: "Học IELTS miễn phí trọn đời hoặc nâng cấp Pro để được chấm AI Writing, Speaking chi tiết.", alternates: { canonical: "/nang-cap" } };

const FAQ: [string, string][] = [
  ["Gói miễn phí có giới hạn thời gian không?", "Không. Toàn bộ nội dung học, đề thi và flashcard luôn miễn phí."],
  ["Thanh toán bằng cách nào?", "Bạn có thể thanh toán qua chuyển khoản/QR hoặc thẻ. Sau khi thanh toán, tài khoản được kích hoạt trong vòng 24 giờ."],
  ["Có hoàn tiền không?", "Nếu chưa sử dụng tính năng Pro, bạn được hoàn tiền trong 7 ngày kể từ khi thanh toán."],
];

export default function Page() {
  const cta = (id: string) => CHECKOUT_URL ? `${CHECKOUT_URL}${CHECKOUT_URL.includes("?") ? "&" : "?"}plan=${id}` : CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Đăng ký IELTS Master " + id)}` : "/tu-vung/on-tap";
  return (
    <>
      <Crumbs items={[["/nang-cap", "Bảng giá"]]} />
      <PageHead eyebrow="Bảng giá" title="Học miễn phí, nâng cấp khi bạn cần" desc="Mọi nội dung học đều miễn phí. Gói Pro dành cho người muốn được AI chấm Writing & Speaking chi tiết mỗi ngày." />
      <div className="container-x mt-10 grid gap-5 lg:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.id} className={cn("card relative flex flex-col p-7", p.highlight && "border-2 border-brand-500 shadow-xl")}>
            {p.highlight && <span className="absolute -top-3 left-7 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white">Phổ biến nhất</span>}
            <h2 className="text-lg font-bold">{p.name}</h2>
            <p className="mt-3"><span className="title-display text-4xl">{vnd(p.price)}</span> <span className="text-muted">{p.period}</span></p>
            {p.note && <p className="mt-1 text-sm font-semibold text-accent-600 dark:text-accent-400">{p.note}</p>}
            <ul className="mt-6 flex-1 space-y-2.5 text-sm">
              {p.features.map(([f, on]) => (
                <li key={f} className={cn("flex items-start gap-2", !on && "text-muted")}>
                  {on === true ? <Check className="mt-0.5 size-4 shrink-0 text-brand-500" /> : on === "soon" ? <Clock3 className="mt-0.5 size-4 shrink-0 text-accent-500" /> : <Minus className="mt-0.5 size-4 shrink-0" />}
                  <span>{f}{on === "soon" && <span className="ml-1.5 rounded bg-accent-400/20 px-1.5 text-[11px] font-semibold text-accent-600 dark:text-accent-400">Sắp có</span>}</span>
                </li>
              ))}
            </ul>
            {p.price === 0 ? <Link href="/tu-vung/on-tap" className="btn-ghost mt-7 py-3">Bắt đầu miễn phí</Link>
              : <a href={cta(p.id)} className={cn("mt-7 py-3", p.highlight ? "btn-primary" : "btn-ghost")}>Nâng cấp {p.name}</a>}
          </div>
        ))}
      </div>
      <section className="container-x mt-14 max-w-3xl">
        <h2 className="title-display text-center text-2xl">Câu hỏi về thanh toán</h2>
        <div className="mt-5 space-y-3">{FAQ.map(([q, a]) => <details key={q} className="card p-5"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-2 text-sm text-muted">{a}</p></details>)}</div>
      </section>
    </>
  );
}
