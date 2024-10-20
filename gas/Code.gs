function fetchAndSaveNewsletters() {
  const config = getConfig();
  const label = GmailApp.getUserLabelByName(config.NEWSLETTER_LABEL);
  
  // ラベルが見つからない場合のエラーハンドリング
  if (!label) {
    Logger.log('Error: Label "' + config.NEWSLETTER_LABEL + '" not found.');
    return;
  }
  
  const threads = label.getThreads();
  Logger.log(`Found ${threads.length} threads with the label "${config.NEWSLETTER_LABEL}".`);
  
  for (let i = 0; i < threads.length; i++) {
    const messages = threads[i].getMessages();
    Logger.log(`Processing thread ${i + 1} of ${threads.length} with ${messages.length} messages.`);
    for (let j = 0; j < messages.length; j++) {
      const message = messages[j];
      Logger.log(`Processing message ${j + 1} of ${messages.length} in thread ${i + 1}.`);
      const newsletter = parseNewsletter(message);
      
      if (newsletter) {
        Logger.log(`Parsed newsletter: ${JSON.stringify(newsletter)}`);
        saveNewsletter(newsletter);
        message.markRead();
        threads[i].removeLabel(label);
        Logger.log(`Processed and removed label from thread ${i + 1}.`);
      } else {
        Logger.log(`Failed to parse newsletter from message ${j + 1} in thread ${i + 1}.`);
      }
    }
  }
}

function saveNewsletter(newsletter) {
  const config = getConfig();
  Logger.log("Config for API call: " + JSON.stringify(config, null, 2));

  if (!config.API_KEY) {
    Logger.log('Error: API key is not set. Please run setApiKey() function first.');
    return;
  }

  const url = `${config.API_ENDPOINT}/rest/v1/newsletters`;
  Logger.log(`Sending POST request to: ${url}`);

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(newsletter),
    'headers': {
      'Authorization': 'Bearer ' + config.API_KEY,
      'apikey': config.API_KEY,
      'Prefer': 'return=minimal'
    },
    'muteHttpExceptions': true
  };

  Logger.log(`Request options: ${JSON.stringify(options, null, 2)}`);

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  Logger.log(`Response Code: ${responseCode}`);
  Logger.log(`Response Body: ${responseBody}`);

  if (responseCode === 201) {
    Logger.log('Newsletter saved successfully');
  } else {
    Logger.log(`Error saving newsletter: ${responseCode} - ${responseBody}`);
  }
}

// setTrigger関数は変更なし
