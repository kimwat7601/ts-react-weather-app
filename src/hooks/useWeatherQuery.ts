import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
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

const useCurrentWeather = (city: string) => {
  const query = useQuery({
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
    enabled: !!city.trim(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('City not found')) {
        return false;
      }
      return failureCount < 3;
    },
  });
  useEffect(() => {
    if (query.isError && query.error) {
      console.log('❌ [React Query] Current weather error:', city, query.error);
    }
  }, [query.isError, query.error, city]);
  return query;
};

const useForecastWeather = (city: string) => {
  const query = useQuery({
    queryKey: weatherQueryKey.forecast(city),
    queryFn: async (): Promise<ForecastWeatherData[][]> => {
      const forecastWeatherdata = await fetchData<ForecastWeatherFetchData>(
        city,
        import.meta.env['VITE_OPEN_WEATHER_API_KEY'],
        'forecast'
      );
      const newForecastData: ForecastWeatherData[][] =
        forecastWeatherdata && setDaysData(forecastWeatherdata);
      return newForecastData;
    },
    enabled: !!city.trim(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('City not found')) {
        return false;
      }
      return failureCount < 3;
    },
  });
  useEffect(() => {
    if (query.isError && query.error) {
      console.log('❌ [React Query] Forecast weather error:', city, query.error);
    }
  }, [query.isError, query.error, city]);
  return query;
};

const useWeatherData = (city: string) => {
  const currentWeather = useCurrentWeather(city);
  const forecastWeather = useForecastWeather(city);
  return {
    currentWeather: currentWeather.data,
    isCurrenttLoading: currentWeather.isLoading,
    currentError: currentWeather.error,

    forecastWeather: forecastWeather.data,
    isForecastLoading: forecastWeather.isLoading,
    forecastError: forecastWeather.error,

    isAnyLoading: currentWeather.isLoading || forecastWeather.isLoading,
    hasAnyError: currentWeather.isError || forecastWeather.isError,

    refetchCurrent: currentWeather.refetch,
    refetchForecast: forecastWeather.refetch,
    refetchAll: () => {
      currentWeather.refetch();
      forecastWeather.refetch();
    },

    currentStatus: currentWeather.status, // 'loading' | 'error' | 'success'
    forecastStatus: forecastWeather.status,
    isFetching: currentWeather.isFetching || forecastWeather.isFetching,
  };
};

export { useCurrentWeather, useForecastWeather, useWeatherData };
