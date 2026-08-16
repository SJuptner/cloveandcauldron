import type { Metadata } from 'next';
import ArticleCard from '@/components/ArticleCard';
import SubjectTags from '@/components/SubjectTags';
import ArchiveSearch from '@/components/ArchiveSearch';
import { getAllArticles, getAllSubjects } from '@/lib/sanity.queries';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'The Embers | Clove & Cauldron',
  description:
    'Browse every article in The Embers, our digital hearth where old Turkic and Anatolian folklore meets the modern seeker.',
  alternates: { canonical: '/embers' },
  openGraph: {
    title: 'The Embers | Clove & Cauldron',
    description:
      'Browse every article in The Embers, our digital hearth where old Turkic and Anatolian folklore meets the modern seeker.',
    url: '/embers',
  },
};

export default async function ArchivePage() {
  const [articles, subjects] = await Promise.all([
    getAllArticles().catch(() => []),
    getAllSubjects().catch(() => []),
  ]);

  return (
    <div className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <h1 className="font-headline-lg text-headline-lg text-primary mb-4">The Embers</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
        Welcome to The Embers, our digital hearth where old folklore meets the
        modern seeker.
      </p>

      <ArchiveSearch articles={articles} />

      <div className="mb-16">
        <SubjectTags subjects={subjects} />
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-start">
          {articles.map((article: any) => (
            <article key={article.slug.current} className="group">
              <ArticleCard article={article} />
            </article>
          ))}
        </div>
      ) : (
        <p className="font-body-md text-body-md text-on-surface-variant italic">
          No articles published yet.
        </p>
      )}
    </div>
  );
}
