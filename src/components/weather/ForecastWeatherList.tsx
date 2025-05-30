import { type FC, useState } from 'react';
import ForcastWeatherItem from '@/components/weather/ForcastWeatherItem';
import { type ForecastWeatherData } from '@/types/types';
import TabDays from '@/components/weather/TabDays';
import { calcMonthendDate } from '@/utils/utilitys';
import LoadingBox from '@/components/common/Loading';

type ForecastWeatherProps = {
  data: ForecastWeatherData[][] | null;
  isLoading: boolean;
};

const ForecastWeatherList: FC<ForecastWeatherProps> = ({ data, isLoading }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!data) {
    return (
      <section className="forecast-weather-area empty">
        <p className="forecast-weather-texxt">都市名を検索して天気を表示します</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="cur-weather-area">
        <LoadingBox />
      </section>
    );
  }

  const showDayTabs = (data: ForecastWeatherData[][]) => {
    // console.log('data:', data);
    const today = new Date();
    const endMonthDate = calcMonthendDate(today);
    const todayDate = today.getDate();
    const days = [] as number[];
    for (let i = 1; i <= data.length; i++) {
      const day = endMonthDate >= todayDate + i ? todayDate + i : todayDate + i - endMonthDate;
      days.push(day);
    }
    return days;
  };

  return (
    <section className="forecast-weather-area">
      <ul className="tab-area">
        {showDayTabs(data).map((dayNum, index) => {
          return (
            <TabDays
              dayNum={dayNum}
              isActive={index === activeTab}
              key={index}
              onClick={() => setActiveTab(index)}
            />
          );
        })}
      </ul>
      <div className="tab-contents-wrap">
        {data.map((dayData, index) => {
          return (
            <div
              className={`tab-contents ${index === activeTab ? 'tab-contents--is-active' : ''}`}
              key={index}
            >
              <ul className="forecast-weather-list">
                {dayData.map((hourData, index) => {
                  return <ForcastWeatherItem data={hourData} key={index} />;
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ForecastWeatherList;
