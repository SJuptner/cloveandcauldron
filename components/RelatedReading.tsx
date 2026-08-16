import ArticleCard from './ArticleCard';

interface RelatedReadingProps {
  articles: {
    title: string;
    slug: { current: string };
    dek?: string;
    coverImage?: any;
    subjects?: { name: string; slug: { current: string } }[];
  }[];
}

// Renders nothing when there are no genuinely related articles (shared
// subject tag) rather than padding with unrelated recent posts.
export default function RelatedReading({ articles }: RelatedReadingProps) {
  if (!articles?.length) return null;

  return (
    <section className="mt-16 md:mt-24 border-t border-outline/20 pt-16">
      <h2 className="font-headline-md text-headline-md text-primary mb-12">Further Journeys</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter items-start">
        {articles.map((article) => (
          <ArticleCard key={article.slug.current} article={article} />
        ))}
      </div>
    </section>
  );
}
