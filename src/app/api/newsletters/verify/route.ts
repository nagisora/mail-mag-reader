import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function calculateSimilarity(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(0));

  for (let i = 0; i <= len1; i++) {
    matrix[0][i] = i;
  }
  for (let j = 0; j <= len2; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1
        );
      }
    }
  }

  const maxLen = Math.max(len1, len2);
  const similarity = 1 - matrix[len2][len1] / maxLen;
  return similarity * 100;
}

export async function POST(request: Request) {
  const { content } = await request.json();

  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const { data: newsletters, error } = await supabase
    .from('newsletters')
    .select('content')
    .eq('is_master', true);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch master newsletters' }, { status: 500 });
  }

  let maxSimilarity = 0;
  for (const newsletter of newsletters) {
    const similarity = calculateSimilarity(content, newsletter.content);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
    }
  }

  const match = maxSimilarity >= 95;

  return NextResponse.json({ match, similarity: maxSimilarity });
}
