const mapWeatherCodeToIconPath = (type: string): string => {
  const path = '/assets/images/';
  let icon = 'icn_sunny.svg'; //デフォルトアイコン
  switch (type) {
    case 'Clear':
      icon = 'icn_sunny.svg';
      break;
    case 'Clouds':
      icon = 'icn_cloudy.svg';
      break;
    case 'Rain':
    case 'Drizzle':
      icon = 'icn_rain.svg';
      break;
    case 'Thunderstorm':
      icon = 'icn_thunder.svg';
      break;
    case 'Snow':
      icon = 'icn_snow.svg';
      break;
  }
  return path + icon;
};

/*
 * 月末の日を返すユーティリティ関数
 **/
const calcMonthendDate = (currentDate: Date): number => {
  const newDate = new Date(currentDate);
  newDate.setMonth(newDate.getMonth() + 1, 0);
  return newDate.getDate();
};

export { mapWeatherCodeToIconPath, calcMonthendDate };
