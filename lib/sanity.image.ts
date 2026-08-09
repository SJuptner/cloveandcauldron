import createImageUrlBuilder from '@sanity/image-url';
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
