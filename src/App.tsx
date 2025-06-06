import { useState, useCallback } from 'react';
import SearchForm from '@/components/weather/SearchForm';
import CurrentWeather from '@/components/weather/CurrentWeather';
import ForecastWeatherList from '@/components/weather/ForecastWeatherList';
import { useWeatherData } from '@/hooks/useWeatherQuery';

// const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

const App = () => {
  const [searchCity, setSearchCity] = useState('');

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
      </section>
      <section className="dashboard-body">
        <CurrentWeather
          data={currentWeatherData}
          isLoading={isCurrentLoading}
          error={currentError?.message || ''}
        />
        <ForecastWeatherList
          data={forecastWeatherData}
          isLoading={isForecastLoading}
          error={forecastError?.message || ''}
        />
      </section>
    </>
  );
};
export default App;
