// src/components/debug/ErrorBoundaryTest.tsx
import { useState } from 'react';

const ErrorBoundaryTest = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  // エラーを投げる
  if (shouldThrow) {
    throw new Error('🚨 テスト用エラー: ErrorBoundaryの動作確認');
  }

  return (
    <div
      style={{
        padding: '20px',
        border: '2px dashed #ff6b6b',
        borderRadius: '8px',
        backgroundColor: '#fff5f5',
      }}
    >
      <h3>🧪 ErrorBoundary テスト</h3>
      <p>下のボタンを押すとエラーが発生し、ErrorBoundaryが動作するはずです。</p>

      <button
        onClick={() => setShouldThrow(true)}
        style={{
          backgroundColor: '#ff6b6b',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        💥 エラーを発生させる
      </button>

      <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        ✅ 正常時: このメッセージが表示される
        <br />❌ エラー時: カスタムエラーUIが表示されるはず
      </p>
    </div>
  );
};

export default ErrorBoundaryTest;
