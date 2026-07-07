import { MapExplorer } from "@/components/MapExplorer";

export const metadata = {
  title: "世界のリアル服装マップ",
  description:
    "東京・大阪・京都・ソウル・台北・パリ…世界の都市とエリアで、今日みんなが実際に着ている服装を地図から探せます。",
};

// 世界のリアル服装マップ。
// NANIKIRUの地図は位置共有アプリではなく「服装の気候マップ」。
// MVPはCSS+モックデータの地図風パネル（フェーズ2でMapLibre GLに置き換え）。
export default function MapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">世界のリアル服装マップ</h1>
        <p className="mt-1 text-sm text-sub">
          旅行先や近くの街で、今日みんながどんな服を着ているかを地図から探せます。
        </p>
      </div>

      <MapExplorer />
    </div>
  );
}
