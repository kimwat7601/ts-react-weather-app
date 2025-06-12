import { useState, useCallback, Suspense } from 'react';
import SearchForm from '@/components/weather/SearchForm';

// 従来版コンポーネント
import CurrentWeather from '@/components/weather/CurrentWeather';
import ForecastWeatherList from '@/components/weather/ForecastWeatherList';
import { useWeatherData } from '@/hooks/UseWeatherQuery';

// 🆕 Suspense版コンポーネント
import CurrentWeatherSuspense from '@/components/weather/CurrentWeatherSuspense';
import ForecastWeatherListSuspense from '@/components/weather/ForecastWeatherListSuspense';

import WeatherErrorBoundary from '@/components/common/WeatherErrorBoundary';
// import LoadingBox from '@/components/common/Loading';

// 統合ラッパー
import WeatherSuspenseWrapper, {
  CurrentWeatherWrapper,
  ForecastWeatherWrapper,
  useWeatherErrorHandler,
} from '@/components/common/WeatherSuspenseWrapper';

// 🧪 デバッグコンポーネント
import ErrorRecoveryTest from '@/components/debug/ErrorRecoveryTest';
// const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

const App = () => {
  const [searchCity, setSearchCity] = useState('');
  const [appMode, setAppMode] = useState<'traditional' | 'phase2' | 'phase3'>('traditional');
  const [showDebugTest, setShowDebugTest] = useState(false); // 🆕 デバッグテスト表示フラグ

  // 従来版のデータフェッチ（比較用）
  const {
    currentWeatherData,
    isCurrentLoading,
    currentError,
    forecastWeatherData,
    isForecastLoading,
    forecastError,
  } = useWeatherData(searchCity);

  const handleWeatherError = useWeatherErrorHandler('weatherApp');

  const handleSearch = useCallback(
    (inputValue: string) => {
      console.log(`🔍 [${appMode} Mode] Search triggered:`, inputValue);
      setSearchCity(inputValue);
    },
    [appMode]
  );

  // モード切り替えボタンのスタイル
  const getModeButtonStyle = (mode: typeof appMode) => ({
    backgroundColor: appMode === mode ? '#4CAF50' : '#E0E0E0',
    color: appMode === mode ? 'white' : 'black',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '0 5px',
    fontWeight: appMode === mode ? 'bold' : 'normal',
  });

  return (
    <>
      <section className="dashboard-header">
        <SearchForm handleSearch={handleSearch} />

        {/* Phase 3: 3つのモード切り替え */}
        <div
          style={{
            padding: '20px',
            backgroundColor: '#f5f5f5',
            color: 'black',
            border: '2px solid #ddd',
            margin: '10px 0',
            borderRadius: '8px',
          }}
        >
          <div style={{ marginBottom: '15px' }}>
            <strong>アプリモード選択:</strong>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <button
              onClick={() => setAppMode('traditional')}
              style={getModeButtonStyle('traditional')}
            >
              📱 従来版
            </button>
            <button onClick={() => setAppMode('phase2')} style={getModeButtonStyle('phase2')}>
              🔄 Phase 2
            </button>
            <button onClick={() => setAppMode('phase3')} style={getModeButtonStyle('phase3')}>
              ✨ Phase 3
            </button>
          </div>

          {/* 🆕 デバッグテストボタン */}
          {import.meta.env.DEV && appMode === 'phase3' && (
            <div style={{ marginBottom: '15px' }}>
              <button
                onClick={() => setShowDebugTest(!showDebugTest)}
                style={{
                  backgroundColor: showDebugTest ? '#ff9800' : '#9e9e9e',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                🧪 {showDebugTest ? 'デバッグテストを隠す' : 'エラー回復テストを表示'}
              </button>
            </div>
          )}

          {/* モード説明 */}
          <div
            style={{
              padding: '10px',
              backgroundColor: '#fff',
              color: 'black',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            {appMode === 'traditional' && (
              <span>
                <strong>📱 従来版:</strong> useQueryベースの個別エラー/ローディング処理
              </span>
            )}
            {appMode === 'phase2' && (
              <span>
                <strong>🔄 Phase 2:</strong> useSuspenseQuery + 基本的なSuspense/ErrorBoundary
              </span>
            )}
            {appMode === 'phase3' && (
              <span>
                <strong>✨ Phase 3:</strong> 統合ラッパーによる高度なUX +
                インテリジェントなエラー処理 + 自動回復機能
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 🧪 エラー回復デバッグテスト */}
      {import.meta.env.DEV && appMode === 'phase3' && showDebugTest && <ErrorRecoveryTest />}

      <section className="dashboard-body">
        {/* 従来版 */}
        {appMode === 'traditional' && (
          <>
            <WeatherErrorBoundary debugLabel="CurrentWeather-Traditional">
              <CurrentWeather
                data={currentWeatherData}
                isLoading={isCurrentLoading}
                error={currentError?.message || ''}
              />
            </WeatherErrorBoundary>
            <WeatherErrorBoundary debugLabel="ForecastWeather-Traditional">
              <ForecastWeatherList
                data={forecastWeatherData}
                isLoading={isForecastLoading}
                error={forecastError?.message || ''}
              />
            </WeatherErrorBoundary>
          </>
        )}

        {/* Phase 2: 基本的なSuspense */}
        {appMode === 'phase2' && searchCity && (
          <>
            <WeatherErrorBoundary debugLabel="CurrentWeather-Phase2">
              <Suspense fallback={<div>Loading current weather...</div>}>
                <CurrentWeatherSuspense city={searchCity} />
              </Suspense>
            </WeatherErrorBoundary>
            <WeatherErrorBoundary debugLabel="ForecastWeather-Phase2">
              <Suspense fallback={<div>Loading forecast...</div>}>
                <ForecastWeatherListSuspense city={searchCity} />
              </Suspense>
            </WeatherErrorBoundary>
          </>
        )}

        {/* 🔧 Phase 3: 改良されたエラー回復機能 */}
        {appMode === 'phase3' && (
          <>
            {searchCity ? (
              <>
                {/* プリセットラッパーを使用 */}
                <CurrentWeatherWrapper
                  resetTrigger={searchCity}
                  onError={handleWeatherError}
                  enableDebugLog={true}
                  resetOnPropsChange={true}
                >
                  <CurrentWeatherSuspense city={searchCity} />
                </CurrentWeatherWrapper>

                <ForecastWeatherWrapper
                  resetTrigger={searchCity}
                  onError={handleWeatherError}
                  enableDebugLog={true}
                  resetOnPropsChange={true}
                >
                  <ForecastWeatherListSuspense city={searchCity} />
                </ForecastWeatherWrapper>
              </>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px',
                  backgroundColor: '#f8f9fa',
                  color: 'black',
                  borderRadius: '8px',
                  margin: '20px 0',
                }}
              >
                <h2>✨ Phase 3: 統合ラッパー版</h2>
                <p style={{ fontSize: '18px', color: '#666', margin: '20px 0' }}>
                  🌤️ 都市名を検索して、進化したUXを体験してください
                </p>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '15px',
                    backgroundColor: '#e8f5e8',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  <strong>✨ Phase 3の新機能:</strong>
                  <br />
                  • インテリジェントなエラー分析
                  <br />
                  • タイプ別カスタムローディング
                  <br />
                  • 統合されたエラー/ローディング管理
                  <br />
                  • アクセシビリティ対応
                  <br />
                  • 🆕 自動エラー回復機能
                  <br />• 詳細なデバッグ情報
                </div>
              </div>
            )}
          </>
        )}

        {/* 共通のウェルカムメッセージ（検索前） */}
        {(appMode === 'phase2' || appMode === 'phase3') && !searchCity && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#fff',
              color: 'black',
              border: '2px dashed #ddd',
              borderRadius: '8px',
              margin: '20px 0',
            }}
          >
            <h3>🔍 都市名を検索してください</h3>
            <p>例: Tokyo, Osaka, New York, London</p>
          </div>
        )}
      </section>

      {/* カスタムラッパーの例 */}
      {appMode === 'phase3' && searchCity && (
        <WeatherSuspenseWrapper
          type="general"
          loadingMessage="追加の気象データを取得中..."
          loadingSize="small"
          debugLabel="AdditionalWeatherData"
          resetTrigger={searchCity}
          resetOnPropsChange={true}
          enableDebugLog={true}
          onError={handleWeatherError}
        >
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#e3f2fd',
              color: 'black',
              borderRadius: '8px',
              margin: '10px 0',
            }}
          >
            <h4>🌡️ 追加データ</h4>
            <p>将来的にここに詳細な気象データが表示されます</p>
            <small>（Phase 3統合ラッパーのデモ）</small>
          </div>
        </WeatherSuspenseWrapper>
      )}

      {/* Phase 3専用: 機能説明パネル */}
      {appMode === 'phase3' && import.meta.env.DEV && (
        <section
          style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#fff3e0',
            color: 'black',
            border: '2px solid #ff9800',
            borderRadius: '8px',
          }}
        >
          <h3>🔧 Phase 3 エラー回復テストガイド</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginTop: '15px',
            }}
          >
            <div>
              <h4>✅ 正常動作テスト</h4>
              <ul style={{ fontSize: '14px' }}>
                <li>Tokyo, Osaka などで検索</li>
                <li>カスタムローディングメッセージを確認</li>
                <li>デバッグラベルの表示確認</li>
              </ul>
            </div>
            <div>
              <h4>🔄 エラー回復テスト</h4>
              <ul style={{ fontSize: '14px' }}>
                <li>
                  <strong>Step 1:</strong> "InvalidCity123" でエラー発生
                </li>
                <li>
                  <strong>Step 2:</strong> "Tokyo" で検索 → 自動回復
                </li>
                <li>
                  <strong>Step 3:</strong> コンソールでリセットログを確認
                </li>
                <li>
                  <strong>Step 4:</strong> デバッグテストでも確認
                </li>
              </ul>
            </div>
          </div>

          <div
            style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            <strong>💡 観察ポイント:</strong>
            <br />
            • コンソールで "🔄 Error boundary reset - Trigger: [都市名]" ログが出力される
            <br />
            • エラー状態から正常状態への自動回復が動作する
            <br />• デバッグパネルで resetTrigger の値が確認できる
          </div>
        </section>
      )}
    </>
  );
};
export default App;
