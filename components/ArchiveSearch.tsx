'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { portableTextToPlainText } from '@/lib/portableText';

interface ArticleLite {
  title: string;
  slug: { current: string };
  dek?: string;
  subjects?: { name: string; slug: { current: string } }[];
  body?: any[];
}

export default function ArchiveSearch({ articles }: { articles: ArticleLite[] }) {
  const [query, setQuery] = useState('');

  // Built once per articles list (not per keystroke) -- flattening portable
  // text is the expensive part, filtering the resulting strings is cheap.
  const searchIndex = useMemo(
    () =>
      articles.map((article) => ({
        article,
        haystack: [
          article.title,
          article.dek,
          ...(article.subjects?.map((s) => s.name) || []),
          portableTextToPlainText(article.body),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase(),
      })),
    [articles]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchIndex.filter((entry) => entry.haystack.includes(q)).map((entry) => entry.article);
  }, [searchIndex, query]);

  const showResults = query.trim().length > 0;

  return (
    <div className="relative mb-16">
      <div className="relative">
        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
          search
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the embers..."
          className="w-full bg-surface-container ink-border pl-14 pr-5 py-5 font-body-lg text-body-lg text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
        />
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface ink-border woodblock-shadow z-30 max-h-[28rem] overflow-y-auto">
          {results.length > 0 ? (
            <ul>
              {results.map((article) => (
                <li key={article.slug.current} className="border-b border-outline/10 last:border-b-0">
                  <Link
                    href={`/articles/${article.slug.current}`}
                    className="block px-6 py-4 hover:bg-surface-container-high transition-colors"
                  >
                    <div className="font-headline-sm text-headline-sm text-primary">{article.title}</div>
                    {article.dek && (
                      <div className="font-body-md text-body-md text-on-surface-variant mt-1 line-clamp-1">
                        {article.dek}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-5 font-body-md text-body-md text-on-surface-variant italic">
              No embers found for &ldquo;{query}&rdquo;.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
