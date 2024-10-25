"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/components/LoginForm";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
          <CardDescription>メルマガリーダーにログインしてください</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />

          <div className="my-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  または
                </span>
              </div>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            asChild
          >
            <Link href="/auth/google">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                {/* Google SVG path は省略 */}
              </svg>
              Googleでログイン
            </Link>
          </Button>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            アカウントをお持ちでない方は{' '}
            <Link href="/register" className="text-primary hover:underline">
              新規登録
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
