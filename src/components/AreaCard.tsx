import Link from "next/link";
import { PhotoPlaceholder } from "@/components/PostCard";
import { postsByArea, type FlatArea } from "@/lib/mock";
import { WEATHER_KINDS, type Weather } from "@/lib/types";

// エリアプレビューカード（地図でピンを選んだ時に表示）。
// 投稿ありなら「今日の服装を見る」、投稿ゼロなら「このエリアで投稿する」導線を出す。

export function AreaCard({ area, weather }: { area: FlatArea; weather: Weather }) {
  const kind = WEATHER_KINDS[weather.kind];
  const posts = postsByArea(area.citySlug, area.areaSlug);
  const hasPosts = area.postCount > 0;

  return (
    <div className="nk-card space-y-3 p-5">
      <div>
        <p className="text-lg font-bold">{area.displayName}</p>
        <p className="mt-1 text-sm text-sub">
          {Math.round(weather.tempC)}℃ / 体感{Math.round(weather.feelsLikeC)}℃ ・ {kind.emoji}{" "}
          {kind.label}
        </p>
      </div>

      <p className="text-sm font-semibold">
        {hasPosts ? `今日の投稿 ${area.postCount}件` : "今日の投稿はまだありません"}
      </p>

      {hasPosts && area.trend && (
        <span className="nk-chip bg-sky/10 text-xs font-semibold text-skydeep">👕 {area.trend}</span>
      )}

      {hasPosts ? (
        <>
          {posts.length > 0 && (
            <div className="flex gap-2">
              {posts.slice(0, 3).map((post) => (
                <div key={post.id} className="w-16">
                  <PhotoPlaceholder post={post} />
                </div>
              ))}
            </div>
          )}
          <Link
            href={`/locations/${area.citySlug}/${area.areaSlug}`}
            className="block rounded-xl bg-sky py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
          >
            今日の服装を見る
          </Link>
        </>
      ) : (
        <>
          <p className="text-xs leading-relaxed text-sub">
            このエリアで最初に投稿してみませんか？
            <br />
            あなたの投稿が、誰かの「今日なに着る？」の参考になります。
          </p>
          <Link
            href={`/compose?city=${area.citySlug}&area=${area.areaSlug}`}
            className="block rounded-xl bg-sky py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
          >
            このエリアで投稿する
          </Link>
          <Link
            href={`/locations/${area.citySlug}/${area.areaSlug}`}
            className="block text-center text-xs font-semibold text-skydeep"
          >
            エリアページを見る
          </Link>
        </>
      )}
    </div>
  );
}
