import { describe, expect, it } from 'vitest';

import { renderCard, renderCardSvg } from '../src/lib/card';

describe('social card', () => {
  it('lays the card out on a 1200 by 630 canvas', async () => {
    const svg = await renderCardSvg({ title: 'Two sum', number: '#1', line: '24 February 2023' });
    expect(svg.startsWith('<svg width="1200" height="630"')).toBe(true);
  });

  it('renders a 1200 by 630 PNG', async () => {
    const png = await renderCard({
      title: 'AI writes the applications, AI screens them. 14,572 engineering job postings.',
      line: '18 June 2026 · 11 min read',
    });
    // PNG signature, then the IHDR chunk with width and height.
    expect([...png.slice(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const view = new DataView(png.buffer, png.byteOffset);
    expect(view.getUint32(16)).toBe(1200);
    expect(view.getUint32(20)).toBe(630);
  });
});
