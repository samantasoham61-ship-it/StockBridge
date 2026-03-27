import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useStocks } from '../context/StockContext';
import { User, Mail, Calendar, Briefcase, TrendingUp, TrendingDown, Activity, Edit2, Check, X, Camera } from 'lucide-react';
import { formatINR } from '../utils/currency';

const API = 'http://localhost:5000/api';

export default function Profile() {
  const { user } = useAuth();
  const { stocks } = useStocks();
  const [portfolio, setPortfolio] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(() => localStorage.getItem(`avatar_${user?.id}`) || null);
  const fileRef = useRef();

  useEffect(() => {
    if (user) {
      axios.get(`${API}/portfolio`).then(r => setPortfolio(r.data));
      axios.get(`${API}/watchlist`).then(r => setWatchlist(r.data.stocks || []));
      axios.get(`${API}/alerts`).then(r => setAlerts(r.data));
      setName(user.name);
    }
  }, [user]);

  const totalValue = portfolio?.holdings?.reduce((s, h) => {
    const live = stocks.find(x => x.symbol === h.symbol);
    const price = live?.price || h.currentPrice || h.avgBuyPrice;
    return s + price * h.quantity;
  }, 0) || 0;

  const totalInvested = portfolio?.totalInvested || 0;
  const totalPnL = totalValue - totalInvested;
  const pnlPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
  const holdingsCount = portfolio?.holdings?.length || 0;

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const joinDate = user?._id
    ? new Date(parseInt(user._id.substring(0, 8), 16) * 1000).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setAvatar(dataUrl);
      localStorage.setItem(`avatar_${user?.id}`, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const statCards = [
    { label: 'Portfolio Value', value: formatINR(totalValue), icon: Briefcase, color: '#4a9eff', bg: 'rgba(74,158,255,0.1)' },
    { label: 'Total Invested', value: formatINR(totalInvested), icon: Activity, color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
    { label: 'Total P&L', value: `${totalPnL >= 0 ? '+' : ''}${formatINR(totalPnL)}`, icon: totalPnL >= 0 ? TrendingUp : TrendingDown, color: totalPnL >= 0 ? '#00d4aa' : '#ff4757', bg: totalPnL >= 0 ? 'rgba(0,212,170,0.1)' : 'rgba(255,71,87,0.1)' },
    { label: 'Return', value: `${pnlPercent >= 0 ? '+' : ''}${pnlPercent.toFixed(2)}%`, icon: Activity, color: pnlPercent >= 0 ? '#00d4aa' : '#ff4757', bg: pnlPercent >= 0 ? 'rgba(0,212,170,0.1)' : 'rgba(255,71,87,0.1)' },
  ];

  const activityStats = [
    { label: 'Holdings', value: holdingsCount, color: '#4a9eff' },
    { label: 'Watchlist', value: watchlist.length, color: '#ffd700' },
    { label: 'Alerts', value: alerts.length, color: '#a855f7' },
    { label: 'Active Alerts', value: alerts.filter(a => !a.triggered).length, color: '#00d4aa' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '48rem', margin: '0 auto' }}>

      {/* Profile Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(74,158,255,0.1), rgba(168,85,247,0.08))', borderColor: 'rgba(74,158,255,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div
              onClick={() => fileRef.current.click()}
              style={{
                width: '5rem', height: '5rem', borderRadius: '50%',
                background: avatar ? 'none' : 'linear-gradient(135deg, #4a9eff, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 800, color: 'white',
                boxShadow: '0 0 0 4px rgba(74,158,255,0.2)',
                cursor: 'pointer', overflow: 'hidden', position: 'relative'
              }}>
              {avatar
                ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initials
              }
              {/* Hover overlay */}
              <div style={{
                position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.2s', borderRadius: '50%'
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                <Camera size={20} color="white" />
              </div>
            </div>
            {/* Camera badge */}
            <button
              onClick={() => fileRef.current.click()}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: '1.6rem', height: '1.6rem', borderRadius: '50%',
                backgroundColor: '#4a9eff', border: '2px solid #0f1629',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer'
              }}>
              <Camera size={11} color="white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>

          <div style={{ flex: 1 }}>
            {editing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="input-field" style={{ maxWidth: '16rem', padding: '0.4rem 0.75rem', fontSize: '1rem', fontWeight: 700 }} />
                <button onClick={() => setEditing(false)}
                  style={{ padding: '0.4rem', backgroundColor: 'rgba(0,212,170,0.15)', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', color: '#00d4aa' }}>
                  <Check size={16} />
                </button>
                <button onClick={() => { setName(user.name); setEditing(false); }}
                  style={{ padding: '0.4rem', backgroundColor: 'rgba(255,71,87,0.15)', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', color: '#ff4757' }}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>{name}</h1>
                <button onClick={() => setEditing(true)}
                  style={{ padding: '0.3rem', backgroundColor: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
                  <Edit2 size={13} />
                </button>
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.4rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
                <Mail size={13} /> {user?.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
                <Calendar size={13} /> Joined {joinDate}
              </span>
            </div>
          </div>

          {/* Investor badge */}
          <div style={{ backgroundColor: totalValue > totalInvested ? 'rgba(0,212,170,0.15)' : 'rgba(255,71,87,0.15)', border: `1px solid ${totalValue > totalInvested ? 'rgba(0,212,170,0.3)' : 'rgba(255,71,87,0.3)'}`, borderRadius: '0.75rem', padding: '0.5rem 1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.2rem' }}>Investor Status</p>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: totalValue > totalInvested ? '#00d4aa' : '#ff4757' }}>
              {holdingsCount === 0 ? '🌱 Beginner' : holdingsCount <= 3 ? '📈 Learner' : holdingsCount <= 6 ? '💼 Trader' : '🏆 Pro Investor'}
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div>
        <h2 style={{ fontWeight: 700, color: 'white', marginBottom: '0.75rem', fontSize: '1rem' }}>Portfolio Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card" style={{ padding: '1rem' }}>
              <div style={{ width: '2rem', height: '2rem', backgroundColor: bg, borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.6rem' }}>
                <Icon size={16} color={color} />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{label}</p>
              <p style={{ color, fontWeight: 700, fontSize: '1rem', marginTop: '0.2rem' }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Stats */}
      <div>
        <h2 style={{ fontWeight: 700, color: 'white', marginBottom: '0.75rem', fontSize: '1rem' }}>Activity</h2>
        <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', padding: '1.25rem' }}>
          {activityStats.map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#1a2340', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, color }}>{value}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Holdings List */}
      {portfolio?.holdings?.length > 0 && (
        <div>
          <h2 style={{ fontWeight: 700, color: 'white', marginBottom: '0.75rem', fontSize: '1rem' }}>Current Holdings</h2>
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {portfolio.holdings.map(h => {
                const live = stocks.find(s => s.symbol === h.symbol);
                const price = live?.price || h.currentPrice || h.avgBuyPrice;
                const pnl = (price - h.avgBuyPrice) * h.quantity;
                const pct = ((price - h.avgBuyPrice) / h.avgBuyPrice) * 100;
                return (
                  <div key={h.symbol} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#1a2340', borderRadius: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '2.25rem', height: '2.25rem', background: 'linear-gradient(135deg, #4a9eff33, #a855f733)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.65rem', color: '#4a9eff' }}>{h.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, color: 'white', fontSize: '0.875rem' }}>{h.symbol}</p>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>{h.quantity} shares · avg {formatINR(h.avgBuyPrice)}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>{formatINR(price * h.quantity)}</p>
                      <p style={{ fontSize: '0.72rem', color: pnl >= 0 ? '#00d4aa' : '#ff4757' }}>
                        {pnl >= 0 ? '+' : ''}{formatINR(pnl)} ({pct >= 0 ? '+' : ''}{pct.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
