import { useState } from 'react';
import WeatherSuspenseWrapper from '@/components/common/WeatherSuspenseWrapper';

const ErrorRecoveryTest = () => {
  const [testValue, setTestValue] = useState('normal');
  const [testCounter, setTestCounter] = useState(0);

  // テスト用のコンポーネント
  const TestComponent = ({ value }: { value: string }) => {
    console.log(`🧪 TestComponent rendering with value: ${value}`);

    if (value === 'error') {
      throw new Error('Test Error for ErrorBoundary');
    }

    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: '#e8f5e8',
          borderRadius: '4px',
          textAlign: 'center',
        }}
      >
        <h4>✅ Test Component</h4>
        <p>
          Current Value: <strong>{value}</strong>
        </p>
        <p>Render Count: {testCounter}</p>
        <small>Component is working normally</small>
      </div>
    );
  };

  const handleTestChange = (newValue: string) => {
    console.log(`🔄 Changing test value from ${testValue} to ${newValue}`);
    setTestValue(newValue);
    setTestCounter((prev) => prev + 1);
  };

  return (
    <div
      style={{
        color: '#333',
        margin: '20px 0',
        padding: '20px',
        border: '2px solid #2196f3',
        borderRadius: '8px',
        backgroundColor: '#f3f8ff',
      }}
    >
      <h3>🧪 ErrorBoundary Recovery Test</h3>

      <div style={{ marginBottom: '20px' }}>
        <strong>現在の値:</strong> {testValue} | <strong>カウンター:</strong> {testCounter}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => handleTestChange('normal')}
          style={{
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            margin: '0 5px',
            cursor: 'pointer',
          }}
        >
          ✅ Normal Value
        </button>

        <button
          onClick={() => handleTestChange('error')}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            margin: '0 5px',
            cursor: 'pointer',
          }}
        >
          ❌ Error Value
        </button>

        <button
          onClick={() => handleTestChange('recovery')}
          style={{
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            margin: '0 5px',
            cursor: 'pointer',
          }}
        >
          🔄 Recovery Value
        </button>
      </div>

      <WeatherSuspenseWrapper
        type="general"
        debugLabel="ErrorRecoveryTest"
        enableDebugLog={true}
        resetTrigger={testValue} // 🎯 重要: testValue が変わるとリセット
        loadingMessage="テストコンポーネントを読み込み中..."
        onError={(error, errorInfo) => {
          console.log('🚨 Test Error Caught:', error.message);
          console.log('🔧 Error Info:', errorInfo);
        }}
      >
        <TestComponent value={testValue} />
      </WeatherSuspenseWrapper>

      <div
        style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#fff3e0',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      >
        <strong>🎯 テスト手順:</strong>
        <br />
        1. "❌ Error Value" をクリック → エラーが発生
        <br />
        2. "🔄 Recovery Value" をクリック → エラーが自動回復するはず
        <br />
        3. コンソールで "Error boundary reset" ログを確認
      </div>
    </div>
  );
};

export default ErrorRecoveryTest;
