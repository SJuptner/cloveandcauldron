import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';
import { structure } from './structure/structure';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your_project_id';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  name: 'clove-and-cauldron-studio',
  title: 'Clove & Cauldron — Copy Desk',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
});
