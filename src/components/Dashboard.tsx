"use client";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Flame, Layers, Target } from "lucide-react";
import { useStore } from "@/lib/storage";
import { streakOf, todayCount, type Activity, dayKey } from "@/lib/progress";
import type { SrsMap } from "@/lib/srs";
import type { Stage } from "@/lib/types";

const BANDS = ["0", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0"];
export interface Goal { cur: string; tgt: string; date: string; hrs: string }
export const DEFAULT_GOAL: Goal = { cur: "4.5", tgt: "7.0", date: "", hrs: "2" };

export type StageLite = Pick<Stage, "id" | "name" | "range" | "lo" | "hi" | "hours"> & { slug: string };

export function Dashboard({ stages }: { stages: StageLite[] }) {
  const [goal, setGoal, ok] = useStore<Goal>("goal", DEFAULT_GOAL);
  const [srs] = useStore<SrsMap>("srs", {});
  const [act] = useStore<Activity>("activity", { days: {}, goal: 20 });

  const cur = +goal.cur, tgt = +goal.tgt;
  const path = stages.filter((s) => s.hi > cur && s.lo < tgt);
  const now = stages.find((s) => cur < s.hi) || stages[stages.length - 1];
  const hours = path.reduce((a, s) => a + s.hours * Math.min(1, (Math.min(tgt, s.hi) - Math.max(cur, s.lo)) / Math.max(0.5, s.hi - s.lo)), 0);
  const weeks = Math.ceil(hours / Math.max(0.5, +goal.hrs) / 7);
  const daysLeft = goal.date ? Math.ceil((new Date(goal.date).getTime() - Date.now()) / 86_400_000) : null;
  const ts = Date.now();
  const due = Object.values(srs).filter((s) => s.d <= ts).length;
  const learned = Object.keys(srs).length;
  const streak = streakOf(act);
  const last7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return { k: dayKey(d), n: act.days[dayKey(d)] || 0, l: d.getDay() === 0 ? "CN" : "T" + (d.getDay() + 1) }; });

  return (
    <section className="card p-5 sm:p-6" aria-labelledby="dash-h">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="dash-h" className="title-display text-xl">Bảng học của bạn</h2>
        <span className="text-xs text-muted">Lưu trên trình duyệt này · không cần tài khoản</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-semibold text-muted">Band hiện tại
          <select className="input mt-1" value={goal.cur} onChange={(e) => setGoal({ ...goal, cur: e.target.value })}>{BANDS.slice(0, -1).map((b) => <option key={b}>{b}</option>)}</select>
        </label>
        <label className="text-xs font-semibold text-muted">Mục tiêu
          <select className="input mt-1" value={goal.tgt} onChange={(e) => setGoal({ ...goal, tgt: e.target.value })}>{BANDS.slice(1).map((b) => <option key={b}>{b}</option>)}</select>
        </label>
        <label className="text-xs font-semibold text-muted">Ngày thi
          <input type="date" className="input mt-1" value={goal.date} onChange={(e) => setGoal({ ...goal, date: e.target.value })} />
        </label>
        <label className="text-xs font-semibold text-muted">Giờ học / ngày
          <select className="input mt-1" value={goal.hrs} onChange={(e) => setGoal({ ...goal, hrs: e.target.value })}>{["0.5", "1", "1.5", "2", "3", "4"].map((b) => <option key={b}>{b}</option>)}</select>
        </label>
      </div>

      {ok && (
        <>
          <div className="mt-5 grid gap-3 grid-cols-2 lg:grid-cols-4">
            <Stat Icon={Target} label="Ước tính cần" value={tgt <= cur ? "Đã đạt 🎉" : `~${Math.round(hours)} giờ`} sub={tgt > cur ? `≈ ${weeks} tuần với ${goal.hrs}h/ngày` : ""} />
            <Stat Icon={CalendarCheck} label="Còn tới ngày thi" value={daysLeft == null ? "—" : `${daysLeft} ngày`} sub={daysLeft != null && tgt > cur ? (daysLeft >= weeks * 7 ? "Đủ thời gian ✓" : "Nên tăng giờ học") : "Chọn ngày thi"} warn={daysLeft != null && daysLeft < weeks * 7} />
            <Stat Icon={Layers} label="Thẻ cần ôn hôm nay" value={String(due)} sub={`${learned} thẻ đã học`} />
            <Stat Icon={Flame} label="Chuỗi ngày" value={`${streak} ngày`} sub={`Hôm nay: ${todayCount(act)} hoạt động`} />
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-muted">7 ngày qua</p>
              <div className="mt-2 flex items-end gap-1.5" aria-hidden="true">
                {last7.map((d) => (
                  <div key={d.k} className="flex flex-col items-center gap-1">
                    <div className="w-6 rounded-md bg-brand-500" style={{ height: 6 + Math.min(40, d.n * 1.5), opacity: d.n ? 1 : 0.15 }} />
                    <span className="text-[10px] text-muted">{d.l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/lo-trinh/${now.slug}`} className="btn-ghost">Giai đoạn: {now.name} <ArrowRight className="size-4" /></Link>
              <Link href="/tu-vung/on-tap" className="btn-primary">{due ? `Ôn ${due} thẻ đến hạn` : "Học thẻ mới"} <ArrowRight className="size-4" /></Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function Stat({ Icon, label, value, sub, warn }: { Icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub?: string; warn?: boolean }) {
  return (
    <div className="rounded-xl bg-surface-2 p-3.5">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-muted"><Icon className="size-3.5" />{label}</p>
      <p className="mt-1 title-display text-2xl tabular-nums">{value}</p>
      {sub && <p className={`text-xs ${warn ? "text-accent-600 dark:text-accent-400 font-semibold" : "text-muted"}`}>{sub}</p>}
    </div>
  );
}
