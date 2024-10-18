function getConfig() {
  const scriptProperties = PropertiesService.getScriptProperties();
  return {
    NEWSLETTER_LABEL: '中島聡', // ここで指定されたラベルが使用されます
    API_ENDPOINT: 'https://your-nextjs-app.vercel.app/api/newsletters',
    API_KEY: scriptProperties.getProperty('API_KEY')
  };
}

// この関数は初回のみ実行してAPIキーを設定します
function setApiKey() {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('API_KEY', 'your-api-key-here');
  Logger.log('API key has been set.');
}
