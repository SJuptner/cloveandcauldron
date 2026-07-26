'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity/sanity.config';

// Visiting /studio in the browser opens the full Sanity copy desk —
// the visual editor for articles, photo drop-ins, subjects, videos, and products.
// Content authored here lives in Sanity's database, not in this git repo.
export default function StudioPage() {
  return <NextStudio config={config} />;
}
