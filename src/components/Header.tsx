import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export default function Header() {
  return (
    <header className="bg-background text-foreground p-4 shadow-md">
      <nav className="flex justify-between items-center">
        <Link href="/" className="text-lg font-bold">メルマガリーダー</Link>
        <div className="space-x-4 flex items-center">
          <Link href="/" className="hover:text-primary transition">ホーム</Link>
          <Link href="/newsletters" className="hover:text-primary transition">メルマガ一覧</Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
