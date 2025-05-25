import { type CurrentWeatherData, type CurrentWeatherFetchData } from '@/types/types';
import { mapWeatherCodeToIconPath } from '@/utils/utilitys';

const setCurrentWeatherInfo = (data: CurrentWeatherFetchData): CurrentWeatherData => {
  const infoObj = {
    city: data.name,
    weatherIcon: mapWeatherCodeToIconPath(data.weather[0].main),
    weatherText: data.weather[0].description,
    temperature: Math.round(data.main.temp),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    windDirection: data.wind.deg,
  };
  return infoObj;
};

export default setCurrentWeatherInfo;
