import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Chấm Writing/Speaking & tạo bài mẫu bằng Claude. Khoá API chỉ nằm ở server. */
type Kind = "grade-writing" | "model-writing" | "grade-speaking" | "model-speaking";
interface Body { kind: Kind; task?: 1 | 2; part?: 1 | 2 | 3; prompt: string; text?: string }

const hits = new Map<string, { n: number; t: number }>();
const LIMIT = Number(process.env.AI_RATE_LIMIT_PER_HOUR || 20);

function limited(ip: string) {
  const now = Date.now(); const h = hits.get(ip);
  if (!h || now - h.t > 3_600_000) { hits.set(ip, { n: 1, t: now }); return false; }
  h.n++; return h.n > LIMIT;
}

function buildPrompt(b: Body): string {
  const q = b.prompt.slice(0, 2000); const t = (b.text || "").slice(0, 6000);
  switch (b.kind) {
    case "grade-writing":
      return `You are a strict, calibrated IELTS examiner. Assess this IELTS Writing Task ${b.task} response using the official public band descriptors.
Return ONLY valid JSON (no markdown): {"bands":{"ta":0,"cc":0,"lr":0,"gra":0,"overall":0},"summary":"2-3 sentences of feedback IN VIETNAMESE","errors":[{"original":"exact substring of the essay","suggestion":"correction","explanation":"short reason in Vietnamese"}]}
Bands 0-9 in 0.5 steps. Each "original" MUST be an exact substring of the essay. Up to 12 key errors.
QUESTION: ${q}

ESSAY:
${t}`;
    case "model-writing":
      return `Write a Band 9 model answer for this IELTS Writing Task ${b.task} question. About ${b.task === 1 ? 170 : 280} words, clear paragraphing, formal academic style. Return ONLY the essay text.

QUESTION: ${q}`;
    case "grade-speaking":
      return `You are an IELTS Speaking examiner. Assess this Part ${b.part} answer from a transcript. Do NOT grade pronunciation.
Return ONLY valid JSON: {"bands":{"fc":0,"lr":0,"gra":0,"overall":0},"summary":"2-3 sentences IN VIETNAMESE","tips":["short tip in Vietnamese"],"better":"an improved Band 8 answer in English"}. Bands 0-9 in 0.5 steps.
QUESTION: ${q}

TRANSCRIPT:
${t}`;
    case "model-speaking":
      return `Provide a Band 8 sample answer for this IELTS Speaking Part ${b.part} question. ${b.part === 2 ? "About 180-220 words covering all bullet points." : b.part === 1 ? "About 40-60 words, natural." : "About 70-100 words with a reason and an example."} Return ONLY the answer.

QUESTION: ${q}`;
  }
}

export async function GET() {
  return NextResponse.json({ enabled: !!process.env.ANTHROPIC_API_KEY });
}

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ error: "AI chưa được cấu hình trên server." }, { status: 503 });
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  if (limited(ip)) return NextResponse.json({ error: "Bạn đã dùng hết lượt chấm AI trong giờ này. Thử lại sau nhé." }, { status: 429 });

  let body: Body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad JSON" }, { status: 400 }); }
  if (!body?.kind || !body.prompt) return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: 1600,
      messages: [{ role: "user", content: buildPrompt(body) }],
    }),
  });
  if (!r.ok) return NextResponse.json({ error: `AI lỗi (${r.status})` }, { status: 502 });
  const data = (await r.json()) as { content?: { type: string; text?: string }[] };
  const text = (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();

  if (body.kind.startsWith("model")) return NextResponse.json({ text });
  try {
    const clean = text.replace(/```json|```/g, "");
    return NextResponse.json({ json: JSON.parse(clean.slice(clean.indexOf("{"), clean.lastIndexOf("}") + 1)) });
  } catch {
    return NextResponse.json({ error: "Không đọc được kết quả AI" }, { status: 502 });
  }
}
