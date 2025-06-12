import type { FC } from 'react';
import type { FallbackProps } from 'react-error-boundary';

type ErrorType = 'network' | 'api' | 'city-not-found' | 'rate-limit' | 'server' | 'unknown';

type ErrorAnalysis = {
  type: ErrorType;
  title: string;
  message: string;
  action: string;
  icon: string;
  color: string;
  canRetry: boolean;
  userFriendly: boolean;
};

const analyzeError = (error: Error): ErrorAnalysis => {
  const message = error.message.toLowerCase();

  if (message.includes('city not found') || message.includes('404')) {
    return {
      type: 'city-not-found',
      title: '都市が見つかりませんでした',
      message: '入力された都市名を確認してください。英語での都市名入力をお試しください。',
      action: '別の都市名で検索',
      icon: '🗺️',
      color: '#FF6B6B',
      canRetry: false,
      userFriendly: true,
    };
  }

  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return {
      type: 'network',
      title: 'インターネット接続エラー',
      message: 'ネットワーク接続を確認してください。Wi-Fiやモバイルデータ接続をご確認ください。',
      action: '接続を確認して再試行',
      icon: '📡',
      color: '#FFA726',
      canRetry: true,
      userFriendly: true,
    };
  }

  if (message.includes('rate limit') || message.includes('429')) {
    return {
      type: 'rate-limit',
      title: 'アクセス制限中',
      message: 'しばらく時間をおいてから再度お試しください。',
      action: '時間をおいて再試行',
      icon: '⏰',
      color: '#FF9800',
      canRetry: true,
      userFriendly: true,
    };
  }

  if (message.includes('500') || message.includes('server') || message.includes('service')) {
    return {
      type: 'server',
      title: 'サーバーエラー',
      message: '気象データサービスに一時的な問題が発生しています。',
      action: 'しばらく待って再試行',
      icon: '🔧',
      color: '#F44336',
      canRetry: true,
      userFriendly: true,
    };
  }

  if (message.includes('api') || message.includes('key') || message.includes('unauthorized')) {
    return {
      type: 'api',
      title: 'API接続エラー',
      message: '気象データサービスとの接続に問題があります。',
      action: '再試行',
      icon: '🔑',
      color: '#E91E63',
      canRetry: true,
      userFriendly: false,
    };
  }

  return {
    type: 'unknown',
    title: '予期しないエラー',
    message: '申し訳ございません。予期しない問題が発生しました。',
    action: '再試行',
    icon: '❓',
    color: '#9C27B0',
    canRetry: true,
    userFriendly: false,
  };
};

interface WeatherErrorFallbackProps extends FallbackProps {
  errorType?: 'current' | 'forecast' | 'general';
}

const WeatherErrorFallback: FC<WeatherErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  errorType = 'general',
}) => {
  const analysis = analyzeError(error);
  return (
    <div
      className={`weather-error-fallback weather-error-fallback--${errorType}`}
      style={{
        padding: '30px',
        backgroundColor: '#fff5f5',
        border: `2px solid ${analysis.color}`,
        borderRadius: '8px',
        textAlign: 'center',
        margin: '10px 0',
      }}
      // アクセシビリティ対応
      role="alert"
      aria-live="assertive"
    >
      {/* エラーアイコン */}
      <div style={{ fontSize: '48px', marginBottom: '15px' }}>{analysis.icon}</div>

      {/* エラータイトル */}
      <h3
        style={{
          color: analysis.color,
          margin: '0 0 15px 0',
          fontSize: '20px',
        }}
      >
        {analysis.title}
      </h3>

      {/* ユーザーフレンドリーなメッセージ */}
      <p
        style={{
          color: '#333333',
          margin: '0 0 20px 0',
          lineHeight: 1.6,
          fontSize: '16px',
        }}
      >
        {analysis.message}
      </p>

      {/* アクションボタン */}
      {analysis.canRetry && resetErrorBoundary && (
        <button
          onClick={resetErrorBoundary}
          style={{
            backgroundColor: analysis.color,
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '15px',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          🔄 {analysis.action}
        </button>
      )}

      {/* トラブルシューティングヒント */}
      {analysis.userFriendly && (
        <div
          style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '4px',
            marginTop: '15px',
            fontSize: '14px',
            color: '#666',
          }}
        >
          <strong>💡 ヒント:</strong>
          {analysis.type === 'city-not-found' && (
            <ul style={{ textAlign: 'left', margin: '10px 0', paddingLeft: '20px' }}>
              <li>都市名を英語で入力してみてください（例：Tokyo, Osaka, Kyoto）</li>
              <li>スペルが正しいか確認してください</li>
              <li>大きな都市名で試してみてください</li>
            </ul>
          )}
          {analysis.type === 'network' && (
            <ul style={{ textAlign: 'left', margin: '10px 0', paddingLeft: '20px' }}>
              <li>Wi-Fiまたはモバイルデータ接続を確認</li>
              <li>他のウェブサイトにアクセスできるか確認</li>
              <li>VPNを使用している場合は一時的に無効にしてみてください</li>
            </ul>
          )}
        </div>
      )}

      {/* 開発環境での詳細情報 */}
      {import.meta.env.DEV && (
        <details
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: 'rgba(0,0,0,0.05)',
            color: '#333',
            borderRadius: '4px',
            fontSize: '12px',
            textAlign: 'left',
          }}
        >
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>🔧 開発者情報</summary>
          <div style={{ marginTop: '10px' }}>
            <p>
              <strong>Error Type:</strong> {analysis.type}
            </p>
            <p>
              <strong>Error Message:</strong> {error.message}
            </p>
            <p>
              <strong>Error Stack:</strong>
            </p>
            <pre
              style={{
                fontSize: '11px',
                overflow: 'auto',
                maxHeight: '100px',
                backgroundColor: '#fff',
                padding: '5px',
                borderRadius: '2px',
              }}
            >
              {error.stack}
            </pre>
          </div>
        </details>
      )}
    </div>
  );
};

export default WeatherErrorFallback;
