import Link from "next/link";
import { AuthNav } from "@/components/AuthNav";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-cloud bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-extrabold tracking-wide text-sky">
          NANIKIRU
        </Link>
        <AuthNav />
      </div>
    </header>
  );
}
