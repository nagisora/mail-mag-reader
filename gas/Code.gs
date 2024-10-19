function fetchAndSaveNewsletters() {
  const config = getConfig();
  const label = GmailApp.getUserLabelByName(config.NEWSLETTER_LABEL);
  
  // ラベルが見つからない場合のエラーハンドリング
  if (!label) {
    Logger.log('Error: Label "' + config.NEWSLETTER_LABEL + '" not found.');
    return;
  }
  
  const threads = label.getThreads();
  
  for (let i = 0; i < threads.length; i++) {
    const messages = threads[i].getMessages();
    for (let j = 0; j < messages.length; j++) {
      const message = messages[j];
      const newsletter = parseNewsletter(message);
      
      if (newsletter) {
        saveNewsletter(newsletter);
        message.markRead();
        threads[i].removeLabel(label);
      }
    }
  }
}

function saveNewsletter(newsletter) {
  const config = getConfig();
  Logger.log("Config: " + JSON.stringify(config)); 

  if (!config.API_KEY) {
    Logger.log('Error: API key is not set. Please run setApiKey() function first.');
    return;
  }

  // Supabase REST APIのエンドポイントを使用
  const url = `${config.API_ENDPOINT}/rest/v1/newsletters`;

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(newsletter),
    'headers': {
      'Authorization': 'Bearer ' + config.API_KEY,
      'apikey': config.API_KEY, // Supabaseでは、apikeyヘッダーも必要です
      'Prefer': 'return=minimal' // 応答のサイズを最小限に抑えます
    },
    'muteHttpExceptions': true // 完全なエラーレスポンスを取得するため
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 201) { // Supabaseは成功時に201を返します
    Logger.log('Newsletter saved successfully');
  } else {
    Logger.log(`Error saving newsletter: ${responseCode} - ${responseBody}`);
  }
}

function setTrigger() {
  ScriptApp.newTrigger('fetchAndSaveNewsletters')
    .timeBased()
    .everyHours(1)
    .create();
}
