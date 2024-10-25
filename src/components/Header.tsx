"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import ReadingProgressBar from '@/components/ReadingProgressBar';

interface HeaderProps {
  showProgress?: boolean;
  newsletterId?: string;
  isVerified?: boolean;
  onSavePosition?: () => void;
  isSaving?: boolean;
  saveMessage?: string | null;
}

export default function Header({
  showProgress = false,
  newsletterId,
  isVerified = false,
  onSavePosition,
  isSaving = false,
  saveMessage = null
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-10 bg-background border-b">
      <div className="container py-4 flex justify-between items-center h-14">
        <div className="flex items-center gap-4">
          {/* 左側のハンバーガーメニュー */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">メニューを開く</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <Button asChild variant="ghost" onClick={closeMenu}>
                  <Link href="/newsletters">メルマガ一覧</Link>
                </Button>
                <Button asChild variant="ghost" onClick={closeMenu}>
                  <Link href="/profile">プロフィール</Link>
                </Button>
                <ThemeToggle />
              </nav>
            </SheetContent>
          </Sheet>

          {/* タイトル */}
          <Link href="/" className="text-lg font-semibold sm:text-2xl">
            メルマガリーダー
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* 進捗バーと保存ボタン (メルマガ詳細ページの場合のみ表示) */}
          {showProgress && isVerified && (
            <>
              <div className="hidden sm:block">
                {newsletterId && <ReadingProgressBar newsletterId={newsletterId} />}
              </div>
              {onSavePosition && (
                <Button
                  onClick={onSavePosition}
                  disabled={isSaving}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {isSaving ? "保存中..." : saveMessage ? (
                    <span className={saveMessage === '成功' ? 'text-green-500' : 'text-red-500'}>
                      {saveMessage}
                    </span>
                  ) : "位置を保存"}
                </Button>
              )}
            </>
          )}

          {/* PC表示時のナビゲーション */}
          <nav className="hidden sm:flex space-x-2">
            <Button asChild variant="ghost">
              <Link href="/newsletters">メルマガ一覧</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/profile">プロフィール</Link>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
