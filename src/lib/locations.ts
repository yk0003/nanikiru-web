// 都市・エリアの代表点座標（天気取得用）。
// NANIKIRUは位置共有アプリではなく「服装の気候マップ」なので、
// 正確な住所ではなくエリアの代表点でよい。

export interface Coords {
  latitude: number;
  longitude: number;
}

export const CITY_COORDS: Record<string, Coords> = {
  tokyo: { latitude: 35.6895, longitude: 139.6917 },
  osaka: { latitude: 34.6937, longitude: 135.5023 },
  kyoto: { latitude: 35.0116, longitude: 135.7681 },
  seoul: { latitude: 37.5665, longitude: 126.978 },
  taipei: { latitude: 25.033, longitude: 121.5654 },
  paris: { latitude: 48.8566, longitude: 2.3522 },
  honolulu: { latitude: 21.3069, longitude: -157.8583 },
};

// key: "citySlug/areaSlug"
export const AREA_COORDS: Record<string, Coords> = {
  "tokyo/shibuya": { latitude: 35.6595, longitude: 139.7005 },
  "tokyo/shinjuku": { latitude: 35.6896, longitude: 139.7006 },
  "tokyo/ginza": { latitude: 35.6717, longitude: 139.765 },
  "tokyo/omotesando": { latitude: 35.6652, longitude: 139.7126 },
  "tokyo/harajuku": { latitude: 35.6702, longitude: 139.7026 },
  "tokyo/ebisu": { latitude: 35.6467, longitude: 139.7101 },
  "tokyo/daikanyama": { latitude: 35.6485, longitude: 139.7031 },
  "tokyo/nakameguro": { latitude: 35.644, longitude: 139.6982 },
  "tokyo/asakusa": { latitude: 35.7118, longitude: 139.7967 },
  "tokyo/tokyo-station": { latitude: 35.6812, longitude: 139.7671 },
  "tokyo/ikebukuro": { latitude: 35.7295, longitude: 139.7109 },
  "tokyo/roppongi": { latitude: 35.6627, longitude: 139.7314 },
  "tokyo/ueno": { latitude: 35.7141, longitude: 139.7774 },
  "osaka/umeda": { latitude: 34.7055, longitude: 135.4983 },
  "osaka/shinsaibashi": { latitude: 34.672, longitude: 135.5008 },
  "osaka/namba": { latitude: 34.6659, longitude: 135.5013 },
  "kyoto/kawaramachi": { latitude: 35.0045, longitude: 135.7681 },
  "kyoto/gion": { latitude: 35.0037, longitude: 135.7752 },
  "kyoto/arashiyama": { latitude: 35.0094, longitude: 135.6668 },
  "seoul/hongdae": { latitude: 37.5563, longitude: 126.9236 },
  "seoul/myeongdong": { latitude: 37.5636, longitude: 126.9838 },
  "seoul/gangnam": { latitude: 37.4979, longitude: 127.0276 },
  "taipei/ximending": { latitude: 25.0421, longitude: 121.5081 },
  "taipei/xinyi": { latitude: 25.033, longitude: 121.5654 },
  "paris/marais": { latitude: 48.8566, longitude: 2.3622 },
  "paris/saint-germain": { latitude: 48.854, longitude: 2.333 },
  "honolulu/waikiki": { latitude: 21.2793, longitude: -157.8293 },
};

/** エリアの座標（未登録なら都市代表点にfallback） */
export function getCoords(citySlug: string, areaSlug?: string): Coords | undefined {
  if (areaSlug) {
    const areaCoords = AREA_COORDS[`${citySlug}/${areaSlug}`];
    if (areaCoords) return areaCoords;
  }
  return CITY_COORDS[citySlug];
}
