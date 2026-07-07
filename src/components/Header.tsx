import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-cloud bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-extrabold tracking-wide text-sky">
          NANIKIRU
        </Link>
        <nav className="flex items-center gap-3 text-sm text-sub sm:gap-4">
          <Link href="/map" className="whitespace-nowrap hover:text-ink">
            地図
          </Link>
          <Link href="/saved" className="hidden whitespace-nowrap hover:text-ink sm:inline">
            保存
          </Link>
          <Link href="/me" className="hidden whitespace-nowrap hover:text-ink sm:inline">
            マイページ
          </Link>
          <Link
            href="/compose"
            className="whitespace-nowrap rounded-full bg-sky px-4 py-1.5 font-semibold text-white hover:opacity-90"
          >
            投稿する
          </Link>
        </nav>
      </div>
    </header>
  );
}
