import { useCallback } from 'react';

export const usePerformanceMonitor = () => {
  // 🎯 パフォーマンス測定
  const measurePerformance = useCallback(
    (operationName: string, operation: () => void | Promise<void>) => {
      const markStart = `${operationName}-start`;
      const markEnd = `${operationName}-end`;
      const measureName = `${operationName}-duuration`;

      // Performance API でマーク
      performance.mark(markStart);

      try {
        const result = operation();

        //Promise の場合
        if (result instanceof Promise) {
          return result.finally(() => {
            performance.mark(markEnd);
            performance.measure(measureName, markStart, markEnd);

            const measure = performance.getEntriesByName(measureName)[0];
            const duration = measure.duration;

            if (import.meta.env.DEV) {
              console.log(`⚡ [Performance] ${operationName}: ${duration.toFixed(2)}ms`);
            }

            // 遅い操作の警告
            if (duration > 1000) {
              console.warn(
                `🐌 [Performance] Slow operation detected: ${operationName} took ${duration.toFixed(2)}ms`
              );
            }

            // 本番環境でのパフォーマンス監視
            if (import.meta.env.PROD && duration > 500) {
              // 外部監視サービスに送信
              // sendPerformanceMetric(operationName, duration);
            }
          });
        }

        // 同期処理の場合
        performance.mark(markEnd);
        performance.measure(measureName, markStart, markEnd);

        const measure = performance.getEntriesByName(measureName)[0];
        const duration = measure.duration;

        if (import.meta.env.DEV) {
          console.log(`⚡ [Performance] ${operationName}: ${duration.toFixed(2)}ms`);
        }
        return result;
      } catch (error) {
        performance.mark(markEnd);
        performance.measure(measureName, markStart, markEnd);
        throw error;
      }
    },
    []
  );

  // 🎯 Core Web Vitals 監視
  const monitorCoreWebVitals = useCallback(() => {
    // Largest Contentful Paint (LCP)
    const observeLCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        if (import.meta.env.DEV) {
          console.log(`🎨 [Core Web Vitals] LCP: ${lastEntry.startTime.toFixed(2)}ms`);
        }

        // 2.5秒以上は改善が必要
        if (lastEntry.startTime > 2500) {
          console.warn(`⚠️ [Core Web Vitals] Poor LCP: ${lastEntry.startTime.toFixed(2)}ms`);
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
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
          console.log(`🎨 [Core Web Vitals] CLS: ${clsValue.toFixed(4)}`);
        }

        // 0.1以上は改善が必要
        if (clsValue > 0.1) {
          console.warn(`⚠️ [Core Web Vitals] Poor CLS: ${clsValue.toFixed(4)}`);
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    };

    // First Input Delay (FID)
    const observeFID = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0];

        if (import.meta.env.DEV) {
          console.log(
            `⚡ [Core Web Vitals] FID: ${(firstEntry as any).processingStart - firstEntry.startTime}ms`
          );
        }

        const fid = (firstEntry as any).processingStart - firstEntry.startTime;
        // 100ms以上は改善が必要
        if (fid > 100) {
          console.warn(`⚠️ [Core Web Vitals] Poor FID: ${fid}ms`);
        }
      });

      observer.observe({ entryTypes: ['first-input'] });
    };

    // 監視開始
    try {
      observeLCP();
      observeCLS();
      observeFID();
    } catch (error) {
      console.warn('Core Web Vitals monitoring not supported:', error);
    }
  }, []);

  return {
    measurePerformance,
    monitorCoreWebVitals,
  };
};
