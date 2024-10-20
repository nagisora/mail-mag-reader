function getConfig() {
  const scriptProperties = PropertiesService.getScriptProperties();
  return {
    NEWSLETTER_LABEL: '中島聡',
    API_ENDPOINT: 'https://eqtdpdpdzsbkjjrsucva.supabase.co',
    API_KEY: scriptProperties.getProperty('API_KEY')
  };
}

// この関数は初回のみ実行してAPIキーを設定します
function setApiKey() {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('API_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxdGRwZHBkenNia2pqcnN1Y3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3ODM5NTcsImV4cCI6MjA0MzM1OTk1N30.izPFj1I4_3acRWBcxzpGeG12XShkwuUZbaGEjBQWwAo');
  Logger.log('API key has been set.');
}
