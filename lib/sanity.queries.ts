import { client } from './sanity.client';

export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]`);
}

export async function getFeaturedArticles() {
  return client.fetch(`
    *[_type == "article" && featured == true] | order(publishedAt desc) [0...3] {
      title, slug, dek, coverImage, publishedAt,
      subjects[]->{name, slug}
    }
  `);
}

export async function getAllArticles() {
  return client.fetch(`
    *[_type == "article"] | order(publishedAt desc) {
      title, slug, dek, coverImage, publishedAt,
      subjects[]->{name, slug}
    }
  `);
}

export async function getArticlesBySubject(subjectSlug: string) {
  return client.fetch(
    `
    *[_type == "article" && $subjectSlug in subjects[]->slug.current] | order(publishedAt desc) {
      title, slug, dek, coverImage, publishedAt,
      subjects[]->{name, slug}
    }
  `,
    { subjectSlug }
  );
}

export async function getArticleBySlug(slug: string) {
  return client.fetch(
    `
    *[_type == "article" && slug.current == $slug][0] {
      title, dek, coverImage, body, publishedAt,
      subjects[]->{name, slug},
      relatedVideo->{title, url, platform}
    }
  `,
    { slug }
  );
}

export async function getAllSubjects() {
  return client.fetch(`
    *[_type == "subject"] | order(name asc) {
      name, slug, description,
      "articleCount": count(*[_type == "article" && references(^._id)])
    }
  `);
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
      name, image, price, externalUrl
    }
  `);
}

export async function getAllArticleSlugs() {
  return client.fetch(`*[_type == "article"]{"slug": slug.current}`);
}
