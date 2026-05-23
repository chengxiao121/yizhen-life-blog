import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()).default([]),
    description: z.string(),
    draft: z.boolean().default(false),
    photos: z.array(z.string()).default([]),
  }),
});

const moments = defineCollection({
  type: 'content',
  schema: z.object({
    date: z.string(),
    photos: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { posts, moments };
