import { useState, useCallback, Suspense } from 'react';
import SearchForm from '@/components/weather/SearchForm';

// 従来版コンポーネント
import CurrentWeather from '@/components/weather/CurrentWeather';
import ForecastWeatherList from '@/components/weather/ForecastWeatherList';
import { useWeatherData } from '@/hooks/UseWeatherQuery';

// 🆕 Suspense版コンポーネント
import CurrentWeatherSuspense from '@/components/weather/CurrentWeatherSuspense';
import ForecastWeatherListSuspense from '@/components/weather/ForecastWeatherListSuspense';

import WeatherErrorBoundary from '@/components/common/WeatherErrorBoundary';
import LoadingBox from '@/components/common/Loading';

// const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

const App = () => {
  const [searchCity, setSearchCity] = useState('');
  const [useSuspenseMode, setUseSuspenseMode] = useState(false);

  const {
    currentWeatherData,
    isCurrentLoading,
    currentError,
    forecastWeatherData,
    isForecastLoading,
    forecastError,
  } = useWeatherData(searchCity);

  const handleSearch = useCallback(
    (inputValue: string) => {
      const mode = useSuspenseMode ? 'Suspense' : 'Traditional';
      console.log(`🔍 [${mode} Mode] Search triggered:`, inputValue);
      setSearchCity(inputValue);
    },
    [useSuspenseMode]
  );

  return (
    <>
      <section className="dashboard-header">
        <SearchForm handleSearch={handleSearch} />
        {/* Phase 2: モード切り替えボタン */}
        <div
          style={{
            padding: '15px',
            color: 'black',
            backgroundColor: useSuspenseMode ? '#e8f5e8' : '#f0f8ff',
            border: `2px solid ${useSuspenseMode ? '#4caf50' : '#007acc'}`,
            margin: '10px 0',
            borderRadius: '8px',
          }}
        >
          <div style={{ marginBottom: '10px' }}>
            <strong>現在のモード: </strong>
            <span
              style={{
                color: useSuspenseMode ? '#4caf50' : '#007acc',
                fontWeight: 'bold',
              }}
            >
              {useSuspenseMode ? '🆕 Suspense モード' : '📱 従来モード'}
            </span>
          </div>

          <button
            onClick={() => setUseSuspenseMode(!useSuspenseMode)}
            style={{
              backgroundColor: useSuspenseMode ? '#4caf50' : '#007acc',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {useSuspenseMode ? '📱 従来モードに切り替え' : '🆕 Suspenseモードを試す'}
          </button>

          {/* 説明テキスト */}
          <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
            {useSuspenseMode ? (
              <>
                <strong>🆕 Suspense モード:</strong>
                ローディング/エラー処理が宣言的に管理されます。
                コンポーネントはデータ表示のみに集中します。
              </>
            ) : (
              <>
                <strong>📱 従来モード:</strong>
                各コンポーネントで個別にローディング/エラー処理を行います。
                if文による条件分岐が必要です。
              </>
            )}
          </p>
        </div>
      </section>
      <section className="dashboard-body">
        {useSuspenseMode ? (
          <>
            {searchCity ? (
              <>
                <WeatherErrorBoundary debugLabel="CurrentWeather-Suspense">
                  <Suspense
                    fallback={
                      <section className="cur-weather-area">
                        <LoadingBox />
                        <p style={{ textAlign: 'center', marginTop: '10px' }}>
                          🌤️ 現在の天気を取得中...
                        </p>
                      </section>
                    }
                  >
                    <CurrentWeatherSuspense city={searchCity} />
                  </Suspense>
                </WeatherErrorBoundary>
                <WeatherErrorBoundary debugLabel="ForecastWeather-Suspense">
                  <Suspense
                    fallback={
                      <section className="forecast-weather-area">
                        <LoadingBox />
                        <p style={{ textAlign: 'center', marginTop: '10px' }}>
                          📅 予報データを取得中...
                        </p>
                      </section>
                    }
                  >
                    <ForecastWeatherListSuspense city={searchCity} />
                  </Suspense>
                </WeatherErrorBoundary>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <h2>🌤️ Suspense版 天気アプリ</h2>
                <p>都市名を検索して天気情報を表示します</p>
              </div>
            )}
          </>
        ) : (
          <>
            <WeatherErrorBoundary debugLabel="CurrentWeather-Traditional">
              <CurrentWeather
                data={currentWeatherData}
                isLoading={isCurrentLoading}
                error={currentError?.message || ''}
              />
            </WeatherErrorBoundary>
            <WeatherErrorBoundary debugLabel="ForecastWeather-Traditional">
              <ForecastWeatherList
                data={forecastWeatherData}
                isLoading={isForecastLoading}
                error={forecastError?.message || ''}
              />
            </WeatherErrorBoundary>
          </>
        )}
      </section>
    </>
  );
};
export default App;
