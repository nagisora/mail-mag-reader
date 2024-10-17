import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white p-4 shadow-md">
      <nav className="flex justify-between items-center">
        <Link href="/" className="text-lg font-bold">メルマガリーダー</Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-blue-400 transition">ホーム</Link>
          <Link href="/newsletters" className="hover:text-blue-400 transition">メルマガ一覧</Link>
          {/* ログイン状態に応じて表示を変更する */}
        </div>
      </nav>
    </header>
  );
}
