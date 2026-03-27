import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ArrowDownCircle, ArrowUpCircle, Filter } from 'lucide-react';
import { formatINR } from '../utils/currency';

const API = 'http://localhost:5000/api';

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) axios.get(`${API}/transactions`).then(r => setTransactions(r.data));
  }, [user]);

  const filtered = transactions.filter(t => filter === 'all' || t.type === filter);

  const totalBought = transactions.filter(t => t.type === 'buy').reduce((s, t) => s + t.total, 0);
  const totalSold = transactions.filter(t => t.type === 'sell').reduce((s, t) => s + t.total, 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Transaction History</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginTop: '0.25rem' }}>All your buy & sell activity</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Transactions', value: transactions.length, color: '#4a9eff' },
          { label: 'Total Bought', value: formatINR(totalBought), color: '#00d4aa' },
          { label: 'Total Sold', value: formatINR(totalSold), color: '#ff4757' },
          { label: 'Net Flow', value: formatINR(totalSold - totalBought), color: totalSold >= totalBought ? '#00d4aa' : '#ff4757' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ textAlign: 'center', padding: '1rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', marginBottom: '0.3rem' }}>{label}</p>
            <p style={{ color, fontWeight: 700, fontSize: '1.1rem' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Filter size={16} color="rgba(255,255,255,0.3)" style={{ alignSelf: 'center' }} />
        {['all', 'buy', 'sell'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '0.4rem 1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, textTransform: 'capitalize', transition: 'all 0.2s',
              backgroundColor: filter === f ? (f === 'buy' ? '#00d4aa' : f === 'sell' ? '#ff4757' : '#4a9eff') : '#1a2340',
              color: filter === f ? (f === 'sell' ? 'white' : '#0a0e1a') : 'rgba(255,255,255,0.5)' }}>
            {f === 'all' ? 'All' : f === 'buy' ? '▲ Buys' : '▼ Sells'}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="card" style={{ padding: '0.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((t, i) => (
              <div key={t._id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.875rem 1rem', borderRadius: '0.75rem', transition: 'background 0.15s',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
              }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  {t.type === 'buy'
                    ? <ArrowDownCircle size={28} color="#00d4aa" />
                    : <ArrowUpCircle size={28} color="#ff4757" />}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'white' }}>{t.symbol}</span>
                      <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.5rem', borderRadius: '9999px', fontWeight: 600,
                        backgroundColor: t.type === 'buy' ? 'rgba(0,212,170,0.15)' : 'rgba(255,71,87,0.15)',
                        color: t.type === 'buy' ? '#00d4aa' : '#ff4757' }}>
                        {t.type.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: '0.15rem' }}>
                      {t.quantity} shares @ {formatINR(t.price)}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>{formatINR(t.total)}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', marginTop: '0.15rem' }}>
                    {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <ArrowDownCircle size={48} color="rgba(255,255,255,0.1)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>No transactions yet</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Buy or sell a stock to see history here</p>
        </div>
      )}
    </div>
  );
}
