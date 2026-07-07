import Link from "next/link";
import { getCity } from "@/lib/mock";

// スマホ用の「地図で探す」導線カード。
// スマホでは地図パネルを大きく出さず、コンパクトなカードで /map へ誘導する。

const TEASER_CITY_SLUGS = ["tokyo", "seoul", "taipei", "paris"];

export function LocationCards() {
  const cities = TEASER_CITY_SLUGS.map((slug) => getCity(slug)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c)
  );

  return (
    <section className="nk-card space-y-3 p-5">
      <p className="font-bold">🌏 地図で探す</p>
      <p className="text-sm leading-relaxed text-sub">
        旅行先や近くの街で、今日みんなが何を着ているかを地図から探せます。
      </p>

      <div className="flex flex-wrap gap-2">
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={`/locations/${city.slug}`}
            className="nk-chip bg-cloud text-sm font-semibold hover:bg-sky/10"
          >
            {city.name}
            <span className="text-xs text-sub">{city.postCount}件</span>
          </Link>
        ))}
      </div>

      <Link
        href="/map"
        className="block rounded-xl bg-sky py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
      >
        世界のリアル服装マップを見る
      </Link>
    </section>
  );
}
