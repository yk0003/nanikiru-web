"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { flattenAreas, type FlatArea } from "@/lib/mock";

// 地図ページの検索バー。結果をタップするとエリアページへ遷移する。
// 正確な住所・現在地は扱わない（都市・エリア単位のみ）。

const SUGGESTION_REFS: [string, string][] = [
  ["tokyo", "shibuya"],
  ["tokyo", "nakameguro"],
  ["osaka", "umeda"],
  ["kyoto", "kawaramachi"],
  ["seoul", "hongdae"],
  ["taipei", "ximending"],
  ["paris", "marais"],
];

export function LocationSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const all = flattenAreas();
  const q = query.trim().toLowerCase();

  const results: FlatArea[] =
    q === ""
      ? SUGGESTION_REFS.map(([c, a]) =>
          all.find((x) => x.citySlug === c && x.areaSlug === a)
        ).filter((x): x is FlatArea => Boolean(x))
      : all.filter(
          (a) =>
            a.displayName.toLowerCase().includes(q) ||
            a.name.toLowerCase().includes(q) ||
            a.cityName.toLowerCase().includes(q) ||
            a.country.toLowerCase().includes(q) ||
            a.areaSlug.includes(q) ||
            a.citySlug.includes(q)
        );

  const showDropdown = focused && results.length > 0;

  return (
    <div className="relative max-w-xl">
      <div className="flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 shadow-sm">
        <span className="text-sub">🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="都市・エリアを検索"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {showDropdown && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl bg-surface p-2 shadow-lg">
          {q === "" && (
            <p className="px-3 py-1.5 text-xs font-semibold text-sub">人気の検索</p>
          )}
          {results.map((area) => (
            <button
              key={`${area.citySlug}-${area.areaSlug}`}
              type="button"
              onMouseDown={() => router.push(`/locations/${area.citySlug}/${area.areaSlug}`)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm hover:bg-cloud"
            >
              <span className="font-semibold">📍 {area.displayName}</span>
              <span className="text-xs text-sub">
                {area.postCount > 0 ? `今日 ${area.postCount}件` : "まだ投稿なし"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
