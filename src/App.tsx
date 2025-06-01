import { useState } from 'react';
import SearchForm from '@/components/weather/SearchForm';
import CurrentWeather from '@/components/weather/CurrentWeather';
import ForecastWeatherList from '@/components/weather/ForecastWeatherList';
import fetchData from '@/services/api';
import {
  type CurrentWeatherData,
  type CurrentWeatherFetchData,
  type ForecastWeatherData,
  type ForecastWeatherFetchData,
} from '@/types/types';
import setCurrentWeatherInfo from '@/processor/setCurrentWeatherData';
import { setDaysData } from '@/processor/setForecastWeatherData';

// const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

const App = () => {
  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastWeatherData[][] | null>(null);
  const [isCureentLoading, setIsCurrentLoading] = useState(false);
  const [isForecastLoading, setIsForecastLoading] = useState(false);
  const [cureentError, setCureentError] = useState('');
  const [forecastError, setForecastError] = useState('');

  const handleSearch = async (inputValue: string) => {
    setIsCurrentLoading(true);
    // sleep(2000);
    try {
      const currentData = await fetchData<CurrentWeatherFetchData>(
        inputValue,
        import.meta.env['VITE_OPEN_WEATHER_API_KEY'],
        'weather'
      );
      const newWeatherData: CurrentWeatherData = currentData && setCurrentWeatherInfo(currentData);
      setWeatherData(newWeatherData);
      setCureentError('');
    } catch (error) {
      if (error instanceof Error) {
        setCureentError(error.message);
      } else {
        setCureentError('An unknown error occurred');
      }
    }
    setIsCurrentLoading(false);

    setIsForecastLoading(true);
    // sleep(2000);
    try {
      const forecastWeatherdata = await fetchData<ForecastWeatherFetchData>(
        inputValue,
        import.meta.env['VITE_OPEN_WEATHER_API_KEY'],
        'forecast'
      );
      const newForecastData: ForecastWeatherData[][] =
        forecastWeatherdata && setDaysData(forecastWeatherdata);
      setForecastData(newForecastData);
      setForecastError('');
    } catch (error) {
      if (error instanceof Error) {
        setForecastError(error.message);
      } else {
        setForecastError('An unknown error occurred');
      }
    }
    setIsForecastLoading(false);
  };

  return (
    <>
      <section className="dashboard-header">
        <SearchForm handleSearch={handleSearch} />
      </section>
      <section className="dashboard-body">
        <CurrentWeather data={weatherData} isLoading={isCureentLoading} error={cureentError} />
        <ForecastWeatherList
          data={forecastData}
          isLoading={isForecastLoading}
          error={forecastError}
        />
      </section>
    </>
  );
};
export default App;
