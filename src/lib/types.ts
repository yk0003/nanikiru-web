// NANIKIRU ドメイン型（iOS版 Models.swift と対応）

export type FeelTag = "cold" | "slightlyCold" | "comfortable" | "slightlyHot" | "hot";

export const FEEL_TAGS: Record<FeelTag, { label: string; fg: string; bg: string }> = {
  cold: { label: "寒い", fg: "#3E6E9E", bg: "#E1EDF8" },
  slightlyCold: { label: "少し寒い", fg: "#4E93B8", bg: "#E6F3F9" },
  comfortable: { label: "ちょうどいい", fg: "#35845F", bg: "#E4F4EC" },
  slightlyHot: { label: "少し暑い", fg: "#A9741B", bg: "#FBF0DA" },
  hot: { label: "暑い", fg: "#B05A25", bg: "#FAE7DA" },
};

export type WeatherKind = "sunny" | "cloudy" | "rain" | "snow";

export const WEATHER_KINDS: Record<WeatherKind, { label: string; emoji: string }> = {
  sunny: { label: "晴れ", emoji: "☀️" },
  cloudy: { label: "くもり", emoji: "☁️" },
  rain: { label: "雨", emoji: "🌧" },
  snow: { label: "雪", emoji: "🌨" },
};

export type TimeOfDay = "morning" | "daytime" | "night";

export const TIME_OF_DAY: Record<TimeOfDay, string> = {
  morning: "朝",
  daytime: "昼",
  night: "夜",
};

export interface Weather {
  tempC: number;
  feelsLikeC: number;
  kind: WeatherKind;
  windMps: number;
  humidity: number;
}

export interface ItemLink {
  id: string;
  title: string;
  category: string;
  label: string; // 着用 / 似ている / おすすめ
  url: string;
  isAffiliate: boolean;
  clickCount: number;
}

export interface Post {
  id: string;
  userName: string;
  userIsCreator: boolean;
  citySlug: string;
  cityName: string;
  areaSlug: string;
  areaName: string;
  time: string;
  timeOfDay: TimeOfDay;
  weather: Weather;
  feelTag: FeelTag;
  outfitTags: string[];
  comment: string;
  itemLinks: ItemLink[];
}

export interface Area {
  slug: string;
  citySlug: string;
  name: string; // 渋谷
  displayName: string; // 東京・渋谷
  postCount: number;
  trend?: string; // 体感傾向（MVPは固定文）
}

export interface City {
  slug: string;
  name: string; // 東京
  country: string;
  postCount: number;
  weather: Weather;
  areas: Area[];
}

export interface Ad {
  id: string;
  advertiser: string;
  title: string;
  body: string;
  ctaLabel: string;
}
