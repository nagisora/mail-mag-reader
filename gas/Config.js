function getConfig() {
  const scriptProperties = PropertiesService.getScriptProperties();
  return {
    NEWSLETTER_LABEL: '中島聡',
    API_ENDPOINT: scriptProperties.getProperty('API_ENDPOINT'),
    API_KEY: scriptProperties.getProperty('API_KEY'),
    SERVICE_ROLE_KEY: scriptProperties.getProperty('SERVICE_ROLE_KEY')
  };
}

// この関数は初回のみ実行して設定を行います
function setInitialConfig() {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperties({
    'API_ENDPOINT': 'your-api-endpoint-here',
    'API_KEY': 'your-api-key-here',
    'SERVICE_ROLE_KEY': 'your-service-role-key-here'
  });
  Logger.log('Initial configuration has been set.');
}

// 新しく追加する関数
function setServiceRoleKey() {
  const scriptProperties = PropertiesService.getScriptProperties();
  // ここに実際のサービスロールキーを設定してください
  scriptProperties.setProperty('SERVICE_ROLE_KEY', 'your-actual-service-role-key-here');
  Logger.log('Service Role Key has been set.');
}
