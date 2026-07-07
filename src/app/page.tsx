import Link from "next/link";
import { HeroMapPreview } from "@/components/HeroMapPreview";
import { LocationCards } from "@/components/LocationCards";
import { PostGrid } from "@/components/PostGrid";
import { WeatherHero } from "@/components/WeatherHero";
import { CITIES, POSTS } from "@/lib/mock";
import { getCityWeatherMap, getWeatherForArea } from "@/lib/weather";

// トップ = 「今日の天気 + 現地の服装フィード」が主役。
// PC: ヒーローに地図風プレビューを置き、「天候・場所・服装のアプリ」だと一目で伝える。
// スマホ: 地図は大きく出さず、フィードの後に小さな「地図で探す」導線カードを置く。
// 天気はOpen-Meteoの現在値（30分キャッシュ）。取得失敗時はモックにfallback。
export default async function HomePage() {
  const [shibuyaWeather, cityWeathers] = await Promise.all([
    getWeatherForArea("tokyo", "shibuya"),
    getCityWeatherMap(),
  ]);

  return (
    <div className="space-y-8">
      {/* ヒーロー: PCは2カラム（左=コピー+天気、右=地図風プレビュー）、スマホは左カラムのみ */}
      <section className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <WeatherHero weather={shibuyaWeather} source={shibuyaWeather.source} />
        <div className="hidden lg:block">
          <HeroMapPreview weatherByCity={cityWeathers} />
        </div>
      </section>

      {/* 都市チップ（SEOページへの内部リンク） */}
      <section>
        <h2 className="mb-3 text-lg font-bold">今日の服装を場所から探す</h2>
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

      {/* 今日のリアル服装フィード */}
      <section id="feed">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">今日のリアル服装</h2>
          <Link href="/locations/tokyo" className="text-sm text-skydeep">
            もっと見る
          </Link>
        </div>
        <PostGrid posts={POSTS.filter((p) => p.citySlug === "tokyo")} />
      </section>

      {/* スマホ用の地図導線カード（PCはヒーローに地図があるため非表示） */}
      <div className="lg:hidden">
        <LocationCards />
      </div>

      {/* サービス説明（SEO用テキスト） */}
      <section className="nk-card space-y-3 p-6 text-sm leading-relaxed text-sub">
        <h2 className="text-base font-bold text-ink">NANIKIRUとは</h2>
        <p>
          NANIKIRU（ナニキル）は「服装の天気予報」です。天気アプリでは気温はわかっても、実際にみんなが何を着ているか、その服で寒いのか暑いのかはわかりません。
        </p>
        <p>
          NANIKIRUでは、その場所にいる人たちが今日の服装を写真と体感メモで投稿し、旅行前や外出前の「今日なに着る？」の参考にできます。正確な位置情報は表示されず、服装はエリア単位で共有されます。
        </p>
      </section>
    </div>
  );
}
