// @/lib/sanity.ts
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'yu413ogt', // REPLACE WITH YOUR SANITY PROJECT ID
  dataset: 'production', // REPLACE WITH YOUR SANITY DATASET
  apiVersion: '2024-01-01',
  useCdn: true,
});
