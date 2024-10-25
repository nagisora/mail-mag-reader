"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from '@/lib/auth';
import { ThemeProvider } from "@/components/theme-provider";
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  // メルマガ詳細ページではグローバルヘッダーを非表示にする
  const hideHeader = pathname?.startsWith('/newsletters/') && pathname !== '/newsletters';

  return (
    <html lang="ja" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {!hideHeader && <Header />} {/* 条件付きレンダリング */}
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
