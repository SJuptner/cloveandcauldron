import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'subject',
  title: 'Subject',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g. Bektashism, Tamga, Irkbitig, Kıyafetnâme, Göktürk Script',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 64 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta title (optional override)',
      type: 'string',
      description: 'Overrides the page <title> for this subject’s archive page. Leave empty to use the Name.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description (optional override)',
      type: 'text',
      rows: 3,
      description:
        'Overrides the meta description for this subject’s archive page. Aim for ~155 characters. Leave empty to use the Short description.',
      validation: (Rule) => Rule.max(160).warning('Longer than ~160 characters may get truncated in search results.'),
    }),
  ],
});
