import { OG_ALT, OG_SIZE, buildOgImage } from "@/lib/ogImage";

// サイト共通のOG画像（/opengraph-image で配信され、全ページのog:imageに自動適用される）。
// エリア名入りの動的OG画像にしたい場合は、app/locations/[city]/[area]/opengraph-image.tsx を
// 追加して buildOgImage をパラメータ化すればよい設計にしてある。

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = OG_ALT;

export default async function Image() {
  return buildOgImage();
}
