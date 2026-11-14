import writingCourse from "@/data/course-writing.json";
import { grammar, skills, topics, notes } from "./data";
import { dictations, samples, tests } from "./content";
import type { SkillKey } from "./types";
import type { CoverTheme } from "@/components/Cover";

export interface QuizQ { q: string; options: string[]; answer: number; why: string }
export type Lesson =
  | { slug: string; title: string; minutes: number; kind: "article"; theory: string; language?: [string, string][]; quiz?: QuizQ[]; practice?: { task: 1 | 2; prompt: string } }
  | { slug: string; title: string; minutes: number; kind: "grammar"; idx: number }
  | { slug: string; title: string; minutes: number; kind: "qtype"; skill: SkillKey; idx: number }
  | { slug: string; title: string; minutes: number; kind: "link"; href: string; desc: string; cta: string };
export interface Chapter { title: string; lessons: Lesson[] }
export interface Course { slug: string; title: string; short: string; desc: string; level: string; theme: CoverTheme; outcomes: string[]; chapters: Chapter[] }

const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const qtypeLessons = (k: SkillKey, prefix = "dang-bai"): Lesson[] => skills[k].types.map((t, idx) => ({ slug: `${prefix}-${slugify(t.t)}`, title: t.t, minutes: 10, kind: "qtype", skill: k, idx }));
const dictLessons = (pred: (p: string) => boolean): Lesson[] => dictations.filter((d) => pred(d.part)).map((d) => ({ slug: `chep-${d.slug}`, title: `Chép chính tả: ${d.title}`, minutes: 15, kind: "link", href: `/chep-chinh-ta/${d.slug}`, desc: `${d.part} · ${d.level} · ${d.lines.length} câu. Nghe từng câu, gõ lại, kiểm tra từng từ.`, cta: "Bắt đầu chép" }));
const testLessons = (skill: string): Lesson[] => tests.filter((t) => t.skill === skill).map((t) => ({ slug: `de-${t.slug}`, title: t.title, minutes: t.minutes, kind: "link", href: `/de-thi/${t.slug}`, desc: `${t.sections.map((s) => s.title).join(" · ")}. Làm bài có bấm giờ, chấm điểm và giải thích đáp án.`, cta: "Làm đề" }));
const topicLesson = (slug: string): Lesson => { const t = topics.find((x) => x.slug === slug)!; return { slug: `tu-vung-${slug}`, title: `Từ vựng: ${t.name.replace(/^\w+ · /, "")}`, minutes: 15, kind: "link", href: `/tu-vung/${slug}`, desc: `${t.count} cụm từ có nghĩa, ví dụ, IPA. Học bằng flashcard lặp lại ngắt quãng.`, cta: "Học flashcard" }; };

export const courses: Course[] = [
  {
    slug: "ielts-nen-tang", title: "IELTS Nền tảng", short: "Ngữ pháp & phát âm cốt lõi", level: "0 → 4.5", theme: "teal",
    desc: "Xây gốc vững trước khi luyện đề: phát âm IPA, 24 chủ điểm ngữ pháp từ cơ bản đến nâng cao, kèm ví dụ theo văn phong IELTS.",
    outcomes: ["Đọc được phiên âm IPA", "Nắm chắc các thì và cấu trúc câu", "Dùng câu phức chính xác trong Writing & Speaking"],
    chapters: [
      { title: "Chương 1 · Phát âm", lessons: [{ slug: "bang-ipa", title: "Bảng phiên âm IPA 44 âm", minutes: 20, kind: "link", href: "/tai-lieu/listening", desc: "Nguyên âm đơn, nguyên âm đôi, phụ âm và cách đọc âm cuối -s/-ed.", cta: "Mở tài liệu" }] },
      ...["Nền tảng", "5.5", "6.0", "7.0", "8.0", "9.0"].map((lv) => ({
        title: `Ngữ pháp · ${lv === "Nền tảng" ? "Nền tảng" : `Band ${lv}`}`,
        lessons: grammar.map((g, idx) => ({ g, idx })).filter(({ g }) => g.lv === lv).map(({ g, idx }) => ({ slug: `ngu-phap-${slugify(g.t)}`, title: g.t, minutes: 10, kind: "grammar" as const, idx })),
      })),
    ],
  },
  {
    slug: "ielts-listening-chuyen-sau", title: "IELTS Listening chuyên sâu", short: "Dạng bài · chép chính tả · đề", level: "4.5 → 7.5", theme: "sky",
    desc: "Nắm cách làm 7 dạng câu hỏi Listening, luyện tai bằng chép chính tả theo từng Part và làm đề có chấm điểm.",
    outcomes: ["Nhận diện bẫy tự sửa, số, đánh vần", "Nghe hiểu bài giảng Part 4", "Ổn định 30+/40 câu"],
    chapters: [
      { title: "Chương 1 · Dạng câu hỏi Listening", lessons: qtypeLessons("L") },
      { title: "Chương 2 · Chép chính tả Part 1–2", lessons: dictLessons((p) => /Listening Part [12]/.test(p)) },
      { title: "Chương 3 · Chép chính tả Part 3–4", lessons: dictLessons((p) => /Listening Part [34]/.test(p)) },
      { title: "Chương 4 · Từ vựng nghe theo chủ đề", lessons: ["travel-and-tourism", "education", "health-and-fitness", "environment", "work-and-career"].map(topicLesson) },
      { title: "Chương 5 · Đề luyện", lessons: testLessons("Listening") },
    ],
  },
  {
    slug: "ielts-reading-chuyen-sau", title: "IELTS Reading chuyên sâu", short: "11 dạng câu hỏi · đề luyện", level: "4.5 → 8.0", theme: "violet",
    desc: "Phương pháp làm 11 dạng câu hỏi Reading Academic, từ vựng học thuật và đề luyện có tô sáng, lưu từ mới.",
    outcomes: ["Phân biệt FALSE và NOT GIVEN", "Skimming & scanning đúng thời gian", "Mở rộng vốn từ học thuật"],
    chapters: [
      { title: "Chương 1 · Tổng quan & chiến lược", lessons: [{ slug: "tong-quan-reading", title: "Tổng quan bài thi Reading", minutes: 8, kind: "link", href: "/ky-nang/reading", desc: "Cấu trúc 3 passage, thời gian, cách tính điểm và thứ tự làm bài.", cta: "Xem tổng quan" }, { slug: "blog-tfng", title: "Cách làm True/False/Not Given", minutes: 6, kind: "link", href: "/blog/cach-lam-true-false-not-given", desc: "Quy trình 4 bước và bảng từ bẫy thường gặp.", cta: "Đọc bài" }] },
      { title: "Chương 2 · 11 dạng câu hỏi", lessons: qtypeLessons("R") },
      { title: "Chương 3 · Từ vựng học thuật", lessons: ["academic-word-list-sublist-1", "academic-research-and-evidence", "academic-society-and-change", "academic-verb-noun-collocations"].filter((s) => topics.some((t) => t.slug === s)).map(topicLesson) },
      { title: "Chương 4 · Đề luyện", lessons: testLessons("Reading") },
    ],
  },
  {
    slug: "ielts-writing-tu-a-den-z", title: "IELTS Writing từ A–Z", short: "Task 1 & Task 2 · chấm AI", level: "5.0 → 7.5", theme: "amber",
    desc: "Từ tiêu chí chấm, paraphrase, câu phức đến từng dạng Task 1 và Task 2. Mỗi bài có lý thuyết, mẫu câu, trắc nghiệm nhanh và đề thực hành được AI chấm.",
    outcomes: ["Viết overview Task 1 chuẩn", "Lập dàn ý Task 2 trong 5 phút", "Tự sửa 10 lỗi ngữ pháp phổ biến"],
    chapters: [
      ...(writingCourse as { title: string; lessons: Omit<Extract<Lesson, { kind: "article" }>, "kind">[] }[]).map((c) => ({ title: c.title, lessons: c.lessons.map((l) => ({ ...l, kind: "article" as const })) })),
      { title: "Chương 5 · Bài mẫu band 8.0", lessons: samples.map((s) => ({ slug: `bai-mau-${s.slug}`, title: `Bài mẫu: ${s.title}`, minutes: 10, kind: "link" as const, href: `/bai-mau/${s.slug}`, desc: `Writing Task ${s.task} · ${s.type}. Dàn ý, bài mẫu và từ vựng nổi bật.`, cta: "Đọc bài mẫu" })) },
    ],
  },
  {
    slug: "ielts-speaking-chuyen-sau", title: "IELTS Speaking chuyên sâu", short: "Part 1–3 · ghi âm · chấm AI", level: "4.5 → 7.5", theme: "rose",
    desc: "Cách trả lời từng Part, cụm diễn đạt tự nhiên, câu trả lời mẫu và luyện nói có ghi âm, đo tốc độ, chấm AI.",
    outcomes: ["Trả lời Part 1 tự nhiên 2–3 câu", "Nói đủ 2 phút Part 2", "Mở rộng ý Part 3 bằng lý do + ví dụ"],
    chapters: [
      { title: "Chương 1 · Cấu trúc & tiêu chí", lessons: qtypeLessons("S") },
      { title: "Chương 2 · Cụm diễn đạt cho Speaking", lessons: topics.filter((t) => t.group === "Speaking").map((t) => topicLesson(t.slug)) },
      { title: "Chương 3 · Câu trả lời mẫu", lessons: [{ slug: "mau-speaking", title: "Câu trả lời mẫu Part 1, 2, 3", minutes: 20, kind: "link", href: "/bai-mau/speaking", desc: "46 câu trả lời mẫu có nút nghe đọc.", cta: "Xem câu mẫu" }, ...dictLessons((p) => p.startsWith("Speaking"))] },
      { title: "Chương 4 · Luyện nói & chấm điểm", lessons: [{ slug: "luyen-noi", title: "Luyện nói Part 1–3 có ghi âm", minutes: 20, kind: "link", href: "/luyen-tap/speaking", desc: "Thu âm, chuyển giọng nói thành chữ, đo tốc độ, từ đệm và chấm AI.", cta: "Bắt đầu luyện" }, { slug: "tai-lieu-speaking", title: "Tài liệu Speaking", minutes: 15, kind: "link", href: `/tai-lieu/${notes.find((n) => n.slug === "speak") ? "speak" : notes[0].slug}`, desc: "Khung trả lời và mẹo cho từng Part.", cta: "Đọc tài liệu" }] },
    ],
  },
];

export const courseBySlug = (s: string) => courses.find((c) => c.slug === s);
export const allLessons = (c: Course) => c.chapters.flatMap((ch) => ch.lessons);
export const lessonCount = (c: Course) => allLessons(c).length;
export const courseMinutes = (c: Course) => allLessons(c).reduce((a, l) => a + l.minutes, 0);
