import { Suspense, type ReactNode, type ErrorInfo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import WeatherLoading from '@/components/common/WeatherLoading';
import WeatherErrorFallback from '@/components/common/WeatherErrorFallback';

interface WeatherSuspenseWrapperProps {
  children: ReactNode;

  // ローディング設定
  type?: 'current' | 'forecast' | 'general';
  loadingMessage?: string;
  loadingSize?: 'small' | 'medium' | 'large';
  showLoadingIcon?: boolean;

  // エラー設定
  onError?: (error: Error, errorInfo: ErrorInfo) => void;

  // カスタマイズ設定
  customFallback?: ReactNode;
  customErrorFallback?: React.ComponentType<any>;

  // デバッグ設定
  debugLabel?: string;
  enableDebugLog?: boolean;

  // エラー回復設定
  resetOnPropsChange?: boolean;
  resetTrigger?: string | number;

  // パフォーマンス設定
  // timeout?: number;
}

const WeatherSuspenseWrapper = ({
  children,
  type = 'general',
  loadingMessage,
  loadingSize = 'medium',
  showLoadingIcon = true,
  onError,
  customFallback,
  customErrorFallback: CustomErrorFallback,
  debugLabel = 'WeatherSuspenseWrapper',
  enableDebugLog = false,
  resetOnPropsChange = true,
  resetTrigger,
  //timeout, 将来的に使用する
}: WeatherSuspenseWrapperProps) => {
  // エラーハンドリング
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    const timestamp = new Date().toISOString();
    const errorId = `${debugLabel}-${Date.now()}`;

    if (enableDebugLog || import.meta.env.DEV) {
      console.group(`🚨 [${debugLabel}] Weather Error - ${timestamp}`);
      console.error('Error ID:', errorId);
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Wrapper Type:', type);
      console.error('Reset Trigger:', resetTrigger);
      console.groupEnd();
    }

    // カスタムエラーハンドラーを実行
    onError?.(error, errorInfo);

    // 本番環境でのエラー報告
    if (import.meta.env.PROD) {
      // エラー報告の処理をここに追加
    }
  };

  // リセット時の処理
  const handleReset = () => {
    if (enableDebugLog || import.meta.env.DEV) {
      console.log(`🔄 [${debugLabel}] Error boundary reset - Trigger: ${resetTrigger}`);
    }
    // 必要に応じてクリーンアップ処理
  };

  // ローディングフォールバック
  const LoadingFallback = customFallback || (
    <WeatherLoading
      type={type}
      message={loadingMessage}
      size={loadingSize}
      showIcon={showLoadingIcon}
    />
  );

  // エラーフォールバック
  const ErrorFallbackComponent = CustomErrorFallback || WeatherErrorFallback;

  // resetKeys に resetTrigger を含める
  const resetKeys =
    resetOnPropsChange && resetTrigger !== undefined
      ? [debugLabel, type, resetTrigger]
      : [debugLabel, type];

  // 🔧 デバッグログ追加
  if (enableDebugLog || import.meta.env.DEV) {
    console.log(`🔧 [${debugLabel}] Reset Keys:`, resetKeys);
  }

  return (
    // <div
    //   className={`weather-suspense-wrapper weather-suspense-wrapper--${type}`}
    //   data-debug-label={debugLabel}
    //   data-type={type}
    // >
    <>
      <ErrorBoundary
        FallbackComponent={(props) => <ErrorFallbackComponent {...props} errorType={type} />}
        onError={handleError}
        onReset={handleReset}
        resetKeys={resetKeys}
      >
        <Suspense fallback={LoadingFallback}>{children}</Suspense>
      </ErrorBoundary>

      {/* 開発環境での可視化 */}
      {import.meta.env.DEV && enableDebugLog && (
        <div
          style={{
            position: 'fixed',
            top: '5px',
            right: '5px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '3px',
            fontSize: '11px',
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        >
          🛡️ {debugLabel}
          <br />
          Trigger: ({resetTrigger})<br />
          Reset: {resetOnPropsChange ? 'On' : 'Off'}
        </div>
      )}
    </>
    // </div>
  );
};

type PresetWrapperProps = Omit<WeatherSuspenseWrapperProps, 'type'>;

// 天気アプリ特化型のプリセットラッパー
export const CurrentWeatherWrapper = ({ children, ...props }: PresetWrapperProps) => {
  return (
    <WeatherSuspenseWrapper
      type="current"
      debugLabel="CurrentWeather"
      loadingMessage="現在の天気を確認中..."
      {...props}
    >
      {children}
    </WeatherSuspenseWrapper>
  );
};

export const ForecastWeatherWrapper = ({ children, ...props }: PresetWrapperProps) => {
  return (
    <WeatherSuspenseWrapper
      type="forecast"
      debugLabel="ForecastWeather"
      loadingMessage="予報データを読み込み中..."
      {...props}
    >
      {children}
    </WeatherSuspenseWrapper>
  );
};

// 高度な使用例のためのフック
export const useWeatherErrorHandler = (debugLabel: string) => {
  return (error: Error, errorInfo: ErrorInfo) => {
    // 共通のエラーハンドリング ロジック
    const errorData = {
      timestamp: new Date().toISOString(),
      debugLabel,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    if (import.meta.env.DEV) {
      console.warn('Weather Error:', errorData);
    }

    // 本番環境での処理
    // reportError(errorData);
  };
};
export default WeatherSuspenseWrapper;
