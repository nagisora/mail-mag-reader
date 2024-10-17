import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <nav>
        <Link href="/">ホーム</Link>
        <Link href="/newsletters">メルマガ一覧</Link>
        {/* ログイン状態に応じて表示を変更する */}
      </nav>
    </header>
  );
}
