import { ImageResponse } from "next/og";

export const alt = "IELTS Master — Free IELTS roadmap 0 to 9.0";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(135deg,#0f4b3f 0%,#1f8a70 70%,#34a083 100%)", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 84, height: 84, borderRadius: 22, background: "white", color: "#1f8a70", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, fontWeight: 800 }}>A</div>
          <div style={{ fontSize: 44, fontWeight: 800 }}>IELTS Master</div>
        </div>
        <div style={{ fontSize: 86, fontWeight: 800, marginTop: 40, lineHeight: 1.05 }}>IELTS roadmap 0 → 9.0</div>
        <div style={{ fontSize: 34, marginTop: 24, opacity: 0.9 }}>1,100+ collocations · Spaced-repetition flashcards · AI Writing & Speaking feedback</div>
      </div>
    ),
    size,
  );
}
