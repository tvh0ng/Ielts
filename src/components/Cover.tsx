import { cn } from "@/lib/cn";

const THEMES = {
  teal: "from-brand-500 to-brand-800",
  violet: "from-violet-500 to-indigo-800",
  sky: "from-sky-400 to-blue-700",
  amber: "from-amber-400 to-orange-600",
  rose: "from-rose-400 to-pink-700",
  lime: "from-lime-400 to-emerald-700",
} as const;
export type CoverTheme = keyof typeof THEMES;
const ORDER: CoverTheme[] = ["teal", "violet", "sky", "amber", "rose", "lime"];
export const themeAt = (i: number) => ORDER[((i % ORDER.length) + ORDER.length) % ORDER.length];

/** Ảnh bìa minh hoạ tự vẽ bằng CSS (không cần file ảnh). */
export function Cover({ label, big, theme = "teal", badge, className }: { label: string; big?: string; theme?: CoverTheme; badge?: string; className?: string }) {
  return (
    <div className={cn("relative aspect-[16/10] overflow-hidden rounded-xl bg-gradient-to-br text-white", THEMES[theme], className)} aria-hidden="true">
      <svg className="absolute -right-6 -bottom-8 size-40 opacity-20" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="6" /><circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="6" /></svg>
      <svg className="absolute left-4 bottom-4 opacity-25" width="64" height="20" viewBox="0 0 64 20"><path d="M2 14c6-10 12-10 18 0s12 10 18 0 12-10 18 0" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" /></svg>
      {badge && <span className="absolute left-3 top-3 rounded-md bg-black/25 px-2 py-0.5 text-[11px] font-bold backdrop-blur">{badge}</span>}
      <div className="absolute inset-0 flex flex-col justify-center px-5">
        <span className="text-[11px] font-bold uppercase tracking-[.16em] opacity-85">{label}</span>
        {big && <span className="title-display mt-1 text-2xl leading-tight drop-shadow-sm sm:text-[1.65rem]">{big}</span>}
      </div>
    </div>
  );
}
