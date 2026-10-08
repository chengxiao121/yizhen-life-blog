import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z
      .union([z.string(), z.date()])
      .transform((v) => (typeof v === 'string' ? v : v.toISOString().slice(0, 10))),
    tags: z.array(z.string()).default([]),
    category: z.enum(["技术", "生活"]),
    description: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
