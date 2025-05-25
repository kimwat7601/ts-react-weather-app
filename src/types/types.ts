type CurrentWeatherFetchData = {
  name: string;
  weather: Array<{
    main: string;
    description: string;
  }>;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
};

type ForecastWeatherFetchData = {
  list: ForecastHoursFetchData[];
};

type ForecastHoursFetchData = {
  main: {
    temp: number;
    // その他のプロパティ
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  pop: number;
  dt_txt: string;
};

type CurrentWeatherData = {
  city: string;
  weatherIcon: string;
  weatherText: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
};

type ForecastWeatherData = {
  time: string;
  weatherIcon: string;
  weatherText: string;
  temperature: string;
  rop: string;
};

export {
  type CurrentWeatherData,
  type CurrentWeatherFetchData,
  type ForecastWeatherData,
  type ForecastHoursFetchData,
  type ForecastWeatherFetchData,
};
