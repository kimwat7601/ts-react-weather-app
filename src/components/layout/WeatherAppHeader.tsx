const WeatherAppHeader = () => {
  return (
    <header
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '20px 0',
        marginBottom: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        <h1
          style={{
            margin: '0 0 10px 0',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          🌤️ Modern Weather App
        </h1>
        <p
          style={{
            margin: '0',
            fontSize: '1.1rem',
            opacity: 0.9,
          }}
        >
          Powered by React Suspense & ErrorBoundary
        </p>

        {/* 🆕 Phase 4: 技術スタック表示 */}
        <div
          style={{
            marginTop: '15px',
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          {[
            '⚛️ React 18',
            '🔄 Suspense',
            '🛡️ ErrorBoundary',
            '📊 React Query',
            '💎 TypeScript',
            '🎨 Modern UX',
          ].map((tech) => (
            <span
              key={tech}
              style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                backdropFilter: 'blur(10px)',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default WeatherAppHeader;
