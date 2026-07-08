-- ============================================================
-- NANIKIRU フェーズ7: 投稿作成のRLS（insertのみ許可）
-- Supabase SQL Editor で実行する
-- ============================================================

-- posts: ログインユーザーが「自分のuser_idで」insertできる
-- （update/deleteのポリシーは作らない = まだ誰も編集・削除できない）
drop policy if exists "posts_insert_own" on posts;
create policy "posts_insert_own" on posts
  for insert to authenticated
  with check (auth.uid()::text = user_id);

-- post_tags: 自分の投稿にのみタグを追加できる
drop policy if exists "post_tags_insert_own" on post_tags;
create policy "post_tags_insert_own" on post_tags
  for insert to authenticated
  with check (
    exists (
      select 1 from posts p
      where p.id = post_id and p.user_id = auth.uid()::text
    )
  );

-- 確認用:
--   select policyname, cmd from pg_policies where tablename in ('posts','post_tags');
--   → posts_read(SELECT) / posts_insert_own(INSERT) / post_tags_read(SELECT) / post_tags_insert_own(INSERT)
