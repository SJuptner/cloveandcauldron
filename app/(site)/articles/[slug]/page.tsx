import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getArticleBySlug,
  getAllArticleSlugs,
  getRelatedArticles,
  getAllArticles,
} from '@/lib/sanity.queries';
import { resolveImageSrc } from '@/lib/sanity.image';
import { estimateReadingMinutes } from '@/lib/readingTime';
import ArticleBody from '@/components/ArticleBody';
import ArticleCard from '@/components/ArticleCard';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs().catch(() => []);
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug).catch(() => null);
  if (!article) return notFound();

  const subjectSlugs = (article.subjects || []).map((s: any) => s.slug.current);
  let related = await getRelatedArticles(subjectSlugs, article._id, 3).catch((): any[] => []);
  if (related.length < 3) {
    const latest = await getAllArticles().catch(() => []);
    const seen = new Set([slug, ...related.map((r: any) => r.slug.current)]);
    for (const candidate of latest) {
      if (related.length >= 3) break;
      if (!seen.has(candidate.slug.current)) {
        related.push(candidate);
        seen.add(candidate.slug.current);
      }
    }
  }

  const readMinutes = estimateReadingMinutes(article.body);
  const publishedLabel = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;
  const symbolism = (article.body || [])
    .filter((b: any) => b._type === 'symbolCallout' && b.label)
    .map((b: any) => b.label);
  // heroImage is an optional wide-format override for the banner below --
  // most articles just reuse the (portrait) coverImage for both contexts.
  const heroImage = article.heroImage || article.coverImage;

  return (
    <div className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      {/* Editorial Header */}
      <header className="mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="max-w-2xl">
            <div className="flex gap-2 flex-wrap mb-4">
              {article.subjects?.map((s: any) => (
                <Link
                  key={s.slug.current}
                  href={`/embers/${s.slug.current}`}
                  className="font-label-sm text-label-sm text-secondary uppercase tracking-widest underline decoration-secondary/30 underline-offset-4"
                >
                  {s.name}
                </Link>
              ))}
            </div>
            <h1 className="font-headline-lg text-headline-lg md:text-display-lg md:font-display-lg text-primary leading-tight">
              {article.title}
            </h1>
            {article.dek && (
              <p className="font-body-lg text-body-lg text-on-surface-variant italic mt-4">
                {article.dek}
              </p>
            )}
          </div>
          <div className="md:text-right shrink-0">
            {publishedLabel && (
              <p className="font-label-lg text-label-lg uppercase text-on-surface-variant">
                {publishedLabel}
              </p>
            )}
            <p className="font-label-lg text-label-lg font-bold">{readMinutes} Minute Read</p>
          </div>
        </div>

        <div className="w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden ink-border bg-surface-container mb-4">
          <Image
            src={resolveImageSrc(heroImage, 1600, 686)}
            alt={heroImage?.alt || article.title}
            width={1600}
            height={686}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        {heroImage?.caption && (
          <p className="text-center font-label-sm text-label-sm italic text-on-surface-variant/70">
            {heroImage.caption}
          </p>
        )}
      </header>

      {/* Article Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Sidebar / Metadata */}
        {(article.dek || symbolism.length > 0) && (
          <aside className="hidden lg:block lg:col-span-3 space-y-12">
            {article.dek && (
              <div className="border-l-2 border-secondary pl-6 py-2 sticky top-32">
                <h3 className="font-label-lg text-label-lg uppercase tracking-widest mb-4">
                  Core Essence
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{article.dek}</p>
                {symbolism.length > 0 && (
                  <div className="space-y-4 mt-10">
                    <h3 className="font-label-lg text-label-lg uppercase tracking-widest">
                      Symbolism
                    </h3>
                    <ul className="space-y-2 font-label-sm text-label-sm">
                      {symbolism.map((label: string) => (
                        <li key={label} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-secondary rounded-full shrink-0" />
                          {label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </aside>
        )}

        {/* Main Content */}
        <div className="col-span-1 lg:col-span-7 lg:col-start-5 max-w-none">
          <ArticleBody value={article.body} />

          {article.relatedVideo && (
            <div className="ink-border bg-surface-container p-6 mt-12">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block mb-2">
                Companion video
              </span>
              <a href={article.relatedVideo.url} target="_blank" rel="noopener noreferrer">
                {article.relatedVideo.title} ↗
              </a>
            </div>
          )}

          {/* Article Tags */}
          {article.subjects?.length > 0 && (
            <div className="mt-16 flex flex-wrap gap-2">
              {article.subjects.map((s: any) => (
                <span
                  key={s.slug.current}
                  className="px-4 py-1 border border-outline/30 text-label-sm font-label-sm uppercase tracking-wider"
                >
                  {s.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Articles Section */}
      {related.length > 0 && (
        <section className="mt-16 md:mt-24 border-t border-outline/20 pt-16">
          <h2 className="font-headline-md text-headline-md text-primary mb-12">Further Journeys</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter">
            {related.map((relatedArticle: any) => (
              <ArticleCard key={relatedArticle.slug.current} article={relatedArticle} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
