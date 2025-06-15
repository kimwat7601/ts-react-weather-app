//import { describe } from 'node:test';
import type { FC } from 'react';
import LoadingBox from '@/components/common/Loading';

type WeatherLoadingType = 'current' | 'forecast' | 'general';

type WeatherLoadingProps = {
  type?: WeatherLoadingType;
  message?: string;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
};

const getLoadingConfig = (type: WeatherLoadingType) => {
  const configs = {
    current: {
      icon: '🌤️',
      defaultMessage: '現在の天気を取得中...',
      description: '最新の気象データを確認しています',
      color: '#007ACC',
    },
    forecast: {
      icon: '📅',
      defaultMessage: '予報データを読込中...',
      description: '今後数日間の天気予報を取得しています',
      color: '#4CAF50',
    },
    general: {
      icon: '⛅️',
      defaultMessage: '気象データを取得中...',
      description: 'しばらくお待ちください',
      color: '#666666',
    },
  };
  return configs[type];
};

const WeatherLoading: FC<WeatherLoadingProps> = ({
  type = 'general',
  message,
  size = 'medium',
  showIcon = true,
}) => {
  const config = getLoadingConfig(type);
  const displayMessage = message || config.defaultMessage;
  return (
    <div
      className={`weather-loading weather-loading--${type} weather-loading--${size}`}
      style={{
        padding: size === 'small' ? '15px' : size === 'large' ? '40px' : '25px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        border: `2px solid ${config.color}`,
        borderRadius: '8px',
        margin: '10px 0',
      }}
      // アクセシビリティ対応
      role="status"
      aria-live="polite"
      aria-label={displayMessage}
    >
      {/* ローディングアニメーション */}
      <div style={{ marginBottom: '15px' }}>
        <LoadingBox />
      </div>

      {/* アイコンとメッセージ */}
      {showIcon && (
        <div
          style={{
            fontSize: size === 'small' ? '24px' : size === 'large' ? '48px' : '32px',
            marginBottom: '10px',
          }}
        >
          {config.icon}
        </div>
      )}

      <div style={{ color: config.color }}>
        <p
          style={{
            margin: '0 0 5px 0',
            fontWeight: 'bold',
            fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
          }}
        >
          {displayMessage}
        </p>

        <p
          style={{
            margin: '0',
            fontSize: size === 'small' ? '12px' : '14px',
            color: '#666666',
            opacity: 0.8,
          }}
        >
          {config.description}
        </p>
      </div>

      {/* 開発環境での詳細情報 */}
      {import.meta.env.DEV && (
        <div
          style={{
            marginTop: '15px',
            padding: '8px',
            backgroundColor: 'rgba(0,0,0,0.05)',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#666666',
          }}
        >
          🔧 Dev Info: Type={type}, Size={size}
        </div>
      )}

      {/* スクリーンリーダー用のテキスト */}
      <span className="sr-only">データを読み込み中です。しばらくお待ちください。</span>
    </div>
  );
};

export default WeatherLoading;
