-- ============================================================
-- フェーズ6修正: 既存ユーザーのprofiles補完 + 表示名の修正
-- （トリガー導入前にサインアップしたユーザーはprofiles行が無いため）
-- Supabase SQL Editor で実行する
-- ============================================================

-- 1) profiles行が無い既存ユーザーをまとめて補完
--    （metadataのdisplay_name → 無ければメール前半 → 無ければ'ゲスト'）
insert into profiles (id, display_name)
select
  u.id,
  coalesce(
    nullif(u.raw_user_meta_data->>'display_name', ''),
    split_part(u.email, '@', 1),
    'ゲスト'
  )
from auth.users u
left join profiles p on p.id = u.id
where p.id is null;

-- 2) あなたのアカウントの表示名を「ゆ」に更新（メールアドレスで特定）
update profiles
set display_name = 'ゆ'
where id = (select id from auth.users where email = 'ykato.002@gmail.com');

-- 確認用:
--   select u.email, p.display_name from profiles p join auth.users u on u.id = p.id;
--   → ykato.002@gmail.com | ゆ になっていればOK
