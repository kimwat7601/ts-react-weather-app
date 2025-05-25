import { type FC } from 'react';
type TabDaysProps = {
  dayNum: number;
  isActive: boolean;
  onClick: () => void;
};

const TabDays: FC<TabDaysProps> = ({ dayNum, isActive, onClick }) => {
  const tabClass = isActive ? 'tab-item tab-item--is-active' : 'tab-item';

  return (
    <li className={tabClass} onClick={onClick}>
      <span className="forecast-weather__day-num">{dayNum}</span>日
    </li>
  );
};

export default TabDays;
