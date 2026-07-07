"use client";

import Link from "next/link";
import { useState } from "react";
import { AreaCard } from "@/components/AreaCard";
import { LocationSearch } from "@/components/LocationSearch";
import { MapPreview } from "@/components/MapPreview";
import { CITIES, TRAVEL_POPULAR_REFS, flattenAreas, type FlatArea } from "@/lib/mock";

// 地図ページの本体。都市→エリアの2段階選択と、エリアプレビューの状態を持つ。
// PC: 左に地図パネル / 右にプレビュー。スマホ: 縦積み。

const TOKYO_POPULAR = ["shibuya", "shinjuku", "ginza", "omotesando", "nakameguro", "asakusa"];

export function MapExplorer() {
  const [citySlug, setCitySlug] = useState<string | null>(null);
  const [preview, setPreview] = useState<FlatArea | null>(null);

  const all = flattenAreas();

  const selectCity = (slug: string) => {
    setCitySlug(slug);
    setPreview(null);
  };

  const selectArea = (cSlug: string, aSlug: string) => {
    const area = all.find((a) => a.citySlug === cSlug && a.areaSlug === aSlug);
    if (area) {
      setCitySlug(cSlug);
      setPreview(area);
    }
  };

  const previewWeather = preview
    ? (CITIES.find((c) => c.slug === preview.citySlug) ?? CITIES[0]).weather
    : null;

  const travelAreas = TRAVEL_POPULAR_REFS.map(([c, a]) =>
    all.find((x) => x.citySlug === c && x.areaSlug === a)
  ).filter((x): x is FlatArea => Boolean(x));

  return (
    <div className="space-y-8">
      <LocationSearch />

      {/* 地図パネル + プレビュー */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <MapPreview
          selectedCitySlug={citySlug}
          previewArea={preview}
          onSelectCity={selectCity}
          onSelectArea={selectArea}
          onBackToWorld={() => {
            setCitySlug(null);
            setPreview(null);
          }}
        />

        <div>
          {preview && previewWeather ? (
            <AreaCard area={preview} weather={previewWeather} />
          ) : (
            <div className="nk-card flex h-full min-h-[200px] flex-col items-center justify-center gap-2 p-6 text-center">
              <span className="text-3xl">🧭</span>
              <p className="text-sm font-semibold">
                {citySlug ? "エリアのピンを選んでみてください" : "都市を選んでみてください"}
              </p>
              <p className="text-xs leading-relaxed text-sub">
                エリアを選ぶと、今日の気温・服装傾向・
                <br />
                投稿のプレビューがここに表示されます。
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 人気都市 */}
      <section>
        <h2 className="mb-3 text-lg font-bold">人気都市</h2>
        <div className="flex flex-wrap gap-2">
          {CITIES.map((city) => (
            <Link
              key={city.slug}
              href={`/locations/${city.slug}`}
              className="nk-chip bg-surface font-semibold shadow-sm hover:bg-cloud"
            >
              {city.name}
              <span className="text-xs text-sub">{city.postCount}件</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 東京の人気エリア */}
      <section>
        <h2 className="mb-3 text-lg font-bold">東京の人気エリア</h2>
        <div className="flex flex-wrap gap-2">
          {TOKYO_POPULAR.map((slug) => {
            const area = all.find((a) => a.citySlug === "tokyo" && a.areaSlug === slug);
            if (!area) return null;
            return (
              <Link
                key={slug}
                href={`/locations/tokyo/${slug}`}
                className="nk-chip bg-surface font-semibold shadow-sm hover:bg-cloud"
              >
                {area.name}
                <span className="text-xs text-sub">
                  {area.postCount > 0 ? `${area.postCount}件` : "投稿なし"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 旅行先で人気 */}
      <section>
        <h2 className="mb-3 text-lg font-bold">旅行先で人気</h2>
        <div className="flex flex-wrap gap-2">
          {travelAreas.map((area) => (
            <Link
              key={`${area.citySlug}-${area.areaSlug}`}
              href={`/locations/${area.citySlug}/${area.areaSlug}`}
              className="nk-chip bg-surface font-semibold shadow-sm hover:bg-cloud"
            >
              ✈️ {area.displayName}
              <span className="text-xs text-sub">{area.postCount}件</span>
            </Link>
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-sub">
        正確な現在地や住所は表示されません。服装はエリア単位で共有されます。
        <br />
        実際の地図（MapLibre GL）はフェーズ2で導入予定です。
      </p>
    </div>
  );
}
