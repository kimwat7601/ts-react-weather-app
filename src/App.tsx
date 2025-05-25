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

const App = () => {
  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastWeatherData[][] | null>(null);

  const handleSearch = async (inputValue: string) => {
    const currentData = await fetchData<CurrentWeatherFetchData>(
      inputValue,
      import.meta.env['VITE_OPEN_WEATHER_API_KEY'],
      'weather'
    );
    const newWeatherData: CurrentWeatherData = currentData && setCurrentWeatherInfo(currentData);
    setWeatherData(newWeatherData);
    const forecastWeatherdata = await fetchData<ForecastWeatherFetchData>(
      inputValue,
      import.meta.env['VITE_OPEN_WEATHER_API_KEY'],
      'forecast'
    );
    const newForecastData: ForecastWeatherData[][] =
      forecastWeatherdata && setDaysData(forecastWeatherdata);
    setForecastData(newForecastData);
  };

  return (
    <>
      <section className="dashboard-header">
        <SearchForm handleSearch={handleSearch} />
      </section>
      <section className="dashboard-body">
        <CurrentWeather data={weatherData} />
        <ForecastWeatherList data={forecastData} />
      </section>
    </>
  );
};
export default App;
