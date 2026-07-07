// バックエンド接続前のモックデータ（iOS版 MockData.swift と対応）。
// フェーズ2でSupabaseリポジトリ層に置き換える。

import type { Ad, Area, City, Post, Weather } from "./types";

const tokyoWeather: Weather = { tempC: 29, feelsLikeC: 32, kind: "sunny", windMps: 3, humidity: 68 };
const seoulWeather: Weather = { tempC: 27, feelsLikeC: 29, kind: "cloudy", windMps: 5, humidity: 72 };
const parisWeather: Weather = { tempC: 22, feelsLikeC: 21, kind: "cloudy", windMps: 4, humidity: 55 };

function area(
  citySlug: string,
  slug: string,
  name: string,
  displayName: string,
  postCount: number,
  trend?: string
): Area {
  return { slug, citySlug, name, displayName, postCount, trend };
}

export const CITIES: City[] = [
  {
    slug: "tokyo",
    name: "東京",
    country: "日本",
    postCount: 128,
    weather: tokyoWeather,
    areas: [
      area("tokyo", "shibuya", "渋谷", "東京・渋谷", 24, "半袖・薄手シャツが多め"),
      area("tokyo", "shinjuku", "新宿", "東京・新宿", 18, "半袖が多め。夜は羽織りあり"),
      area("tokyo", "ikebukuro", "池袋", "東京・池袋", 13, "半袖・スニーカーが多め"),
      area("tokyo", "ginza", "銀座", "東京・銀座", 12, "ちょうどいい投稿が多め"),
      area("tokyo", "tokyo-station", "東京駅周辺", "東京駅周辺", 11, "シャツ1枚の通勤スタイルが多め"),
      area("tokyo", "omotesando", "表参道", "東京・表参道", 10, "日差し対策の帽子投稿が多い"),
      area("tokyo", "harajuku", "原宿", "東京・原宿", 9, "Tシャツ・ショートパンツが多め"),
      area("tokyo", "roppongi", "六本木", "東京・六本木", 9, "夜はワンピース＋羽織りが多い"),
      area("tokyo", "asakusa", "浅草", "東京・浅草", 8, "帽子・日傘の投稿が多い"),
      area("tokyo", "ebisu", "恵比寿", "東京・恵比寿", 7, "夜は薄手ジャケットが多い"),
      area("tokyo", "daikanyama", "代官山", "東京・代官山", 6, "半袖＋カーディガンが目立つ"),
      area("tokyo", "ueno", "上野", "東京・上野", 6, "帽子ありの投稿が多め"),
      area("tokyo", "nakameguro", "中目黒", "東京・中目黒", 0),
    ],
  },
  {
    slug: "osaka",
    name: "大阪",
    country: "日本",
    postCount: 42,
    weather: { ...tokyoWeather, tempC: 30, feelsLikeC: 33 },
    areas: [
      area("osaka", "umeda", "梅田", "大阪・梅田", 16, "半袖が多め。地下街は冷房強め"),
      area("osaka", "shinsaibashi", "心斎橋", "大阪・心斎橋", 14, "半袖・サンダルが多め"),
      area("osaka", "namba", "難波", "大阪・難波", 12, "半袖・帽子ありが多め"),
    ],
  },
  {
    slug: "kyoto",
    name: "京都",
    country: "日本",
    postCount: 31,
    weather: { ...tokyoWeather, tempC: 31, feelsLikeC: 34, windMps: 2 },
    areas: [
      area("kyoto", "kawaramachi", "河原町", "京都・河原町", 14, "日傘・帽子の投稿が多い"),
      area("kyoto", "gion", "祇園", "京都・祇園", 11, "歩きやすいスニーカーが多め"),
      area("kyoto", "arashiyama", "嵐山", "京都・嵐山", 10, "日なた対策の帽子が多め"),
    ],
  },
  {
    slug: "seoul",
    name: "ソウル",
    country: "韓国",
    postCount: 86,
    weather: seoulWeather,
    areas: [
      area("seoul", "myeongdong", "明洞", "ソウル・明洞", 42, "半袖＋薄手の羽織りが定番"),
      area("seoul", "hongdae", "弘大", "ソウル・弘大", 31, "夜は長袖投稿が増えています"),
      area("seoul", "gangnam", "江南", "ソウル・江南", 25, "半袖にスニーカーが多め"),
    ],
  },
  {
    slug: "taipei",
    name: "台北",
    country: "台湾",
    postCount: 38,
    weather: { tempC: 33, feelsLikeC: 37, kind: "sunny", windMps: 2, humidity: 75 },
    areas: [
      area("taipei", "ximending", "西門町", "台北・西門町", 19, "Tシャツ・ショートパンツが多め"),
      area("taipei", "xinyi", "信義", "台北・信義", 13),
    ],
  },
  {
    slug: "paris",
    name: "パリ",
    country: "フランス",
    postCount: 33,
    weather: parisWeather,
    areas: [
      area("paris", "marais", "マレ", "パリ・マレ", 12, "薄手ジャケットの投稿が多め"),
      area("paris", "saint-germain", "サンジェルマン", "パリ・サンジェルマン", 7),
    ],
  },
  {
    slug: "honolulu",
    name: "ホノルル",
    country: "アメリカ",
    postCount: 21,
    weather: { tempC: 30, feelsLikeC: 33, kind: "sunny", windMps: 5, humidity: 60 },
    areas: [
      area("honolulu", "waikiki", "ワイキキ", "ホノルル・ワイキキ", 21, "半袖・サンダルがほぼ全員"),
    ],
  },
];

// エリアをフラットに展開したビュー（地図・検索で使う）
export interface FlatArea {
  citySlug: string;
  areaSlug: string;
  name: string;
  displayName: string;
  cityName: string;
  country: string;
  postCount: number;
  trend?: string;
}

export function flattenAreas(): FlatArea[] {
  return CITIES.flatMap((city) =>
    city.areas.map((a) => ({
      citySlug: city.slug,
      areaSlug: a.slug,
      name: a.name,
      displayName: a.displayName,
      cityName: city.name,
      country: city.country,
      postCount: a.postCount,
      trend: a.trend,
    }))
  );
}

/** 旅行先で人気（地図ページ下部） */
export const TRAVEL_POPULAR_REFS: [string, string][] = [
  ["seoul", "hongdae"],
  ["taipei", "ximending"],
  ["paris", "marais"],
  ["honolulu", "waikiki"],
];

export const POSTS: Post[] = [
  {
    id: "p1",
    userName: "Yui",
    userIsCreator: false,
    citySlug: "tokyo",
    cityName: "東京",
    areaSlug: "shibuya",
    areaName: "渋谷",
    time: "12:30",
    timeOfDay: "daytime",
    weather: { tempC: 29, feelsLikeC: 32, kind: "sunny", windMps: 3, humidity: 68 },
    feelTag: "slightlyHot",
    outfitTags: ["半袖", "パンツ", "スニーカー", "帽子あり"],
    comment: "半袖でちょうどいいけど、室内は冷房で少し寒い。羽織りをカバンに入れて正解。",
    itemLinks: [],
  },
  {
    id: "p2",
    userName: "Rin",
    userIsCreator: false,
    citySlug: "tokyo",
    cityName: "東京",
    areaSlug: "omotesando",
    areaName: "表参道",
    time: "11:45",
    timeOfDay: "daytime",
    weather: { tempC: 30, feelsLikeC: 33, kind: "sunny", windMps: 2, humidity: 64 },
    feelTag: "hot",
    outfitTags: ["半袖", "スカート", "サンダル"],
    comment: "ノースリーブにスカートで正解。日陰なら快適です。",
    itemLinks: [],
  },
  {
    id: "p3",
    userName: "Ken",
    userIsCreator: false,
    citySlug: "tokyo",
    cityName: "東京",
    areaSlug: "shinjuku",
    areaName: "新宿",
    time: "09:20",
    timeOfDay: "morning",
    weather: { tempC: 27, feelsLikeC: 29, kind: "sunny", windMps: 3, humidity: 70 },
    feelTag: "comfortable",
    outfitTags: ["半袖", "シャツ", "スニーカー"],
    comment: "半袖に薄手シャツを羽織って出勤。朝はこれでちょうどいい。",
    itemLinks: [],
  },
  {
    id: "p4",
    userName: "Mika",
    userIsCreator: true,
    citySlug: "tokyo",
    cityName: "東京",
    areaSlug: "ginza",
    areaName: "銀座",
    time: "10:15",
    timeOfDay: "morning",
    weather: { tempC: 27, feelsLikeC: 30, kind: "sunny", windMps: 2, humidity: 70 },
    feelTag: "comfortable",
    outfitTags: ["半袖", "スカート", "サンダル"],
    comment: "朝はこれでOK。昼は日差しが強いので帽子があると安心です。",
    itemLinks: [
      {
        id: "l1",
        title: "リネンブレンドTシャツ",
        category: "トップス",
        label: "着用",
        url: "https://example.com/item/1",
        isAffiliate: true,
        clickCount: 12,
      },
      {
        id: "l2",
        title: "UVカット バケットハット",
        category: "帽子・小物",
        label: "おすすめ",
        url: "https://example.com/item/2",
        isAffiliate: true,
        clickCount: 7,
      },
    ],
  },
  {
    id: "p5",
    userName: "Yui",
    userIsCreator: false,
    citySlug: "tokyo",
    cityName: "東京",
    areaSlug: "daikanyama",
    areaName: "代官山",
    time: "18:40",
    timeOfDay: "night",
    weather: { tempC: 26, feelsLikeC: 26, kind: "cloudy", windMps: 4, humidity: 72 },
    feelTag: "slightlyCold",
    outfitTags: ["半袖", "ニット", "パンツ"],
    comment: "日が落ちると少し涼しい。半袖＋カーディガンでちょうどよかった。",
    itemLinks: [],
  },
  {
    id: "p6",
    userName: "Rin",
    userIsCreator: false,
    citySlug: "tokyo",
    cityName: "東京",
    areaSlug: "harajuku",
    areaName: "原宿",
    time: "15:00",
    timeOfDay: "daytime",
    weather: { tempC: 31, feelsLikeC: 34, kind: "sunny", windMps: 2, humidity: 62 },
    feelTag: "hot",
    outfitTags: ["半袖", "パンツ", "スニーカー", "帽子あり"],
    comment: "Tシャツにショートパンツ。日なたはかなり暑いので水分必須！",
    itemLinks: [],
  },
  {
    id: "p7",
    userName: "Taro",
    userIsCreator: false,
    citySlug: "tokyo",
    cityName: "東京",
    areaSlug: "ebisu",
    areaName: "恵比寿",
    time: "20:15",
    timeOfDay: "night",
    weather: { tempC: 25, feelsLikeC: 25, kind: "cloudy", windMps: 5, humidity: 74 },
    feelTag: "slightlyCold",
    outfitTags: ["長袖", "ジャケット", "パンツ"],
    comment: "夜は風が出て少し肌寒い。薄手ジャケットがあってよかった。",
    itemLinks: [],
  },
  {
    id: "p8",
    userName: "Ken",
    userIsCreator: false,
    citySlug: "tokyo",
    cityName: "東京",
    areaSlug: "tokyo-station",
    areaName: "東京駅周辺",
    time: "08:40",
    timeOfDay: "morning",
    weather: { tempC: 26, feelsLikeC: 28, kind: "sunny", windMps: 3, humidity: 72 },
    feelTag: "comfortable",
    outfitTags: ["シャツ", "パンツ", "スニーカー"],
    comment: "出張前に。朝はシャツ1枚でちょうどいいです。",
    itemLinks: [],
  },
  {
    id: "p9",
    userName: "Mika",
    userIsCreator: true,
    citySlug: "tokyo",
    cityName: "東京",
    areaSlug: "omotesando",
    areaName: "表参道",
    time: "15:00",
    timeOfDay: "daytime",
    weather: { tempC: 30, feelsLikeC: 33, kind: "sunny", windMps: 2, humidity: 65 },
    feelTag: "hot",
    outfitTags: ["ワンピース", "サンダル", "帽子あり"],
    comment: "日なたはかなり暑い。日陰を歩くルートがおすすめ。ワンピース＋サンダルで正解でした。",
    itemLinks: [
      {
        id: "l3",
        title: "エアリーロングワンピース",
        category: "ワンピース",
        label: "着用",
        url: "https://example.com/item/3",
        isAffiliate: true,
        clickCount: 9,
      },
    ],
  },
  {
    id: "p10",
    userName: "Yui",
    userIsCreator: false,
    citySlug: "tokyo",
    cityName: "東京",
    areaSlug: "shibuya",
    areaName: "渋谷",
    time: "08:20",
    timeOfDay: "morning",
    weather: { tempC: 25, feelsLikeC: 26, kind: "rain", windMps: 6, humidity: 88 },
    feelTag: "slightlyHot",
    outfitTags: ["半袖", "パンツ", "傘あり"],
    comment: "雨だけど蒸し暑い。長袖は少し暑いと思います。折りたたみ傘必須。",
    itemLinks: [],
  },
  {
    id: "p11",
    userName: "Sora",
    userIsCreator: true,
    citySlug: "seoul",
    cityName: "ソウル",
    areaSlug: "myeongdong",
    areaName: "明洞",
    time: "13:10",
    timeOfDay: "daytime",
    weather: { tempC: 27, feelsLikeC: 29, kind: "cloudy", windMps: 5, humidity: 72 },
    feelTag: "comfortable",
    outfitTags: ["半袖", "パンツ", "スニーカー"],
    comment: "曇りで歩きやすい。旅行なら半袖＋薄手の羽織りで十分です。",
    itemLinks: [],
  },
  {
    id: "p12",
    userName: "Sora",
    userIsCreator: true,
    citySlug: "seoul",
    cityName: "ソウル",
    areaSlug: "hongdae",
    areaName: "弘大",
    time: "21:00",
    timeOfDay: "night",
    weather: { tempC: 24, feelsLikeC: 24, kind: "cloudy", windMps: 6, humidity: 70 },
    feelTag: "slightlyCold",
    outfitTags: ["長袖", "パンツ", "スニーカー"],
    comment: "夜は風が強くて半袖だと少し肌寒い。薄手の長袖がちょうどいいです。",
    itemLinks: [],
  },
];

export const ADS: Ad[] = [
  {
    id: "ad1",
    advertiser: "TravelLight",
    title: "3泊4日がこれひとつ。軽量キャリーケース",
    body: "旅行者に人気の機内持ち込みサイズ。いまなら20%オフ。",
    ctaLabel: "詳しく見る",
  },
  {
    id: "ad2",
    advertiser: "SunCare Lab",
    title: "夏の外出に。汗に強いUVミスト",
    body: "服の上からも使える日焼け止めミスト。",
    ctaLabel: "公式サイトへ",
  },
];

// MARK: - 取得ヘルパー（フェーズ2でSupabaseクエリに置き換え）

export function getCity(citySlug: string): City | undefined {
  return CITIES.find((c) => c.slug === citySlug);
}

export function getArea(citySlug: string, areaSlug: string): Area | undefined {
  return getCity(citySlug)?.areas.find((a) => a.slug === areaSlug);
}

export function getPost(postId: string): Post | undefined {
  return POSTS.find((p) => p.id === postId);
}

export function postsByCity(citySlug: string): Post[] {
  return POSTS.filter((p) => p.citySlug === citySlug);
}

export function postsByArea(citySlug: string, areaSlug: string): Post[] {
  return POSTS.filter((p) => p.citySlug === citySlug && p.areaSlug === areaSlug);
}

export function relatedPosts(post: Post, limit = 4): Post[] {
  return POSTS.filter((p) => p.id !== post.id && p.citySlug === post.citySlug).slice(0, limit);
}

export function areaWeather(citySlug: string): Weather {
  return getCity(citySlug)?.weather ?? tokyoWeather;
}

export const TODAY_LABEL = "7月7日(火)";

// MARK: - 今日の服装サマリー（都市・エリアページ用。天気と体感傾向から自動生成）
// MVPはルールベースの文章生成。実装時は当日の投稿の服装タグ集計に置き換える。

export interface OutfitSummary {
  recommend: string; // 今日のおすすめ
  nightNote: string; // 夜の注意
  weatherNote: string; // 雨・風の注意
  feelNote: string; // 体感傾向
  memo: string; // 服装メモ本文
}

export function buildOutfitSummary(
  placeName: string,
  weather: Weather,
  trend?: string
): OutfitSummary {
  const t = Math.round(weather.tempC);

  const recommend =
    t >= 30
      ? "半袖＋日差し対策（帽子・日傘）"
      : t >= 26
        ? "半袖＋薄手の羽織り"
        : t >= 20
          ? "長袖シャツ、または半袖＋カーディガン"
          : t >= 14
            ? "長袖＋ジャケット"
            : t >= 8
              ? "ニット＋コート"
              : "厚手のコートと防寒小物";

  const nightNote =
    t >= 26
      ? "室内の冷房や夜風で少し肌寒く感じる投稿があります"
      : t >= 18
        ? "夜は羽織りが1枚あると安心です"
        : "朝晩は冷えるのでしっかり防寒を";

  const notes: string[] = [];
  if (weather.kind === "rain") notes.push("雨のため傘と濡れにくい靴がおすすめ");
  if (weather.kind === "snow") notes.push("雪のため滑りにくい靴で");
  if (weather.windMps >= 5) notes.push(`風が${Math.round(weather.windMps)}m/sとやや強め`);
  if (weather.kind === "sunny" && t >= 28) notes.push("日差しが強めです");
  const weatherNote = notes.length > 0 ? notes.join("。") : "大きな天気の崩れはなさそうです";

  const feelNote = trend ?? "投稿が集まると、体感の傾向がここに表示されます";

  const memo =
    t >= 26
      ? `${placeName}は${t}℃で、日中は半袖で過ごしやすい気温です。${
          weather.kind === "rain"
            ? "雨なので足元には注意してください。"
            : "室内は冷房で少し寒いという声もあります。"
        }夜まで外出するなら、薄手の羽織りを持つと安心です。`
      : t >= 20
        ? `${placeName}は${t}℃。長袖1枚か、半袖＋羽織りがちょうどいい気温です。朝晩は少しひんやりするので、脱ぎ着しやすい服装がおすすめです。`
        : `${placeName}は${t}℃と肌寒い気温です。上着を忘れずに。実際の投稿写真で、現地の人の着こなしをチェックしてみてください。`;

  return { recommend, nightNote, weatherNote, feelNote, memo };
}
