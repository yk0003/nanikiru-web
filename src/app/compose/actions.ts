"use server";

// 投稿作成のServer Action。
// 認証確認 → 入力検証 → 投稿時点の天気スナップショット取得(Open-Meteo) →
// posts/post_tagsへINSERT → キャッシュ更新 → エリアページへredirect。
// RLS（posts_insert_own）により、他人のuser_idでの投稿はDB層でも拒否される。

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAreaRepo } from "@/lib/repo/locations";
import { ensureOwnProfile, resolveDisplayName } from "@/lib/repo/profile";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { FEEL_TAGS, WEATHER_KINDS, type FeelTag } from "@/lib/types";
import { getWeatherForArea } from "@/lib/weather";

const FEELING_TO_DB: Record<FeelTag, string> = {
  cold: "cold",
  slightlyCold: "slightly_cold",
  comfortable: "comfortable",
  slightlyHot: "slightly_hot",
  hot: "hot",
};

export interface CreatePostInput {
  citySlug: string;
  areaSlug: string;
  feeling: FeelTag;
  comment: string;
  tags: string[];
}

export async function createPost(input: CreatePostInput): Promise<{ error: string }> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return { error: "現在はモック動作中のため投稿できません（Supabase未接続）。" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "投稿にはログインが必要です。" };
  }

  // ---- 入力検証 ----
  const comment = input.comment.trim();
  if (/https?:\/\//i.test(comment)) {
    return {
      error: "本文にURLは入れられません。商品リンクはCreatorプランのアイテムリンク欄で追加できます。",
    };
  }
  if (comment.length > 500) {
    return { error: "コメントは500文字以内で入力してください。" };
  }
  if (!(input.feeling in FEEL_TAGS)) {
    return { error: "この服での体感を選んでください。" };
  }

  // エリアの実在確認（未登録カスタムエリアへの投稿はエリアページが無いため今はブロック）
  const area = await getAreaRepo(input.citySlug, input.areaSlug);
  if (!area) {
    return { error: "候補にあるエリアを選んでください（新しいエリアの登録は準備中です）。" };
  }

  const tags = [...new Set(input.tags.map((t) => t.trim()).filter(Boolean))].slice(0, 10);

  // ---- 投稿者名（profiles.display_nameを正とする） ----
  const profile = await ensureOwnProfile(supabase, user);
  const authorName = resolveDisplayName(profile, user);

  // ---- 投稿時点の天気スナップショット（Open-Meteo。失敗時はmock値 + source='mock'） ----
  const weather = await getWeatherForArea(input.citySlug, input.areaSlug);

  // ---- 保存 ----
  const postId = crypto.randomUUID();

  const { error: postError } = await supabase.from("posts").insert({
    id: postId,
    user_id: user.id,
    author_name: authorName,
    author_is_creator: profile?.is_creator ?? false,
    city_slug: input.citySlug,
    area_slug: input.areaSlug,
    image_url: null, // 画像アップロードはフェーズ8（Storage）で対応
    feeling: FEELING_TO_DB[input.feeling],
    comment,
    temperature: Math.round(weather.tempC),
    feels_like: Math.round(weather.feelsLikeC),
    weather: weather.kind,
    weather_emoji: WEATHER_KINDS[weather.kind].emoji,
    wind_speed: weather.windMps,
    humidity: weather.humidity,
    weather_source: weather.source,
    posted_at: new Date().toISOString(),
  });

  if (postError) {
    return { error: "投稿を保存できませんでした。時間をおいて再度お試しください。" };
  }

  if (tags.length > 0) {
    // タグ保存の失敗は投稿全体を失敗にしない（本文は保存済みのため）
    await supabase.from("post_tags").insert(tags.map((tag) => ({ post_id: postId, tag })));
  }

  // ---- キャッシュ更新（postsは1時間キャッシュのため、即時反映させる） ----
  revalidateTag("supabase");
  revalidatePath("/");
  revalidatePath(`/locations/${input.citySlug}`);
  revalidatePath(`/locations/${input.citySlug}/${input.areaSlug}`);
  revalidatePath(`/posts/${postId}`);

  // ---- 投稿したエリアのページへ ----
  redirect(`/locations/${input.citySlug}/${input.areaSlug}`);
}
