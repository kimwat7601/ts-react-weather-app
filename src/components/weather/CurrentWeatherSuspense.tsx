import { type FC } from 'react';
import { useCurrentWeatherSuspense } from '@/hooks/UseWeatherSuspenseQuery';
// import { type CurrentWeatherData } from '@/types/types';
// import LoadingBox from '@/components/common/Loading';
// import Error from '@/components/common/Error';

type CurrentWeatherSuspenseProps = {
  city: string;
};

const CurrentWeatherSuspense: FC<CurrentWeatherSuspenseProps> = ({ city }) => {
  console.log('🎨 [CurrentWeatherSuspense] Rendering for city:', city);

  const { data } = useCurrentWeatherSuspense(city);

  console.log('🎨 [CurrentWeatherSuspense] Data received:', data);

  return (
    <section className="cur-weather-area">
      <p className="cur-weather-area__city-text">{data.city}</p>
      <div className="cur-weather-area__weather-temperature">
        <figure className="cur-weather-area__weather-icn">
          <img src="/assets/images/icn_rain.svg" alt={data.weatherText} />
        </figure>
        <p className="cur-weather-area__temperature">
          {data.temperature}
          <img src="/assets/images/icn_thermometer.svg" alt="℃" />
        </p>
      </div>
      <ul className="cur-weather-area__otherinfo-box">
        <li className="cur-weather-area__otherinfo-item">
          <img
            src="/assets/images/icn_humidity.svg"
            alt="湿度"
            className="cur-weather-area__otherinfo-icn"
          />
          <span className="cur-weather-area__otherinfo-val">
            <span className="cur-weather-area__otherinfo-num" id="cof-num">
              {data.humidity}
            </span>
            %
          </span>
        </li>
        <li className="cur-weather-area__otherinfo-item">
          <img
            src="/assets/images/icn_wind.svg"
            alt="風速"
            className="cur-weather-area__otherinfo-icn"
          />
          <span className="cur-weather-area__otherinfo-val">
            <span className="cur-weather-area__otherinfo-num" id="ws-num">
              {data.windSpeed}
            </span>
            m/s
          </span>
        </li>
        <li className="cur-weather-area__otherinfo-item">
          <img
            src="/assets/images/icn_aerovane.svg"
            alt="風向き"
            className="cur-weather-area__otherinfo-icn"
          />
          <span className="cur-weather-area__otherinfo-val cur-weather-area__otherinfo-val--wd">
            <img
              src="/assets/images/icn_direction.svg"
              className="icn-wd"
              id="icn-wd"
              alt="方向"
              style={{ transform: `rotate(${String(data.windDirection)}deg)` }}
            />
          </span>
        </li>
      </ul>
    </section>
  );
};

export default CurrentWeatherSuspense;
