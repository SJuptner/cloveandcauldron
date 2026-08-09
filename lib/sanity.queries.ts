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
      _id, title, dek, coverImage, heroImage, body, publishedAt,
      subjects[]->{name, slug},
      relatedVideo->{title, url, platform}
    }
  `,
    { slug }
  );
  return article || demoArticles.find((a) => a.slug.current === slug) || null;
}

export async function getRelatedArticles(
  subjectSlugs: string[],
  excludeId: string,
  limit = 3
): Promise<any[]> {
  const anyOtherArticleQuery = () =>
    client.fetch(
      `
      *[_type == "article" && _id != $excludeId] | order(publishedAt desc) [0...$limit] {
        title, slug, dek, coverImage,
        subjects[]->{name, slug}
      }
    `,
      { excludeId, limit }
    );

  let articles: any[] = [];

  // Prefer articles that share a subject tag.
  if (subjectSlugs.length) {
    articles = await client.fetch(
      `
      *[_type == "article" && _id != $excludeId && count((subjects[]->slug.current)[@ in $subjectSlugs]) > 0]
        | order(publishedAt desc) [0...$limit] {
        title, slug, dek, coverImage,
        subjects[]->{name, slug}
      }
    `,
      { excludeId, subjectSlugs, limit }
    );
  }

  // Nothing shares a tag (or none to match on) -- still recommend whatever
  // else has actually been published, rather than jumping to demo content.
  if (!articles.length) {
    articles = await anyOtherArticleQuery();
  }

  if (articles.length) return articles;

  // Demo articles are only a stand-in while the site has zero real content
  // at all. Once a real article exists, showing demo "recommendations"
  // alongside it would be misleading -- better to show no related articles
  // than fake ones, so only fall back here while previewing a demo article.
  if (!excludeId.startsWith('demo-')) return [];

  const pool = demoArticles.filter((a) => a._id !== excludeId);
  const bySubject = subjectSlugs.length
    ? pool.filter((a) => a.subjects.some((s) => subjectSlugs.includes(s.slug.current)))
    : pool;
  return (bySubject.length ? bySubject : pool).slice(0, limit);
}

export async function getAllSubjects() {
  const subjects = await client.fetch(`
    *[_type == "subject"] | order(name asc) {
      name, slug, description,
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
  const slugs = await client.fetch(`*[_type == "article"]{"slug": slug.current}`);
  if (slugs.length) return slugs;
  return demoArticles.map((a) => ({ slug: a.slug.current }));
}
