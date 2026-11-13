export const SITE = {
  name: "IELTS Master",
  tagline: "Lộ trình IELTS 0 → 9.0 miễn phí",
  description:
    "Lộ trình IELTS từ nền tảng đến 9.0: đủ dạng bài 4 kỹ năng, ngữ pháp theo band, 1.100+ collocation có flashcard lặp lại ngắt quãng, luyện Writing & Speaking chấm bằng AI.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://ielts-master.vercel.app").replace(/\/$/, ""),
  locale: "vi_VN",
};

export const NAV = [
  { href: "/lo-trinh", label: "Lộ trình" },
  { href: "/ky-nang/listening", label: "Kỹ năng" },
  { href: "/tu-vung", label: "Từ vựng" },
  { href: "/ngu-phap", label: "Ngữ pháp" },
  { href: "/luyen-tap", label: "Luyện tập" },
  { href: "/tinh-diem", label: "Tính điểm" },
] as const;
