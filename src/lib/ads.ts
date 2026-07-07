// 広告差し込みロジック。
// AdSense導入時は AdCard コンポーネントとこの層だけ差し替える。

import { ADS } from "./mock";
import type { Ad, Post } from "./types";

export type FeedItem = { kind: "post"; post: Post } | { kind: "ad"; ad: Ad };

/** 投稿リストにN件ごとに広告を1枚ずつ混ぜる */
export function interleaveAds(posts: Post[], every = 4, showsAds = true): FeedItem[] {
  if (!showsAds || ADS.length === 0) {
    return posts.map((post) => ({ kind: "post", post }));
  }
  const items: FeedItem[] = [];
  let adIndex = 0;
  posts.forEach((post, i) => {
    items.push({ kind: "post", post });
    if ((i + 1) % every === 0) {
      items.push({ kind: "ad", ad: ADS[adIndex % ADS.length] });
      adIndex += 1;
    }
  });
  return items;
}
