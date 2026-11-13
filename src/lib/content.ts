import dictationJson from "@/data/dictation.json";
import testsJson from "@/data/tests.json";
import samplesJson from "@/data/samples.json";
import speakingJson from "@/data/speaking.json";
import type { CueCard, SpeakingQA } from "./types";
import type { CoverTheme } from "@/components/Cover";

export interface Dictation { slug: string; title: string; topic: string; level: "Dễ" | "Trung bình" | "Khó"; part: string; lines: [string, string][] }
export interface TestQuestion { q: string; options?: string[]; answer: string[]; why: string }
export interface TestGroup { type: "tfng" | "mcq" | "gap"; instruction: string; questions: TestQuestion[] }
export interface TestSection { title: string; paras?: string[]; script?: [string, string][]; groups: TestGroup[] }
export interface MockTest { slug: string; title: string; skill: "Reading" | "Listening"; minutes: number; level: string; color: CoverTheme; sections: TestSection[] }
export interface WritingSample { slug: string; task: 1 | 2; type: string; band: string; title: string; prompt: string; outline: string[]; essay: string; vocab: [string, string][] }

export const dictations = dictationJson as Dictation[];
export const tests = testsJson as MockTest[];
export const samples = samplesJson as WritingSample[];
export const speakingBank = speakingJson as unknown as { p1: SpeakingQA[]; p2: CueCard[]; p3: SpeakingQA[] };
export const countQuestions = (t: MockTest) => t.sections.reduce((a, s) => a + s.groups.reduce((b, g) => b + g.questions.length, 0), 0);
