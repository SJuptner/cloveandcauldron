import type { Metadata } from 'next';
import ArticleCard from '@/components/ArticleCard';
import SubjectTags from '@/components/SubjectTags';
import { getArticlesBySubject, getAllSubjects } from '@/lib/sanity.queries';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateStaticParams() {
  const subjects = await getAllSubjects().catch(() => []);
  return subjects.map((s: any) => ({ subject: s.slug.current }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string }>;
}): Promise<Metadata> {
  const { subject } = await params;
  const subjects = await getAllSubjects().catch(() => []);
  const currentSubject = subjects.find((s: any) => s.slug.current === subject);
  if (!currentSubject) return {};

  const title = `${currentSubject.metaTitle || currentSubject.name} | The Embers`;
  const description =
    currentSubject.metaDescription ||
    currentSubject.description ||
    `Articles exploring ${currentSubject.name} on Clove & Cauldron.`;
  const path = `/embers/${subject}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
  };
}

export default async function SubjectArchivePage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;
  const [articles, subjects] = await Promise.all([
    getArticlesBySubject(subject).catch(() => []),
    getAllSubjects().catch(() => []),
  ]);

  const currentSubject = subjects.find((s: any) => s.slug.current === subject);
  if (!currentSubject) return notFound();

  return (
    <div className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <span className="text-secondary font-label-lg text-label-lg uppercase tracking-widest mb-2 block">
        The Embers
      </span>
      <h1 className="font-headline-lg text-headline-lg text-primary mb-4">
        {currentSubject.name}
      </h1>
      {currentSubject.description && (
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
          {currentSubject.description}
        </p>
      )}

      <div className="mb-16">
        <SubjectTags subjects={subjects} activeSlug={subject} />
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
          No articles tagged with this subject yet.
        </p>
      )}
    </div>
  );
}
