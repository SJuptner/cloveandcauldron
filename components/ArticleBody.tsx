import { Children, Fragment, ReactNode } from 'react';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';
import { resolveImageSrc } from '@/lib/sanity.image';

const URL_REGEX = /(https?:\/\/[^\s]+)/g;
// Trailing characters that usually belong to the surrounding sentence, not the URL
// itself (e.g. "...see https://example.com." or "(https://example.com)").
const TRAILING_PUNCTUATION_REGEX = /[),.;:!?\]]+$/;

// Auto-links bare "https://..." text so citations work even when the Studio
// author didn't manually add a link mark to that span (easy to miss, and
// inconsistent results are confusing -- see the article citation lists).
// Only plain-string children are touched; children already rendered as
// elements (existing link marks, bold/italic, footnotes) pass through as-is.
function linkifyChildren(children: ReactNode): ReactNode {
  return Children.map(children, (child, i) => {
    if (typeof child !== 'string') return child;

    // A single capturing group means split() deterministically alternates
    // plain text (even indices) and matched URLs (odd indices) -- no need
    // to re-test each part against the (stateful, global) regex.
    const parts = child.split(URL_REGEX);
    if (parts.length === 1) return child;

    return (
      <Fragment key={i}>
        {parts.map((part, j) => {
          if (j % 2 === 0) return part || null;
          const trailingMatch = part.match(TRAILING_PUNCTUATION_REGEX);
          const trailing = trailingMatch ? trailingMatch[0] : '';
          const url = trailing ? part.slice(0, -trailing.length) : part;
          return (
            <Fragment key={j}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary underline decoration-secondary/30 underline-offset-4"
              >
                {url}
              </a>
              {trailing}
            </Fragment>
          );
        })}
      </Fragment>
    );
  });
}

// Groups consecutive standalone "photo" blocks into a paired 2-col grid,
// matching the editorial layout in the design mockups.
function withImagePairs(blocks: any[]) {
  const result: any[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const next = blocks[i + 1];
    if (block?._type === 'image' && next?._type === 'image' && (block.layout || 'inline') === 'inline') {
      result.push({ _type: 'imagePair', _key: `${block._key}-pair`, images: [block, next] });
      i++;
    } else {
      result.push(block);
    }
  }
  return result;
}

// Portable Text mark components only receive the markDef for their own
// span, not the article as a whole, so footnote numbering has to be
// precomputed by walking every block's markDefs in document order.
function buildFootnoteIndex(blocks: any[]): Map<string, number> {
  const index = new Map<string, number>();
  let n = 0;
  for (const block of blocks || []) {
    if (block._type !== 'block' || !block.markDefs) continue;
    for (const def of block.markDefs) {
      if (def._type === 'footnote') index.set(def._key, ++n);
    }
  }
  return index;
}

function getComponents(
  dropCapKey: string | undefined,
  footnoteIndex: Map<string, number>
): PortableTextComponents {
  return {
    block: {
      h2: ({ children }) => (
        <>
          <div className="ink-divider" />
          <h2 className="font-headline-md text-headline-md text-primary mb-4">{children}</h2>
        </>
      ),
      h3: ({ children }) => (
        <h3 className="font-headline-sm text-headline-sm text-primary mt-8 mb-3">{children}</h3>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-16 px-8 py-10 border-y border-outline/20 relative text-center">
          <span className="material-symbols-outlined absolute -top-4 left-1/2 -translate-x-1/2 bg-background px-4 text-secondary scale-150">
            auto_awesome
          </span>
          <p className="font-headline-md text-headline-md italic text-primary leading-snug">
            {linkifyChildren(children)}
          </p>
        </blockquote>
      ),
      normal: ({ children, value }) => (
        <p
          className={
            value._key === dropCapKey
              ? 'font-body-lg text-body-lg leading-relaxed mb-6 drop-cap'
              : 'font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-6'
          }
        >
          {linkifyChildren(children)}
        </p>
      ),
    },
    list: {
      number: ({ children }) => (
        <ol className="list-decimal list-outside pl-6 space-y-2 font-body-lg text-body-lg text-on-surface-variant mb-6">
          {children}
        </ol>
      ),
      bullet: ({ children }) => (
        <ul className="list-disc list-outside pl-6 space-y-2 font-body-lg text-body-lg text-on-surface-variant mb-6">
          {children}
        </ul>
      ),
    },
    listItem: {
      number: ({ children }) => <li className="pl-1">{linkifyChildren(children)}</li>,
      bullet: ({ children }) => <li className="pl-1">{linkifyChildren(children)}</li>,
    },
    types: {
      image: ({ value }) => {
        const layout = value.layout || 'inline';
        return (
          <figure className={`my-10 ${layout === 'wide' ? '-mx-8 md:-mx-16' : ''}`}>
            <div className="relative aspect-[3/2] ink-border overflow-hidden">
              <Image
                src={resolveImageSrc(value, 1400, 933)}
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
      imagePair: ({ value }) => (
        <div className="grid grid-cols-2 gap-gutter my-12">
          {value.images.map((image: any) => (
            <div key={image._key} className="aspect-square bg-surface-container-high ink-border overflow-hidden">
              <div className="relative w-full h-full">
                <Image
                  src={resolveImageSrc(image, 700, 700)}
                  alt={image.alt || ''}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          ))}
        </div>
      ),
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
      footnote: ({ value, children }) => {
        const number = footnoteIndex.get(value?._key);
        return (
          <span
            className="border-b border-dotted border-on-surface-variant cursor-help"
            title={value?.text || 'Source note'}
          >
            {children}
            {number && (
              <sup className="ml-0.5 text-secondary font-label-sm text-label-sm">[{number}]</sup>
            )}
          </span>
        );
      },
    },
  };
}

export default function ArticleBody({ value }: { value: any[] }) {
  const firstNormalKey = value?.find((b) => b._type === 'block' && (!b.style || b.style === 'normal'))?._key;
  const footnoteIndex = buildFootnoteIndex(value);
  const processed = withImagePairs(value || []);

  return <PortableText value={processed} components={getComponents(firstNormalKey, footnoteIndex)} />;
}
