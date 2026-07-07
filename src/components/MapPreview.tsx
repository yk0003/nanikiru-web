"use client";

import { CITIES, type FlatArea } from "@/lib/mock";
import { WEATHER_KINDS } from "@/lib/types";

// 地図風パネル（本物の地図APIはフェーズ2でMapLibre等に置き換え）。
// 都市ピン → タップでその都市のエリアピンに切り替わる2段階構成。
// 位置はざっくりの相対配置。正確な座標・住所は扱わない。

// 都市ピンの相対位置（実際の地理関係にざっくり合わせる。正確な座標ではない）
export const CITY_POS: Record<string, { x: number; y: number }> = {
  paris: { x: 11, y: 24 },
  seoul: { x: 59, y: 36 },
  tokyo: { x: 79, y: 44 },
  kyoto: { x: 70, y: 49 },
  osaka: { x: 67, y: 56 },
  taipei: { x: 58, y: 68 },
  honolulu: { x: 84, y: 76 },
};

// 地図風の背景シェイプ（本物の地図APIは使わない）。
// 大陸・列島・島をうっすら描いて「服装の気候マップ」の雰囲気だけ出す。
// インラインSVGなので外部リクエストなし・軽量。
export function MapBackdrop({ variant }: { variant: "world" | "city" }) {
  const land = "rgba(140,207,193,0.22)";
  const landStrong = "rgba(140,207,193,0.28)";
  const coast = "rgba(120,183,208,0.30)";

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {variant === "world" ? (
        <>
          {/* ユーラシア大陸（パリ〜朝鮮半島のあたり） */}
          <path
            d="M -5 18 Q 12 8 28 14 Q 44 9 54 19 Q 64 23 61 32 Q 57 39 48 41 Q 36 51 22 45 Q 8 48 -5 40 Z"
            fill={land}
            stroke={coast}
            strokeWidth="0.4"
          />
          {/* 朝鮮半島 */}
          <path d="M 57 30 Q 61 32 59.5 38 Q 58 43 55 41 Q 55.5 34 57 30 Z" fill={landStrong} />
          {/* 日本列島の弧（大阪→京都→東京） */}
          <path
            d="M 64 60 Q 69 52 75 47 Q 81 41 85 34 Q 87.5 36 84 43 Q 79 50 72 56 Q 67 61 64 60 Z"
            fill={landStrong}
            stroke={coast}
            strokeWidth="0.4"
          />
          {/* 台湾 */}
          <ellipse cx="58" cy="70" rx="1.9" ry="3.1" fill={landStrong} />
          {/* ハワイ諸島 */}
          <circle cx="83" cy="78" r="1.1" fill={landStrong} />
          <circle cx="86.5" cy="75.5" r="0.8" fill={landStrong} />
          <circle cx="89" cy="73.5" r="0.5" fill={landStrong} />
        </>
      ) : (
        <>
          {/* 市街地っぽい大きな面 */}
          <path
            d="M 8 30 Q 25 12 50 16 Q 78 10 90 32 Q 98 55 84 74 Q 65 92 40 86 Q 14 82 8 60 Q 4 44 8 30 Z"
            fill="rgba(140,207,193,0.14)"
            stroke={coast}
            strokeWidth="0.4"
          />
          {/* 川 */}
          <path
            d="M -5 62 Q 22 52 48 60 Q 74 68 105 58"
            fill="none"
            stroke="rgba(120,183,208,0.30)"
            strokeWidth="1.6"
          />
          {/* 大通りっぽい線 */}
          <path
            d="M 30 -5 Q 44 40 36 105"
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.1"
          />
          <path
            d="M -5 34 Q 45 30 105 40"
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="0.9"
          />
        </>
      )}
    </svg>
  );
}

const AREA_POS: Record<string, Record<string, { x: number; y: number }>> = {
  tokyo: {
    ikebukuro: { x: 42, y: 14 },
    ueno: { x: 66, y: 20 },
    asakusa: { x: 80, y: 28 },
    shinjuku: { x: 32, y: 36 },
    "tokyo-station": { x: 64, y: 44 },
    ginza: { x: 70, y: 56 },
    harajuku: { x: 42, y: 48 },
    omotesando: { x: 50, y: 56 },
    shibuya: { x: 34, y: 62 },
    roppongi: { x: 56, y: 66 },
    ebisu: { x: 40, y: 74 },
    daikanyama: { x: 30, y: 80 },
    nakameguro: { x: 20, y: 70 },
  },
  osaka: {
    umeda: { x: 50, y: 26 },
    shinsaibashi: { x: 54, y: 52 },
    namba: { x: 48, y: 68 },
  },
  kyoto: {
    arashiyama: { x: 20, y: 40 },
    kawaramachi: { x: 58, y: 46 },
    gion: { x: 70, y: 52 },
  },
  seoul: {
    hongdae: { x: 26, y: 42 },
    myeongdong: { x: 50, y: 46 },
    gangnam: { x: 64, y: 66 },
  },
  taipei: {
    ximending: { x: 40, y: 50 },
    xinyi: { x: 62, y: 56 },
  },
  paris: {
    marais: { x: 58, y: 44 },
    "saint-germain": { x: 42, y: 58 },
  },
  honolulu: {
    waikiki: { x: 50, y: 55 },
  },
};

function areaPos(citySlug: string, areaSlug: string, index: number) {
  return (
    AREA_POS[citySlug]?.[areaSlug] ?? {
      x: 15 + ((index * 53) % 70),
      y: 15 + ((index * 37) % 62),
    }
  );
}

export function MapPreview({
  selectedCitySlug,
  previewArea,
  onSelectCity,
  onSelectArea,
  onBackToWorld,
}: {
  selectedCitySlug: string | null;
  previewArea: FlatArea | null;
  onSelectCity: (citySlug: string) => void;
  onSelectArea: (citySlug: string, areaSlug: string) => void;
  onBackToWorld: () => void;
}) {
  const city = CITIES.find((c) => c.slug === selectedCitySlug);

  return (
    <div
      className="relative min-h-[420px] overflow-hidden rounded-3xl border border-cloud shadow-sm"
      style={{
        background:
          "linear-gradient(135deg, rgba(120,183,208,0.16), rgba(250,248,243,0.9) 45%, rgba(140,207,193,0.18))",
      }}
    >
      {/* 地図風の背景シェイプ */}
      <MapBackdrop variant={city ? "city" : "world"} />

      {/* ドット模様（旅行マップの雰囲気） */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(120,183,208,0.22) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
        aria-hidden
      />

      {/* パネル左上のラベル */}
      <p className="absolute left-4 top-4 z-10 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-sub backdrop-blur">
        {city ? `🗾 ${city.name}のエリア` : "🌏 世界のリアル服装マップ"}
      </p>

      {/* 世界に戻る */}
      {city && (
        <button
          type="button"
          onClick={onBackToWorld}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur hover:bg-white"
        >
          🌏 世界地図に戻る
        </button>
      )}

      {/* ピン */}
      {!city
        ? CITIES.map((c) => {
            const pos = CITY_POS[c.slug] ?? { x: 50, y: 50 };
            const kind = WEATHER_KINDS[c.weather.kind];
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => onSelectCity(c.slug)}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow-md transition hover:scale-105"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                {kind.emoji} {c.name}
                <span className="ml-1.5 rounded-full bg-sky px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {c.postCount}
                </span>
              </button>
            );
          })
        : city.areas.map((a, i) => {
            const pos = areaPos(city.slug, a.slug, i);
            const selected = previewArea?.areaSlug === a.slug;
            return (
              <button
                key={a.slug}
                type="button"
                onClick={() => onSelectArea(city.slug, a.slug)}
                className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold shadow-md transition hover:scale-105 ${
                  selected ? "bg-sky text-white ring-2 ring-white" : "bg-white"
                }`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                {a.name}
                <span
                  className={`ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                    selected ? "bg-white/25 text-white" : a.postCount > 0 ? "bg-sky text-white" : "bg-cloud text-sub"
                  }`}
                >
                  {a.postCount}
                </span>
              </button>
            );
          })}

      {/* パネル下のヒント */}
      <p className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/80 px-3 py-1 text-[11px] text-sub backdrop-blur">
        {city ? "エリアをタップすると今日の服装のプレビューが見られます" : "都市をタップするとエリア別に見られます"}
      </p>
    </div>
  );
}
