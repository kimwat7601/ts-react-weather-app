import {
  type ForecastWeatherFetchData,
  type ForecastHoursFetchData,
  type ForecastWeatherData,
} from '@/types/types';
import { mapWeatherCodeToIconPath } from '@/utils/utilitys';

const setForecastWeatherInfo = (
  hour: number,
  data: ForecastHoursFetchData
): ForecastWeatherData => {
  const infoObj = {
    time: String(hour) + ':00',
    weatherIcon: mapWeatherCodeToIconPath(data.weather[0].main),
    weatherText: data.weather[0].description,
    temperature: String(Math.round(data.main.temp)),
    rop: String(Math.round(data.pop * 100)) + '%',
  };
  return infoObj;
};

const setDaysData = (dataObj: ForecastWeatherFetchData): ForecastWeatherData[][] => {
  const intervalHour = 3; // 何時間ごとのデータか
  const getDataTimes = 24 / intervalHour; // 1日に予報を取得する回数
  const todayDate = new Date();
  let dayDatas = [];
  const daysDatas = [];
  let dayCount = 0;
  let daysCount = 0;
  for (let i = 0; i < dataObj.list.length; i++) {
    const recentDate = new Date(dataObj.list[i].dt_txt);
    recentDate.setHours(recentDate.getHours() + 9); // 日本標準時にセットし直す
    const thisHour =
      recentDate.getHours() >= 24 ? recentDate.getHours() - 24 : recentDate.getHours();
    const dayObj = setForecastWeatherInfo(thisHour, dataObj.list[i]);
    // console.log('today: ' + todayDate.getDate() + ', ' + 'recent: ' + recentDate.getDate());
    if (todayDate.getDate() !== recentDate.getDate()) {
      dayDatas[dayCount] = dayObj;
      dayCount++;
      if (dayCount % getDataTimes === 0 || i === dataObj.list.length - 1) {
        daysDatas[daysCount] = dayDatas;
        dayDatas = [];
        dayCount = 0;
        daysCount++;
      }
    }
  }
  return daysDatas;
};

export { setForecastWeatherInfo, setDaysData };
