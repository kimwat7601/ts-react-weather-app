import { StrictMode, version } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import App from '@/App.tsx';

// 🆕 Phase 4: グローバルエラーフォールバック
const GlobalErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>😵</div>
        <h1 style={{ color: '#d32f2f', marginBottom: '16px' }}>アプリケーションエラー</h1>
        <p style={{ color: '#666', marginBottom: '24px', lineHeight: 1.6 }}>
          申し訳ございません。予期しないエラーが発生しました。
          <br />
          ページを再読み込みするか、しばらく時間をおいてから再度お試しください。
        </p>

        {/* エラー詳細（開発環境のみ） */}
        {import.meta.env.DEV && (
          <details
            style={{
              marginBottom: '20px',
              padding: '12px',
              backgroundColor: '#f5f5f5',
              color: '#333',
              borderRadius: '4px',
              textAlign: 'left',
            }}
          >
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              🔧 エラー詳細（開発環境）
            </summary>
            <pre
              style={{
                marginTop: '10px',
                fontSize: '12px',
                overflow: 'auto',
                maxHeight: '200px',
              }}
            >
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={resetErrorBoundary}
            style={{
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            🔄 再試行
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#757575',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            🔄 ページ再読み込み
          </button>
        </div>
      </div>
    </div>
  );
};

// 🎯 パフォーマンス監視（非Hook版）
const monitorCoreWebVitals = () => {
  // Largest Contentful Paint (LCP)
  const observeLCP = () => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      if (import.meta.env.DEV) {
        console.log(`📊 [Core Web Vitals] LCP: ${lastEntry.startTime.toFixed(2)}ms`);
      }

      // 2.5秒以上は改善が必要
      if (lastEntry.startTime > 2500) {
        console.warn(`⚠️ [Core Web Vitals] Poor LCP: ${lastEntry.startTime.toFixed(2)}ms`);
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch {
      console.warn('LCP monitoring not supported');
    }
  };

  // Cumulative Layout Shift (CLS)
  const observeCLS = () => {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }

      if (import.meta.env.DEV) {
        console.log(`📊 [Core Web Vitals] CLS: ${clsValue.toFixed(4)}`);
      }

      // 0.1以上は改善が必要
      if (clsValue > 0.1) {
        console.warn(`⚠️ [Core Web Vitals] Poor CLS: ${clsValue.toFixed(4)}`);
      }
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch {
      console.warn('CLS monitoring not supported');
    }
  };

  // First Input Delay (FID)
  const observeFID = () => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0];

      if (import.meta.env.DEV) {
        console.log(
          `📊 [Core Web Vitals] FID: ${(firstEntry as any).processingStart - firstEntry.startTime}ms`
        );
      }

      const fid = (firstEntry as any).processingStart - firstEntry.startTime;

      // 100ms以上は改善が必要
      if (fid > 100) {
        console.warn(`⚠️ [Core Web Vitals] Poor FID: ${fid}ms`);
      }
    });

    try {
      observer.observe({ entryTypes: ['first-input'] });
    } catch {
      console.warn('FID monitoring not supported');
    }
  };

  // 監視開始
  try {
    observeLCP();
    observeCLS();
    observeFID();
  } catch (error) {
    console.warn('Core Web Vitals monitoring not supported:', error);
  }
};

// const queryClient = new QueryClient();

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // キャッシュ戦略最適化
        staleTime: 5 * 60 * 1000, // 5分間はデータを新鮮とみなす
        gcTime: 10 * 60 * 1000, // 10分間キャッシュを保持

        // エラーハンドリング最適化
        retry: (failureCount, error) => {
          // 特定のエラーは再試行しない
          if (error instanceof Error) {
            if (error.message.includes('City not found') || error.message.includes('404')) {
              return false;
            }
          }

          // 最大3回まで再試行（指数バックオフ）
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // ネットワーク状態に応じた設定
        networkMode: 'online',

        // バックグラウンド更新設定
        refetchOnWindowFocus: false,
        refetchOnReconnect: 'always',
        refetchOnMount: true,
      },
      mutations: {
        // ミューテーション用の設定
        retry: 2,
        networkMode: 'online',
      },
    },
  });
};

// 🆕 Phase 4: パフォーマンス監視付きアプリ初期化
const initializeApp = () => {
  const queryClient = createQueryClient();

  // Core Web Vitals監視開始（非Hook版）
  if ('PerformanceObserver' in window) {
    setTimeout(monitorCoreWebVitals, 1000); // 1秒後に監視開始
  }

  // グローバルエラーハンドリング
  window.addEventListener('error', (event) => {
    console.error('🚨 [Global] Uncaught Error:', event.error);

    // 本番環境ではエラー監視サービスに送信
    if (import.meta.env.PROD) {
      // Sentry.captureException(event.error);
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 [Global] Unhandled Promise Rejection:', event.reason);

    // 本番環境ではエラー監視サービスに送信
    if (import.meta.env.PROD) {
      // Sentry.captureException(event.reason);
    }
  });

  return queryClient;
};

// 🎯 Phase 4: アプリケーション起動
const queryClient = initializeApp();

// Root要素の取得と型安全性確保
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Please check your HTML file.');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    {/* 🛡️ Phase 4: グローバルErrorBoundary */}
    <ErrorBoundary
      FallbackComponent={GlobalErrorFallback}
      onError={(error, errorInfo) => {
        console.log('🚨 [Global ErrorBoundary] App-level error:', error);
        console.log('🚨 [Global ErrorBoundary] Error info:', errorInfo);

        // 本番環境でのエラー報告
        if (import.meta.env.PROD) {
          // sendGlobalErrorReport(error, errorInfo);
        }
      }}
    >
      <QueryClientProvider client={queryClient}>
        <App />
        {/* 🔧 React Query DevTools（開発環境のみ） */}
        {import.meta.env.DEV && (
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);

// 🆕 Phase 4: アプリケーション情報をコンソールに出力
if (import.meta.env.DEV) {
  console.log(`
    🚀 Weather App - Phase 4 (Final) Loaded!

    📊 Configuration:
    • React: ${version}
    • TypeScript: Enabled
    • Suspense: Global
    • Error Recovery: Enabled
    • Performance Monitoring: Active
    • Hot Reload: Active

    🛠️ Development Tools:
    • React DevTools: Available
    • React Query DevTools: Available
    • Console Logging: Enabled

    🎯 Ready for production deployment!
  `);
} else {
  console.log('🌤️ Weather App loaded successfully!');
}
