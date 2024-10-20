import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const { content } = await req.json();

  // すべてのメルマガを取得
  const { data: newsletters, error } = await supabase
    .from('newsletters')
    .select('id, title, content');

  if (error) {
    return NextResponse.json({ error: 'メルマガの取得に失敗しました' }, { status: 500 });
  }

  // 照合ロジック
  const matchedNewsletter = newsletters.find(newsletter => {
    // 簡易的な照合ロジック（実際にはより高度なアルゴリズムを使用する）
    const similarity = calculateSimilarity(content, newsletter.content);
    return similarity >= 0.95; // 95%以上の一致
  });

  if (matchedNewsletter) {
    return NextResponse.json({ id: matchedNewsletter.id, title: matchedNewsletter.title });
  } else {
    return NextResponse.json({ error: '一致するメルマガが見つかりませんでした' }, { status: 404 });
  }
}

// 簡易的な類似度計算関数（実際にはより高度なアルゴリズムを使用する）
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  const intersection = words1.filter(word => words2.includes(word));
  return intersection.length / Math.max(words1.length, words2.length);
}
