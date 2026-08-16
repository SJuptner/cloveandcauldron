import { createImageUrlBuilder } from '@sanity/image-url';
import type { Image } from 'sanity';
import { projectId, dataset } from './sanity.client';

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: Image) {
  return builder.image(source);
}

export const PLACEHOLDER_IMAGE = '/placeholders/image.svg';

/**
 * Resolves either a real Sanity image (has `asset`) or the local demo-content
 * shape (`{ src }`, used by lib/demoContent.ts) to a renderable URL, falling
 * back to a generic on-brand placeholder if neither is present.
 *
 * Pass `height` whenever the image will be shown in a fixed-aspect container
 * (card thumbnails, the article hero banner, etc). Without it, Sanity only
 * scales the image and the browser's `object-cover` blindly center-crops it
 * client-side, ignoring any focal point an editor picked in Studio. With
 * both `width` and `height`, Sanity crops server-side around that hotspot
 * instead, so the crop actually follows what the editor marked as important.
 */
export function resolveImageSrc(image: any, width = 1200, height?: number): string {
  if (!image) return PLACEHOLDER_IMAGE;
  if (image.asset) {
    const builder = urlFor(image).width(width);
    return (height ? builder.height(height).fit('crop') : builder).url();
  }
  if (typeof image.src === 'string') return image.src;
  return PLACEHOLDER_IMAGE;
}

// Sanity image asset ids are deterministically named
// `image-<hash>-<width>x<height>-<format>` at upload time -- the dimensions
// are baked into the reference string itself, no need to dereference the
// asset document or extend any GROQ projection to get at them.
const ASSET_REF_DIMENSIONS = /-(\d+)x(\d+)-/;

/**
 * Real pixel dimensions of a Sanity image, parsed straight off its asset
 * reference. next/image requires width+height up front for any non-`fill`
 * remote image; using the asset's real aspect ratio here (instead of a
 * guessed one) is what lets a fixed-width, auto-height image render at its
 * true proportions with no cropping.
 *
 * Demo/placeholder images (lib/demoContent.ts) have no `asset` ref -- they
 * fall back to a plain 4:3 box.
 */
export function getImageDimensions(
  image: any,
  fallback: { width: number; height: number } = { width: 4, height: 3 }
): { width: number; height: number } {
  const ref = image?.asset?._ref || image?.asset?._id;
  const match = typeof ref === 'string' ? ref.match(ASSET_REF_DIMENSIONS) : null;
  if (match) return { width: Number(match[1]), height: Number(match[2]) };
  return fallback;
}
