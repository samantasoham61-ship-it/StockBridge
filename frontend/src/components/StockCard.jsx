import { TrendingUp, TrendingDown, Plus, Star } from 'lucide-react';
import { useStocks } from '../context/StockContext';
import { formatINR, formatINRChange } from '../utils/currency';

export default function StockCard({ stock, onBuy, onWatchlist, isWatched }) {
  const { priceFlash } = useStocks();
  const flash = priceFlash[stock.symbol];
  const isUp = stock.change >= 0;

  return (
    <div
      className={`card ${flash === 'up' ? 'animate-pulse-green' : ''} ${flash === 'down' ? 'animate-pulse-red' : ''}`}
      style={{
        cursor: 'pointer', transition: 'all 0.3s',
        borderColor: flash === 'up' ? 'rgba(0,212,170,0.3)' : flash === 'down' ? 'rgba(255,71,87,0.3)' : undefined
      }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'white' }}>{stock.symbol}</span>
            <span className={isUp ? 'badge-up' : 'badge-down'}>
              {isUp ? '+' : ''}{stock.changePercent?.toFixed(2)}%
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '0.125rem' }}>{stock.name}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button onClick={(e) => { e.stopPropagation(); onWatchlist?.(stock); }}
            title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
            style={{
              padding: '0.375rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              color: isWatched ? '#ffd700' : 'rgba(255,255,255,0.5)',
              backgroundColor: isWatched ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)'
            }}>
            <Star size={14} fill={isWatched ? 'currentColor' : 'none'} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onBuy?.(stock); }}
            title="Buy stock"
            style={{
              padding: '0.375rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              color: '#00d4aa', backgroundColor: 'rgba(0,212,170,0.15)'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,212,170,0.3)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0,212,170,0.15)'}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>{formatINR(stock.price)}</p>
          <p className={isUp ? 'positive' : 'negative'} style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.125rem' }}>
            {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {formatINRChange(stock.change)}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>Vol</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>{(stock.volume / 1e6).toFixed(1)}M</p>
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
        <div><span style={{ color: 'rgba(255,255,255,0.3)' }}>H </span><span style={{ color: 'rgba(255,255,255,0.7)' }}>{formatINR(stock.high)}</span></div>
        <div><span style={{ color: 'rgba(255,255,255,0.3)' }}>L </span><span style={{ color: 'rgba(255,255,255,0.7)' }}>{formatINR(stock.low)}</span></div>
      </div>
    </div>
  );
}
