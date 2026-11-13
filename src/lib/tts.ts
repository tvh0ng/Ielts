"use client";
export type Accent = "auto" | "en-GB" | "en-US";
let voices: SpeechSynthesisVoice[] = [];
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  const load = () => (voices = window.speechSynthesis.getVoices());
  load();
  window.speechSynthesis.onvoiceschanged = load;
}
export const ttsSupported = () => typeof window !== "undefined" && "speechSynthesis" in window;

export function speak(text: string, opts: { accent?: Accent; rate?: number; onend?: () => void } = {}) {
  if (!ttsSupported()) return;
  const s = window.speechSynthesis;
  s.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const lang = opts.accent && opts.accent !== "auto" ? opts.accent : "en-GB";
  u.lang = lang;
  u.rate = opts.rate ?? 0.9;
  const v = voices.find((x) => x.lang === lang && /natural|google|neural/i.test(x.name)) || voices.find((x) => x.lang === lang) || voices.find((x) => x.lang.startsWith("en"));
  if (v) u.voice = v;
  if (opts.onend) u.onend = opts.onend;
  s.speak(u);
}
export const stopSpeaking = () => ttsSupported() && window.speechSynthesis.cancel();
