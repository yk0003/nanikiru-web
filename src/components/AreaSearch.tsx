"use client";

import { useState } from "react";
import { CITIES } from "@/lib/mock";

// エリア選択（検索 + 人気候補 + 投稿なしエリア・未登録エリアも選べる）。
// 正確な位置情報は扱わない。エリア単位のみ。

export interface AreaSelection {
  citySlug: string;
  areaSlug: string;
  displayName: string;
}

interface AreaOption extends AreaSelection {
  name: string;
  cityName: string;
  country: string;
  postCount: number;
}

const ALL_AREAS: AreaOption[] = CITIES.flatMap((city) =>
  city.areas.map((area) => ({
    citySlug: city.slug,
    areaSlug: area.slug,
    displayName: area.displayName,
    name: area.name,
    cityName: city.name,
    country: city.country,
    postCount: area.postCount,
  }))
);

// 投稿画面に出す人気エリア候補
const POPULAR_SLUGS: [string, string][] = [
  ["tokyo", "shibuya"],
  ["tokyo", "shinjuku"],
  ["tokyo", "ginza"],
  ["tokyo", "omotesando"],
  ["tokyo", "nakameguro"],
  ["osaka", "umeda"],
  ["kyoto", "kawaramachi"],
  ["seoul", "hongdae"],
  ["taipei", "ximending"],
  ["paris", "marais"],
];

const POPULAR_AREAS = POPULAR_SLUGS.map(([c, a]) =>
  ALL_AREAS.find((x) => x.citySlug === c && x.areaSlug === a)
).filter((x): x is AreaOption => Boolean(x));

export function AreaSearch({
  value,
  onChange,
}: {
  value: AreaSelection;
  onChange: (area: AreaSelection) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const q = query.trim().toLowerCase();
  const results =
    q === ""
      ? POPULAR_AREAS
      : ALL_AREAS.filter(
          (a) =>
            a.displayName.toLowerCase().includes(q) ||
            a.name.toLowerCase().includes(q) ||
            a.cityName.toLowerCase().includes(q) ||
            a.country.toLowerCase().includes(q) ||
            a.areaSlug.includes(q) ||
            a.citySlug.includes(q)
        );

  const select = (area: AreaSelection) => {
    onChange(area);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      {/* 選択中の場所 */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl bg-cloud p-3 text-sm"
      >
        <span className="font-semibold">📍 {value.displayName}</span>
        <span className="text-xs font-semibold text-skydeep">変更 {open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="space-y-3 rounded-xl border border-cloud p-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="都市・エリアを検索"
            className="w-full rounded-xl bg-cloud p-3 text-sm"
            autoFocus
          />

          {q === "" && <p className="text-xs font-semibold text-sub">人気エリア</p>}

          <div className="max-h-56 space-y-1 overflow-y-auto">
            {results.map((area) => (
              <button
                key={`${area.citySlug}-${area.areaSlug}`}
                type="button"
                onClick={() => select(area)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-cloud"
              >
                <span className="font-semibold">{area.displayName}</span>
                <span className="text-xs text-sub">
                  {area.postCount > 0 ? `今日 ${area.postCount}件` : "まだ投稿なし"}
                </span>
              </button>
            ))}

            {/* 一致なし: 入力した場所でそのまま投稿できる */}
            {q !== "" && results.length === 0 && (
              <button
                type="button"
                onClick={() =>
                  select({ citySlug: "custom", areaSlug: "custom", displayName: query.trim() })
                }
                className="w-full rounded-lg bg-sky/10 px-3 py-2.5 text-left text-sm font-semibold text-skydeep"
              >
                ＋ 「{query.trim()}」で投稿する（まだ投稿はありません）
              </button>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-sub">
        正確な位置は公開されません。自宅や職場の近くで投稿するときは、広めのエリアを選ぶのがおすすめです。
      </p>
    </div>
  );
}
