import type { Metadata, Viewport } from "next";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource-variable/bricolage-grotesque/index.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/site";


export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["IELTS", "lộ trình IELTS", "tự học IELTS", "từ vựng IELTS", "collocation", "IELTS Writing", "IELTS Speaking", "band 7.0", "flashcard"],
  openGraph: { type: "website", locale: SITE.locale, siteName: SITE.name, title: `${SITE.name} — ${SITE.tagline}`, description: SITE.description, url: SITE.url },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f4f7f6" }, { media: "(prefers-color-scheme: dark)", color: "#0c1719" }],
};

const themeScript = `try{var t=localStorage.getItem('im2:theme');t=t?JSON.parse(t):'system';if(t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh font-sans flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 btn-primary">Bỏ qua tới nội dung</a>
        <Header />
        <main id="main" className="flex-1 pb-24 md:pb-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
