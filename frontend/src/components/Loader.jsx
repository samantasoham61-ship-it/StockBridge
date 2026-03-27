import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

const STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'META'];

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Connecting to market...');

  useEffect(() => {
    const messages = [
      'Connecting to market...',
      'Fetching live prices...',
      'Loading your portfolio...',
      'Almost ready...',
    ];
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProgress(step * 25);
      setStatusText(messages[step] || messages[messages.length - 1]);
      if (step >= 4) clearInterval(interval);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1629 60%, #0a0e1a 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '2rem'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '5rem', height: '5rem', backgroundColor: 'rgba(74,158,255,0.15)',
          border: '2px solid rgba(74,158,255,0.4)', borderRadius: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          <TrendingUp size={40} color="#4a9eff" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>StockSync</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Real-time Stock Management</p>
        </div>
      </div>

      {/* Animated ticker */}
      <div style={{
        display: 'flex', gap: '1rem', overflow: 'hidden',
        maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)'
      }}>
        {[...STOCKS, ...STOCKS].map((s, i) => (
          <div key={i} style={{
            backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '0.75rem', padding: '0.5rem 1rem', textAlign: 'center', flexShrink: 0,
            animation: `ticker ${8 + (i % 3)}s linear infinite`
          }}>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>{s}</p>
            <p style={{ color: i % 2 === 0 ? '#00d4aa' : '#ff4757', fontSize: '0.75rem' }}>
              {i % 2 === 0 ? '+' : '-'}{(Math.random() * 3 + 0.1).toFixed(2)}%
            </p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ width: '16rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '9999px',
            background: 'linear-gradient(90deg, #4a9eff, #00d4aa)',
            width: `${progress}%`, transition: 'width 0.5s ease'
          }} />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{statusText}</p>
      </div>

      {/* Spinning dots */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: '#4a9eff',
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
          }} />
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74,158,255,0.3); }
          50% { box-shadow: 0 0 0 16px rgba(74,158,255,0); }
        }
      `}</style>
    </div>
  );
}
