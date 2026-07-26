import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Meta & Tags' },
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
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
              {
                name: 'footnote',
                type: 'object',
                title: 'Footnote / Source',
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
            { name: 'alt', title: 'Alt text', type: 'string' },
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
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', subtitle: 'dek' },
  },
});
