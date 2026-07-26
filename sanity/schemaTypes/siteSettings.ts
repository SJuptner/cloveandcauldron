import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroEyebrow',
      title: 'Hero eyebrow text',
      type: 'string',
      initialValue: 'Anatolia · Central Asia · Bektashism',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero title',
      type: 'string',
      initialValue: 'Ancient Echoes, Modern Paths.',
    }),
    defineField({
      name: 'heroBody',
      title: 'Hero body text',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'aboutText',
      title: 'About / mission statement',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube channel URL',
      type: 'url',
    }),
    defineField({
      name: 'tiktokUrl',
      title: 'TikTok profile URL',
      type: 'url',
    }),
    defineField({
      name: 'shopUrl',
      title: 'External shop URL (if using a full external storefront)',
      type: 'url',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' };
    },
  },
});
