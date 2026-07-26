import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Shop Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Product image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'price',
      title: 'Price (display string, e.g. €28)',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description: 'e.g. Ceramics, Journals, Apparel, Apothecary — used for the shop filter pills.',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'externalUrl',
      title: 'Link to external shop listing',
      type: 'url',
    }),
    defineField({
      name: 'available',
      title: 'Currently available',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'price', media: 'image' },
  },
});
