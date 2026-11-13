"use client";
import { Moon, Sun } from "lucide-react";
import { useStore } from "@/lib/storage";

export function ThemeToggle() {
  const [, setTheme] = useStore<"light" | "dark" | "system">("theme", "system");
  const toggle = () => {
    const dark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", dark);
    setTheme(dark ? "dark" : "light");
  };
  return (
    <button onClick={toggle} className="grid size-10 place-items-center rounded-xl border border-line bg-surface text-muted hover:text-ink" aria-label="Đổi giao diện sáng/tối">
      <Sun className="size-[18px] hidden dark:block" />
      <Moon className="size-[18px] dark:hidden" />
    </button>
  );
}
