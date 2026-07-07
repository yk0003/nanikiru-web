"use client";

import type { CSSProperties, ReactNode } from "react";

// チップ共通コンポーネント。
// ルール: 左寄せ・自然に折り返す・右側で見切れない・均等配置にしない。
// 選択中は淡いブルー（体感チップは各タグの色）でわかりやすくする。

export function Chip({
  selected,
  onClick,
  children,
  selectedStyle,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  /** 体感チップなど、選択色をタグごとに変えたい場合に指定 */
  selectedStyle?: CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`nk-chip cursor-pointer font-semibold transition ${
        selected && !selectedStyle
          ? "bg-sky/15 text-skydeep ring-1 ring-sky"
          : "bg-cloud text-sub hover:text-ink"
      }`}
      style={selected ? selectedStyle : undefined}
    >
      {children}
    </button>
  );
}

/** 左寄せで折り返すチップの入れ物 */
export function ChipGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}
