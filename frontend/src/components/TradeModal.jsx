import { useState } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatINR, toINR } from '../utils/currency';

const API = 'http://localhost:5000/api';

export default function TradeModal({ stock, mode = 'buy', onClose, onSuccess, holding }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const total = formatINR(quantity * (stock?.price || 0));
  const profitINR = mode === 'sell' && holding
    ? toINR((stock.price - holding.avgBuyPrice) * quantity)
    : null;

  const handleTrade = async () => {
    if (quantity <= 0) return toast.error('Invalid quantity');
    setLoading(true);
    try {
      const endpoint = mode === 'buy' ? '/portfolio/buy' : '/portfolio/sell';
      await axios.post(`${API}${endpoint}`, {
        symbol: stock.symbol, name: stock.name,
        quantity: Number(quantity), price: stock.price
      });
      toast.success(`${mode === 'buy' ? 'Bought' : 'Sold'} ${quantity} shares of ${stock.symbol}!`);
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  const row = (label, value, valueStyle) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
      <span style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
      <span style={valueStyle || { color: 'white' }}>{value}</span>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
      <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '28rem' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>{mode === 'buy' ? 'Buy' : 'Sell'} {stock?.symbol}</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>{stock?.name}</p>
          </div>
          <button onClick={onClose} style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', borderRadius: '0.75rem' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ backgroundColor: '#1a2340', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Current Price</span>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>{formatINR(stock?.price)}</p>
              <p style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem', color: stock?.change >= 0 ? '#00d4aa' : '#ff4757' }}>
                {stock?.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stock?.changePercent?.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Quantity</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
              style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#1a2340', borderRadius: '0.75rem', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1.25rem', fontWeight: 700 }}>−</button>
            <input type="number" value={quantity} min="1"
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="input-field" style={{ textAlign: 'center', fontSize: '1.125rem', fontWeight: 700 }} />
            <button onClick={() => setQuantity(q => q + 1)}
              style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#1a2340', borderRadius: '0.75rem', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1.25rem', fontWeight: 700 }}>+</button>
          </div>
        </div>

        <div style={{ backgroundColor: '#1a2340', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {row('Price per share', formatINR(stock?.price))}
          {row('Quantity', quantity)}
          {mode === 'sell' && holding && row('Avg Buy Price', formatINR(holding.avgBuyPrice))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Total</span>
            <span style={{ color: 'white', fontSize: '1.125rem' }}>{total}</span>
          </div>
          {profitINR !== null && row('Est. P&L', `${profitINR >= 0 ? '+' : '-'}${formatINR(Math.abs(profitINR / 83.5))}`, { color: profitINR >= 0 ? '#00d4aa' : '#ff4757', fontWeight: 600 })}
        </div>

        <button onClick={handleTrade} disabled={loading}
          className={mode === 'buy' ? 'btn-success' : 'btn-danger'}
          style={{ width: '100%', padding: '0.75rem', fontSize: '1.125rem', opacity: loading ? 0.5 : 1 }}>
          {loading ? 'Processing...' : `${mode === 'buy' ? 'Buy' : 'Sell'} ${quantity} Share${quantity > 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  );
}
