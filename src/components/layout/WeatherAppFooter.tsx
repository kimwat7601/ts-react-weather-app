const WeatherAppFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '30px 0',
        marginTop: '40px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div
          style={{
            marginBottom: '20px',
            padding: '20px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.3rem' }}>
            🎓 React + TypeScript学習プロジェクト完了
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px',
              marginTop: '15px',
            }}
          >
            <div>
              <strong>📚 Phase 1-2:</strong>
              <br />
              <small>ErrorBoundary基礎 + Suspense基礎</small>
            </div>
            <div>
              <strong>🔧 Phase 3:</strong>
              <br />
              <small>統合ラッパー + エラー回復機能</small>
            </div>
            <div>
              <strong>🚀 Phase 4:</strong>
              <br />
              <small>完全移行 + 本番運用準備</small>
            </div>
          </div>
        </div>

        {/* プロジェクト情報 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          <div>
            <h4 style={{ margin: '0 0 10px 0' }}>🛠️ 技術スタック</h4>
            <ul
              style={{
                listStyle: 'none',
                padding: '0',
                margin: '0',
                fontSize: '0.9rem',
                opacity: 0.9,
              }}
            >
              <li>• React 18 + TypeScript</li>
              <li>• Tanstack Query (React Query)</li>
              <li>• react-error-boundary</li>
              <li>• OpenWeatherMap API</li>
            </ul>
          </div>
          <div>
            <h4 style={{ margin: '0 0 10px 0' }}>✨ 実装機能</h4>
            <ul
              style={{
                listStyle: 'none',
                padding: '0',
                margin: '0',
                fontSize: '0.9rem',
                opacity: 0.9,
              }}
            >
              <li>• 宣言的UI設計</li>
              <li>• 自動エラー回復</li>
              <li>• パフォーマンス監視</li>
              <li>• アクセシビリティ対応</li>
            </ul>
          </div>
          <div>
            <h4 style={{ margin: '0 0 10px 0' }}>🎯 学習成果</h4>
            <ul
              style={{
                listStyle: 'none',
                padding: '0',
                margin: '0',
                fontSize: '0.9rem',
                opacity: 0.9,
              }}
            >
              <li>• モダンReactパターン</li>
              <li>• 型安全な開発</li>
              <li>• エラーハンドリング</li>
              <li>• 保守性の高い設計</li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '20px',
            fontSize: '0.9rem',
            opacity: 0.8,
          }}
        >
          <p style={{ margin: '0 0 10px 0' }}>
            &copy; {currentYear} React + TypeScript 学習プロジェクト
          </p>
          <p style={{ margin: '0', fontSize: '0.8rem' }}>
            Built with ❤️ for learning modern web development
          </p>
        </div>
        {/* 🆕 開発環境での追加情報 */}
        {import.meta.env.DEV && (
          <div
            style={{
              marginTop: '20px',
              padding: '15px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              fontSize: '0.8rem',
            }}
          >
            <strong>🔧 Development Info:</strong>
            <br />
            Mode: {import.meta.env.MODE} | Build:{' '}
            {import.meta.env.DEV ? 'Development' : 'Production'}
            <br />
            Hot Reload: Active | TypeScript: Enabled | React DevTools: Available
          </div>
        )}
      </div>
    </footer>
  );
};

export default WeatherAppFooter;
