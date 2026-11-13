/**
 * Spaced repetition (SM-2 variant, như Anki): mỗi thẻ có ease, interval (ngày), due (timestamp).
 * Grade: 0 = Quên, 1 = Khó, 2 = Nhớ, 3 = Dễ.
 */
export interface SrsState { e: number; i: number; d: number; r: number; l?: number }
export type SrsMap = Record<string, SrsState>;
export type Grade = 0 | 1 | 2 | 3;

const DAY = 86_400_000;
export const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };

export function schedule(prev: SrsState | undefined, g: Grade, now = Date.now()): SrsState {
  let e = prev?.e ?? 2.5, i = prev?.i ?? 0;
  const r = (prev?.r ?? 0) + 1;
  if (g === 0) { e = Math.max(1.3, e - 0.2); i = 0; return { e, i, d: now + 10 * 60_000, r, l: (prev?.l ?? 0) + 1 }; }
  if (g === 1) { e = Math.max(1.3, e - 0.15); i = i < 1 ? 1 : Math.max(1, Math.round(i * 1.2)); }
  if (g === 2) { i = i < 1 ? 1 : i < 3 ? 3 : Math.round(i * e); }
  if (g === 3) { e = e + 0.15; i = i < 1 ? 4 : Math.round(i * e * 1.3); }
  return { e, i, d: today() + i * DAY, r, l: prev?.l };
}

export const isDue = (s: SrsState | undefined, now = Date.now()) => !!s && s.d <= now;
export const isLearned = (s: SrsState | undefined) => !!s && s.i >= 21;
export const intervalLabel = (s: SrsState) => (s.i === 0 ? "10 phút" : s.i === 1 ? "1 ngày" : `${s.i} ngày`);

export function preview(prev: SrsState | undefined): Record<Grade, string> {
  return { 0: "10p", 1: intervalLabel(schedule(prev, 1)), 2: intervalLabel(schedule(prev, 2)), 3: intervalLabel(schedule(prev, 3)) } as Record<Grade, string>;
}
