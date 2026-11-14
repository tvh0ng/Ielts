export const SITE = {
  name: "IELTS Master",
  tagline: "Nền tảng tự học IELTS miễn phí",
  description:
    "Nền tảng tự học IELTS miễn phí: lộ trình 0 → 9.0, đề thi online có chấm điểm, chép chính tả luyện nghe, 1.100+ collocation với flashcard thông minh, bài mẫu và chấm Writing/Speaking bằng AI.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://ielts-master.vercel.app").replace(/\/$/, ""),
  locale: "vi_VN",
};

export const NAV = [
  { href: "/khoa-hoc", label: "Khoá học" },
  { href: "/de-thi", label: "Đề thi online" },
  { href: "/chep-chinh-ta", label: "Chép chính tả" },
  { href: "/tu-vung", label: "Từ vựng" },
  { href: "/bai-mau", label: "Bài mẫu" },
  { href: "/luyen-tap", label: "Luyện tập AI" },
] as const;

/** Menu đầy đủ trong ngăn kéo bên trái. */
export const MENU: { h: string; items: [string, string, string?][] }[] = [
  { h: "Khoá học", items: [["/khoa-hoc", "Tất cả khoá học", "Nền tảng · Listening · Reading · Writing · Speaking"]] },
  { h: "Luyện thi", items: [["/de-thi", "IELTS Online Test", "Reading & Listening có chấm điểm"], ["/chep-chinh-ta", "Chép chính tả", "Luyện nghe từng câu"], ["/luyen-tap", "Bài tập theo dạng câu hỏi"]] },
  { h: "Writing & Speaking", items: [["/luyen-tap/writing", "Luyện Writing (AI chấm)"], ["/luyen-tap/speaking", "Luyện Speaking (AI chấm)"], ["/bai-mau", "Bài mẫu Writing"], ["/bai-mau/speaking", "Bài mẫu Speaking"]] },
  { h: "Kiến thức", items: [["/tu-vung", "Từ vựng theo chủ đề"], ["/tu-vung/on-tap", "Ôn flashcard hôm nay"], ["/ngu-phap", "Ngữ pháp theo band"], ["/ky-nang/listening", "Kỹ năng & dạng bài"], ["/tai-lieu", "Tài liệu tự học"]] },
  { h: "Công cụ", items: [["/lo-trinh", "Lộ trình 0 → 9.0"], ["/tinh-diem", "Tính điểm band"], ["/tien-do", "Kết quả & tiến độ", "Thống kê luyện đề, sao lưu"]] },
  { h: "Khác", items: [["/blog", "Blog kinh nghiệm"], ["/nang-cap", "Bảng giá & gói Pro"]] },
];
