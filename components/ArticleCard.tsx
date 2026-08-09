import Link from 'next/link';
import Image from 'next/image';
import { resolveImageSrc } from '@/lib/sanity.image';

interface ArticleCardProps {
  article: {
    title: string;
    slug: { current: string };
    dek?: string;
    coverImage?: any;
    subjects?: { name: string; slug: { current: string } }[];
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const primarySubject = article.subjects?.[0];

  return (
    <Link href={`/articles/${article.slug.current}`} className="group block">
      <div className="relative overflow-hidden mb-6 aspect-[4/5] ink-border bg-surface-container">
        <Image
          className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          src={resolveImageSrc(article.coverImage, 800, 1000)}
          alt={article.coverImage?.alt || article.title}
          fill
        />
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors" />
      </div>
      <div className="space-y-3">
        {primarySubject && (
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block">
            {primarySubject.name}
          </span>
        )}
        <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">
          {article.title}
        </h3>
        {article.dek && (
          <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3">
            {article.dek}
          </p>
        )}
      </div>
    </Link>
  );
}
