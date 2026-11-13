# IELTS Master v2

Website tự học IELTS từ 0 → 9.0, viết lại bằng **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4**.
Bản trước là một file `index.html` 466 KB; bản này tách dữ liệu ra JSON, mỗi chủ đề/chặng/kỹ năng là một trang tĩnh riêng (tốt cho SEO) và chỉ tải phần cần dùng.

## Tính năng

| Mục | Đường dẫn | Ghi chú |
|---|---|---|
| Trang chủ + Bảng học | `/` | Đặt band hiện tại/mục tiêu/ngày thi → ước tính giờ học, thẻ đến hạn, chuỗi ngày (streak) |
| Lộ trình 6 chặng | `/lo-trinh`, `/lo-trinh/[chặng]` | Mục tiêu từng kỹ năng, ngữ pháp, dạng bài, lịch tuần, checklist có lưu tiến độ |
| Kỹ năng & dạng bài | `/ky-nang/{listening,reading,writing,speaking}` | 35 dạng bài: cách làm, bẫy, mẹo, ví dụ |
| Ngữ pháp theo band | `/ngu-phap` | Lọc theo band + tìm kiếm |
| Từ vựng | `/tu-vung`, `/tu-vung/[chủ-đề]` | 1.100 collocation / 62 chủ đề, IPA, phát âm Anh–Anh/Anh–Mỹ |
| Flashcard SRS | `/tu-vung/on-tap` | Lặp lại ngắt quãng kiểu Anki (Quên/Khó/Nhớ/Dễ), phím tắt Space, 1–4, S |
| Thẻ của tôi | `/tu-vung/cua-toi` | Thêm/sửa/xoá, nhập hàng loạt từ Excel, xuất CSV |
| Luyện Writing | `/luyen-tap/writing` | Đồng hồ, đếm từ, chấm AI 4 tiêu chí, sửa lỗi 1 chạm, bài mẫu |
| Luyện Speaking | `/luyen-tap/speaking` | Thu âm, chuyển giọng nói → chữ, đo wpm/từ đệm, chấm AI, câu mẫu |
| Bài tập | `/luyen-tap/[bài]` | TFNG, Matching headings, Sentence completion, Listening form |
| Tính điểm | `/tinh-diem` | Quy đổi số câu → band, làm tròn Overall đúng quy tắc, mô tả band |
| Tài liệu | `/tai-lieu/[slug]` | 7 bộ ghi chú |

Khác: dark mode, giao diện mobile có thanh điều hướng dưới (kiểu app), cài được như PWA (manifest), `sitemap.xml`, `robots.txt`, ảnh Open Graph, JSON-LD (FAQ, Breadcrumb, DefinedTermSet), font tự host (không phụ thuộc Google Fonts), header bảo mật.

Tiến độ người học lưu bằng `localStorage` (khoá `im2:*`) — chưa cần tài khoản.

## Chạy trên máy

```bash
npm install
cp .env.example .env.local   # điền ANTHROPIC_API_KEY nếu muốn bật chấm AI
npm run dev                  # http://localhost:3000
npm run build && npm start   # bản production
```

## Deploy (khuyến nghị: Vercel)

1. Tạo repo mới trên GitHub và push code này:
   ```bash
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```
2. Vào vercel.com → **Add New Project** → chọn repo → Deploy (Vercel tự nhận Next.js).
3. **Settings → Environment Variables**:
   - `NEXT_PUBLIC_SITE_URL` = domain thật (vd. `https://ieltsmaster.vn`)
   - `ANTHROPIC_API_KEY` = khoá API (bật chấm AI; không có thì app dùng chấm nhanh offline)
   - tuỳ chọn `ANTHROPIC_MODEL`, `AI_RATE_LIMIT_PER_HOUR`
4. **Settings → Domains** để gắn tên miền riêng, rồi gửi `https://<domain>/sitemap.xml` lên Google Search Console.

Cũng chạy được trên Netlify, Railway, Render, Docker (`npm run build && npm start`). GitHub Pages **không** chạy được route `/api/ai` (chỉ host file tĩnh).

## Cấu trúc

```
src/
  app/            # các trang (App Router) + api/ai/route.ts (gọi Claude ở server, có rate limit)
  components/     # Flashcards, WritingPractice, SpeakingPractice, Dashboard, …
  data/           # nội dung: cards, topics, roadmap, skills, grammar, bands, notes, …
  lib/            # srs.ts (thuật toán ôn), storage.ts, analyze.ts (chấm offline), tts.ts
public/data/cards.json   # bộ thẻ tải lười cho phiên ôn tập
```

Sửa/thêm nội dung chỉ cần chỉnh file JSON trong `src/data/` (nhớ chép `cards.json` sang `public/data/`).

## Hướng phát triển thương mại

- **Tài khoản & đồng bộ**: Supabase/Auth.js + Postgres để lưu tiến độ trên nhiều thiết bị (thay `useStore`).
- **Gói trả phí**: miễn phí phần học; giới hạn số lượt chấm AI/ngày, gói Pro mở không giới hạn (Stripe hoặc PayOS/VNPay cho thị trường VN).
- **Rate limit bền vững**: thay Map trong `api/ai` bằng Upstash Redis khi chạy nhiều instance.
- **Đo lường**: Vercel Analytics / Plausible; theo dõi tỉ lệ hoàn thành phiên ôn.
- **Nội dung**: thêm đề Cambridge-style đầy đủ, audio thật cho Listening, blog SEO theo từ khoá “từ vựng IELTS chủ đề …”.

IELTS là thương hiệu của British Council, IDP và Cambridge University Press & Assessment; dự án không liên kết với các tổ chức này.
