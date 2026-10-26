import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * 文章数据唯一入口（结构规则 §2）：
 * 过滤草稿 + 按日期从新到旧排序，全站统一走这里，禁止在页面里复制这段逻辑。
 */
export async function getPublishedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
}
