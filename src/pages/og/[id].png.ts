import type { APIRoute } from 'astro';

import { renderCard } from '../../lib/card';
import { longDate } from '../../lib/dates';
import { allPosts } from '../../lib/posts';
import { readingTime } from '../../lib/readingTime';

// One social card per post, built with the site.
export async function getStaticPaths() {
  const posts = await allPosts();
  return posts.map(post => ({ params: { id: post.id }, props: { post } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props;
  const png = await renderCard({
    title: post.title,
    number: post.leetcode_number ? `#${post.leetcode_number}` : undefined,
    line: `${longDate(post.publishedAt)} · ${readingTime(post.content)} min read`,
  });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
