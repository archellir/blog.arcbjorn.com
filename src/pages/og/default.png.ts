import type { APIRoute } from 'astro';

import { renderCard } from '../../lib/card';
import { SITE_DESCRIPTION, SITE_NAME } from '../../lib/site';

// The card for pages that are not a post.
export const GET: APIRoute = async () => {
  const png = await renderCard({ title: SITE_NAME, line: SITE_DESCRIPTION });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
