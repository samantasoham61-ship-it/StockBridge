import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useStocks } from '../context/StockContext';
import { Bell, Plus, Trash2, BellRing } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatINR } from '../utils/currency';

const API = 'http://localhost:5000/api';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState({ symbol: 'AAPL', targetPrice: '', condition: 'above' });
  const [showForm, setShowForm] = useState(false);
  const { stocks } = useStocks();
  const { user } = useAuth();

  useEffect(() => {
    if (user) axios.get(`${API}/alerts`).then(r => setAlerts(r.data));
  }, [user]);

  useEffect(() => {
    alerts.forEach(alert => {
      if (!alert.isActive || alert.triggered) return;
      const stock = stocks.find(s => s.symbol === alert.symbol);
      if (!stock) return;
      const triggered = alert.condition === 'above'
        ? stock.price >= alert.targetPrice
        : stock.price <= alert.targetPrice;
      if (triggered) {
        toast.success(`🔔 Alert! ${alert.symbol} is ${alert.condition} $${alert.targetPrice}`, { duration: 5000 });
        setAlerts(prev => prev.map(a => a._id === alert._id ? { ...a, triggered: true } : a));
      }
    });
  }, [stocks]);

  const createAlert = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/alerts`, form);
      setAlerts(prev => [res.data, ...prev]);
      setForm({ symbol: 'AAPL', targetPrice: '', condition: 'above' });
      setShowForm(false);
      toast.success('Alert created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create alert');
    }
  };

  const deleteAlert = async (id) => {
    await axios.delete(`${API}/alerts/${id}`);
    setAlerts(prev => prev.filter(a => a._id !== id));
    toast.success('Alert deleted');
  };

  const currentPrice = stocks.find(s => s.symbol === form.symbol)?.price;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={24} color="#4a9eff" /> Price Alerts
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Get notified when stocks hit your target price</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> New Alert
        </button>
      </div>

      {showForm && (
        <div className="card animate-slide-up">
          <h2 style={{ fontWeight: 700, color: 'white', marginBottom: '1rem' }}>Create Price Alert</h2>
          <form onSubmit={createAlert} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', display: 'block', marginBottom: '0.375rem' }}>Stock</label>
              <select value={form.symbol} onChange={e => setForm({ ...form, symbol: e.target.value })} className="input-field">
                {stocks.map(s => <option key={s.symbol} value={s.symbol}>{s.symbol} - {s.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', display: 'block', marginBottom: '0.375rem' }}>Condition</label>
              <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} className="input-field">
                <option value="above">Price Above</option>
                <option value="below">Price Below</option>
              </select>
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', display: 'block', marginBottom: '0.375rem' }}>
                Target Price {currentPrice && <span style={{ color: '#4a9eff' }}>(Now: ${currentPrice?.toFixed(2)})</span>}
              </label>
              <input type="number" step="0.01" placeholder="0.00" required
                value={form.targetPrice} onChange={e => setForm({ ...form, targetPrice: e.target.value })}
                className="input-field" />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create Alert</button>
            </div>
          </form>
        </div>
      )}

      {alerts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {alerts.map(alert => {
            const stock = stocks.find(s => s.symbol === alert.symbol);
            const isTriggered = alert.triggered;
            const progress = stock ? Math.min(100, Math.abs((stock.price / alert.targetPrice) * 100)) : 0;

            return (
              <div key={alert._id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', borderColor: isTriggered ? 'rgba(255,215,0,0.3)' : undefined, backgroundColor: isTriggered ? 'rgba(255,215,0,0.03)' : undefined }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isTriggered ? 'rgba(255,215,0,0.2)' : 'rgba(74,158,255,0.1)', flexShrink: 0 }}>
                    {isTriggered ? <BellRing size={18} color="#ffd700" /> : <Bell size={18} color="#4a9eff" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, color: 'white' }}>{alert.symbol}</span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>{alert.condition === 'above' ? '↑ Above' : '↓ Below'}</span>
                      <span style={{ color: '#4a9eff', fontWeight: 600 }}>{formatINR(alert.targetPrice)}</span>
                      {isTriggered && <span style={{ backgroundColor: 'rgba(255,215,0,0.2)', color: '#ffd700', fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>Triggered!</span>}
                    </div>
                    {stock && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.25rem' }}>
                          <span>Current: {formatINR(stock.price)}</span>
                          <span>Target: {formatINR(alert.targetPrice)}</span>
                        </div>
                        <div style={{ height: '0.375rem', backgroundColor: '#1a2340', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: '9999px', transition: 'width 0.3s', width: `${Math.min(progress, 100)}%`, backgroundColor: isTriggered ? '#ffd700' : '#4a9eff' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => deleteAlert(alert._id)}
                  style={{ padding: '0.5rem', color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '0.75rem', transition: 'all 0.2s', flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#ff4757'; e.currentTarget.style.backgroundColor = 'rgba(255,71,87,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <Bell size={48} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.125rem' }}>No alerts set</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Create an alert to get notified when a stock hits your target</p>
        </div>
      )}
    </div>
  );
}
