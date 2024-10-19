# Google Apps Script (GAS) プロジェクトの作成方法

このガイドでは、Google Apps Script (GAS) プロジェクトを作成する手順を説明します。

## 1. Google アカウントでログイン

1. [Google アカウント](https://accounts.google.com/)にログインします。

## 2. Google Apps Script エディタを開く

1. Google ドライブにアクセスします。
2. 左上の「新規」ボタンをクリックします。
3. 「その他」を選択し、「Google Apps Script」をクリックします。

## 3. プロジェクトの設定

1. 新しいプロジェクトが開かれます。デフォルトのプロジェクト名をクリックして、適切な名前に変更します（例: `NewsletterFetcher`）。
2. プロジェクトの説明を追加することもできます。

## 4. スクリプトの作成

1. エディタにスクリプトを追加します。以下のファイルを作成します：
   - `Code.gs`
   - `Parser.gs`
   - `Config.gs`

### 4.1 `Code.gs` の内容

```javascript
function fetchAndSaveNewsletters() {
  const config = getConfig();
  const label = GmailApp.getUserLabelByName(config.NEWSLETTER_LABEL);
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
  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(newsletter),
    'headers': {
      'Authorization': 'Bearer ' + config.API_KEY
    }
  };
  
  const response = UrlFetchApp.fetch(config.API_ENDPOINT, options);
  
  if (response.getResponseCode() === 200) {
    Logger.log('Newsletter saved successfully');
  } else {
    Logger.log('Error saving newsletter: ' + response.getContentText());
  }
}

function setTrigger() {
  ScriptApp.newTrigger('fetchAndSaveNewsletters')
    .timeBased()
    .everyHours(1)
    .create();
}
```

### 4.2 `Parser.gs` の内容

```javascript
function parseNewsletter(message) {
  const subject = message.getSubject();
  const body = message.getPlainBody();
  
  return {
    title: subject,
    content: body,
    created_at: new Date().toISOString()
  };
}
```

### 4.3 `Config.gs` の内容

```javascript
function getConfig() {
  return {
    NEWSLETTER_LABEL: 'メルマガ',
    API_ENDPOINT: 'https://your-nextjs-app.vercel.app/api/newsletters',
    API_KEY: 'your-api-key-here'
  };
}
```

## 5. トリガーの設定

1. `setTrigger` 関数を一度実行して、定期実行のトリガーを設定します。
2. エディタの上部メニューから「実行」を選択し、「setTrigger」を選びます。

## 6. スクリプトの保存と実行

1. スクリプトを保存するには、左上のディスクアイコンをクリックします。
2. スクリプトを手動で実行するには、実行したい関数を選択し、上部の「実行」ボタンをクリックします。

## 7. エラーログの確認

1. スクリプトの実行中にエラーが発生した場合、エラーログを確認することができます。
2. エディタの下部にある「ログ」タブをクリックして、実行結果やエラーメッセージを確認します。

## 8. プロジェクトの共有

1. プロジェクトを他のユーザーと共有するには、右上の「共有」ボタンをクリックします。
2. 共有したいユーザーのメールアドレスを入力し、権限を設定します。

これで、Google Apps Script プロジェクトの作成が完了しました。必要に応じて、スクリプトをカスタマイズして機能を追加してください。