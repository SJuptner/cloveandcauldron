import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/sanity.queries';
import { urlFor } from '@/lib/sanity.image';
import ArticleBody from '@/components/ArticleBody';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs().catch(() => []);
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }));
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug).catch(() => null);
  if (!article) return notFound();

  return (
    <article className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-2 flex-wrap mb-6">
          {article.subjects?.map((s: any) => (
            <Link
              key={s.slug.current}
              href={`/archive/${s.slug.current}`}
              className="font-label-sm text-label-sm text-secondary uppercase tracking-widest underline decoration-secondary/30 underline-offset-4"
            >
              {s.name}
            </Link>
          ))}
        </div>

        <h1 className="font-headline-lg text-headline-lg text-primary mb-4">
          {article.title}
        </h1>

        {article.dek && (
          <p className="font-body-lg text-body-lg text-on-surface-variant italic mb-10">
            {article.dek}
          </p>
        )}

        {article.coverImage && (
          <div className="relative aspect-video ink-border mb-12 overflow-hidden">
            <Image
              src={urlFor(article.coverImage).width(1600).url()}
              alt={article.coverImage.alt || article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

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
      </div>
    </article>
  );
}
