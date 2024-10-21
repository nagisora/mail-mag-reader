import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">メルマガリーダー</CardTitle>
          <CardDescription className="text-center">お気に入りのメルマガを管理しましょう</CardDescription>
        </CardHeader>
        <CardContent>
          <nav className="flex flex-col space-y-4">
            <Button asChild variant="outline">
              <Link href="/login">ログイン</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">新規登録</Link>
            </Button>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}
