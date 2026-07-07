"use client";

import { useState } from "react";

// お気に入りボタン（MVPモック: 表示切り替えのみ。永続化はフェーズ2でfavorite_areasテーブルに接続）
export function FavoriteButton() {
  const [fav, setFav] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFav(!fav)}
      className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
        fav ? "bg-mint text-white" : "bg-mint/20 text-skydeep hover:bg-mint/30"
      }`}
    >
      {fav ? "♥ お気に入り済み" : "♡ お気に入りに追加"}
    </button>
  );
}
