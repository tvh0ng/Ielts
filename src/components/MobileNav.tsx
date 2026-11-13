"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Dumbbell, Home, Layers, Map } from "lucide-react";
import { cn } from "@/lib/cn";

const items = [
  { href: "/", label: "Trang chủ", Icon: Home },
  { href: "/lo-trinh", label: "Lộ trình", Icon: Map },
  { href: "/tu-vung", label: "Từ vựng", Icon: Layers },
  { href: "/luyen-tap", label: "Luyện tập", Icon: Dumbbell },
  { href: "/tai-lieu", label: "Tài liệu", Icon: BookOpen },
];

export function MobileNav() {
  const path = usePathname();
  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur pb-[env(safe-area-inset-bottom)]" aria-label="Điều hướng nhanh">
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, Icon }) => {
          const on = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} className={cn("flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold", on ? "text-brand-600 dark:text-brand-300" : "text-muted")}>
                <Icon className="size-5" strokeWidth={on ? 2.5 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
