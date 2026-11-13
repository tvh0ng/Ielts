"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/site";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { StreakBadge } from "./StreakBadge";
import { cn } from "@/lib/cn";

export function Header() {
  const path = usePathname();
  const active = (href: string) => { const seg = "/" + href.split("/")[1]; return path === seg || path.startsWith(seg + "/"); };
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/85 backdrop-blur-md supports-[backdrop-filter]:bg-page/70">
      <div className="container-x flex h-16 items-center gap-6">
        <Link href="/" aria-label="Trang chủ IELTS Master"><Logo /></Link>
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold" aria-label="Điều hướng chính">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
              className={cn("rounded-lg px-3 py-2 transition", active(n.href) ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200" : "text-muted hover:text-ink")}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <StreakBadge />
          <ThemeToggle />
          <Link href="/tu-vung/on-tap" className="btn-primary hidden sm:inline-flex">Học ngay</Link>
        </div>
      </div>
    </header>
  );
}
