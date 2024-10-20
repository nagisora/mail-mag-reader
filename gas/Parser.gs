function parseNewsletter(message) {
  const subject = message.getSubject();
  const body = message.getBody();
  
  Logger.log(`Parsing newsletter with subject: "${subject}"`);
  Logger.log(`Raw HTML body length: ${body.length} characters`);
  
  const markdownBody = convertHtmlToMarkdown(body);
  
  Logger.log(`Converted Markdown body length: ${markdownBody.length} characters`);
  
  return {
    title: subject,
    content: markdownBody,
    created_at: new Date().toISOString()
  };
}

function convertHtmlToMarkdown(html) {
  Logger.log('Starting HTML to Markdown conversion');
  
  // 簡易的なHTMLパーサーを作成
  var doc = XmlService.parse(html);
  var root = doc.getRootElement();
  
  // Markdownに変換
  var markdown = elementToMarkdown(root);
  
  Logger.log(`Finished HTML to Markdown conversion. Result length: ${markdown.length} characters`);
  
  return markdown;
}

function convertHtmlToMarkdown(html) {
  // 簡易的なHTMLパーサーを作成
  var doc = XmlService.parse(html);
  var root = doc.getRootElement();
  
  // Markdownに変換
  return elementToMarkdown(root);
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
