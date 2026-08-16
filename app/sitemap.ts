import type { MetadataRoute } from 'next';
import { getAllArticleSlugs, getAllSubjects } from '@/lib/sanity.queries';
import { SITE_URL } from '@/lib/seo';

const STATIC_ROUTES = ['/', '/embers', '/about', '/shop', '/the-long-road', '/privacy'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articleSlugs, subjects] = await Promise.all([
    getAllArticleSlugs().catch(() => []),
    getAllSubjects().catch(() => []),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const articleEntries: MetadataRoute.Sitemap = articleSlugs.map(
    (article: { slug: string; publishedAt?: string }) => ({
      url: `${SITE_URL}/articles/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
    })
  );

  const subjectEntries: MetadataRoute.Sitemap = subjects.map((subject: any) => ({
    url: `${SITE_URL}/embers/${subject.slug.current}`,
    lastModified: new Date(),
  }));

  return [...staticEntries, ...articleEntries, ...subjectEntries];
}
