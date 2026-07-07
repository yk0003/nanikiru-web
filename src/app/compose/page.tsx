import { PostComposer } from "@/components/PostComposer";
import { getArea, getCity } from "@/lib/mock";

export const metadata = { title: "今日の服装を投稿" };

// 投稿作成ページ。
// クエリ（?city=tokyo&area=shibuya）はサーバー側で解決してpropsで渡す。
// ※ useSearchParamsを使うとページ全体がクライアントレンダリングにバイルアウトし
//   SSR HTMLが空になるため、この形にしている。

type Props = { searchParams: Promise<{ city?: string; area?: string }> };

export default async function ComposePage({ searchParams }: Props) {
  const { city, area } = await searchParams;

  const resolvedArea =
    city && area && getArea(city, area)
      ? { citySlug: city, areaSlug: area, displayName: getArea(city, area)!.displayName }
      : { citySlug: "tokyo", areaSlug: "shibuya", displayName: "東京・渋谷" };

  // cityだけ指定された場合（都市ページの「最初に投稿する」導線）
  const resolved =
    !area && city && getCity(city)
      ? {
          citySlug: city,
          areaSlug: getCity(city)!.areas[0].slug,
          displayName: getCity(city)!.areas[0].displayName,
        }
      : resolvedArea;

  return <PostComposer initialArea={resolved} />;
}
