-- ============================================================
-- NANIKIRU フェーズ6: profilesテーブル + RLS + サインアップ時の自動作成
-- Supabase SQL Editor にこのファイル全体を貼り付けて実行する
-- ============================================================

-- ---------- profiles ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'ゲスト',
  avatar_url text,
  bio text,
  is_creator boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- updated_at 自動更新 ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists profiles_touch on profiles;
create trigger profiles_touch before update on profiles
  for each row execute function public.touch_updated_at();

-- ---------- サインアップ時にprofilesを自動作成 ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'display_name', ''),
      split_part(new.email, '@', 1),
      'ゲスト'
    )
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- RLS ----------
alter table profiles enable row level security;

-- 誰でも読める（投稿者名の表示用）
drop policy if exists "profiles_read" on profiles;
create policy "profiles_read" on profiles for select using (true);

-- 自分のprofileだけ作成できる（通常はトリガーが作るが保険）
drop policy if exists "profiles_insert_own" on profiles;
create policy "profiles_insert_own" on profiles for insert
  with check (auth.uid() = id);

-- 自分のprofileだけ更新できる
drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles for update
  using (auth.uid() = id);

-- deleteポリシーは作らない（削除はauth.users削除時のcascadeのみ）

-- 確認用: select * from profiles; （サインアップ後に1行増える）
