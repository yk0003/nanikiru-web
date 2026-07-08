// profilesリポジトリ層。
// 表示名は public.profiles.display_name を正とする（Authのmetadataやemailは最後のfallback）。
// profiles行が無い場合（トリガー導入前に登録したユーザー等）は自己修復で作成する。

import type { SupabaseClient, User } from "@supabase/supabase-js";

export interface Profile {
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  is_creator: boolean;
  created_at: string;
}

const PROFILE_COLUMNS = "display_name, avatar_url, bio, is_creator, created_at";

/** Authユーザーの情報から表示名の初期値を決める（profilesが無い時の作成用） */
function initialDisplayName(user: User): string {
  const metaName = (user.user_metadata?.display_name as string | undefined)?.trim();
  if (metaName) return metaName;
  const emailName = user.email?.split("@")[0];
  if (emailName) return emailName;
  return "ゲスト";
}

/**
 * 自分のprofileを取得。行が無ければ自己修復で作成して返す。
 * （RLSのprofiles_insert_ownにより本人のみ作成可能）
 */
export async function ensureOwnProfile(
  supabase: SupabaseClient,
  user: User
): Promise<Profile | null> {
  try {
    const { data: existing } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("id", user.id)
      .maybeSingle();

    if (existing) return existing as Profile;

    // 行が無い → トリガー導入前のユーザー等。自己修復で作成
    const { data: created } = await supabase
      .from("profiles")
      .insert({ id: user.id, display_name: initialDisplayName(user) })
      .select(PROFILE_COLUMNS)
      .single();

    return (created as Profile) ?? null;
  } catch {
    return null;
  }
}

/** 表示名の解決: profiles.display_name → metadata → メール前半 → ゲスト */
export function resolveDisplayName(profile: Profile | null, user: User): string {
  const profileName = profile?.display_name?.trim();
  if (profileName) return profileName;
  return initialDisplayName(user);
}
