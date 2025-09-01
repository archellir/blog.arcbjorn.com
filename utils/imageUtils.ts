import { asset } from "$fresh/runtime.ts";

/**
 * Resolves an image path to a full URL
 * @param imagePath - The image path (can be relative or absolute URL)
 * @param origin - The site origin (e.g., https://blog.arcbjorn.com)
 * @param fallback - Fallback image path if imagePath is not provided
 * @returns Full URL to the image
 */
export function resolveImageUrl(
  imagePath: string | undefined,
  origin: string,
  fallback: string = "/images/og-default.png",
): string {
  if (!imagePath) {
    return `${origin}${asset(fallback)}`;
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `${origin}${asset(imagePath)}`;
}
