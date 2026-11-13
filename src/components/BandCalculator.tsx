"use client";
import { useState } from "react";
import { overallBand, rawToBand } from "@/lib/analyze";
import { cn } from "@/lib/cn";

type Conv = Record<"L" | "RA" | "RG", [number, number][]>;
const WS = ["4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0"];

export function BandCalculator({ conv }: { conv: Conv }) {
  const [l, setL] = useState(27); const [r, setR] = useState(27);
  const [mod, setMod] = useState<"RA" | "RG">("RA");
  const [w, setW] = useState("6.0"); const [s, setS] = useState("6.0");
  const bl = rawToBand(conv.L, l), br = rawToBand(conv[mod], r);
  const ov = overallBand([bl, br, +w, +s]);
  const avg = (bl + br + +w + +s) / 4;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="card space-y-6 p-6">
        <div className="inline-flex rounded-xl border border-line bg-surface p-1">
          {(["RA", "RG"] as const).map((m) => <button key={m} onClick={() => setMod(m)} aria-pressed={mod === m} className={cn("btn py-1.5", mod === m ? "bg-brand-500 text-white" : "text-muted")}>{m === "RA" ? "Academic" : "General Training"}</button>)}
        </div>
        <Slider label="Listening — số câu đúng" v={l} set={setL} band={bl} />
        <Slider label={`Reading (${mod === "RA" ? "Academic" : "General"}) — số câu đúng`} v={r} set={setR} band={br} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Pick label="Writing (band)" v={w} set={setW} />
          <Pick label="Speaking (band)" v={s} set={setS} />
        </div>
      </div>
      <div className="card flex flex-col items-center justify-center bg-brand-700 p-8 text-center text-white border-brand-700 lg:sticky lg:top-20 lg:self-start">
        <p className="text-sm font-semibold text-brand-100">Overall band dự kiến</p>
        <p className="title-display mt-2 text-7xl tabular-nums">{ov.toFixed(1)}</p>
        <p className="mt-2 text-xs text-brand-100">Trung bình {avg.toFixed(3)} → làm tròn theo quy tắc IELTS</p>
        <div className="mt-6 grid w-full grid-cols-4 gap-2 text-xs">
          {[["L", bl], ["R", br], ["W", +w], ["S", +s]].map(([k, v]) => <div key={k as string} className="rounded-lg bg-white/10 py-2"><p className="font-bold text-base">{(v as number).toFixed(1)}</p><p className="text-brand-100">{k}</p></div>)}
        </div>
      </div>
    </div>
  );
}

function Slider({ label, v, set, band }: { label: string; v: number; set: (n: number) => void; band: number }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-sm font-semibold"><span>{label}</span><span className="tabular-nums"><b className="text-lg">{v}</b>/40 → <span className="rounded-md bg-brand-500/10 px-2 py-0.5 font-bold text-brand-700 dark:text-brand-200">Band {band.toFixed(1)}</span></span></span>
      <input type="range" min={0} max={40} value={v} onChange={(e) => set(+e.target.value)} className="mt-3 w-full accent-brand-500" />
    </label>
  );
}
function Pick({ label, v, set }: { label: string; v: string; set: (s: string) => void }) {
  return <label className="text-sm font-semibold">{label}<select className="input mt-1" value={v} onChange={(e) => set(e.target.value)}>{WS.map((x) => <option key={x}>{x}</option>)}</select></label>;
}
