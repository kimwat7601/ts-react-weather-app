import { useCallback } from 'react';

interface AnalyticsEvent {
  event: string;
  category: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

interface SearchEvent {
  searchTerm: string;
  timestamp: number;
  sessionId: string;
}

interface ErrorEvent {
  error: string;
  context?: Record<string, unknown>;
  timestamp: number;
  sessionId: string;
}

export const useAppAnalytics = () => {
  // セッションID生成（簡易版）
  const getSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}}`;
  }, []);

  const trackSearch = useCallback(
    (searchTerm: string) => {
      const searchEvent: SearchEvent = {
        searchTerm,
        timestamp: Date.now(),
        sessionId: getSessionId(),
      };

      if (import.meta.env.DEV) {
        console.log('📊 [Analytics] Search Event:', searchEvent);
      }

      // 本番環境では外部アナリティクスサービスに送信
      if (import.meta.env.PROD) {
        // Google Analytics, Mixpanel, などに送信
        // gtag('event', 'search', {
        //   search_term: searchTerm,
        //   timestamp: searchEvent.timestamp
        // });
      }

      // ローカルストレージに保存（デモ用）
      try {
        const stored = localStorage.getItem('weather_analytics') || '[]';
        const analytics = JSON.parse(stored);
        analytics.push({
          type: 'search',
          ...searchEvent,
        });
        localStorage.setItem('weather_analytics', JSON.stringify(analytics.slice(-50)));
      } catch (error) {
        console.warn('Analytics storage failed:', error);
      }
    },
    [getSessionId]
  );

  // 🎯 エラーイベント追跡
  const trackError = useCallback(
    (error: Error, context?: Record<string, unknown>) => {
      const errorEvent: ErrorEvent = {
        error: error.message,
        context,
        timestamp: Date.now(),
        sessionId: getSessionId(),
      };

      if (import.meta.env.DEV) {
        console.error('🚨 [Analytics] Error Event:', errorEvent);
      }

      // 本番環境では外部エラー監視サービスに送信
      if (import.meta.env.PROD) {
        // Sentry, LogRocket, などに送信
        // Sentry.captureException(error, {
        //   extra: context,
        //   tags: { component: 'weather-app' }
        // });
      }

      // ローカルストレージに保存（デモ用）
      try {
        const stored = localStorage.getItem('weather_errors') || '[]';
        const errors = JSON.parse(stored);
        errors.push(errorEvent);
        localStorage.setItem('weather_errors', JSON.stringify(errors.slice(-20)));
      } catch (storageError) {
        console.warn('Error tracking storage failed:', storageError);
      }
    },
    [getSessionId]
  );

  // 🎯 ページビュー追跡
  const trackPageView = useCallback(() => {
    const pageViewEvent: AnalyticsEvent = {
      event: 'page_view',
      category: 'navigation',
      data: {
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      },
      timestamp: Date.now(),
    };

    if (import.meta.env.DEV) {
      console.log('📊 [Analytics] Page View:', pageViewEvent);
    }

    // 本番環境での処理
    if (import.meta.env.PROD) {
      // gtag('config', 'GA_MEASUREMENT_ID', {
      //   page_title: 'Weather App',
      //   page_location: window.location.href
      // });
    }
  }, []);

  // 🎯 分析データ取得（開発/デバッグ用）
  const getAnalyticsData = useCallback(() => {
    try {
      const searches = JSON.parse(localStorage.getItem('weather_analytics') || '[]');
      const errors = JSON.parse(localStorage.getItem('weather_errors') || '[]');

      return {
        searches,
        errors,
        totalSearches: searches.length,
        totalErrors: errors.length,
        errorRate: searches.length > 0 ? ((errors.length / searches.length) * 100).toFixed(2) : '0',
      };
    } catch (error) {
      console.warn('Failed to get analytics data:', error);
    }
  }, []);

  return {
    trackSearch,
    trackError,
    trackPageView,
    getAnalyticsData,
  };
};
