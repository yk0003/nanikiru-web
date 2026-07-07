"use client";

import { CITIES, type FlatArea } from "@/lib/mock";
import { WEATHER_KINDS } from "@/lib/types";

// 地図風パネル（本物の地図APIはフェーズ2でMapLibre等に置き換え）。
// 都市ピン → タップでその都市のエリアピンに切り替わる2段階構成。
// 位置はざっくりの相対配置。正確な座標・住所は扱わない。

export const CITY_POS: Record<string, { x: number; y: number }> = {
  paris: { x: 12, y: 28 },
  seoul: { x: 56, y: 34 },
  tokyo: { x: 80, y: 42 },
  kyoto: { x: 69, y: 52 },
  osaka: { x: 63, y: 60 },
  taipei: { x: 56, y: 70 },
  honolulu: { x: 82, y: 74 },
};

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
