// Flattens a Sanity portable-text body (plus our custom block types) into
// plain text, so client components can full-text search article content
// without shipping a separate search index.
export function portableTextToPlainText(blocks: any[] | undefined): string {
  if (!blocks?.length) return '';

  return blocks
    .map((block) => {
      if (block._type === 'block' && Array.isArray(block.children)) {
        return block.children.map((child: any) => child.text || '').join(' ');
      }
      if (block._type === 'symbolCallout') {
        return [block.label, block.note].filter(Boolean).join(' ');
      }
      if (block._type === 'videoEmbed') {
        return block.caption || '';
      }
      if (block._type === 'image') {
        return [block.alt, block.caption].filter(Boolean).join(' ');
      }
      return '';
    })
    .join(' ');
}
