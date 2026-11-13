"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Flashcards, DEFAULT_SETTINGS, type StudyCard, type StudySettings } from "./Flashcards";
import { readStore } from "@/lib/storage";
import type { SrsMap } from "@/lib/srs";
import type { Card, Topic } from "@/lib/types";
import topicsJson from "@/data/topics.json";

export interface UserCard { key: string; c: string; m: string; e: string; ipa: string; topic: string }
const topicName = Object.fromEntries((topicsJson as Topic[]).map((t) => [t.slug, t.name]));

export function ReviewSession() {
  const [session, setSession] = useState<StudyCard[] | null>(null);
  const [info, setInfo] = useState({ due: 0, fresh: 0 });

  useEffect(() => {
    let alive = true;
    fetch("/data/cards.json").then((r) => r.json()).then((base: Card[]) => {
      if (!alive) return;
      const srs = readStore<SrsMap>("srs", {});
      const set = readStore<StudySettings>("study-settings", DEFAULT_SETTINGS);
      const mine = readStore<UserCard[]>("user-cards", []);
      const all: StudyCard[] = [
        ...mine.map((u) => ({ ...u, topic: u.topic || "Thẻ của tôi" })),
        ...base.map((c) => ({ key: String(c.id), c: c.c, m: c.m, e: c.e, ipa: c.ipa, topic: topicName[c.t] })),
      ];
      const now = Date.now();
      const due = all.filter((c) => srs[c.key] && srs[c.key].d <= now).sort((a, b) => srs[a.key].d - srs[b.key].d);
      const fresh = all.filter((c) => !srs[c.key]).slice(0, set.newPerDay);
      setInfo({ due: due.length, fresh: fresh.length });
      setSession([...due, ...fresh]);
    });
    return () => { alive = false; };
  }, []);

  if (!session) return <div className="card grid place-items-center p-16 text-muted"><Loader2 className="size-6 animate-spin" /></div>;
  return (
    <>
      <p className="mb-4 text-sm text-muted"><b className="text-ink">{info.due}</b> thẻ đến hạn · <b className="text-ink">{info.fresh}</b> thẻ mới</p>
      <Flashcards cards={session} title="Ôn tập" />
    </>
  );
}
