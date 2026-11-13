import { buildIndex } from "@/lib/search-index";
import { topics } from "@/lib/data";

export const dynamic = "force-static";
export function GET() {
  return Response.json({ index: buildIndex(), topicName: Object.fromEntries(topics.map((t) => [t.slug, t.name])) });
}
