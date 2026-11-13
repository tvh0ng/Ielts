import topicsJson from "@/data/topics.json";
import cardsJson from "@/data/cards.json";
import roadJson from "@/data/roadmap.json";
import skillsJson from "@/data/skills.json";
import gramJson from "@/data/grammar.json";
import bandsJson from "@/data/bands.json";
import notesJson from "@/data/notes.json";
import type { BandTable, Card, GrammarItem, Note, Skill, SkillKey, Stage, Topic } from "./types";

export const topics = topicsJson as Topic[];
export const cards = cardsJson as Card[];
export const roadmap = roadJson as unknown as Stage[];
export const skills = skillsJson as unknown as Record<SkillKey, Skill>;
export const grammar = gramJson as GrammarItem[];
export const bands = bandsJson as unknown as { writing: BandTable; speaking: BandTable; conv: Record<"L" | "RA" | "RG", [number, number][]> };
export const notes = notesJson as Note[];

export const SKILL_SLUG: Record<SkillKey, string> = { L: "listening", R: "reading", W: "writing", S: "speaking" };
export const SLUG_SKILL: Record<string, SkillKey> = { listening: "L", reading: "R", writing: "W", speaking: "S" };

export const topicBySlug = (s: string) => topics.find((t) => t.slug === s);
export const topicByName = (n: string) => topics.find((t) => t.name === n);
export const cardsOf = (slug: string) => cards.filter((c) => c.t === slug);
export const stageById = (id: string) => roadmap.find((r) => r.id === id);
export const stageSlug = (s: Stage) => (s.id === "f" ? "nen-tang" : `band-${s.id[0]}-${s.id[1]}`);
export const stageBySlug = (slug: string) => roadmap.find((s) => stageSlug(s) === slug);
export const stripTags = (s: string) => s.replace(/<[^>]+>/g, "");
