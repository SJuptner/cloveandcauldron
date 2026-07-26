import { PortableText, PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity.image';

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-headline-md text-headline-md text-primary mt-12 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-headline-sm text-headline-sm text-primary mt-8 mb-3">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-secondary pl-6 italic text-on-surface my-8">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-6">
        {children}
      </p>
    ),
  },
  types: {
    image: ({ value }) => {
      const layout = value.layout || 'inline';
      return (
        <figure className={`my-10 ${layout === 'wide' ? '-mx-8 md:-mx-16' : ''}`}>
          <div className="relative aspect-[3/2] ink-border overflow-hidden">
            <Image
              src={urlFor(value).width(1400).url()}
              alt={value.alt || ''}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="font-label-sm text-label-sm text-on-surface-variant text-center mt-3 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    symbolCallout: ({ value }) => (
      <div className="ink-border bg-surface-container p-8 my-10 text-center">
        <div className="text-5xl mb-3 text-on-surface-variant">{value.glyph}</div>
        <div className="font-label-lg text-label-lg text-secondary uppercase tracking-widest mb-2">
          {value.label}
        </div>
        {value.note && (
          <p className="font-body-md text-body-md text-on-surface-variant italic">{value.note}</p>
        )}
      </div>
    ),
    videoEmbed: ({ value }) => (
      <div className="my-10">
        <div className="ink-border bg-surface-container aspect-video flex items-center justify-center">
          <a
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-on-primary px-8 py-3 uppercase tracking-widest font-label-lg text-label-lg ink-border cta-shadow transition-all"
          >
            Watch video ↗
          </a>
        </div>
        {value.caption && (
          <figcaption className="font-label-sm text-label-sm text-on-surface-variant text-center mt-3 italic">
            {value.caption}
          </figcaption>
        )}
      </div>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        className="text-secondary underline decoration-secondary/30 underline-offset-4"
      >
        {children}
      </a>
    ),
    footnote: ({ children }) => (
      <span className="border-b border-dotted border-on-surface-variant cursor-help" title="Source note">
        {children}
      </span>
    ),
  },
};

export default function ArticleBody({ value }: { value: any[] }) {
  return <PortableText value={value} components={components} />;
}
