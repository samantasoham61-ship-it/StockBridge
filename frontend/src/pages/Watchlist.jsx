import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useStocks } from '../context/StockContext';
import { Star, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import TradeModal from '../components/TradeModal';
import toast from 'react-hot-toast';
import { formatINR, formatINRChange } from '../utils/currency';

const API = 'http://localhost:5000/api';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [tradeModal, setTradeModal] = useState(null);
  const { stocks } = useStocks();
  const { user } = useAuth();

  useEffect(() => {
    if (user) axios.get(`${API}/watchlist`).then(r => setWatchlist(r.data.stocks || []));
  }, [user]);

  const remove = async (symbol) => {
    await axios.delete(`${API}/watchlist/remove/${symbol}`);
    setWatchlist(prev => prev.filter(s => s.symbol !== symbol));
    toast.success('Removed from watchlist');
  };

  const watchedStocks = watchlist.map(w => {
    const live = stocks.find(s => s.symbol === w.symbol);
    return { ...w, ...live };
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Star size={24} color="#ffd700" fill="#ffd700" /> Watchlist
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{watchlist.length} stocks being tracked</p>
      </div>

      {watchedStocks.length > 0 ? (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['Symbol', 'Price', 'Change', '% Change', 'Volume', 'High', 'Low', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', paddingBottom: '0.75rem', paddingRight: '1rem', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {watchedStocks.map(s => (
                <tr key={s.symbol} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem 1rem 1rem 0' }}>
                    <p style={{ fontWeight: 700, color: 'white' }}>{s.symbol}</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{s.name}</p>
                  </td>
                  <td style={{ padding: '1rem 1rem 1rem 0', color: 'white', fontWeight: 600 }}>{formatINR(s.price)}</td>
                  <td style={{ padding: '1rem 1rem 1rem 0', color: s.change >= 0 ? '#00d4aa' : '#ff4757', fontWeight: 500 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {s.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {formatINRChange(s.change)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1rem 1rem 0' }}>
                    <span className={s.changePercent >= 0 ? 'badge-up' : 'badge-down'}>
                      {s.changePercent >= 0 ? '+' : ''}{s.changePercent?.toFixed(2) || '0'}%
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1rem 1rem 0', color: 'rgba(255,255,255,0.5)' }}>{s.volume ? `${(s.volume / 1e6).toFixed(1)}M` : '—'}</td>
                  <td style={{ padding: '1rem 1rem 1rem 0', color: 'rgba(255,255,255,0.5)' }}>{formatINR(s.high)}</td>
                  <td style={{ padding: '1rem 1rem 1rem 0', color: 'rgba(255,255,255,0.5)' }}>{formatINR(s.low)}</td>
                  <td style={{ padding: '1rem 0' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => setTradeModal({ stock: s, mode: 'buy' })}
                        className="btn-success" style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}>Buy</button>
                      <button onClick={() => remove(s.symbol)}
                        style={{ padding: '0.375rem', color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '0.5rem', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ff4757'; e.currentTarget.style.backgroundColor = 'rgba(255,71,87,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <Star size={48} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.125rem' }}>Your watchlist is empty</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Click the ★ icon on any stock to add it here</p>
        </div>
      )}

      {tradeModal && (
        <TradeModal {...tradeModal} onClose={() => setTradeModal(null)} onSuccess={() => {}} />
      )}
    </div>
  );
}
