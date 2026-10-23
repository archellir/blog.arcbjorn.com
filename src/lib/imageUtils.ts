// A post's social image as a full URL, or the site's default one.
export function resolveImageUrl(
  imagePath: string | undefined,
  origin: string,
  fallback = '/images/og-default.png'
): string {
  if (!imagePath) return `${origin}${fallback}`;
  if (imagePath.startsWith('http')) return imagePath;
  return `${origin}${imagePath}`;
}
