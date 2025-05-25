import { type FC } from 'react';
import { type ForecastWeatherData } from '@/types/types';

type ForcastWeatherItemProps = {
  data: ForecastWeatherData;
};

const ForcastWeatherItem: FC<ForcastWeatherItemProps> = ({ data }) => {
  return (
    <li className="forecast-weather-list__item">
      <span className="forecast-weather-list__time">{data.time}</span>
      <span className="forecast-weather-list__weather">
        <img src={data.weatherIcon} alt="sunny" />
        <span className="forecast-weather-list__weather-text">{data.weatherText}</span>
      </span>
      <span className="forecast-weather-list__temp">
        <img src="/assets/images/icn_thermometer_sml.svg" alt="気温" />
        {data.temperature}
      </span>
      <span className="forecast-weather-list__cor">
        <img src="/assets/images/icn_drop.svg" alt="降水確率" />
        {data.rop}
      </span>
    </li>
  );
};

export default ForcastWeatherItem;
