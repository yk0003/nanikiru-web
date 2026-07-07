import { WEATHER_KINDS, type Weather } from "@/lib/types";

// 投稿画面用のコンパクトな天気カード。
// 投稿時の天気は自動取得される想定（MVPでは選択エリアのモック天気を表示）。
export function WeatherMiniCard({ weather }: { weather: Weather }) {
  const kind = WEATHER_KINDS[weather.kind];
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-cloud p-3 text-sm">
        <span className="font-semibold">
          {kind.emoji} {Math.round(weather.tempC)}℃ / 体感{Math.round(weather.feelsLikeC)}℃
        </span>
        <span className="text-xs text-sub">
          {kind.label} ・ 風{Math.round(weather.windMps)}m/s ・ 湿度{weather.humidity}%
        </span>
      </div>
      <p className="mt-2 text-xs text-sub">投稿時の天気・気温・風は自動で記録されます。</p>
    </div>
  );
}
