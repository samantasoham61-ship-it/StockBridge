import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStocks } from '../context/StockContext';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, DollarSign, Briefcase, Activity, ArrowRight, Zap, BarChart2, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import StockCard from '../components/StockCard';
import TradeModal from '../components/TradeModal';
import toast from 'react-hot-toast';
import { formatINR } from '../utils/currency';

const API = 'http://localhost:5000/api';

const generateSparkline = (base) => {
  let price = base * 0.95;
  return Array.from({ length: 20 }, () => {
    price += (Math.random() - 0.48) * price * 0.01;
    return { value: parseFloat(price.toFixed(2)) };
  });
};

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' },
  stockGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' },
  iconBox: (bg) => ({ width: '2.5rem', height: '2.5rem', backgroundColor: bg, borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }),
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' },
  viewAll: { color: '#4a9eff', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer' },
  rankRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#1a2340', borderRadius: '0.75rem' },
};

export default function Dashboard() {
  const { stocks } = useStocks();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [tradeModal, setTradeModal] = useState(null);

  useEffect(() => {
    if (user) {
      axios.get(`${API}/portfolio`).then(r => setPortfolio(r.data));
      axios.get(`${API}/watchlist`).then(r => setWatchlist(r.data.stocks || []));
    }
  }, [user]);

  const totalValue = portfolio?.holdings?.reduce((s, h) => s + h.currentPrice * h.quantity, 0) || 0;
  const totalInvested = portfolio?.totalInvested || 0;
  const totalPnL = totalValue - totalInvested;
  const pnlPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  const topGainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  const topLosers = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 3);

  const gainersCount = stocks.filter(s => s.change > 0).length;
  const total = stocks.length || 1;
  const bullPct = Math.round((gainersCount / total) * 100);
  const sentiment = bullPct >= 60
    ? { label: 'Bullish 🐂', color: '#00d4aa' }
    : bullPct <= 40
    ? { label: 'Bearish 🐻', color: '#ff4757' }
    : { label: 'Neutral ⚖️', color: '#ffd700' };

  const volumeData = [...stocks]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 6)
    .map(s => ({ name: s.symbol, volume: parseFloat((s.volume / 1e6).toFixed(1)), up: s.change >= 0 }));

  const snapshotStats = stocks.length ? [
    { label: 'Highest Price', val: formatINR(Math.max(...stocks.map(s => s.price || 0))), sub: stocks.reduce((a, b) => (a.price > b.price ? a : b), stocks[0])?.symbol, color: '#4a9eff' },
    { label: 'Lowest Price', val: formatINR(Math.min(...stocks.filter(s => s.price > 0).map(s => s.price))), sub: stocks.filter(s => s.price > 0).reduce((a, b) => (a.price < b.price ? a : b), stocks[0])?.symbol, color: '#a855f7' },
    { label: 'Best Gainer', val: `+${Math.max(...stocks.map(s => s.changePercent || 0)).toFixed(2)}%`, sub: topGainers[0]?.symbol, color: '#00d4aa' },
    { label: 'Worst Loser', val: `${Math.min(...stocks.map(s => s.changePercent || 0)).toFixed(2)}%`, sub: topLosers[0]?.symbol, color: '#ff4757' },
    { label: 'Avg Change', val: `${(stocks.reduce((s, x) => s + (x.changePercent || 0), 0) / total).toFixed(2)}%`, sub: 'All stocks', color: '#ffd700' },
    { label: 'Total Volume', val: `${(stocks.reduce((s, x) => s + (x.volume || 0), 0) / 1e9).toFixed(2)}B`, sub: 'Shares traded', color: '#ff6b35' },
  ] : [];

  const handleWatchlist = async (stock) => {
    const isWatched = watchlist.find(s => s.symbol === stock.symbol);
    if (isWatched) {
      await axios.delete(`${API}/watchlist/remove/${stock.symbol}`);
      setWatchlist(prev => prev.filter(s => s.symbol !== stock.symbol));
      toast.success('Removed from watchlist');
    } else {
      const res = await axios.post(`${API}/watchlist/add`, { symbol: stock.symbol, name: stock.name });
      setWatchlist(res.data.stocks);
      toast.success('Added to watchlist');
    }
  };

  const statCards = [
    { label: 'Portfolio Value', value: formatINR(totalValue), Icon: DollarSign, color: '#4a9eff', bg: 'rgba(74,158,255,0.1)' },
    { label: 'Total Invested', value: formatINR(totalInvested), Icon: Briefcase, color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
    { label: 'Total P&L', value: `${totalPnL >= 0 ? '+' : ''}${formatINR(totalPnL)}`, Icon: totalPnL >= 0 ? TrendingUp : TrendingDown, color: totalPnL >= 0 ? '#00d4aa' : '#ff4757', bg: totalPnL >= 0 ? 'rgba(0,212,170,0.1)' : 'rgba(255,71,87,0.1)' },
    { label: 'Return %', value: `${pnlPercent >= 0 ? '+' : ''}${pnlPercent.toFixed(2)}%`, Icon: Activity, color: pnlPercent >= 0 ? '#00d4aa' : '#ff4757', bg: pnlPercent >= 0 ? 'rgba(0,212,170,0.1)' : 'rgba(255,71,87,0.1)' },
  ];

  return (
    <div className="animate-fade-in" style={S.page}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Here's your portfolio overview</p>
      </div>

      {/* Stat Cards */}
      <div style={S.grid4}>
        {statCards.map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="card">
            <div style={S.iconBox(bg)}><Icon size={20} color={color} /></div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{label}</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem', color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Chart + Holdings */}
      <div style={S.grid2}>
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div style={S.header}>
            <h2 style={{ fontWeight: 700, color: 'white' }}>Portfolio Performance</h2>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>Simulated</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={generateSparkline(totalValue || 10000)}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4a9eff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4a9eff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                formatter={v => [formatINR(v), 'Value']} />
              <Area type="monotone" dataKey="value" stroke="#4a9eff" strokeWidth={2} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div style={S.header}>
            <h2 style={{ fontWeight: 700, color: 'white' }}>Holdings</h2>
            <button onClick={() => navigate('/portfolio')} style={S.viewAll}>View all <ArrowRight size={12} /></button>
          </div>
          {portfolio?.holdings?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {portfolio.holdings.slice(0, 4).map(h => {
                const pnl = (h.currentPrice - h.avgBuyPrice) * h.quantity;
                return (
                  <div key={h.symbol} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontWeight: 600, color: 'white', fontSize: '0.875rem' }}>{h.symbol}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{h.quantity} shares</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: 500 }}>{formatINR(h.currentPrice * h.quantity)}</p>
                      <p style={{ fontSize: '0.75rem', color: pnl >= 0 ? '#00d4aa' : '#ff4757' }}>{pnl >= 0 ? '+' : ''}{formatINR(pnl)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>No holdings yet</p>
              <button onClick={() => navigate('/market')} className="btn-primary" style={{ marginTop: '0.75rem', fontSize: '0.875rem', padding: '0.5rem 1rem' }}>Buy Stocks</button>
            </div>
          )}
        </div>

        {/* Top Gainers */}
        <div className="card">
          <h2 style={{ fontWeight: 700, color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="#00d4aa" /> Top Gainers
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topGainers.map(s => (
              <div key={s.symbol} style={S.rankRow}>
                <div>
                  <p style={{ fontWeight: 600, color: 'white', fontSize: '0.875rem' }}>{s.symbol}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{formatINR(s.price)}</p>
                </div>
                <span className="badge-up">+{s.changePercent?.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="card">
          <h2 style={{ fontWeight: 700, color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingDown size={18} color="#ff4757" /> Top Losers
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topLosers.map(s => (
              <div key={s.symbol} style={S.rankRow}>
                <div>
                  <p style={{ fontWeight: 600, color: 'white', fontSize: '0.875rem' }}>{s.symbol}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{formatINR(s.price)}</p>
                </div>
                <span className="badge-down">{s.changePercent?.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Sentiment + Volume Leaders + Snapshot */}
      <div style={S.grid2}>

        {/* Sentiment Meter */}
        <div className="card">
          <h2 style={{ fontWeight: 700, color: 'white', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={18} color="#ffd700" /> Market Sentiment
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: sentiment.color }}>{sentiment.label}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{gainersCount} of {total} stocks advancing</p>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#00d4aa' }}>Bull {bullPct}%</span>
                <span style={{ color: '#ff4757' }}>Bear {100 - bullPct}%</span>
              </div>
              <div style={{ height: '10px', borderRadius: '9999px', backgroundColor: 'rgba(255,71,87,0.3)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${bullPct}%`, borderRadius: '9999px', background: 'linear-gradient(90deg, #00d4aa, #4a9eff)', transition: 'width 0.8s ease' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              {[
                { label: 'Advancing', val: gainersCount, color: '#00d4aa' },
                { label: 'Declining', val: total - gainersCount, color: '#ff4757' },
                { label: 'Total', val: total, color: '#4a9eff' }
              ].map(({ label, val, color }) => (
                <div key={label} style={{ backgroundColor: '#1a2340', borderRadius: '0.75rem', padding: '0.6rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700, color }}>{val}</p>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Volume Leaders Bar Chart */}
        <div className="card">
          <h2 style={{ fontWeight: 700, color: 'white', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={18} color="#a855f7" /> Volume Leaders
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={volumeData} barSize={28} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                formatter={v => [`${v}M shares`, 'Volume']} />
              <Bar dataKey="volume" radius={[6, 6, 0, 0]} label={{ position: 'top', fill: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 600, formatter: v => `${v}M` }}>
                {volumeData.map((entry, i) => (
                  <Cell key={i} fill={entry.up ? '#00d4aa' : '#ff4757'} fillOpacity={0.9} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', textAlign: 'center', marginTop: '0.5rem' }}>Volume in millions · Green = gaining · Red = losing</p>
        </div>

        {/* Market Snapshot */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h2 style={{ fontWeight: 700, color: 'white', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="#4a9eff" /> Market Snapshot
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {snapshotStats.map(({ label, val, sub, color }) => (
              <div key={label} style={{ backgroundColor: '#1a2340', borderRadius: '0.75rem', padding: '0.875rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginBottom: '0.35rem' }}>{label}</p>
                <p style={{ color, fontWeight: 700, fontSize: '1rem' }}>{val}</p>
                {sub && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{sub}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Market */}
      <div>
        <div style={S.header}>
          <h2 style={{ fontWeight: 700, color: 'white' }}>Live Market</h2>
          <button onClick={() => navigate('/market')} style={S.viewAll}>View all <ArrowRight size={14} /></button>
        </div>
        <div style={S.stockGrid}>
          {stocks.slice(0, 8).map(stock => (
            <StockCard key={stock.symbol} stock={stock}
              onBuy={s => setTradeModal({ stock: s, mode: 'buy' })}
              onWatchlist={handleWatchlist}
              isWatched={watchlist.some(w => w.symbol === stock.symbol)} />
          ))}
        </div>
      </div>

      {tradeModal && (
        <TradeModal {...tradeModal} onClose={() => setTradeModal(null)}
          onSuccess={() => axios.get(`${API}/portfolio`).then(r => setPortfolio(r.data))} />
      )}
    </div>
  );
}
