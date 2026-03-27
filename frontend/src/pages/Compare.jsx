import { useState } from 'react';
import { useStocks } from '../context/StockContext';
import { GitCompare, TrendingUp, TrendingDown } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { formatINR } from '../utils/currency';

const generateHistory = (price) => {
  let p = price * 0.92;
  return Array.from({ length: 14 }, (_, i) => {
    p += (Math.random() - 0.47) * p * 0.012;
    return { day: `D${i + 1}`, value: parseFloat(p.toFixed(2)) };
  });
};

export default function Compare() {
  const { stocks } = useStocks();
  const [symA, setSymA] = useState('AAPL');
  const [symB, setSymB] = useState('TSLA');

  const A = stocks.find(s => s.symbol === symA);
  const B = stocks.find(s => s.symbol === symB);

  const histA = A ? generateHistory(A.price) : [];
  const histB = B ? generateHistory(B.price) : [];

  const combined = histA.map((d, i) => ({ day: d.day, [symA]: d.value, [symB]: histB[i]?.value }));

  const radarData = A && B ? [
    { metric: 'Price', A: Math.min((A.price / (A.price + B.price)) * 10, 10), B: Math.min((B.price / (A.price + B.price)) * 10, 10) },
    { metric: 'Change%', A: Math.max(0, A.changePercent + 5), B: Math.max(0, B.changePercent + 5) },
    { metric: 'Volume', A: (A.volume / (A.volume + B.volume)) * 10, B: (B.volume / (A.volume + B.volume)) * 10 },
    { metric: 'High', A: (A.high / (A.high + B.high)) * 10, B: (B.high / (A.high + B.high)) * 10 },
    { metric: 'Low', A: (A.low / (A.low + B.low)) * 10, B: (B.low / (A.low + B.low)) * 10 },
  ] : [];

  const metrics = A && B ? [
    { label: 'Current Price', a: formatINR(A.price), b: formatINR(B.price), winner: A.price > B.price ? 'a' : 'b' },
    { label: 'Change %', a: `${A.changePercent >= 0 ? '+' : ''}${A.changePercent?.toFixed(2)}%`, b: `${B.changePercent >= 0 ? '+' : ''}${B.changePercent?.toFixed(2)}%`, winner: A.changePercent > B.changePercent ? 'a' : 'b' },
    { label: 'Day High', a: formatINR(A.high), b: formatINR(B.high), winner: A.high > B.high ? 'a' : 'b' },
    { label: 'Day Low', a: formatINR(A.low), b: formatINR(B.low), winner: A.low > B.low ? 'a' : 'b' },
    { label: 'Volume', a: `${(A.volume / 1e6).toFixed(1)}M`, b: `${(B.volume / 1e6).toFixed(1)}M`, winner: A.volume > B.volume ? 'a' : 'b' },
    { label: 'Open', a: formatINR(A.open), b: formatINR(B.open), winner: A.open > B.open ? 'a' : 'b' },
  ] : [];

  const selectStyle = { backgroundColor: '#1a2340', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.6rem 1rem', color: 'white', fontSize: '0.95rem', fontWeight: 700, outline: 'none', cursor: 'pointer', minWidth: '8rem' };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GitCompare size={24} color="#4a9eff" /> Stock Comparison
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Compare two stocks side by side</p>
      </div>

      {/* Selectors */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '0.4rem' }}>Stock A</p>
          <select value={symA} onChange={e => setSymA(e.target.value)} style={{ ...selectStyle, color: '#4a9eff' }}>
            {stocks.map(s => <option key={s.symbol} value={s.symbol}>{s.symbol}</option>)}
          </select>
        </div>
        <div style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.2)', fontWeight: 700 }}>VS</div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '0.4rem' }}>Stock B</p>
          <select value={symB} onChange={e => setSymB(e.target.value)} style={{ ...selectStyle, color: '#a855f7' }}>
            {stocks.map(s => <option key={s.symbol} value={s.symbol}>{s.symbol}</option>)}
          </select>
        </div>
      </div>

      {A && B && (
        <>
          {/* Price Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
            <div className="card" style={{ textAlign: 'center', borderColor: 'rgba(74,158,255,0.3)' }}>
              <p style={{ color: '#4a9eff', fontWeight: 800, fontSize: '1.1rem' }}>{A.symbol}</p>
              <p style={{ color: 'white', fontSize: '1.6rem', fontWeight: 800, margin: '0.25rem 0' }}>{formatINR(A.price)}</p>
              <span className={A.changePercent >= 0 ? 'badge-up' : 'badge-down'}>{A.changePercent >= 0 ? '+' : ''}{A.changePercent?.toFixed(2)}%</span>
            </div>
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontWeight: 700 }}>⚡</div>
            <div className="card" style={{ textAlign: 'center', borderColor: 'rgba(168,85,247,0.3)' }}>
              <p style={{ color: '#a855f7', fontWeight: 800, fontSize: '1.1rem' }}>{B.symbol}</p>
              <p style={{ color: 'white', fontSize: '1.6rem', fontWeight: 800, margin: '0.25rem 0' }}>{formatINR(B.price)}</p>
              <span className={B.changePercent >= 0 ? 'badge-up' : 'badge-down'}>{B.changePercent >= 0 ? '+' : ''}{B.changePercent?.toFixed(2)}%</span>
            </div>
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Price History */}
            <div className="card" style={{ gridColumn: 'span 2' }}>
              <h2 style={{ fontWeight: 700, color: 'white', marginBottom: '1rem', fontSize: '0.95rem' }}>Price Trend (14 Days)</h2>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={combined}>
                  <defs>
                    <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4a9eff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4a9eff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    formatter={(v, name) => [formatINR(v), name]} />
                  <Area type="monotone" dataKey={symA} stroke="#4a9eff" strokeWidth={2} fill="url(#gA)" />
                  <Area type="monotone" dataKey={symB} stroke="#a855f7" strokeWidth={2} fill="url(#gB)" />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#4a9eff' }}>
                  <div style={{ width: '1.5rem', height: '2px', backgroundColor: '#4a9eff' }} /> {symA}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#a855f7' }}>
                  <div style={{ width: '1.5rem', height: '2px', backgroundColor: '#a855f7' }} /> {symB}
                </span>
              </div>
            </div>

            {/* Radar */}
            <div className="card">
              <h2 style={{ fontWeight: 700, color: 'white', marginBottom: '1rem', fontSize: '0.95rem' }}>Performance Radar</h2>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                  <Radar name={symA} dataKey="A" stroke="#4a9eff" fill="#4a9eff" fillOpacity={0.2} />
                  <Radar name={symB} dataKey="B" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} />
                  <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Metrics Table */}
            <div className="card">
              <h2 style={{ fontWeight: 700, color: 'white', marginBottom: '1rem', fontSize: '0.95rem' }}>Head to Head</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {metrics.map(({ label, a, b, winner }) => (
                  <div key={label} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.5rem', alignItems: 'center', padding: '0.5rem', backgroundColor: '#1a2340', borderRadius: '0.625rem' }}>
                    <p style={{ color: winner === 'a' ? '#4a9eff' : 'rgba(255,255,255,0.5)', fontWeight: winner === 'a' ? 700 : 400, fontSize: '0.82rem', textAlign: 'right' }}>{a}</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', textAlign: 'center', whiteSpace: 'nowrap' }}>{label}</p>
                    <p style={{ color: winner === 'b' ? '#a855f7' : 'rgba(255,255,255,0.5)', fontWeight: winner === 'b' ? 700 : 400, fontSize: '0.82rem' }}>{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
