import ArticleCard from '@/components/ArticleCard';
import SubjectTags from '@/components/SubjectTags';
import { getAllArticles, getAllSubjects } from '@/lib/sanity.queries';

export const revalidate = 60;

export default async function ArchivePage() {
  const [articles, subjects] = await Promise.all([
    getAllArticles().catch(() => []),
    getAllSubjects().catch(() => []),
  ]);

  return (
    <div className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <span className="text-secondary font-label-lg text-label-lg uppercase tracking-widest mb-2 block">
        The Archive
      </span>
      <h1 className="font-headline-lg text-headline-lg text-primary mb-10">
        Browse by Subject
      </h1>

      <div className="mb-16">
        <SubjectTags subjects={subjects} />
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
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
