// locationsリポジトリ層。
// DB（Supabase locationsテーブル）から都市・エリアを読み、既存UIと同じ City / Area 型で返す。
// env未設定・取得エラー・0件のいずれの場合も lib/mock.ts にfallbackするので、ページは落ちない。
// 注意:
//  - trend（体感傾向）はまだDBに無いのでmockから補完（フェーズ5以降で投稿集計に置換予定）
//  - City.weather は表示fallback用にmockを入れる（実表示はOpen-Meteoが上書き）

import { getSupabaseAnonClient } from "@/lib/supabase/anon";
import { CITIES, getArea as getMockArea, getCity as getMockCity } from "@/lib/mock";
import type { Area, City } from "@/lib/types";

interface LocationRow {
  city_slug: string;
  city_name: string;
  area_slug: string | null;
  area_name: string | null;
  display_name: string;
  country: string;
  post_count: number;
  sort_order: number;
}

async function fetchAllLocations(): Promise<LocationRow[] | null> {
  try {
    const supabase = getSupabaseAnonClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("locations")
      .select("city_slug, city_name, area_slug, area_name, display_name, country, post_count, sort_order")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return null;
    return data as LocationRow[];
  } catch {
    return null;
  }
}

function buildCities(rows: LocationRow[]): City[] {
  const cityRows = rows.filter((r) => r.area_slug === null);

  return cityRows.map((cityRow) => {
    const mockCity = getMockCity(cityRow.city_slug);

    const areas: Area[] = rows
      .filter((r) => r.city_slug === cityRow.city_slug && r.area_slug !== null)
      .map((r) => ({
        slug: r.area_slug!,
        citySlug: r.city_slug,
        name: r.area_name ?? r.display_name,
        displayName: r.display_name,
        postCount: r.post_count,
        // 体感傾向は当面mockから補完（DB未収載）
        trend: getMockArea(r.city_slug, r.area_slug!)?.trend,
      }));

    return {
      slug: cityRow.city_slug,
      name: cityRow.city_name,
      country: cityRow.country,
      postCount: cityRow.post_count,
      // 表示fallback用（実際の表示はOpen-Meteoの実データが優先される）
      weather: mockCity?.weather ?? CITIES[0].weather,
      areas,
    };
  });
}

/** 全都市（DB優先・mockフォールバック） */
export async function getCitiesRepo(): Promise<City[]> {
  const rows = await fetchAllLocations();
  if (!rows) return CITIES;
  const cities = buildCities(rows);
  return cities.length > 0 ? cities : CITIES;
}

/** 都市1件 */
export async function getCityRepo(citySlug: string): Promise<City | undefined> {
  const cities = await getCitiesRepo();
  return cities.find((c) => c.slug === citySlug);
}

/** エリア1件 */
export async function getAreaRepo(citySlug: string, areaSlug: string): Promise<Area | undefined> {
  const city = await getCityRepo(citySlug);
  return city?.areas.find((a) => a.slug === areaSlug);
}

/** ヘルスチェック用: locationsの行数（DB未接続ならnull） */
export async function countLocations(): Promise<number | null> {
  try {
    const supabase = getSupabaseAnonClient();
    if (!supabase) return null;
    const { count, error } = await supabase
      .from("locations")
      .select("*", { count: "exact", head: true });
    if (error) return null;
    return count ?? 0;
  } catch {
    return null;
  }
}
