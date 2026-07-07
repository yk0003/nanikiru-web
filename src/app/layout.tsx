import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  // OG画像URL・canonical等の相対パスをNEXT_PUBLIC_SITE_URL基準で解決する
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s｜NANIKIRU",
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  // サイト全体のOGPデフォルト（og:imageは app/opengraph-image.tsx が自動で付与される）
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "NANIKIRU",
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
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
