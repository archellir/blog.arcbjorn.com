import type { IHeading } from "../types.ts";

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

function decode(text: string): string {
  return text.replace(/&(amp|lt|gt|quot|#39);/g, (entity) => ENTITIES[entity]);
}

// The headings of one level from rendered HTML, with tags (including the
// permalink anchor) stripped from their text.
export function extractHeadings(html: string, level = 2): IHeading[] {
  const pattern = new RegExp(
    `<h${level} id="([^"]+)">([\\s\\S]*?)<\\/h${level}>`,
    "g",
  );
  return [...html.matchAll(pattern)].map((match) => ({
    id: match[1],
    text: decode(
      match[2]
        .replace(/<a class="anchor"[^>]*>[\s\S]*?<\/a>/g, "")
        .replace(/<[^>]+>/g, ""),
    ).trim(),
  }));
}
