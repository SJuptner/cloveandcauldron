const WORDS_PER_MINUTE = 200;

// Rough estimate from a portable-text body: counts words in text spans only.
export function estimateReadingMinutes(body: any[] | undefined): number {
  if (!body?.length) return 1;

  const wordCount = body.reduce((count, block) => {
    if (block?._type !== 'block' || !Array.isArray(block.children)) return count;
    const text = block.children.map((child: any) => child.text || '').join(' ');
    return count + text.split(/\s+/).filter(Boolean).length;
  }, 0);

  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
