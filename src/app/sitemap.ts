import type { MetadataRoute } from "next";
import { CITIES, POSTS } from "@/lib/mock";
import { SITE_URL } from "@/lib/seo";

// sitemap.xml（/sitemap.xml で配信される）
// 全都市・全エリア・投稿詳細をmockデータから自動生成する。
// フェーズ2でSupabase接続後は、DBのareas/postsから同じ形で生成する。

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();

  const add = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  ) => {
    const url = `${SITE_URL}${path}`;
    if (seen.has(url)) return; // slug重複などでURLがかぶっても1回だけ載せる
    seen.add(url);
    entries.push({ url, lastModified: now, changeFrequency, priority });
  };

  // 固定ページ
  add("/", 1.0, "daily");
  add("/map", 0.6, "daily");
  add("/compose", 0.6, "monthly");
  add("/creator", 0.6, "monthly");
  add("/saved", 0.6, "monthly");

  // 都市・エリアページ（SEOの主戦場。今日の服装なので更新頻度はdaily）
  for (const city of CITIES) {
    add(`/locations/${city.slug}`, 0.9, "daily");
    for (const area of city.areas) {
      add(`/locations/${city.slug}/${area.slug}`, 0.85, "daily");
    }
  }

  // 投稿詳細
  for (const post of POSTS) {
    add(`/posts/${post.id}`, 0.7, "weekly");
  }

  return entries;
}
