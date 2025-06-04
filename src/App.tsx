import { useState, useEffect, useCallback } from 'react';
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
  const [isCurrentLoading, setIsCurrentLoading] = useState(false);
  const [isForecastLoading, setIsForecastLoading] = useState(false);
  const [currentError, setCurrentError] = useState('');
  const [forecastError, setForecastError] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const handleSearch = useCallback((inputValue: string) => {
    setSearchCity(inputValue);
  }, []);

  useEffect(() => {
    if (!searchCity.trim()) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchCurrentWeather = async () => {
      setIsCurrentLoading(true);
      setCurrentError('');
      try {
        const currentData = await fetchData<CurrentWeatherFetchData>(
          searchCity,
          import.meta.env['VITE_OPEN_WEATHER_API_KEY'],
          'weather',
          { signal: signal }
        );
        const newWeatherData: CurrentWeatherData =
          currentData && setCurrentWeatherInfo(currentData);
        setWeatherData(newWeatherData);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        if (error instanceof Error) {
          setCurrentError(error.message);
        } else {
          setCurrentError('An unknown error occurred');
        }
      } finally {
        setIsCurrentLoading(false);
      }
    };
    fetchCurrentWeather();

    return () => {
      controller.abort();
    };
  }, [searchCity]);

  useEffect(() => {
    if (!searchCity.trim()) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchForecastWeather = async () => {
      setIsForecastLoading(true);
      setForecastError('');
      try {
        const forecastWeatherdata = await fetchData<ForecastWeatherFetchData>(
          searchCity,
          import.meta.env['VITE_OPEN_WEATHER_API_KEY'],
          'forecast',
          { signal: signal }
        );
        const newForecastData: ForecastWeatherData[][] =
          forecastWeatherdata && setDaysData(forecastWeatherdata);
        setForecastData(newForecastData);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        if (error instanceof Error) {
          setForecastError(error.message);
        } else {
          setForecastError('An unknown error occurred');
        }
      } finally {
        setIsForecastLoading(false);
      }
    };
    fetchForecastWeather();
    return () => {
      controller.abort();
    };
  }, [searchCity]);

  return (
    <>
      <section className="dashboard-header">
        <SearchForm handleSearch={handleSearch} />
      </section>
      <section className="dashboard-body">
        <CurrentWeather data={weatherData} isLoading={isCurrentLoading} error={currentError} />
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
