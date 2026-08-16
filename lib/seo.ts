import fs from 'fs';
import path from 'path';
import { portableTextToPlainText } from './portableText';
import { resolveImageSrc } from './sanity.image';

export const SITE_URL = 'https://cloveandcauldron.co';
export const SITE_NAME = 'Clove & Cauldron';

// Reads width/height straight out of the PNG's IHDR chunk (bytes 16-23,
// per the PNG spec) instead of hardcoding them, so the JSON-LD logo
// dimensions can never drift out of sync with whatever file actually ships.
function readPngDimensions(publicPath: string): { width: number; height: number } {
  const buffer = fs.readFileSync(path.join(process.cwd(), 'public', publicPath));
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

// Raster (PNG) version of the lockup mark, for Google's Organization logo
// rich-result eligibility -- Google doesn't accept SVG for that.
const LOGO_PATH = '/logo/lockup-black.png';
const LOGO_URL = `${SITE_URL}${LOGO_PATH}`;
const { width: LOGO_WIDTH, height: LOGO_HEIGHT } = readPngDimensions(LOGO_PATH);

// Google's Organization logo rich result wants a roughly square image
// (and at least 112x112px) -- this lockup mark is wide, not square, so it
// won't reliably qualify even though it clears the raster/PNG requirement.
const LOGO_ASPECT_RATIO = LOGO_WIDTH / LOGO_HEIGHT;
if (LOGO_WIDTH < 112 || LOGO_HEIGHT < 112 || LOGO_ASPECT_RATIO > 1.25 || LOGO_ASPECT_RATIO < 0.8) {
  console.warn(
    `[seo] JSON-LD logo ${LOGO_PATH} is ${LOGO_WIDTH}x${LOGO_HEIGHT} (ratio ${LOGO_ASPECT_RATIO.toFixed(2)}) -- does not meet Google's "roughly square, min 112x112" guidance for the Organization logo rich result. A square icon-style crop would be needed for that rich result specifically; the JSON-LD itself remains valid regardless.`
  );
}

// Trims plain text to a meta-description-friendly length without cutting
// mid-word, since search engines truncate awkwardly otherwise.
export function truncate(text: string, maxLength: number): string {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length <= maxLength) return trimmed;

  const cut = trimmed.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

// Shared by generateMetadata and the Article JSON-LD block so both read the
// same title/description/image, rather than re-deriving the fallback chain
// (metaTitle/metaDescription overrides -> dek -> body excerpt) in two places.
export function getArticleSeo(article: any) {
  const title = article.metaTitle || article.title;
  const description =
    article.metaDescription ||
    article.dek ||
    truncate(portableTextToPlainText(article.body), 155);
  const imageSource = article.ogImage || article.coverImage;
  const image = resolveImageSrc(imageSource, 1200, 630);
  const imageAlt = imageSource?.alt || title;
  return { title, description, image, imageAlt };
}

// `dangerouslySetInnerHTML`-safe JSON-LD serialization: escapes `<` so a
// body value containing "</script>" can't break out of the script tag.
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function buildArticleJsonLd(article: any, slug: string) {
  const { title, description, image } = getArticleSeo(article);
  const url = `${SITE_URL}/articles/${slug}`;
  // No author field exists on the article schema -- every piece is written
  // in-house, so the Organization itself is the byline.
  const author = { '@type': 'Organization', name: SITE_NAME, url: SITE_URL };

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: [image],
    datePublished: article.publishedAt,
    dateModified: article._updatedAt || article.publishedAt,
    author,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
        width: LOGO_WIDTH,
        height: LOGO_HEIGHT,
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}

export function buildSiteJsonLd() {
  const sameAs = [
    'https://instagram.com/cloveandcauldron',
    'https://youtube.com/@cloveandcauldron',
    'https://tiktok.com/@cloveandcauldron',
  ];

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  };

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    sameAs,
  };

  return { website, organization };
}
