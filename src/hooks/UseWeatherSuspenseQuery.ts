import { useSuspenseQuery } from '@tanstack/react-query';
import fetchData from '@/services/api';
import {
  type CurrentWeatherData,
  type CurrentWeatherFetchData,
  type ForecastWeatherData,
  type ForecastWeatherFetchData,
} from '@/types/types';
import setCurrentWeatherInfo from '@/processor/setCurrentWeatherData';
import { setDaysData } from '@/processor/setForecastWeatherData';

const weatherQueryKey = {
  all: ['weather'] as const,
  current: (city: string) => [...weatherQueryKey.all, 'current', city] as const,
  forecast: (city: string) => [...weatherQueryKey.all, 'forecast', city] as const,
};

const useCurrentWeatherSuspense = (city: string) => {
  return useSuspenseQuery({
    queryKey: weatherQueryKey.current(city),
    queryFn: async (): Promise<CurrentWeatherData> => {
      const currentData = await fetchData<CurrentWeatherFetchData>(
        city,
        import.meta.env['VITE_OPEN_WEATHER_API_KEY'],
        'weather'
      );
      const newWeatherData: CurrentWeatherData = currentData && setCurrentWeatherInfo(currentData);
      return newWeatherData;
    },
    // enabled: !!city.trim(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      console.log(`🔄 [Suspense] Retry attempt ${failureCount} for current weather`);
      if (error instanceof Error && error.message.includes('City not found')) {
        console.log('❌ [Suspense] City not found, no retry');
        return false;
      }
      return failureCount < 2;
    },
  });
};

const useForecastWeatherSuspense = (city: string) => {
  return useSuspenseQuery({
    queryKey: weatherQueryKey.forecast(city),
    queryFn: async (): Promise<ForecastWeatherData[][]> => {
      const forecastWeatherData = await fetchData<ForecastWeatherFetchData>(
        city,
        import.meta.env['VITE_OPEN_WEATHER_API_KEY'],
        'forecast'
      );

      const newForecastData: ForecastWeatherData[][] =
        forecastWeatherData && setDaysData(forecastWeatherData);
      return newForecastData;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      console.log(`🔄 [Suspense] Retry attempt ${failureCount} for forecast weather`);
      if (error instanceof Error && error.message.includes('City not found')) {
        console.log('❌ [Suspense] City not found, no retry');
        return false;
      }
      return failureCount < 2;
    },
  });
};

export { weatherQueryKey, useCurrentWeatherSuspense, useForecastWeatherSuspense };
