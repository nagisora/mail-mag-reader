"use client"

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import jconv from 'jconv';
import { dummyMailMagazine, MailMagazine } from './mail-magazines';

// Supabaseクライアントの初期化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [mailMagazine, setMailMagazine] = useState<MailMagazine>(dummyMailMagazine);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      setError('サインインに失敗しました: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError('サインアウトに失敗しました: ' + error.message);
    }
  };

  const handleFileUpload = async (file: File) => {
    // EMLファイルの解析ロジックをここに追加
    const content = await parseEmlFile(file); // EMLファイルを解析して内容を取得
    console.log(content);
    
    setMailMagazine(content);

    // Supabaseにデータを保存
    const { data, error } = await supabase
      .from('newsletters')
      .insert(content);

    if (error) {
      setError(error.message);
    } else {
      console.log('Data saved:', data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">メールマガジンリーダー</h1>
        <div className="mb-6 flex justify-between items-center">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">{user.email}</span>
              <button onClick={handleSignOut}>サインアウト</button>
            </div>
          ) : (
            <button onClick={handleSignIn}>Googleでサインイン</button>
          )}
          <input 
            type="file" 
            accept=".eml" 
            className="border border-gray-300 rounded p-2"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileUpload(file); // ファイルアップロード処理を呼び出す
              }
            }} 
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-6">
          <div key={mailMagazine.title} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-1">{mailMagazine.name}</h3>
            <h2 className="text-xl font-semibold mb-2">{mailMagazine.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{mailMagazine.issue_number}</p>
            <div dangerouslySetInnerHTML={{ __html: mailMagazine.content }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// EMLファイルを解析する関数
async function parseEmlFile(file: File): Promise<MailMagazine> {
  const name = '週刊Life is beautiful';
  const title = file.name.replace(/\.eml$/, '');

  const halfWidthTitle = title.replace(/[！-～]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xFEE0));
  const match = halfWidthTitle.match(/(\d{4})年(\d{1,2})月(\d{1,2})日号/);
  const year = match?.[1] || '0';
  const month = String(match?.[2]?.padStart(2, '0') || '0');
  const day = String(match?.[3]?.padStart(2, '0') || '0');
  const issue_number = parseInt(`${year}${month}${day}`, 10); // 連結して整数に変換

  const rawContent = await file.text();
  const htmlContent = rawContent.split('<h1>')[1] ? `<h1>${rawContent.split('<h1>')[1]}` : '';
  const content = jconv.convert(htmlContent, 'JIS', 'UTF8').toString();

  return { name, issue_number, title, content };
}
