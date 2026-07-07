import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // devサーバーと本番サーバーを同時に動かせるよう、ビルド出力先を環境変数で分離できるようにする
  // （本番: NEXT_DIST_DIR=.next-prod で build & start）
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
