"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-background border-b">
      <div className="container py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">メルマガリーダー</Link>
        <nav className="hidden sm:flex space-x-2">
          <Button asChild variant="ghost">
            <Link href="/newsletters">メルマガ一覧</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/profile">プロフィール</Link>
          </Button>
          <ThemeToggle />
        </nav>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="sm:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">メニュー</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:hidden">
            <SheetTitle>メニュー</SheetTitle>
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
      </div>
    </header>
  );
}
