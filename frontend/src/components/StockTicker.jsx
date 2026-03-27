import { useStocks } from '../context/StockContext';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatINR } from '../utils/currency';

export default function StockTicker() {
  const { stocks } = useStocks();

  return (
    <div style={{ backgroundColor: 'rgba(15,22,41,0.6)', borderBottom: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', padding: '0.5rem 0' }}>
      <div className="animate-ticker" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
        {[...stocks, ...stocks].map((stock, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', margin: '0 1.5rem', fontSize: '0.875rem' }}>
            <span style={{ fontWeight: 700, color: 'white' }}>{stock.symbol}</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{formatINR(stock.price)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.125rem', color: stock.change >= 0 ? '#00d4aa' : '#ff4757' }}>
              {stock.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {stock.changePercent?.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
