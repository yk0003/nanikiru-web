import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  // OG画像URL・canonical等の相対パスをNEXT_PUBLIC_SITE_URL基準で解決する
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NANIKIRU | 天気予報よりリアル。現地の今日の服装を見る",
    template: "%s | NANIKIRU",
  },
  description:
    "NANIKIRU（ナニキル）は、旅行先や現在地の「今日なにを着ればいいか」を、現地の人のリアルな服装投稿・気温・天気・体感メモから判断できるサービスです。",
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen antialiased">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <footer className="mt-16 border-t border-cloud py-8 text-center text-xs text-sub">
          <p className="space-x-4">
            <Link href="/creator">Creatorプラン</Link>
            <Link href="/map">世界のリアル服装マップ</Link>
            <Link href="/login">ログイン</Link>
          </p>
          <p className="mt-3">© NANIKIRU — 正確な位置情報は表示されません。服装はエリア単位で共有されます。</p>
        </footer>
      </body>
    </html>
  );
}
