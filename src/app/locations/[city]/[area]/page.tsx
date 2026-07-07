import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdBanner } from "@/components/AdCard";
import { LocationHero } from "@/components/LocationHero";
import { OutfitGrid } from "@/components/OutfitGrid";
import { RelatedLocations } from "@/components/RelatedLocations";
import { SeoTextBlock } from "@/components/SeoTextBlock";
import { WeatherSummary } from "@/components/WeatherSummary";
import { ADS, CITIES, buildOutfitSummary, postsByArea } from "@/lib/mock";
import { getAreaRepo, getCityRepo } from "@/lib/repo/locations";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getWeatherForArea } from "@/lib/weather";

// エリアページ（SEO: 「渋谷 今日の服装」の着地ページ）
// 構成: ヒーロー → 今日の服装メモ → フィルター+投稿グリッド（0件なら空状態+近くのエリア）
//       → SEOテキスト → 関連エリア → 広告

type Props = { params: Promise<{ city: string; area: string }> };

export function generateStaticParams() {
  return CITIES.flatMap((city) =>
    city.areas.map((area) => ({ city: city.slug, area: area.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, area: areaSlug } = await params;
  const city = await getCityRepo(citySlug); // DB優先・mockフォールバック
  const area = await getAreaRepo(citySlug, areaSlug);
  if (!city || !area) return {};

  const weather = await getWeatherForArea(citySlug, areaSlug);
  const title = `${area.name}の今日の服装`;
  const description = `${area.name}の今日の気温・天気・現地のリアルな服装投稿をチェック。現在${Math.round(weather.tempC)}℃・体感${Math.round(weather.feelsLikeC)}℃。${area.trend ?? "半袖で寒くないか、夜に羽織りが必要か"}を体感メモで確認できます。`;
  const path = `/locations/${city.slug}/${area.slug}`;

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

export default async function AreaPage({ params }: Props) {
  const { city: citySlug, area: areaSlug } = await params;
  const city = await getCityRepo(citySlug); // DB優先・mockフォールバック
  const area = await getAreaRepo(citySlug, areaSlug);
  if (!city || !area) notFound();

  // Open-Meteoの現在天気（エリア代表点。失敗時はモック）。服装メモもこの実データから生成される
  const weather = await getWeatherForArea(citySlug, areaSlug);

  const posts = postsByArea(citySlug, areaSlug);
  const summary = buildOutfitSummary(area.name, weather, area.trend);
  const lead =
    posts.length > 0 && area.trend
      ? `現地の投稿では、${area.trend}です。${summary.nightNote}。`
      : `${area.name}の今日の投稿はまだありません。天気からのおすすめは「${summary.recommend}」です。最初の投稿者になりませんか？`;

  // 同じ都市で実際に投稿があるエリア（空状態の「近くのエリア候補」用）
  const nearbyAreas = city.areas
    .filter((a) => a.slug !== areaSlug && postsByArea(citySlug, a.slug).length > 0)
    .slice(0, 4);

  const jsonLd = breadcrumbJsonLd([
    { name: "NANIKIRU", path: "/" },
    { name: city.name, path: `/locations/${city.slug}` },
    { name: area.name, path: `/locations/${city.slug}/${area.slug}` },
  ]);

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <LocationHero
        title={`${area.name}の今日の服装`}
        weather={weather}
        lead={lead}
        composeHref={`/compose?city=${citySlug}&area=${areaSlug}`}
        source={weather.source}
      />

      <WeatherSummary summary={summary} />

      <section>
        <h2 className="mb-3 text-lg font-bold">{area.name}の今日のリアル服装</h2>

        {posts.length > 0 ? (
          <OutfitGrid posts={posts} />
        ) : (
          <div className="nk-card p-10 text-center">
            <p className="font-bold">{area.name}の今日の投稿はまだありません。</p>
            <p className="mt-2 text-sm leading-relaxed text-sub">
              このエリアで最初に投稿してみませんか？
              <br />
              あなたの服装が、誰かの「今日なに着る？」の参考になります。
            </p>
            <Link
              href={`/compose?city=${citySlug}&area=${areaSlug}`}
              className="mt-5 inline-block rounded-xl bg-sky px-6 py-2.5 text-sm font-bold text-white"
            >
              このエリアで投稿する
            </Link>

            {nearbyAreas.length > 0 && (
              <div className="mt-8 border-t border-cloud pt-5 text-left">
                <p className="mb-2 text-sm font-semibold text-ink">近くの投稿があるエリア</p>
                <div className="flex flex-wrap gap-2">
                  {nearbyAreas.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/locations/${citySlug}/${a.slug}`}
                      className="nk-chip bg-cloud font-semibold text-sub hover:text-ink"
                    >
                      {a.name} <span className="text-xs">{a.postCount}件</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <SeoTextBlock placeName={area.name} />

      <RelatedLocations
        title="関連エリア"
        citySlug={citySlug}
        areas={city.areas}
        currentAreaSlug={areaSlug}
        cityName={city.name}
      />

      <AdBanner ad={ADS[0]} />
    </div>
  );
}
