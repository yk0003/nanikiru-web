// postsリポジトリ層。
// DB（Supabase posts + post_tags）から投稿を読み、既存UIと同じ Post 型で返す。
// env未設定・取得エラー・0件のいずれの場合も lib/mock.ts にfallbackするので、ページは落ちない。
// 注意:
//  - 着用アイテム（itemLinks）はcreator_linksテーブル導入前なのでmockからid照合で補完（フェーズ10で置換）
//  - 都市名・エリア名はlocations repo（DB優先）から解決
//  - time / timeOfDay はposted_atのJST時刻から導出

import { getSupabaseAnonClient } from "@/lib/supabase/anon";
import {
  POSTS as MOCK_POSTS,
  getPost as getMockPost,
  postsByArea as mockPostsByArea,
  postsByCity as mockPostsByCity,
} from "@/lib/mock";
import { getCitiesRepo } from "@/lib/repo/locations";
import type { FeelTag, Post, TimeOfDay, WeatherKind } from "@/lib/types";

interface PostRow {
  id: string;
  author_name: string;
  author_is_creator: boolean;
  city_slug: string;
  area_slug: string | null;
  image_url: string | null;
  feeling: string;
  comment: string | null;
  temperature: number | null;
  feels_like: number | null;
  weather: string | null;
  wind_speed: number | null;
  humidity: number | null;
  posted_at: string;
  post_tags: { tag: string }[];
}

const FEELING_MAP: Record<string, FeelTag> = {
  cold: "cold",
  slightly_cold: "slightlyCold",
  comfortable: "comfortable",
  slightly_hot: "slightlyHot",
  hot: "hot",
};

const timeFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function timeOfDayFromHour(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 18) return "daytime";
  return "night";
}

async function rowToPost(
  row: PostRow,
  cityNames: Map<string, { cityName: string; areaNames: Map<string, string> }>
): Promise<Post> {
  const city = cityNames.get(row.city_slug);
  const areaSlug = row.area_slug ?? "";
  const mockPost = getMockPost(row.id);
  const postedAt = new Date(row.posted_at);
  const timeLabel = timeFormatter.format(postedAt);
  const jstHour = Number(timeLabel.split(":")[0]);

  return {
    id: row.id,
    userName: row.author_name,
    userIsCreator: row.author_is_creator,
    citySlug: row.city_slug,
    cityName: city?.cityName ?? row.city_slug,
    areaSlug,
    areaName: city?.areaNames.get(areaSlug) ?? areaSlug,
    time: timeLabel,
    timeOfDay: timeOfDayFromHour(jstHour),
    weather: {
      tempC: row.temperature ?? 0,
      feelsLikeC: row.feels_like ?? row.temperature ?? 0,
      kind: (row.weather ?? "cloudy") as WeatherKind,
      windMps: row.wind_speed ?? 0,
      humidity: row.humidity ?? 0,
    },
    feelTag: FEELING_MAP[row.feeling] ?? "comfortable",
    outfitTags: row.post_tags.map((t) => t.tag),
    comment: row.comment ?? "",
    // creator_links導入（フェーズ10）まではmockから補完
    itemLinks: mockPost?.itemLinks ?? [],
  };
}

async function fetchAllPosts(): Promise<Post[] | null> {
  try {
    const supabase = getSupabaseAnonClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("posts")
      .select(
        "id, author_name, author_is_creator, city_slug, area_slug, image_url, feeling, comment, temperature, feels_like, weather, wind_speed, humidity, posted_at, post_tags(tag)"
      )
      .order("posted_at", { ascending: false });

    if (error || !data || data.length === 0) return null;

    // 都市名・エリア名の解決テーブル（locations repo = DB優先・mockフォールバック）
    const cities = await getCitiesRepo();
    const cityNames = new Map(
      cities.map((c) => [
        c.slug,
        {
          cityName: c.name,
          areaNames: new Map(c.areas.map((a) => [a.slug, a.name])),
        },
      ])
    );

    return Promise.all((data as PostRow[]).map((row) => rowToPost(row, cityNames)));
  } catch {
    return null;
  }
}

/** 全投稿（DB優先・mockフォールバック、新しい順） */
export async function getPostsRepo(): Promise<Post[]> {
  return (await fetchAllPosts()) ?? MOCK_POSTS;
}

/** 投稿1件 */
export async function getPostRepo(postId: string): Promise<Post | undefined> {
  const posts = await fetchAllPosts();
  if (!posts) return getMockPost(postId);
  return posts.find((p) => p.id === postId) ?? getMockPost(postId);
}

/** 都市の投稿 */
export async function postsByCityRepo(citySlug: string): Promise<Post[]> {
  const posts = await fetchAllPosts();
  if (!posts) return mockPostsByCity(citySlug);
  return posts.filter((p) => p.citySlug === citySlug);
}

/** エリアの投稿 */
export async function postsByAreaRepo(citySlug: string, areaSlug: string): Promise<Post[]> {
  const posts = await fetchAllPosts();
  if (!posts) return mockPostsByArea(citySlug, areaSlug);
  return posts.filter((p) => p.citySlug === citySlug && p.areaSlug === areaSlug);
}

/** 関連投稿（同じ都市の他の投稿） */
export async function relatedPostsRepo(post: Post, limit = 4): Promise<Post[]> {
  const posts = await getPostsRepo();
  return posts.filter((p) => p.id !== post.id && p.citySlug === post.citySlug).slice(0, limit);
}

/** ヘルスチェック用: postsの行数（DB未接続・未作成ならnull） */
export async function countPosts(): Promise<number | null> {
  try {
    const supabase = getSupabaseAnonClient();
    if (!supabase) return null;
    const { count, error } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true });
    if (error) return null;
    return count ?? 0;
  } catch {
    return null;
  }
}
