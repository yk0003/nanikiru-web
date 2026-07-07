"use client";

import Link from "next/link";
import { useState } from "react";
import { PostCard } from "@/components/PostCard";
import { CITIES, POSTS } from "@/lib/mock";
import { WEATHER_KINDS } from "@/lib/types";

// 保存 = 旅行前・外出前に見返す場所。投稿 / 場所 / フォロー / 旅行予定 の4カテゴリ。
// MVPはモック内容の表示のみ。フェーズ2でsaved_posts / favorite_areasテーブルに接続する。

const TABS = ["投稿", "場所", "フォロー", "旅行予定"] as const;
type Tab = (typeof TABS)[number];

export function SavedClient() {
  const [tab, setTab] = useState<Tab>("投稿");

  const savedPosts = POSTS.slice(0, 3); // モック
  const favoriteAreas = [
    { citySlug: "tokyo", areaSlug: "shibuya" },
    { citySlug: "kyoto", areaSlug: "kawaramachi" },
  ];
  const travelAreas = [
    { citySlug: "seoul", areaSlug: "myeongdong" },
    { citySlug: "seoul", areaSlug: "hongdae" },
  ];

  const areaCard = (citySlug: string, areaSlug: string, buttonLabel: string) => {
    const city = CITIES.find((c) => c.slug === citySlug);
    const area = city?.areas.find((a) => a.slug === areaSlug);
    if (!city || !area) return null;
    const kind = WEATHER_KINDS[city.weather.kind];
    return (
      <Link
        key={`${citySlug}-${areaSlug}`}
        href={`/locations/${citySlug}/${areaSlug}`}
        className="nk-card block p-5 hover:bg-cloud/40"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">📍 {area.displayName}</p>
            <p className="mt-1 text-xs text-sub">
              {area.postCount > 0 ? `今日 ${area.postCount}件の投稿` : "今日の投稿はまだありません"}
            </p>
          </div>
          <p className="text-xl font-bold">
            {kind.emoji} {Math.round(city.weather.tempC)}°
          </p>
        </div>
        <p className="mt-3 rounded-xl bg-sky/15 py-2 text-center text-sm font-semibold text-skydeep">
          {buttonLabel}
        </p>
      </Link>
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-xl font-bold">保存</h1>

      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`nk-chip font-semibold ${
              tab === t ? "bg-sky/15 text-skydeep ring-1 ring-sky" : "bg-cloud text-sub"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "投稿" && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {savedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {tab === "場所" && (
        <div className="space-y-3">
          {favoriteAreas.map((a) => areaCard(a.citySlug, a.areaSlug, "今日の服装を見る"))}
        </div>
      )}

      {tab === "フォロー" && (
        <div className="nk-card p-10 text-center text-sm text-sub">
          <p className="text-2xl">👥</p>
          <p className="mt-2 font-semibold text-ink">フォロー中の投稿者はいません</p>
          <p className="mt-1">
            参考になる投稿者をフォローすると、その人の毎日の服装をチェックできます。
          </p>
        </div>
      )}

      {tab === "旅行予定" && (
        <div className="space-y-3">
          {travelAreas.map((a) => areaCard(a.citySlug, a.areaSlug, "旅行前に服装を確認"))}
        </div>
      )}
    </div>
  );
}
