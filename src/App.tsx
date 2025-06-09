import { useState, useCallback } from 'react';
import SearchForm from '@/components/weather/SearchForm';
import CurrentWeather from '@/components/weather/CurrentWeather';
import ForecastWeatherList from '@/components/weather/ForecastWeatherList';
import { useWeatherData } from '@/hooks/UseWeatherQuery';
import WeatherErrorBoundary from '@/components/common/WeatherErrorBoundary';
import ErrorBoundaryTest from '@/components/debug/ErrorBoundaryTest'; //デバッグ用

// const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

const App = () => {
  const [searchCity, setSearchCity] = useState('');
  const [showDebugPanel, setShowDebugPanel] = useState(false); //デバッグ用

  const {
    currentWeatherData,
    isCurrentLoading,
    currentError,
    forecastWeatherData,
    isForecastLoading,
    forecastError,
  } = useWeatherData(searchCity);

  const handleSearch = useCallback((inputValue: string) => {
    console.log('🔍 [React Query App] Search triggered:', inputValue);
    setSearchCity(inputValue);
  }, []);

  return (
    <>
      <section className="dashboard-header">
        <SearchForm handleSearch={handleSearch} />
        {/* 開発環境でのみデバッグパネル表示 */}
        {import.meta.env.DEV && (
          <div className="dev-controls">
            <button onClick={() => setShowDebugPanel(!showDebugPanel)} className="debug-toggle">
              {showDebugPanel ? '🔧 デバッグパネルを隠す' : '🔧 デバッグパネルを表示'}
            </button>
          </div>
        )}
      </section>
      <section className="dashboard-body">
        <WeatherErrorBoundary>
          <CurrentWeather
            data={currentWeatherData}
            isLoading={isCurrentLoading}
            error={currentError?.message || ''}
          />
        </WeatherErrorBoundary>
        <WeatherErrorBoundary>
          <ForecastWeatherList
            data={forecastWeatherData}
            isLoading={isForecastLoading}
            error={forecastError?.message || ''}
          />
        </WeatherErrorBoundary>
      </section>
      {/* デバッグパネル（開発環境のみ） */}
      {import.meta.env.DEV && showDebugPanel && (
        <section className="debug-section">
          <WeatherErrorBoundary>
            <ErrorBoundaryTest />
          </WeatherErrorBoundary>
        </section>
      )}
    </>
  );
};
export default App;
