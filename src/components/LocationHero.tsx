import Link from "next/link";
import { FavoriteButton } from "@/components/FavoriteButton";
import { WEATHER_KINDS, type Weather } from "@/lib/types";

// 都市・エリアページの上部ヒーロー。
// SEOの主見出し（h1）+ 今日の気象 + リード文 + 主要アクション。

export function LocationHero({
  title,
  weather,
  lead,
  composeHref,
  composeLabel = "このエリアで投稿する",
}: {
  title: string;
  weather: Weather;
  lead: string;
  composeHref: string;
  composeLabel?: string;
}) {
  const kind = WEATHER_KINDS[weather.kind];

  return (
    <section className="nk-card p-6">
      <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>

      <p className="mt-2 text-lg font-bold text-skydeep">
        {Math.round(weather.tempC)}℃ / 体感{Math.round(weather.feelsLikeC)}℃ / {kind.emoji}{" "}
        {kind.label}
      </p>
      <p className="mt-1 text-xs text-sub">
        💨 風{Math.round(weather.windMps)}m/s ・ 💧 湿度{weather.humidity}%
      </p>

      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sub">{lead}</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={composeHref}
          className="rounded-full bg-sky px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
        >
          {composeLabel}
        </Link>
        <FavoriteButton />
        <Link
          href="/map"
          className="rounded-full bg-cloud px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-sky/10"
        >
          🌏 地図で見る
        </Link>
      </div>
    </section>
  );
}
