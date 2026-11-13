"use client";
import { useState } from "react";
import { Download, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useStore } from "@/lib/storage";
import type { UserCard } from "./ReviewSession";
import type { SrsMap } from "@/lib/srs";

const EMPTY = { c: "", m: "", e: "", ipa: "", topic: "" };

export function MyCards() {
  const [cards, setCards, ok] = useStore<UserCard[]>("user-cards", []);
  const [, setSrs] = useStore<SrsMap>("srs", {});
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [bulk, setBulk] = useState("");
  const [msg, setMsg] = useState("");

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.c.trim() || !form.m.trim()) return setMsg("Cần nhập cụm từ và nghĩa.");
    if (editing) setCards(cards.map((c) => (c.key === editing ? { ...c, ...form } : c)));
    else setCards([{ key: `u:${Date.now().toString(36)}`, ...form, topic: form.topic || "Thẻ của tôi" }, ...cards]);
    setForm(EMPTY); setEditing(null); setMsg("Đã lưu ✓");
  };
  const del = (k: string) => {
    if (!confirm("Xoá thẻ này?")) return;
    setCards(cards.filter((c) => c.key !== k));
    setSrs((m) => { const n = { ...m }; delete n[k]; return n; });
  };
  const importBulk = () => {
    const rows = bulk.split(/\n/).map((l) => l.split(/\t|\s*\|\s*|;/).map((x) => x.trim())).filter((r) => r[0] && r[1]);
    const t = Date.now();
    setCards([...rows.map((r, i) => ({ key: `u:${(t + i).toString(36)}`, c: r[0], m: r[1], e: r[2] || "", ipa: r[3] || "", topic: r[4] || "Thẻ của tôi" })), ...cards]);
    setMsg(`Đã nhập ${rows.length} thẻ ✓`); setBulk("");
  };
  const exportCsv = () => {
    const esc = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;
    const csv = "﻿collocation,meaning,example,ipa,topic\n" + cards.map((c) => [c.c, c.m, c.e, c.ipa, c.topic].map(esc).join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "ielts-master-the-cua-toi.csv"; a.click();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <div className="space-y-6">
        <form onSubmit={save} className="card space-y-3 p-5">
          <h2 className="title-display text-lg">{editing ? "Sửa thẻ" : "Thêm thẻ mới"}</h2>
          <input className="input" placeholder="Cụm từ (vd: tackle a problem) *" value={form.c} onChange={(e) => setForm({ ...form, c: e.target.value })} />
          <input className="input" placeholder="Nghĩa tiếng Việt *" value={form.m} onChange={(e) => setForm({ ...form, m: e.target.value })} />
          <textarea className="input min-h-20" placeholder="Câu ví dụ" value={form.e} onChange={(e) => setForm({ ...form, e: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <input className="input" placeholder="IPA" value={form.ipa} onChange={(e) => setForm({ ...form, ipa: e.target.value })} />
            <input className="input" placeholder="Chủ đề" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button className="btn-primary flex-1" type="submit"><Plus className="size-4" />{editing ? "Cập nhật" : "Thêm thẻ"}</button>
            {editing && <button type="button" className="btn-ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Huỷ</button>}
          </div>
          {msg && <p className="text-sm text-brand-600 dark:text-brand-300" role="status">{msg}</p>}
        </form>
        <div className="card space-y-3 p-5">
          <h2 className="title-display text-lg">Nhập nhanh nhiều thẻ</h2>
          <p className="text-xs text-muted">Mỗi dòng một thẻ, phân cách bằng Tab, “|” hoặc “;”: <code>cụm từ | nghĩa | ví dụ | IPA | chủ đề</code>. Dán trực tiếp từ Excel/Google Sheets được.</p>
          <textarea className="input min-h-28 font-mono text-xs" value={bulk} onChange={(e) => setBulk(e.target.value)} placeholder={"make an effort | nỗ lực | I make an effort to read daily."} />
          <div className="flex gap-2">
            <button className="btn-ghost flex-1" onClick={importBulk} disabled={!bulk.trim()}><Upload className="size-4" />Nhập</button>
            <button className="btn-ghost flex-1" onClick={exportCsv} disabled={!cards.length}><Download className="size-4" />Xuất CSV</button>
          </div>
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4"><h2 className="font-bold">{ok ? cards.length : 0} thẻ</h2></div>
        {ok && cards.length ? (
          <ul className="divide-y divide-line">
            {cards.map((c) => (
              <li key={c.key} className="flex items-start gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{c.c} <span className="text-xs font-normal text-muted">{c.ipa}</span></p>
                  <p className="text-sm">{c.m}</p>
                  {c.e && <p className="text-xs italic text-muted truncate">{c.e}</p>}
                </div>
                <span className="chip hidden sm:inline-flex">{c.topic}</span>
                <button className="grid size-9 place-items-center rounded-lg text-muted hover:bg-surface-2" aria-label="Sửa" onClick={() => { setEditing(c.key); setForm({ c: c.c, m: c.m, e: c.e, ipa: c.ipa, topic: c.topic }); }}><Pencil className="size-4" /></button>
                <button className="grid size-9 place-items-center rounded-lg text-muted hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30" aria-label="Xoá" onClick={() => del(c.key)}><Trash2 className="size-4" /></button>
              </li>
            ))}
          </ul>
        ) : <p className="p-10 text-center text-muted">Chưa có thẻ nào. Thêm thẻ đầu tiên ở bên trái.</p>}
      </div>
    </div>
  );
}
