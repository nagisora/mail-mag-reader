"use client"

import { dummyMailMagazines } from './mail-magazines';
import { useState } from 'react';

export default function Home() {
  const [mailMagazines, setMailMagazines] = useState(dummyMailMagazines);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">メールマガジンリーダー</h1>
        <div className="space-y-6">
          {mailMagazines.map((mailMagazine) => (
            <div key={mailMagazine.title} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">{mailMagazine.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{mailMagazine.date}</p>
              <div dangerouslySetInnerHTML={{ __html: mailMagazine.content }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}