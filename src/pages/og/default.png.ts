import type { APIRoute } from 'astro';

import { renderCard, SITE_CARD } from '../../lib/card';

// The card for pages that are not a post.
export const GET: APIRoute = async () => {
  const png = await renderCard(SITE_CARD);
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
