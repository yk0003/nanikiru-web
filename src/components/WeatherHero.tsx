import Link from "next/link";
import { WeatherHeader } from "@/components/WeatherHeader";
import { TODAY_LABEL, getCity } from "@/lib/mock";
import { weatherAttribution, type WeatherSource } from "@/lib/weather";
import type { Weather } from "@/lib/types";

// トップのヒーロー左カラム: キャッチコピー + 天気カード + 主要導線。
// 天気はサーバー側でOpen-Meteoから取得したものをpropsで受け取る（失敗時はモック）。
export function WeatherHero({
  weather,
  source = "mock",
}: {
  weather?: Weather;
  source?: WeatherSource;
}) {
  const displayWeather = weather ?? getCity("tokyo")!.weather;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold leading-snug sm:text-3xl">
          天気予報よりリアル。
          <br />
          現地の<span className="text-skydeep">今日の服装</span>を見る。
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-sub">
          気温だけでは「なに着るか」は決められない。NANIKIRUは、その場所にいる人たちのリアルな服装投稿と体感メモで、旅行前・外出前の服装選びを助けます。
        </p>
      </div>

      <div>
        <WeatherHeader placeLabel="東京・渋谷" dateLabel={TODAY_LABEL} weather={displayWeather} />
        <p className="mt-1.5 text-right text-[11px] text-sub/80">{weatherAttribution(source)}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href="#feed"
          className="rounded-full bg-sky px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
        >
          今日のリアル服装を見る
        </a>
        <Link
          href="/map"
          className="rounded-full bg-mint/20 px-5 py-2.5 text-sm font-bold text-skydeep transition hover:bg-mint/30"
        >
          🌏 地図で探す
        </Link>
      </div>
    </div>
  );
}
