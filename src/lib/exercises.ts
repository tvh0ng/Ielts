import ex from "@/data/exercises.json";

export interface TfngEx { title: string; lv: string; passage: string[]; qs: [string, string, string][] }
export interface HeadEx { title: string; lv: string; heads: string[]; paras: [string, string, string, string][] }
export interface GapEx { title: string; lv: string; note: string; qs: [string, string, string[], string][] }
export interface ListenEx extends GapEx { script: [string, string][] }
export const EXERCISES = ex as unknown as { tfng: TfngEx; headings: HeadEx; gap: GapEx; listen: ListenEx };

export const EX_META: Record<string, { slug: string; key: keyof typeof EXERCISES; desc: string }> = {
  "true-false-not-given": { slug: "true-false-not-given", key: "tfng", desc: "Phân biệt TRUE / FALSE / NOT GIVEN — dạng gây mất điểm nhiều nhất trong Reading." },
  "matching-headings": { slug: "matching-headings", key: "headings", desc: "Chọn tiêu đề đúng cho từng đoạn văn, tránh tiêu đề nhiễu." },
  "sentence-completion": { slug: "sentence-completion", key: "gap", desc: "Điền không quá hai từ lấy từ bài đọc — chú ý số ít/số nhiều." },
  "listening-form-completion": { slug: "listening-form-completion", key: "listen", desc: "Nghe hội thoại Part 1 và điền biểu mẫu, nhận diện bẫy tự sửa." },
};
