import writing from "@/data/writing.json";
import speaking from "@/data/speaking.json";

export interface Issue { original: string; suggestion: string; explanation: string; done?: boolean }
export interface Feedback {
  source: "ai" | "offline";
  bands?: Record<string, number>;
  band?: number;
  summary?: string;
  advisory?: string[];
  issues?: Issue[];
  tips?: string[];
  model?: string;
  note?: string;
}

const LINKERS: string[] = writing.linkers;
const STOP = new Set<string>(writing.stop);
const FILLERS: string[] = speaking.fillers;
const words = (t: string) => t.match(/[A-Za-z0-9'’]+/g) || [];
const clampBand = (b: number) => Math.max(4, Math.min(7.5, Math.round(b * 2) / 2));

const MECH: [RegExp, string, string][] = [
  [/ {2,}/, " ", "Thừa dấu cách"],
  [/\balot\b/i, "a lot", 'Sai chính tả: viết "a lot"'],
  [/\brecieve\b/i, "receive", "Sai chính tả"],
  [/\bteh\b/i, "the", "Lỗi gõ"],
  [/\bthier\b/i, "their", "Sai chính tả"],
  [/\bbecuase\b/i, "because", "Sai chính tả"],
  [/\bdefinately\b/i, "definitely", "Sai chính tả"],
  [/\benviroment\b/i, "environment", "Sai chính tả"],
  [/\bgovernement\b/i, "government", "Sai chính tả"],
  [/\bi\b/, "I", 'Đại từ "I" luôn viết hoa'],
  [/\bpeoples\b/i, "people", '"people" đã là số nhiều'],
  [/\bin the other hand\b/i, "on the other hand", "Cụm cố định: on the other hand"],
  [/\bdiscuss about\b/i, "discuss", '"discuss" không đi với "about"'],
  [/\bam agree\b/i, "agree", 'Không dùng "be" trước "agree"'],
];

export function analyzeWriting(text: string, task: 1 | 2): Feedback {
  const target = task === 1 ? 150 : 250;
  const ws = words(text); const wc = ws.length;
  const paras = text.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 1);
  const lens = sentences.map((s) => words(s).length);
  const avg = lens.length ? lens.reduce((a, b) => a + b, 0) / lens.length : 0;
  const longS = lens.filter((l) => l > 40).length;
  const lower = text.toLowerCase();
  const linkUsed = LINKERS.filter((l) => lower.includes(l)).length;
  const freq: Record<string, number> = {};
  ws.forEach((w) => { w = w.toLowerCase(); if (w.length > 3 && !STOP.has(w)) freq[w] = (freq[w] || 0) + 1; });
  const repeated = Object.entries(freq).filter(([, n]) => n >= 5).sort((a, b) => b[1] - a[1]).slice(0, 3);

  const issues: Issue[] = [];
  MECH.forEach(([re, sug, why]) => { const m = text.match(re); if (m) issues.push({ original: m[0], suggestion: sug, explanation: why }); });
  const cap = text.match(/[.!?]\s+([a-z])/);
  if (cap) issues.push({ original: cap[0], suggestion: cap[0].slice(0, -1) + cap[1].toUpperCase(), explanation: "Viết hoa đầu câu sau dấu chấm" });

  const adv: string[] = [];
  const minParas = task === 1 ? 3 : 4;
  if (wc < target) adv.push(`Bài đang ${wc} từ — chưa đạt tối thiểu ${target} từ (bị trừ điểm Task ${task === 1 ? "Achievement" : "Response"}).`);
  if (paras.length < minParas) adv.push(`Nên chia rõ ${task === 1 ? "3–4" : "4–5"} đoạn (mở bài / ${task === 1 ? "overview" : "thân bài"} / ${task === 1 ? "chi tiết" : "kết luận"}).`);
  if (linkUsed < 3) adv.push(`Dùng thêm từ nối (however, moreover, for example…) để tăng Coherence — hiện mới có ~${linkUsed} loại.`);
  if (longS) adv.push(`${longS} câu quá dài (>40 từ) — dễ sai ngữ pháp, nên tách câu.`);
  if (repeated.length) adv.push(`Lặp từ nhiều: ${repeated.map(([w, n]) => `“${w}” (${n} lần)`).join(", ")} — thử paraphrase.`);
  if (!adv.length) adv.push("Cấu trúc bài ổn. Để biết lỗi ngữ pháp/từ vựng chi tiết, hãy dùng chấm AI.");

  let b = 6;
  if (wc < target) b -= 1;
  if (paras.length < minParas) b -= 0.5;
  if (linkUsed >= 4) b += 0.5; else if (linkUsed < 2) b -= 0.5;
  if (issues.length > 3) b -= 0.5;
  if (avg >= 12 && avg <= 22) b += 0.5;
  if (repeated.length >= 2) b -= 0.5;
  return { source: "offline", band: clampBand(b), advisory: adv, issues };
}

export function analyzeSpeaking(text: string, seconds: number, part: 1 | 2 | 3): Feedback {
  const ws = words(text); const wc = ws.length;
  const wpm = seconds > 3 ? Math.round(wc / (seconds / 60)) : null;
  const lower = text.toLowerCase();
  const fillers = FILLERS.reduce((n, f) => n + (text.match(new RegExp(`\\b${f.replace(/ /g, "\\s+")}\\b`, "gi")) || []).length, 0);
  const diversity = wc ? Math.round((new Set(ws.map((w) => w.toLowerCase())).size / wc) * 100) : 0;
  const linkers = LINKERS.filter((l) => lower.includes(l)).length;
  const adv: string[] = [`Số từ: ${wc}${seconds ? ` · ${Math.round(seconds)} giây` : ""}${wpm ? ` · ~${wpm} từ/phút` : ""}`];
  if (wpm != null) {
    if (wpm < 90) adv.push(`Nói khá chậm (~${wpm} wpm). Mục tiêu trôi chảy ~120–150 wpm.`);
    else if (wpm > 180) adv.push(`Nói hơi nhanh (~${wpm} wpm) — giữ rõ ràng.`);
    else adv.push(`Tốc độ ~${wpm} wpm — tốt.`);
  }
  adv.push(`Từ đệm (um, like, you know…): ${fillers}${fillers > 6 ? " — hơi nhiều." : " — ổn."}`);
  adv.push(`Đa dạng từ vựng: ${diversity}% từ khác nhau${diversity < 45 ? " — thêm từ đồng nghĩa." : " — tốt."}`);
  if (linkers < 2) adv.push("Thêm từ nối (because, for example, however…) để mạch lạc hơn.");
  if (part === 2 && seconds < 60) adv.push("Part 2 nên nói 1–2 phút.");
  let b = 6;
  if (wc < 40) b -= 1;
  if (wpm != null) { if (wpm < 90) b -= 0.5; if (wpm >= 110 && wpm <= 160) b += 0.5; }
  if (fillers > 6) b -= 0.5;
  if (diversity >= 50) b += 0.5;
  if (linkers >= 3) b += 0.5;
  return { source: "offline", band: clampBand(b), advisory: adv };
}

export function rawToBand(tbl: [number, number][], raw: number) {
  for (const [min, b] of tbl) if (raw >= min) return b;
  return raw > 0 ? 2 : 0;
}
/** Làm tròn overall theo IELTS: x.125 → x.0, x.25 → x.5, x.75 → x+1. */
export function overallBand(xs: number[]) {
  const avg = xs.reduce((a, b) => a + b, 0) / xs.length;
  const q = Math.floor(avg * 4 + 1e-9) / 4;
  const frac = q - Math.floor(q);
  return frac === 0.25 || frac === 0.75 ? q + 0.25 : q;
}
