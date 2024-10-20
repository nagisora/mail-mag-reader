function parseNewsletter(message) {
  const subject = message.getSubject();
  const htmlBody = message.getBody();
  Logger.log(`Parsing newsletter with subject: "${subject}"`);
  Logger.log(`Raw HTML body length: ${htmlBody.length} characters`);

  // HTMLをMarkdownに変換
  const markdownContent = convertHtmlToMarkdown(htmlBody);
  Logger.log(`Converted Markdown content length: ${markdownContent.length} characters`);

  // タイトルの抽出（サブジェクトを使用）
  const title = subject;

  // 日付の抽出（メッセージの日付を使用）
  const date = message.getDate();

  if (title && markdownContent) {
    return {
      title: title,
      content: markdownContent,
      created_at: date.toISOString()
    };
  } else {
    Logger.log('Failed to parse newsletter: missing title or content');
    return null;
  }
}

function convertHtmlToMarkdown(html) {
  Logger.log('Starting HTML to Markdown conversion');
  
  // HTMLを整形するための処理を追加
  html = html.replace(/<\s*br\s*\/?>/gi, '\n'); // <br>タグを改行に変換
  html = html.replace(/<\/p>/gi, '</p>\n\n'); // ���落の後に2つの改行を追加
  html = html.replace(/<\/?[^>]+(\/?)>/g, function (match) {
    return match.toLowerCase(); // タグを小文字に変換
  });

  // 簡易的なMarkdown変換ロジック
  let markdown = html;
  
  // 見出しの変換
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  
  // リンクの変換
  markdown = markdown.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  
  // 画像の変換
  markdown = markdown.replace(/<img\s+[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)'); // 画像をMarkdown形式に変換
  
  // コードブロックの変換
  markdown = markdown.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```'); // コードブロックをMarkdown形式に変換
  markdown = markdown.replace(/<code>(.*?)<\/code>/gi, '`$1`'); // インラインコードをMarkdown形式に変換
  
  // 強調の変換
  markdown = markdown.replace(/<(strong|b)>(.*?)<\/\1>/gi, '**$2**');
  markdown = markdown.replace(/<(em|i)>(.*?)<\/\1>/gi, '*$2*');
  
  // リストの変換
  markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, function(match, content) {
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');
  });
  
  // 順序付きリストの変換
  markdown = markdown.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, function(match, content) {
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '1. $1\n');
  });
  
  // 残りのHTMLタグを削除
  markdown = markdown.replace(/<[^>]+>/g, '');
  
  // 特殊文字をデコード
  markdown = markdown.replace(/&nbsp;/g, ' ');
  markdown = markdown.replace(/&amp;/g, '&');
  markdown = markdown.replace(/&lt;/g, '<');
  markdown = markdown.replace(/&gt;/g, '>');
  
  // 複数の空行を1つに置換
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  
  // 前後の空白を削除
  markdown = markdown.trim();
  
  return markdown;
}
