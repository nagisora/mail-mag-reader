function parseNewsletter(message) {
  const subject = message.getSubject();
  const htmlBody = message.getBody();
  Logger.log(`Parsing newsletter with subject: "${subject}"`);
  Logger.log(`Raw HTML body length: ${htmlBody.length} characters`);

  // HTMLからプレーンテキストを抽出
  const plainText = extractTextFromHtml(htmlBody);
  Logger.log(`Extracted plain text body length: ${plainText.length} characters`);

  // タイトルの抽出（サブジェクトを使用）
  const title = subject;

  // コンテンツの抽出（最初の1000文字を使用）
  const content = plainText.substring(0, 1000);

  // 日付の抽出（メッセージの日付を使用）
  const date = message.getDate();

  if (title && content) {
    return {
      title: title,
      content: content,
      created_at: date.toISOString()
    };
  } else {
    Logger.log('Failed to parse newsletter: missing title or content');
    return null;
  }
}

function extractTextFromHtml(html) {
  // スタイル情報を削除
  html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // スクリプトを削除
  html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // HTMLタグを削除
  let text = html.replace(/<[^>]+>/g, ' ');
  
  // 特殊文字をデコード
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  
  // 複数の空白を1つに置換
  text = text.replace(/\s+/g, ' ');
  
  // 前後の空白を削除
  text = text.trim();
  
  return text;
}

function convertHtmlToMarkdown(html) {
  Logger.log('Starting HTML to Markdown conversion');
  
  // HTMLを整形するための処理を追加
  html = html.replace(/<\s*br\s*\/?>/gi, '<br/>'); // <br>タグを整形
  html = html.replace(/<\/?[^>]+(\/?)>/g, function (match) {
    return match.toLowerCase(); // タグを小文字に変換
  });

  // XMLパースをtry-catchで囲む
  try {
    var doc = XmlService.parse(html);
    var root = doc.getRootElement();
    
    // Markdownに変換
    return elementToMarkdown(root);
  } catch (e) {
    Logger.log(`Error parsing HTML: ${e.message}`);
    return ''; // エラーが発生した場合は空の文字列を返す
  }
}

function elementToMarkdown(element) {
  var markdown = '';
  var children = element.getChildren();
  
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var tagName = child.getName().toLowerCase();
    
    switch(tagName) {
      case 'h1':
        markdown += '# ' + child.getText() + '\n\n';
        break;
      case 'h2':
        markdown += '## ' + child.getText() + '\n\n';
        break;
      case 'p':
        markdown += child.getText() + '\n\n';
        break;
      case 'a':
        var href = child.getAttribute('href');
        markdown += '[' + child.getText() + '](' + href + ')';
        break;
      case 'strong':
      case 'b':
        markdown += '**' + child.getText() + '**';
        break;
      case 'em':
      case 'i':
        markdown += '*' + child.getText() + '*';
        break;
      case 'ul':
        markdown += elementToMarkdown(child);
        break;
      case 'li':
        markdown += '- ' + child.getText() + '\n';
        break;
      default:
        markdown += elementToMarkdown(child);
    }
  }
  
  return markdown;
}
