import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name, short_name: "IELTS Master", description: SITE.description, lang: "vi", start_url: "/", display: "standalone",
    background_color: "#f4f7f6", theme_color: "#1f8a70",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }, { src: "/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }],
    shortcuts: [{ name: "Ôn tập hôm nay", url: "/tu-vung/on-tap" }, { name: "Luyện Writing", url: "/luyen-tap/writing" }],
  };
}
