// Layout Shift Entry の型定義
interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  sources?: Array<{
    node?: Node;
    currentRect: DOMRectReadOnly;
    previousRect: DOMRectReadOnly;
  }>;
}

// First Input Delay Entry の型定義
interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
  cancelable: boolean;
}

// Largest Contentful Paint Entry の型定義
interface LargestContentfulPaintEntry extends PerformanceEntry {
  renderTime: number;
  loadTime: number;
  size: number;
  id: string;
  url?: string;
  element?: Element;
}

// 型ガード関数
export const isLayoutShiftEntry = (entry: PerformanceEntry): entry is LayoutShiftEntry => {
  return entry.entryType === 'layout-shift';
};

export const isFirstInputEntry = (entry: PerformanceEntry): entry is FirstInputEntry => {
  return entry.entryType === 'first-input';
};

export const isLargestContentfulPaintEntry = (
  entry: PerformanceEntry
): entry is LargestContentfulPaintEntry => {
  return entry.entryType === 'largest-contentful-paint';
};

export type { LayoutShiftEntry, FirstInputEntry, LargestContentfulPaintEntry };
