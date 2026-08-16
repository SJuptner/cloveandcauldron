import { defineField, defineType } from 'sanity';
import { AsteriskIcon, LinkIcon } from '@sanity/icons';

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Meta & Tags' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dek',
      title: 'Dek (short teaser / subtitle)',
      type: 'text',
      rows: 2,
      group: 'content',
      description: 'The italic teaser line shown on cards and article headers.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'content',
      description:
        'Used for article cards on the homepage and listing pages (portrait crop). Also used as the article page banner if no separate Hero Image is set below.',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt text', type: 'string' },
        { name: 'caption', title: 'Caption', type: 'string' },
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image (optional)',
      type: 'image',
      group: 'content',
      description:
        'Optional wide-format photo for the banner at the top of the article page. Leave empty to reuse the Cover Image there. Set this when one photo does not crop well both as a portrait card AND a wide banner.',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt text', type: 'string' },
        { name: 'caption', title: 'Caption', type: 'string' },
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Pull Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Numbered', value: 'number' },
            { title: 'Bulleted', value: 'bullet' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                icon: LinkIcon,
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
              {
                name: 'footnote',
                type: 'object',
                title: 'Footnote / Source',
                icon: AsteriskIcon,
                fields: [{ name: 'text', type: 'string', title: 'Note text' }],
              },
            ],
          },
        },
        // Drop-in photo block — this is the "photo drop-in" the copy desk needs
        {
          type: 'image',
          title: 'Photo',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description:
                'Describes the image for screen readers and search engines. Left blank, this image silently renders with no alt text on the live site.',
              validation: (Rule) =>
                Rule.warning(
                  'Add alt text so screen readers and search engines can describe this image — leaving it blank makes the photo invisible to both.'
                ),
            },
            { name: 'caption', title: 'Caption', type: 'string' },
            {
              name: 'layout',
              title: 'Layout width',
              type: 'string',
              options: {
                list: [
                  { title: 'Inline (text width)', value: 'inline' },
                  { title: 'Wide (bleed)', value: 'wide' },
                  { title: 'Full bleed', value: 'full' },
                ],
              },
              initialValue: 'inline',
            },
          ],
        },
        // Symbol callout block — for showing a specific symbol/glyph with a label
        {
          type: 'object',
          name: 'symbolCallout',
          title: 'Symbol Callout',
          fields: [
            { name: 'glyph', title: 'Glyph / character', type: 'string' },
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'note', title: 'Note', type: 'text', rows: 2 },
          ],
          preview: {
            select: { title: 'label', subtitle: 'glyph' },
          },
        },
        // Video embed block
        {
          type: 'object',
          name: 'videoEmbed',
          title: 'Video Embed',
          fields: [
            { name: 'url', title: 'YouTube/TikTok URL', type: 'url' },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'subjects',
      title: 'Subjects (tags)',
      type: 'array',
      group: 'meta',
      of: [{ type: 'reference', to: [{ type: 'subject' }] }],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'featured',
      title: 'Featured on homepage',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
    }),
    defineField({
      name: 'relatedVideo',
      title: 'Related video',
      type: 'reference',
      to: [{ type: 'video' }],
      group: 'meta',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta title (optional override)',
      type: 'string',
      group: 'seo',
      description: 'Overrides the page <title> and og:title. Leave empty to use the article Title.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description (optional override)',
      type: 'text',
      rows: 3,
      group: 'seo',
      description:
        'Overrides the meta description and og:description. Aim for ~155 characters so it doesn’t get truncated in search results. Leave empty to use the Dek, or an excerpt of the body if there’s no Dek.',
      validation: (Rule) => Rule.max(160).warning('Longer than ~160 characters may get truncated in search results.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image (optional override)',
      type: 'image',
      group: 'seo',
      description:
        'Used for social/link previews (og:image). Leave empty to use the Cover Image.',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', subtitle: 'dek' },
  },
});
