// Temporary local preview content -- renders through the exact same
// components as real Sanity data. lib/sanity.queries.ts falls back to this
// only when the live dataset has nothing yet, so it disappears automatically
// once real articles/subjects are published in the Studio. Safe to delete
// this file (and the fallback branches that reference it) at any time.

const LOREM_SHORT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const LOREM_LONG =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';

const LOREM_MED =
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus, at velit tristique et sit amet velit.';

function placeholderImage(alt: string, layout?: 'inline' | 'wide' | 'full') {
  return { src: '/placeholders/image.svg', alt, layout };
}

function block(style: 'normal' | 'h2' | 'h3' | 'blockquote', key: string, text: string, marks: any[] = []) {
  return {
    _type: 'block',
    _key: key,
    style,
    markDefs: marks,
    children: [{ _type: 'span', _key: `${key}-s`, text, marks: [] }],
  };
}

export const demoSubjects = [
  { name: 'Mythology', slug: { current: 'mythology' }, description: 'Gods, spirits, and origin stories.', articleCount: 2 },
  { name: 'Anatolian Heritage', slug: { current: 'anatolian-heritage' }, description: 'Living traditions of Anatolia.', articleCount: 2 },
  { name: 'Cosmology', slug: { current: 'cosmology' }, description: 'How the ancients mapped the world.', articleCount: 1 },
  { name: 'Shamanic Wisdom', slug: { current: 'shamanic-wisdom' }, description: 'Steppe ritual and belief.', articleCount: 1 },
];

const subj = (slug: string) => demoSubjects.find((s) => s.slug.current === slug)!;

export const demoArticles = [
  {
    _id: 'demo-1',
    title: 'The Weaver of Fate: Umay Ana',
    slug: { current: 'the-weaver-of-fate-umay-ana' },
    dek: 'The silver-haired guardian of the cradle, Umay represents the divine feminine in the Tengrist pantheon.',
    coverImage: placeholderImage('Woodblock illustration of Umay Ana'),
    publishedAt: '2026-01-05T00:00:00.000Z',
    subjects: [subj('mythology'), subj('anatolian-heritage')],
    relatedVideo: null,
    body: [
      block('normal', 'a1', LOREM_LONG),
      block('normal', 'a2', LOREM_MED),
      block('blockquote', 'a3', `"${LOREM_SHORT}" — Oral Traditions of the Altai`),
      block('h2', 'a4', 'The Three Golden Braids'),
      block('normal', 'a5', LOREM_LONG),
      { _type: 'image', _key: 'a6', ...placeholderImage('Placeholder detail one', 'inline') },
      { _type: 'image', _key: 'a7', ...placeholderImage('Placeholder detail two', 'inline') },
      block('h2', 'a8', 'Protector of the Hearth'),
      block('normal', 'a9', LOREM_MED),
      {
        _type: 'symbolCallout',
        _key: 'a10',
        glyph: '✦',
        label: 'The Swan of Life',
        note: LOREM_SHORT,
      },
      {
        _type: 'symbolCallout',
        _key: 'a11',
        glyph: '☽',
        label: 'The Indigo Cradle',
        note: LOREM_SHORT,
      },
      block('normal', 'a12', LOREM_MED),
    ],
  },
  {
    _id: 'demo-2',
    title: 'Echoes of Göbeklitepe',
    slug: { current: 'echoes-of-gobeklitepe' },
    dek: 'Before history was written, it was carved. We return to the zero point of time.',
    coverImage: placeholderImage('Woodblock illustration of Göbeklitepe'),
    publishedAt: '2025-11-18T00:00:00.000Z',
    subjects: [subj('cosmology'), subj('anatolian-heritage')],
    relatedVideo: null,
    body: [
      block('normal', 'b1', LOREM_LONG),
      block('h2', 'b2', 'The Zero Point of Time'),
      block('normal', 'b3', LOREM_MED),
      { _type: 'image', _key: 'b4', ...placeholderImage('Wide placeholder image of the site', 'wide') },
      block('h3', 'b5', 'Reading the Pillars'),
      block('normal', 'b6', LOREM_SHORT),
      {
        _type: 'videoEmbed',
        _key: 'b7',
        url: 'https://example.com/demo-video',
        caption: 'Companion field notes (placeholder link)',
      },
      block('normal', 'b8', LOREM_MED),
    ],
  },
  {
    _id: 'demo-3',
    title: 'Shadows of the Taurus',
    slug: { current: 'shadows-of-the-taurus' },
    dek: 'Hidden in the limestone peaks, the spirits of the mountains guard the ancient boundaries.',
    coverImage: placeholderImage('Woodblock illustration of the Taurus mountains'),
    publishedAt: '2025-09-02T00:00:00.000Z',
    subjects: [subj('shamanic-wisdom'), subj('mythology')],
    relatedVideo: null,
    body: [
      block('normal', 'c1', LOREM_SHORT),
      block('blockquote', 'c2', `"${LOREM_MED}" — Field notes, Taurus foothills`),
      block('normal', 'c3', LOREM_LONG),
      block('h2', 'c4', 'The Boundary Spirits'),
      block('normal', 'c5', LOREM_MED),
      { _type: 'image', _key: 'c6', ...placeholderImage('Placeholder mountain detail', 'inline') },
      block('normal', 'c7', LOREM_SHORT),
    ],
  },
];
