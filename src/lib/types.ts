export type SkillKey = "L" | "R" | "W" | "S";

export interface Topic { name: string; slug: string; group: "Chủ đề" | "Writing" | "Academic" | "Speaking"; count: number }
export interface Card { id: number; t: string; c: string; m: string; e: string; ipa: string }

export interface Stage {
  id: string; band: string; name: string; range: string; lo: number; hi: number; weeks: string; hours: number;
  summary: string; targets: [string, string, string][]; grammar: string[]; vocab: string[];
  types: [SkillKey, string][]; week: [string, string][]; checklist: string[]; mistakes: string[]; exit: string;
}

export interface QuestionType { t: string; s: string; lv: string; d: string; st?: string[]; tr?: string[]; tip?: string; ex?: string }
export interface Skill { name: string; icon: string; fmt: [string, string][]; intro: string; types: QuestionType[] }

export interface GrammarItem { lv: string; t: string; f: string; ex: string[]; use: string }
export interface BandTable { head: string[]; rows: string[][] }
export interface Note { slug: string; label: string; sections: { h: string; body: string }[] }

export interface SpeakingQA { q: string; a: string }
export interface CueCard { title: string; bullets: string[]; model: string }
