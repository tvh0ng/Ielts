import blogJson from "@/data/blog.json";
export interface Post { slug: string; title: string; excerpt: string; category: string; date: string; minutes: number; body: string }
export const posts = (blogJson as Post[]).sort((a, b) => b.date.localeCompare(a.date));
export const fmtDate = (d: string) => new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
