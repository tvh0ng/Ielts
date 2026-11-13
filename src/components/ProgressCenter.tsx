"use client";
import { useRef, useState } from "react";
import { Download, Trash2, Upload } from "lucide-react";
import { useStore } from "@/lib/storage";
import type { SrsMap } from "@/lib/srs";
import { streakOf, type Activity } from "@/lib/progress";
import { RecentActivity } from "./RecentActivity";

const PREFIX = "im2:";
export function ProgressCenter() {
  const [srs, , ok] = useStore<SrsMap>("srs", {});
  const [act] = useStore<Activity>("activity", { days: {}, goal: 20 });
  const [dict] = useStore<Record<string, number>>("dict-progress", {});
  const [msg, setMsg] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const now = Date.now();
  const cards = Object.values(srs);
  const stats = [
    ["Thẻ đã học", cards.length], ["Thẻ thuộc lâu (≥21 ngày)", cards.filter((c) => c.i >= 21).length], ["Đến hạn ôn", cards.filter((c) => c.d <= now).length],
    ["Ngày học", Object.keys(act.days).length], ["Chuỗi hiện tại", streakOf(act)], ["Câu chép chính tả đúng", Object.values(dict).reduce((a, b) => a + b, 0)],
  ];

  const exportAll = () => {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i)!; if (k.startsWith(PREFIX)) data[k] = JSON.parse(localStorage.getItem(k) || "null"); }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify({ app: "ielts-master", v: 2, at: new Date().toISOString(), data }, null, 1)], { type: "application/json" }));
    a.download = `ielts-master-sao-luu-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  };
  const importAll = async (f: File) => {
    try {
      const j = JSON.parse(await f.text());
      if (j.app !== "ielts-master") throw new Error();
      Object.entries(j.data as Record<string, unknown>).forEach(([k, v]) => k.startsWith(PREFIX) && localStorage.setItem(k, JSON.stringify(v)));
      setMsg("Đã khôi phục. Đang tải lại…"); setTimeout(() => location.reload(), 600);
    } catch { setMsg("File không hợp lệ."); }
  };
  const reset = () => {
    if (!confirm("Xoá toàn bộ tiến độ trên trình duyệt này? Không thể hoàn tác.")) return;
    Object.keys(localStorage).filter((k) => k.startsWith(PREFIX)).forEach((k) => localStorage.removeItem(k)); location.reload();
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {stats.map(([l, v]) => <div key={l as string} className="card p-4"><p className="title-display text-3xl tabular-nums">{ok ? v : "–"}</p><p className="mt-1 text-xs text-muted">{l}</p></div>)}
      </div>
      <RecentActivity title="Hoạt động gần đây" limit={9} />
      <section className="card p-6">
        <h2 className="title-display text-xl">Sao lưu & chuyển máy</h2>
        <p className="mt-1 text-sm text-muted">Tiến độ đang lưu trên trình duyệt này. Xuất file sao lưu để chuyển sang máy khác hoặc phòng khi xoá dữ liệu trình duyệt.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="btn-primary" onClick={exportAll}><Download className="size-4" />Tải file sao lưu</button>
          <button className="btn-ghost" onClick={() => file.current?.click()}><Upload className="size-4" />Khôi phục từ file</button>
          <input ref={file} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && importAll(e.target.files[0])} />
          <button className="btn-ghost text-rose-600 ml-auto" onClick={reset}><Trash2 className="size-4" />Xoá tiến độ</button>
        </div>
        {msg && <p className="mt-3 text-sm font-semibold" role="status">{msg}</p>}
      </section>
    </div>
  );
}
