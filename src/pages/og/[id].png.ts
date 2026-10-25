import type { APIRoute } from 'astro';

import { postCard, renderCard } from '../../lib/card';
import { allPosts } from '../../lib/posts';

// One social card per post, built with the site.
export async function getStaticPaths() {
  const posts = await allPosts();
  return posts.map(post => ({ params: { id: post.id }, props: { post } }));
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderCard(postCard(props.post));
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
