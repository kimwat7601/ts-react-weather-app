export const env = {
  openWeatherApiKey: import.meta.env.VITE_OPEN_WEATHER_API_KEY,
  isDevelopment: import.meta.env.DEV,
  // その他の環境変数
};
// 型チェックを追加（オプション）
function validateEnv() {
  const requiredEnvVars = ['VITE_OPEN_WEATHER_API_KEY'];

  requiredEnvVars.forEach((varName) => {
    if (!import.meta.env[varName]) {
      console.warn(`環境変数 ${varName} が設定されていません`);
    }
  });
}

// 開発環境でのみ実行
if (import.meta.env.DEV) {
  validateEnv();
}
