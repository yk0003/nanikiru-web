import { WEATHER_KINDS, type Weather } from "@/lib/types";

/** 天気ヘッダーカード（iOS版 WeatherHeaderView と対応） */
export function WeatherHeader({
  placeLabel,
  dateLabel,
  weather,
}: {
  placeLabel: string;
  dateLabel: string;
  weather: Weather;
}) {
  const kind = WEATHER_KINDS[weather.kind];
  return (
    <div className="nk-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">📍 {placeLabel}</p>
        <p className="text-xs text-sub">{dateLabel}</p>
      </div>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-5xl font-bold">
          {Math.round(weather.tempC)}°
          <span className="ml-2 align-middle text-base font-normal text-sub">
            体感 {Math.round(weather.feelsLikeC)}°
          </span>
        </p>
        <span className="text-4xl" aria-label={kind.label}>
          {kind.emoji}
        </span>
      </div>
      <div className="mt-3 flex gap-6 text-xs text-sub">
        <span>
          {kind.emoji} {kind.label}
        </span>
        <span>💨 風 {Math.round(weather.windMps)}m/s</span>
        <span>💧 湿度 {weather.humidity}%</span>
      </div>
    </div>
  );
}

/** コンパクトな環境チップ行（投稿詳細用） */
export function EnvChips({ weather }: { weather: Weather }) {
  const kind = WEATHER_KINDS[weather.kind];
  const chip = "nk-chip bg-cloud text-sub text-xs";
  return (
    <div className="flex flex-wrap gap-2">
      <span className={chip}>{Math.round(weather.tempC)}℃</span>
      <span className={chip}>体感 {Math.round(weather.feelsLikeC)}℃</span>
      <span className={chip}>
        {kind.emoji} {kind.label}
      </span>
      <span className={chip}>風 {Math.round(weather.windMps)}m/s</span>
    </div>
  );
}
