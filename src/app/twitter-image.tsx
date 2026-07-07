import { OG_ALT, OG_SIZE, buildOgImage } from "@/lib/ogImage";

// Twitter(X)カード用画像（/twitter-image で配信）。OG画像と共通デザイン。

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = OG_ALT;

export default async function Image() {
  return buildOgImage();
}
