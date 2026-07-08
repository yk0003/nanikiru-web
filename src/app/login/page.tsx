import { LoginForm } from "@/components/LoginForm";

export const metadata = { title: "ログイン" };

// ログインページ。閲覧はログイン不要、投稿・保存・フォローにログインが必要。
export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm space-y-6 py-8">
      <div className="text-center">
        <p className="text-2xl font-extrabold text-sky">NANIKIRU</p>
        <p className="mt-2 text-sm text-sub">天気予報よりリアル。現地の今日の服装を見る。</p>
      </div>

      <LoginForm />

      <p className="text-center text-xs leading-relaxed text-sub">
        投稿・保存・フォローにはログインが必要です。
        <br />
        見るだけなら、ログインなしでもすべてのページを利用できます。
      </p>
    </div>
  );
}
