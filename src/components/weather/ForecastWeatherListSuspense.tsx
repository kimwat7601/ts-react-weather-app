import { type FC, useState } from 'react';
import { useForecastWeatherSuspense } from '@/hooks/UseWeatherSuspenseQuery';
import { type ForecastWeatherData } from '@/types/types';
import ForcastWeatherItem from '@/components/weather/ForcastWeatherItem';
import TabDays from '@/components/weather/TabDays';
import { calcMonthendDate } from '@/utils/utilitys';
// import LoadingBox from '@/components/common/Loading';
// import Error from '@/components/common/Error';

type ForecastWeatherSuspenseProps = {
  city: string;
};

const ForecastWeatherListSuspense: FC<ForecastWeatherSuspenseProps> = ({ city }) => {
  const { data } = useForecastWeatherSuspense(city);
  const [activeTab, setActiveTab] = useState(0);

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

  const dayTabs = showDayTabs(data);

  return (
    <section className="forecast-weather-area">
      <ul className="tab-area">
        {showDayTabs(data).map((dayNum, index) => {
          return (
            <TabDays
              dayNum={dayNum}
              isActive={index === activeTab}
              key={`day-${dayNum}`}
              onClick={() => setActiveTab(index)}
            />
          );
        })}
      </ul>
      <div className="tab-contents-wrap">
        {data.map((dayData, dayIndex) => {
          const dayNum = dayTabs[dayIndex];
          const dateKey = `day-${dayNum}`;
          return (
            <div
              className={`tab-contents ${dayIndex === activeTab ? 'tab-contents--is-active' : ''}`}
              key={dateKey}
            >
              <ul className="forecast-weather-list">
                {dayData.map((hourData, hourIndex) => {
                  const timeKey = `${dateKey}-hour-${hourIndex}`;
                  return <ForcastWeatherItem data={hourData} key={timeKey} />;
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ForecastWeatherListSuspense;
