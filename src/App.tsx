import { useState, useCallback } from 'react';
import SearchForm from '@/components/weather/SearchForm';

// 🎯 Phase 4: Suspense版のみ使用
import CurrentWeatherSuspense from '@/components/weather/CurrentWeatherSuspense';
import ForecastWeatherListSuspense from '@/components/weather/ForecastWeatherListSuspense';

// 統合ラッパー
import {
  CurrentWeatherWrapper,
  ForecastWeatherWrapper,
  useWeatherErrorHandler,
} from '@/components/common/WeatherSuspenseWrapper';

// 🆕 Phase 4: 本番運用機能
import { useAppAnalytics } from '@/hooks/useAppAnalytics';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import WeatherAppHeader from '@/components/layout/WeatherAppHeader';
import WeatherAppFooter from '@/components/layout/WeatherAppFooter';

// const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

const App = () => {
  const [searchCity, setSearchCity] = useState('');

  // 🆕 Phase 4: アナリティクスとパフォーマンス監視
  const { trackSearch, trackError } = useAppAnalytics();
  const { measurePerformance } = usePerformanceMonitor();

  // 🆕 Phase 4: 統合エラーハンドラー
  const handleWeatherError = useWeatherErrorHandler('weatherApp');

  const handleSearch = useCallback(
    (inputValue: string) => {
      measurePerformance('search', () => {
        console.log('🔍 [Final App] Search triggered:', inputValue);
        setSearchCity(inputValue);

        // アナリティクス追跡
        trackSearch(inputValue);
      });
    },
    [trackSearch, measurePerformance]
  );

  // 🆕 Phase 4: エラー追跡機能付きハンドラー
  const handleAppError = useCallback(
    (error: Error, errorInfo: any) => {
      handleWeatherError(error, errorInfo);
      trackError(error, { searchCity, timestamp: Date.now() });
    },
    [handleWeatherError, trackError, searchCity]
  );

  return (
    <div className="weather-app">
      {/* 🆕 Phase 4: アプリケーションヘッダー */}
      <WeatherAppHeader />

      <main className="weather-app__content">
        <section className="dashboard-header">
          <SearchForm handleSearch={handleSearch} />

          {/* 🆕 Phase 4: アプリ情報パネル */}
          <div
            style={{
              padding: '20px',
              backgroundColor: '#e8f5e8',
              border: '2px solid #4caf50',
              color: 'black',
              margin: '10px 0',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <h2 style={{ margin: '0 0 10px 0', color: '#2E7D32' }}>🌤️ Modern Weather App</h2>
            <p style={{ margin: '0', color: '#388E3C' }}>
              <strong>✨ Powered by React Suspense + ErrorBoundary</strong>
            </p>
            <small style={{ color: '#66bb6a' }}>
              宣言的UI • 型安全 • 自動エラー回復 • パフォーマンス監視
            </small>
          </div>
        </section>

        <section className="dashboard-body">
          {searchCity ? (
            <>
              {/* 🎯 Phase 4: 完全にSuspense版のみ */}
              <CurrentWeatherWrapper
                resetTrigger={searchCity}
                onError={handleAppError}
                enableDebugLog={import.meta.env.DEV}
              >
                <CurrentWeatherSuspense city={searchCity} />
              </CurrentWeatherWrapper>

              <ForecastWeatherWrapper
                resetTrigger={searchCity}
                onError={handleAppError}
                enableDebugLog={import.meta.env.DEV}
              >
                <ForecastWeatherListSuspense city={searchCity} />
              </ForecastWeatherWrapper>
            </>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                color: 'black',
                margin: '20px 0',
              }}
            >
              <div style={{ fontSize: '72px', marginBottom: '20px' }}>🌍</div>
              <h2 style={{ color: '#333', marginBottom: '20px' }}>世界の天気を検索</h2>
              <p
                style={{
                  fontSize: '18px',
                  color: '#666',
                  marginBottom: '30px',
                  lineHeight: 1.6,
                }}
              >
                都市名を入力して、現在の天気と予報を確認しましょう
              </p>

              {/* 🆕 Phase 4: 検索例の提示 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                  marginBottom: '20px',
                }}
              >
                {['Tokyo', 'New York', 'London', 'Paris', 'Sydney'].map((city) => (
                  <button
                    key={city}
                    onClick={() => handleSearch(city)}
                    style={{
                      background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>

              <small style={{ color: '#999' }}>
                💡 上記の都市名をクリックするか、検索ボックスに都市名を入力してください
              </small>
            </div>
          )}
        </section>
      </main>

      {/* 🆕 Phase 4: アプリケーションフッター */}
      <WeatherAppFooter />

      {/* 🆕 Phase 4: 開発環境専用パネル */}
      {import.meta.env.DEV && (
        <div
          style={{
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 9999,
            maxWidth: '250px',
          }}
        >
          <strong>🔧 Development Mode</strong>
          <br />
          App: Phase 4 (Final)
          <br />
          Search: {searchCity || 'None'}
          <br />
          Suspense: Active
          <br />
          Error Recovery: Enabled
        </div>
      )}
    </div>
  );
};
export default App;
