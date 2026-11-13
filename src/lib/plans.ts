/**
 * Cấu hình gói học. Sửa giá, quyền lợi và link thanh toán tại đây.
 * CTA dùng NEXT_PUBLIC_CHECKOUT_URL (vd. link thanh toán PayOS / Stripe Payment Link) — nếu để trống sẽ hiện nút liên hệ qua email.
 */
export interface Plan { id: string; name: string; price: number; period: string; note?: string; highlight?: boolean; features: [string, boolean | "soon"][] }

export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
export const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL || "";

export const PLANS: Plan[] = [
  {
    id: "free", name: "Miễn phí", price: 0, period: "mãi mãi",
    features: [
      ["Lộ trình 0 → 9.0, ngữ pháp, tài liệu", true],
      ["1.100+ collocation & flashcard thông minh", true],
      ["Đề thi online Reading & Listening", true],
      ["Chép chính tả, bài mẫu Writing & Speaking", true],
      ["Chấm nhanh Writing/Speaking (offline)", true],
      ["Chấm AI chi tiết 4 tiêu chí", false],
      ["Đồng bộ tiến độ nhiều thiết bị", false],
    ],
  },
  {
    id: "pro-month", name: "Pro tháng", price: 99000, period: "/ tháng",
    features: [
      ["Mọi tính năng của gói Miễn phí", true],
      ["Chấm AI Writing & Speaking chi tiết", true],
      ["Bài mẫu AI band 8–9 theo đúng đề", true],
      ["Đề mới cập nhật hằng tháng", "soon"],
      ["Đồng bộ tiến độ nhiều thiết bị", "soon"],
    ],
  },
  {
    id: "pro-year", name: "Pro năm", price: 690000, period: "/ năm", note: "Tiết kiệm ~42% so với trả theo tháng", highlight: true,
    features: [
      ["Toàn bộ quyền lợi gói Pro tháng", true],
      ["Ưu tiên tính năng mới", true],
      ["Đề mới cập nhật hằng tháng", "soon"],
      ["Đồng bộ tiến độ nhiều thiết bị", "soon"],
    ],
  },
];

export const vnd = (n: number) => (n === 0 ? "0đ" : n.toLocaleString("vi-VN") + "đ");
