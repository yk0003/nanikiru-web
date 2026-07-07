import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdBanner } from "@/components/AdCard";
import { LocationHero } from "@/components/LocationHero";
import { OutfitGrid } from "@/components/OutfitGrid";
import { RelatedLocations } from "@/components/RelatedLocations";
import { SeoTextBlock } from "@/components/SeoTextBlock";
import { WeatherSummary } from "@/components/WeatherSummary";
import { ADS, CITIES, buildOutfitSummary } from "@/lib/mock";
import { getCityRepo } from "@/lib/repo/locations";
import { postsByCityRepo } from "@/lib/repo/posts";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getWeatherForCity } from "@/lib/weather";

// 都市ページ（SEO: 「東京 今日の服装」の着地ページ）
// 構成: ヒーロー → 今日の服装メモ → フィルター+投稿グリッド → SEOテキスト → 関連エリア → 広告

type Props = { params: Promise<{ city: string }> };

export function generateStaticParams() {
  return CITIES.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = await getCityRepo(citySlug); // DB優先・mockフォールバック
  if (!city) return {};

  const weather = await getWeatherForCity(city.slug);
  const title = `${city.name}の今日の服装`;
  const description = `${city.name}の今日の気温・天気・現地のリアルな服装投稿をチェック。現在${Math.round(weather.tempC)}℃・体感${Math.round(weather.feelsLikeC)}℃。半袖で寒くないか、夜に羽織りが必要かを体感メモで確認できます。`;
  const path = `/locations/${city.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName: "NANIKIRU",
      url: path,
      title: `${title}｜NANIKIRU`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title}｜NANIKIRU`,
      description,
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { city: citySlug } = await params;
  const city = await getCityRepo(citySlug); // DB優先・mockフォールバック
  if (!city) notFound();

  // Open-Meteoの現在天気（失敗時はモック）。服装メモもこの実データから生成される
  const weather = await getWeatherForCity(city.slug);

  const posts = await postsByCityRepo(city.slug); // DB優先・mockフォールバック
  const topTrend = city.areas.find((a) => a.trend)?.trend;
  const summary = buildOutfitSummary(city.name, weather, topTrend);
  const lead = topTrend
    ? `現地の投稿では、${topTrend}です。${summary.nightNote}。`
    : summary.memo;

  const jsonLd = breadcrumbJsonLd([
    { name: "NANIKIRU", path: "/" },
    { name: city.name, path: `/locations/${city.slug}` },
  ]);

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <LocationHero
        title={`${city.name}の今日の服装`}
        weather={weather}
        lead={lead}
        composeHref={`/compose?city=${city.slug}`}
        composeLabel="この都市で投稿する"
        source={weather.source}
      />

      <WeatherSummary summary={summary} />

      <section>
        <h2 className="mb-3 text-lg font-bold">{city.name}の今日のリアル服装</h2>
        {posts.length > 0 ? (
          <OutfitGrid posts={posts} />
        ) : (
          <div className="nk-card p-10 text-center">
            <p className="font-bold">{city.name}の今日の投稿はまだありません。</p>
            <p className="mt-2 text-sm leading-relaxed text-sub">
              この都市で最初に投稿してみませんか？
              <br />
              あなたの服装が、誰かの「今日なに着る？」の参考になります。
            </p>
            <Link
              href={`/compose?city=${city.slug}`}
              className="mt-5 inline-block rounded-xl bg-sky px-6 py-2.5 text-sm font-bold text-white"
            >
              この都市で投稿する
            </Link>
          </div>
        )}
      </section>

      <SeoTextBlock placeName={city.name} />

      <RelatedLocations
        title={`${city.name}のエリアから探す`}
        citySlug={city.slug}
        areas={city.areas}
      />

      <AdBanner ad={ADS[0]} />
    </div>
  );
}
