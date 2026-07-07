import Link from "next/link";
import { WeatherHeader } from "@/components/WeatherHeader";
import { TODAY_LABEL, getCity } from "@/lib/mock";

// トップのヒーロー左カラム: キャッチコピー + 天気カード + 主要導線。
// トップの主役は「今日の天気 + 現地の服装フィード」。地図はその補助。
export function WeatherHero() {
  const tokyo = getCity("tokyo")!;

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

      <WeatherHeader placeLabel="東京・渋谷" dateLabel={TODAY_LABEL} weather={tokyo.weather} />

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
