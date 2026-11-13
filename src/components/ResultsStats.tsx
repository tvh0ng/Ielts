"use client";
import Link from "next/link";
import { useStore } from "@/lib/storage";
import { TYPE_LABEL, type Attempt } from "@/lib/attempts";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** Thống kê kết quả luyện đề: band trung bình theo kỹ năng, độ chính xác theo dạng câu hỏi, lịch sử làm bài. */
export function ResultsStats() {
  const [atts, , ok] = useStore<Attempt[]>("attempts", []);
  if (!ok) return null;
  if (!atts.length) return (
    <section className="card p-6"><h2 className="title-display text-xl">Kết quả luyện thi</h2><p className="mt-2 text-sm text-muted">Bạn chưa làm đề nào. <Link href="/de-thi" className="font-semibold text-brand-600 dark:text-brand-300">Làm đề đầu tiên →</Link></p></section>
  );
  const bySkill = ["Reading", "Listening"].map((sk) => { const xs = atts.filter((a) => a.skill === sk); return { sk, n: xs.length, avg: xs.length ? xs.reduce((s, a) => s + a.band, 0) / xs.length : null, best: xs.length ? Math.max(...xs.map((a) => a.band)) : null }; });
  const types: Record<string, [number, number]> = {};
  atts.forEach((a) => Object.entries(a.byType).forEach(([k, [c, t]]) => { const v = types[k] || [0, 0]; types[k] = [v[0] + c, v[1] + t]; }));
  const rows = Object.entries(types).map(([k, [c, t]]) => ({ k, pct: Math.round((c / t) * 100), c, t })).sort((x, y) => x.pct - y.pct);
  const totalSecs = atts.reduce((s, a) => s + a.secs, 0);

  return (
    <section className="space-y-5">
      <h2 className="title-display text-2xl">Kết quả luyện thi</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {bySkill.map((b) => (
          <div key={b.sk} className="card p-5"><p className="text-xs font-semibold text-muted">{b.sk}</p><p className="title-display mt-1 text-3xl tabular-nums">{b.avg != null ? b.avg.toFixed(1) : "–"}</p><p className="text-xs text-muted">{b.n ? `band TB · cao nhất ${b.best!.toFixed(1)} · ${b.n} lần làm` : "Chưa có lượt làm"}</p></div>
        ))}
        <div className="card p-5"><p className="text-xs font-semibold text-muted">Tổng thời gian luyện đề</p><p className="title-display mt-1 text-3xl tabular-nums">{Math.round(totalSecs / 60)} phút</p><p className="text-xs text-muted">{atts.length} lượt làm bài</p></div>
      </div>

      <div className="card p-6">
        <h3 className="font-bold">Độ chính xác theo dạng câu hỏi</h3>
        <p className="text-xs text-muted">Sắp xếp từ yếu đến mạnh — ưu tiên luyện dạng ở trên cùng.</p>
        <ul className="mt-4 space-y-3">
          {rows.map((r) => (
            <li key={r.k} className="grid grid-cols-[minmax(0,180px)_1fr_auto] items-center gap-3 text-sm" title={`${r.c}/${r.t} câu đúng`}>
              <span className="truncate">{TYPE_LABEL[r.k] || r.k}</span>
              <span className="h-3 overflow-hidden rounded-full bg-surface-2"><span className="block h-full rounded-r-[4px] bg-brand-500" style={{ width: `${Math.max(2, r.pct)}%` }} /></span>
              <span className="w-24 text-right tabular-nums"><b>{r.pct}%</b> <span className="text-muted">({r.c}/{r.t})</span></span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-surface-2 text-left text-xs uppercase tracking-wide text-muted"><tr><th className="px-4 py-3">Ngày</th><th className="px-4 py-3">Đề</th><th className="px-4 py-3">Chế độ</th><th className="px-4 py-3">Đúng</th><th className="px-4 py-3">Band</th><th className="px-4 py-3">Thời gian</th></tr></thead>
          <tbody>{atts.slice(0, 20).map((a) => (
            <tr key={a.ts} className="border-t border-line"><td className="px-4 py-2.5 text-muted">{new Date(a.ts).toLocaleDateString("vi-VN")}</td><td className="px-4 py-2.5"><Link href={`/de-thi/${a.slug}`} className="font-semibold hover:underline">{a.title}</Link></td><td className="px-4 py-2.5">{a.full ? "Full test" : "Luyện tập"}</td><td className="px-4 py-2.5 tabular-nums">{a.score}/{a.total}</td><td className="px-4 py-2.5 font-bold tabular-nums">{a.band.toFixed(1)}</td><td className="px-4 py-2.5 tabular-nums">{fmt(a.secs)}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  );
}
