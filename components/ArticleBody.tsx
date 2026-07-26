import { PortableText, PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';
import { resolveImageSrc } from '@/lib/sanity.image';

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

function getComponents(dropCapKey: string | undefined): PortableTextComponents {
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
            {children}
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
                src={resolveImageSrc(value, 1400)}
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
                  src={resolveImageSrc(image, 700)}
                  alt={image.alt || ''}
                  fill
                  className="object-cover grayscale hover:scale-105 transition-transform duration-700"
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
      footnote: ({ children }) => (
        <span className="border-b border-dotted border-on-surface-variant cursor-help" title="Source note">
          {children}
        </span>
      ),
    },
  };
}

export default function ArticleBody({ value }: { value: any[] }) {
  const firstNormalKey = value?.find((b) => b._type === 'block' && (!b.style || b.style === 'normal'))?._key;
  const processed = withImagePairs(value || []);

  return <PortableText value={processed} components={getComponents(firstNormalKey)} />;
}
