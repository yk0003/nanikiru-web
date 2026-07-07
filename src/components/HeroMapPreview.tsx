"use client";

import Link from "next/link";
import { useState } from "react";
import { CITY_POS, MapBackdrop } from "@/components/MapPreview";
import { CITIES } from "@/lib/mock";
import { WEATHER_KINDS, type Weather } from "@/lib/types";

// トップページ（PC）用の地図風プレビュー。
// 都市ピンをタップすると、その都市の代表エリアのミニプレビューが出る。
// フル機能の地図は /map（MapExplorer）に委ねる、あくまで「入口」のパネル。

export function HeroMapPreview({
  weatherByCity,
}: {
  /** サーバー側でOpen-Meteoから取得した都市別天気（なければモック） */
  weatherByCity?: Record<string, Weather>;
}) {
  const [citySlug, setCitySlug] = useState("tokyo");

  const city = CITIES.find((c) => c.slug === citySlug) ?? CITIES[0];
  const topArea = city.areas[0]; // 各都市の先頭 = 投稿数が最多のエリア
  const weather = weatherByCity?.[city.slug] ?? city.weather;
  const kind = WEATHER_KINDS[weather.kind];

  return (
    <div
      className="relative h-full min-h-[380px] overflow-hidden rounded-3xl border border-cloud shadow-sm"
      style={{
        background:
          "linear-gradient(135deg, rgba(120,183,208,0.16), rgba(250,248,243,0.9) 45%, rgba(140,207,193,0.18))",
      }}
    >
      {/* 地図風の背景シェイプ */}
      <MapBackdrop variant="world" />

      {/* ドット模様（旅行マップの雰囲気） */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(120,183,208,0.22) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
        aria-hidden
      />

      <p className="absolute left-4 top-4 z-10 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-sub backdrop-blur">
        🌏 世界のリアル服装マップ
      </p>

      {/* 都市ピン */}
      {CITIES.map((c) => {
        const pos = CITY_POS[c.slug] ?? { x: 50, y: 50 };
        const selected = c.slug === citySlug;
        return (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCitySlug(c.slug)}
            className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold shadow-md transition hover:scale-105 ${
              selected ? "bg-sky text-white ring-2 ring-white" : "bg-white"
            }`}
            style={{ left: `${pos.x}%`, top: `${pos.y - 8}%` }}
          >
            {c.name}
            <span
              className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                selected ? "bg-white/25 text-white" : "bg-sky text-white"
              }`}
            >
              {c.postCount}
            </span>
          </button>
        );
      })}

      {/* 選択中都市の代表エリア ミニプレビュー */}
      <div className="absolute inset-x-4 bottom-4 z-10 rounded-2xl bg-white/95 p-4 shadow-md backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">📍 {topArea.displayName}</p>
            <p className="mt-0.5 text-xs text-sub">
              {Math.round(weather.tempC)}℃ / 体感{Math.round(weather.feelsLikeC)}℃ ・{" "}
              {kind.emoji} {kind.label}
            </p>
            {topArea.trend && (
              <p className="mt-1 truncate text-xs font-semibold text-skydeep">👕 {topArea.trend}</p>
            )}
          </div>
          <Link
            href={`/locations/${city.slug}/${topArea.slug}`}
            className="shrink-0 rounded-full bg-sky px-4 py-2 text-xs font-bold text-white transition hover:opacity-90"
          >
            今日の服装を見る
          </Link>
        </div>
      </div>
    </div>
  );
}
