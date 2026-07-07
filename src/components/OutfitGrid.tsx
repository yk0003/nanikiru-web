"use client";

import { useState } from "react";
import { AdCard } from "@/components/AdCard";
import { PostCard } from "@/components/PostCard";
import { interleaveAds } from "@/lib/ads";
import { FEEL_TAGS, TIME_OF_DAY, type FeelTag, type Post, type TimeOfDay } from "@/lib/types";

// 投稿グリッド + 折り返しフィルター（都市・エリアページ共通）。
// PC 3列 / スマホ 2列。広告は数件ごとに1枚、「広告」ラベル付きで混ぜる。

const FILTERS = [
  "今日", "昨日", "直近7日", "朝", "昼", "夜",
  "寒い", "少し寒い", "ちょうどいい", "少し暑い", "暑い",
  "雨", "風強い",
] as const;

export function OutfitGrid({ posts }: { posts: Post[] }) {
  const [selected, setSelected] = useState<string>("今日");

  // MVPモック: 体感・時間帯・雨・風のみ実フィルター。日付系は全件表示。
  const feelEntry = (Object.entries(FEEL_TAGS) as [FeelTag, { label: string }][]).find(
    ([, v]) => v.label === selected
  );
  const timeEntry = (Object.entries(TIME_OF_DAY) as [TimeOfDay, string][]).find(
    ([, label]) => label === selected
  );

  const filtered = posts.filter((p) => {
    if (feelEntry) return p.feelTag === feelEntry[0];
    if (timeEntry) return p.timeOfDay === timeEntry[0];
    if (selected === "雨") return p.weather.kind === "rain";
    if (selected === "風強い") return p.weather.windMps >= 5;
    return true;
  });

  const items = interleaveAds(filtered, 5);

  return (
    <section className="space-y-4">
      {/* フィルター: 左寄せで折り返し。右側で見切れない */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setSelected(filter)}
            className={`nk-chip cursor-pointer font-semibold transition ${
              selected === filter
                ? "bg-sky/15 text-skydeep ring-1 ring-sky"
                : "bg-cloud text-sub hover:text-ink"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {items.map((item, index) =>
            item.kind === "post" ? (
              <PostCard key={`post-${item.post.id}`} post={item.post} />
            ) : (
              <AdCard key={`ad-${index}`} ad={item.ad} />
            )
          )}
        </div>
      ) : (
        <p className="nk-card p-8 text-center text-sm text-sub">この条件の投稿はまだありません</p>
      )}
    </section>
  );
}
