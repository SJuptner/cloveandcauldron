import createImageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';
import { projectId, dataset } from './sanity.client';

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: Image) {
  return builder.image(source);
}
