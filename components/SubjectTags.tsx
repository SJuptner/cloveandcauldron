import Link from 'next/link';

interface Subject {
  name: string;
  slug: { current: string };
  articleCount?: number;
}

export default function SubjectTags({
  subjects,
  activeSlug,
}: {
  subjects: Subject[];
  activeSlug?: string;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {subjects.map((subject) => {
        const isActive = activeSlug === subject.slug.current;
        return (
          <Link
            key={subject.slug.current}
            href={`/embers/${subject.slug.current}`}
            className={
              isActive
                ? 'px-4 py-2 bg-primary text-on-primary font-label-lg text-label-lg uppercase tracking-widest ink-border'
                : 'px-4 py-2 bg-surface-container text-on-surface-variant hover:text-secondary transition-colors font-label-lg text-label-lg uppercase tracking-widest ink-border'
            }
          >
            {subject.name}
            {typeof subject.articleCount === 'number' && (
              <span className="opacity-60"> ({subject.articleCount})</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
