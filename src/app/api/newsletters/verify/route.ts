import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { remark } from 'remark';
import strip from 'strip-markdown';

export async function POST(req: Request) {
  try {
    const { id, content } = await req.json();

    if (!id || !content) {
      return NextResponse.json({ error: 'IDとコンテンツは必須です' }, { status: 400 });
    }

    // データベースからメルマガを取得
    const { data: newsletter, error: fetchError } = await supabase
      .from('newsletters')
      .select('content')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching newsletter:', fetchError);
      return NextResponse.json({ error: 'メルマガの取得に失敗しました' }, { status: 500 });
    }

    if (!newsletter) {
      return NextResponse.json({ error: '指定されたメルマガが見つかりません' }, { status: 404 });
    }

    // Markdownをプレーンテキストに変換
    const plainTextContent = await markdownToPlainText(newsletter.content);

    // コンテンツの照合
    const similarity = calculateSimilarity(plainTextContent, content);

    if (similarity >= 0.80) {
      // 照合成功
      return NextResponse.json({ success: true, similarity });
    } else {
      // 照合失敗
      return NextResponse.json({ success: false, similarity });
    }
  } catch (error) {
    console.error('Error verifying newsletter:', error);
    return NextResponse.json({ error: 'メルマガの照合中にエラーが発生しました' }, { status: 500 });
  }
}

async function markdownToPlainText(markdown: string): Promise<string> {
  const result = await remark()
    .use(strip)
    .process(markdown);
  return result.toString();
}

function calculateSimilarity(str1: string, str2: string): number {
  // 簡易的な類似度計算（実際のプロジェクトではより高度なアルゴリズムを使用することをお勧めします）
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}
