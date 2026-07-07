// Open-Meteo Forecast APIによる現在天気の取得。
// API呼び出しはこのファイルに一元化する（将来の商用プラン移行・別API切替に備える）。
// 返り値は既存の Weather 型と互換にして、WeatherSummary等の既存UIをそのまま使えるようにする。
// 失敗時はモック天気にfallbackし、ページは落とさない。

import { CITIES, areaWeather, getCity } from "./mock";
import { getCoords } from "./locations";
import type { Weather, WeatherKind } from "./types";

export type WeatherSource = "open-meteo" | "mock";

export interface WeatherResult extends Weather {
  source: WeatherSource;
}

/** 30分キャッシュ（ISR）。天気は毎回リアルタイムでなくてよい */
const REVALIDATE_SECONDS = 1800;

/** WMO weather code → NANIKIRUの4分類 */
function kindFromWmoCode(code: number): WeatherKind {
  if (code === 0 || code === 1) return "sunny";
  if (code === 2 || code === 3 || code === 45 || code === 48) return "cloudy";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 51) return "rain"; // 霧雨・雨・にわか雨・雷雨
  return "cloudy";
}

/** 座標を指定して現在天気を取得。失敗時はfallbackを返す */
export async function fetchWeather(
  latitude: number,
  longitude: number,
  fallback: Weather
): Promise<WeatherResult> {
  try {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current:
        "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m",
      wind_speed_unit: "ms",
      timezone: "auto",
    });
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`open-meteo status ${res.status}`);

    const data = await res.json();
    const current = data?.current;
    if (
      typeof current?.temperature_2m !== "number" ||
      typeof current?.apparent_temperature !== "number"
    ) {
      throw new Error("open-meteo: unexpected response shape");
    }

    return {
      tempC: Math.round(current.temperature_2m),
      feelsLikeC: Math.round(current.apparent_temperature),
      kind: kindFromWmoCode(Number(current.weather_code)),
      windMps: Math.round(current.wind_speed_10m ?? 0),
      humidity: Math.round(current.relative_humidity_2m ?? 0),
      source: "open-meteo",
    };
  } catch {
    // ネットワーク・API障害時はモックにfallback（画面は落とさない）
    return { ...fallback, source: "mock" };
  }
}

/** 都市の現在天気 */
export async function getWeatherForCity(citySlug: string): Promise<WeatherResult> {
  const fallback = getCity(citySlug)?.weather ?? areaWeather(citySlug);
  const coords = getCoords(citySlug);
  if (!coords) return { ...fallback, source: "mock" };
  return fetchWeather(coords.latitude, coords.longitude, fallback);
}

/** エリアの現在天気（エリア座標がなければ都市代表点） */
export async function getWeatherForArea(
  citySlug: string,
  areaSlug: string
): Promise<WeatherResult> {
  const fallback = getCity(citySlug)?.weather ?? areaWeather(citySlug);
  const coords = getCoords(citySlug, areaSlug);
  if (!coords) return { ...fallback, source: "mock" };
  return fetchWeather(coords.latitude, coords.longitude, fallback);
}

/** 全都市の現在天気（地図ページ・トップのヒーロー地図用） */
export async function getCityWeatherMap(): Promise<Record<string, WeatherResult>> {
  const entries = await Promise.all(
    CITIES.map(async (city) => [city.slug, await getWeatherForCity(city.slug)] as const)
  );
  return Object.fromEntries(entries);
}

/** 出典表記の文言（fallback時はOpen-Meteoを名乗らない） */
export function weatherAttribution(source: WeatherSource): string {
  return source === "open-meteo" ? "天気データ: Open-Meteo" : "天気情報は参考表示です";
}
