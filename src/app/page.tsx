import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>メルマガリーダー</h1>
      <nav>
        <Link href="/login">ログイン</Link>
        <Link href="/register">新規登録</Link>
        <Link href="/newsletters">メルマガ一覧</Link>
      </nav>
    </div>
  );
}
