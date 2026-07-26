import type { StructureResolver } from 'sanity/structure';

// This defines the layout of the "copy desk" — the left-hand navigation
// inside the Sanity Studio editing interface.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Clove & Cauldron — Copy Desk')
    .items([
      S.listItem()
        .title('Site Settings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings')
        ),
      S.divider(),
      S.listItem()
        .title('Articles')
        .schemaType('article')
        .child(S.documentTypeList('article').title('Articles')),
      S.listItem()
        .title('Subjects (tags)')
        .schemaType('subject')
        .child(S.documentTypeList('subject').title('Subjects')),
      S.listItem()
        .title('Videos')
        .schemaType('video')
        .child(S.documentTypeList('video').title('Videos')),
      S.listItem()
        .title('Shop Products')
        .schemaType('product')
        .child(S.documentTypeList('product').title('Shop Products')),
    ]);
