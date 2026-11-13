import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center text-center">
      <div><p className="title-display text-7xl text-brand-500">404</p><h1 className="title-display mt-2 text-2xl">Không tìm thấy trang</h1><p className="mt-2 text-muted">Có thể đường dẫn đã thay đổi.</p><Link href="/" className="btn-primary mt-6">Về trang chủ</Link></div>
    </div>
  );
}
