"use client";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { MENU } from "@/lib/site";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";

export function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = usePathname();
  useEffect(() => { onClose(); }, [path]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k); document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open, onClose]);
  return (
    <div className={cn("fixed inset-0 z-50", !open && "pointer-events-none")} aria-hidden={!open}>
      <div onClick={onClose} className={cn("absolute inset-0 bg-black/40 transition-opacity", open ? "opacity-100" : "opacity-0")} />
      <nav aria-label="Menu" className={cn("absolute inset-y-0 left-0 flex w-[min(340px,88vw)] flex-col bg-surface shadow-2xl transition-transform duration-300", open ? "translate-x-0" : "invisible -translate-x-full")}>
        <div className="flex h-16 items-center justify-between border-b border-line px-5"><Logo /><button onClick={onClose} className="grid size-9 place-items-center rounded-lg hover:bg-surface-2" aria-label="Đóng menu"><X className="size-5" /></button></div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {MENU.map((g) => (
            <div key={g.h} className="mb-5">
              <p className="px-3 text-[11px] font-bold uppercase tracking-[.14em] text-muted">{g.h}</p>
              <ul className="mt-1.5">
                {g.items.map(([href, label, sub]) => (
                  <li key={href}><Link href={href} tabIndex={open ? 0 : -1} className={cn("block rounded-lg px-3 py-2 text-[15px] font-semibold", path === href ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200" : "hover:bg-surface-2")}>{label}{sub && <span className="block text-xs font-normal text-muted">{sub}</span>}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="border-t border-line px-5 py-4 text-xs text-muted">Miễn phí · tiến độ lưu trên trình duyệt của bạn</p>
      </nav>
    </div>
  );
}
