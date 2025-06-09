import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import type { FC, ReactNode } from 'react';
import type { ErrorInfo } from 'react';

const WeatherErrorFallback: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    // <section className="forecast-weather-area">
    //     <div className="error-message-box">
    //         <div className="error-message">{error.message}</div>
    //     </div>
    // </section>
    <section className="forecast-weather-area">
      <div
        className="error-message-box"
        style={{
          padding: '20px',
          backgroundColor: '#ffe6e6',
          border: '2px solid #ff4757',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <h3 style={{ color: '#ff4757', margin: '0 0 10px 0' }}>⚠️ エラーが発生しました</h3>
        <div
          className="error-message"
          style={{
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '4px',
            margin: '10px 0',
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#333',
          }}
        >
          {error.message}
        </div>

        {/* 再試行ボタンを追加 */}
        {resetErrorBoundary && (
          <button
            onClick={resetErrorBoundary}
            style={{
              backgroundColor: '#5352ed',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '10px',
            }}
          >
            🔄 再試行
          </button>
        )}
      </div>
    </section>
  );
};

type WeatherErrorBoundaryProps = {
  children: ReactNode;
  fallback?: React.ComponentType<FallbackProps>;
};

const WeatherErrorBoundary: FC<WeatherErrorBoundaryProps> = ({
  children,
  fallback: Fallback = WeatherErrorFallback,
}) => {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    if (import.meta.env.DEV) {
      console.group('🚨 Weather App Error');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  };

  return (
    <ErrorBoundary FallbackComponent={Fallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};

export default WeatherErrorBoundary;
