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
 */
export function resolveImageSrc(image: any, width = 1200): string {
  if (!image) return PLACEHOLDER_IMAGE;
  if (image.asset) return urlFor(image).width(width).url();
  if (typeof image.src === 'string') return image.src;
  return PLACEHOLDER_IMAGE;
}
