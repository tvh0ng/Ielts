"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, BookOpen, Headphones, Home, Layers, Menu, Search, Timer, X } from "lucide-react";
import { NAV } from "@/lib/site";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { StreakBadge } from "./StreakBadge";
import { Drawer } from "./Drawer";
import { SearchPalette } from "./SearchPalette";
import { useStore } from "@/lib/storage";
import { cn } from "@/lib/cn";

const ANNOUNCE_ID = "v2-launch";

export function Header() {
  const path = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [dismissed, setDismissed, ok] = useStore<string>("announce", "");
  const closeDrawer = useCallback(() => setDrawer(false), []);
  const active = (href: string) => { const seg = "/" + href.split("/")[1]; return path === seg || path.startsWith(seg + "/"); };

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearch(true); } };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="container-x flex h-16 items-center gap-2 sm:gap-4">
          <button onClick={() => setDrawer(true)} className="grid size-10 place-items-center rounded-full bg-surface-2 hover:bg-line" aria-label="Mở menu"><Menu className="size-5" /></button>
          <Link href="/" aria-label="Trang chủ IELTS Master" className="mr-2"><Logo /></Link>
          <nav className="hidden xl:flex items-center gap-0.5 text-sm font-semibold" aria-label="Điều hướng chính">
            {NAV.map((n) => <Link key={n.href} href={n.href} className={cn("whitespace-nowrap rounded-lg px-3 py-2 transition", active(n.href) ? "text-brand-700 dark:text-brand-300" : "text-muted hover:text-ink")}>{n.label}</Link>)}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setSearch(true)} className="flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm text-muted hover:text-ink" aria-label="Tìm kiếm">
              <Search className="size-[18px]" /><span className="hidden whitespace-nowrap 2xl:inline">Tìm kiếm</span><kbd className="hidden whitespace-nowrap rounded border border-line px-1 text-[10px] 2xl:inline">Ctrl K</kbd>
            </button>
            <StreakBadge />
            <ThemeToggle />
            <Link href="/nang-cap" className="hidden whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold text-accent-600 hover:bg-accent-400/10 2xl:inline-flex dark:text-accent-400">Nâng cấp Pro</Link>
            <Link href="/tu-vung/on-tap" className="btn-primary hidden whitespace-nowrap sm:inline-flex">Học ngay</Link>
          </div>
        </div>
      </header>

      {ok && dismissed !== ANNOUNCE_ID && path === "/" && (
        <div className="border-b border-accent-400/30 bg-[#fff6e8] dark:bg-accent-600/15">
          <div className="container-x flex items-center gap-3 py-2.5 text-sm">
            <span className="rounded-md bg-accent-500 px-2 py-0.5 text-xs font-bold text-white">Mới</span>
            <p className="flex-1">Ra mắt <b>IELTS Online Test</b>, <b>Chép chính tả</b> và <b>Bài mẫu band 8.0+</b>. <Link href="/de-thi" className="font-semibold text-accent-600 dark:text-accent-400 hover:underline">Làm thử ngay →</Link></p>
            <button onClick={() => setDismissed(ANNOUNCE_ID)} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-black/5" aria-label="Ẩn thông báo"><X className="size-4" /></button>
          </div>
        </div>
      )}

      <Drawer open={drawer} onClose={closeDrawer} />
      <SearchPalette open={search} onClose={() => setSearch(false)} />
      <MobileNav path={path} onMenu={() => setDrawer(true)} />
      <BackToTop />
    </>
  );
}

function MobileNav({ path, onMenu }: { path: string; onMenu: () => void }) {
  const items = [
    { href: "/", label: "Trang chủ", Icon: Home },
    { href: "/de-thi", label: "Đề thi", Icon: Timer },
    { href: "/chep-chinh-ta", label: "Luyện nghe", Icon: Headphones },
    { href: "/tu-vung", label: "Từ vựng", Icon: Layers },
  ];
  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur pb-[env(safe-area-inset-bottom)]" aria-label="Điều hướng nhanh">
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, Icon }) => {
          const on = href === "/" ? path === "/" : path.startsWith(href);
          return <li key={href}><Link href={href} className={cn("flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold", on ? "text-brand-600 dark:text-brand-300" : "text-muted")}><Icon className="size-5" strokeWidth={on ? 2.5 : 2} />{label}</Link></li>;
        })}
        <li><button onClick={onMenu} className="flex w-full flex-col items-center gap-0.5 py-2 text-[11px] font-semibold text-muted"><BookOpen className="size-5" />Thêm</button></li>
      </ul>
    </nav>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => { const f = () => setShow(window.scrollY > 900); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Lên đầu trang"
      className={cn("fixed bottom-24 right-4 z-30 grid size-11 place-items-center rounded-full border border-line bg-surface shadow-lg transition md:bottom-6", show ? "opacity-100" : "pointer-events-none opacity-0")}>
      <ArrowUp className="size-5" />
    </button>
  );
}
