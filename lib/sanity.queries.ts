import { client } from './sanity.client';
import { demoArticles, demoSubjects } from './demoContent';

export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]`);
}

export async function getRecentArticles(limit = 3) {
  // Always the most recently published articles -- ignores the `featured`
  // flag so the homepage "Latest" section reflects what's actually posted.
  const articles = await client.fetch(
    `
    *[_type == "article"] | order(publishedAt desc) [0...$limit] {
      title, slug, dek, coverImage, publishedAt,
      subjects[]->{name, slug}
    }
  `,
    { limit }
  );
  // Preview fallback: shows demo articles only until real ones are published.
  return articles.length ? articles : demoArticles.slice(0, limit);
}

export async function getAllArticles() {
  const articles = await client.fetch(`
    *[_type == "article"] | order(publishedAt desc) {
      title, slug, dek, coverImage, body, publishedAt,
      subjects[]->{name, slug}
    }
  `);
  return articles.length ? articles : demoArticles;
}

export async function getArticlesBySubject(subjectSlug: string) {
  const articles = await client.fetch(
    `
    *[_type == "article" && $subjectSlug in subjects[]->slug.current] | order(publishedAt desc) {
      title, slug, dek, coverImage, publishedAt,
      subjects[]->{name, slug}
    }
  `,
    { subjectSlug }
  );
  if (articles.length) return articles;
  return demoArticles.filter((a) => a.subjects.some((s) => s.slug.current === subjectSlug));
}

export async function getArticleBySlug(slug: string) {
  const article = await client.fetch(
    `
    *[_type == "article" && slug.current == $slug][0] {
      _id, _updatedAt, title, dek, coverImage, heroImage, body, publishedAt,
      metaTitle, metaDescription, ogImage,
      subjects[]->{name, slug},
      relatedVideo->{title, url, platform}
    }
  `,
    { slug }
  );
  return article || demoArticles.find((a) => a.slug.current === slug) || null;
}

// Related Reading is genuinely-related-or-nothing: articles must share at
// least one subject tag with the current article. No "pad with whatever's
// recent" fallback -- ranked by how many subjects overlap (most relevant
// first), then recency as a tiebreak.
export async function getRelatedArticles(
  subjectSlugs: string[],
  excludeId: string,
  limit = 3
): Promise<any[]> {
  if (!subjectSlugs.length) return [];

  if (excludeId.startsWith('demo-')) {
    return demoArticles
      .filter(
        (a) => a._id !== excludeId && a.subjects.some((s) => subjectSlugs.includes(s.slug.current))
      )
      .slice(0, limit);
  }

  return client.fetch(
    `
    *[_type == "article" && _id != $excludeId && count((subjects[]->slug.current)[@ in $subjectSlugs]) > 0] {
      title, slug, dek, coverImage, publishedAt,
      subjects[]->{name, slug},
      "matchScore": count((subjects[]->slug.current)[@ in $subjectSlugs])
    } | order(matchScore desc, publishedAt desc) [0...$limit]
  `,
    { excludeId, subjectSlugs, limit }
  );
}

export async function getAllSubjects() {
  const subjects = await client.fetch(`
    *[_type == "subject"] | order(name asc) {
      name, slug, description, metaTitle, metaDescription,
      "articleCount": count(*[_type == "article" && references(^._id)])
    }
  `);
  return subjects.length ? subjects : demoSubjects;
}

export async function getLatestVideos(limit = 4) {
  return client.fetch(
    `
    *[_type == "video"] | order(publishedAt desc) [0...$limit] {
      title, description, platform, url, thumbnail, publishedAt
    }
  `,
    { limit }
  );
}

export async function getShopProducts() {
  return client.fetch(`
    *[_type == "product" && available == true] | order(_createdAt desc) {
      name, image, price, category, description, externalUrl
    }
  `);
}

export async function getAllArticleSlugs() {
  const slugs = await client.fetch(
    `*[_type == "article"]{"slug": slug.current, publishedAt}`
  );
  if (slugs.length) return slugs;
  return demoArticles.map((a) => ({ slug: a.slug.current, publishedAt: a.publishedAt }));
}
