"use client";

import { useState, useEffect } from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from '@/lib/auth';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  return (
    <html lang="ja" className={darkMode ? 'dark' : ''}>
      <body className={`${inter.className} ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <AuthProvider>
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
