import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// A YAML date comes in as a Date, a quoted one as a string; both end up as
// "YYYY-MM-DD".
const isoDate = z
  .union([z.string(), z.date()])
  .transform(value => (value instanceof Date ? value.toISOString() : value).slice(0, 10));

const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './data/posts' }),
  schema: z.object({
    title: z.string(),
    published_at: isoDate,
    snippet: z.string().optional(),
    tags: z.array(z.coerce.string()).optional(),
    image: z.string().optional(),
    leetcode_number: z.number().optional(),
  }),
});

export const collections = { posts };
