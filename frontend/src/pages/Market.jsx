import { useState } from 'react';
import { useStocks } from '../context/StockContext';
import { Search, SlidersHorizontal } from 'lucide-react';
import StockCard from '../components/StockCard';
import TradeModal from '../components/TradeModal';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000/api';

export default function Market() {
  const { stocks } = useStocks();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [filter, setFilter] = useState('all');
  const [tradeModal, setTradeModal] = useState(null);
  const [watchlist, setWatchlist] = useState([]);

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

  const filtered = stocks
    .filter(s => {
      const matchSearch = s.symbol.toLowerCase().includes(search.toLowerCase()) ||
        s.name?.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || (filter === 'gainers' && s.change > 0) || (filter === 'losers' && s.change < 0);
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'change') return b.changePercent - a.changePercent;
      if (sort === 'volume') return b.volume - a.volume;
      return 0;
    });

  const gainers = stocks.filter(s => s.change > 0).length;
  const losers = stocks.filter(s => s.change < 0).length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Live Market</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Real-time prices updated every 5 seconds</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ backgroundColor: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: '0.75rem', padding: '0.5rem 0.75rem', textAlign: 'center' }}>
            <p style={{ color: '#00d4aa', fontWeight: 700 }}>{gainers}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Gainers</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)', borderRadius: '0.75rem', padding: '0.5rem 0.75rem', textAlign: 'center' }}>
            <p style={{ color: '#ff4757', fontWeight: 700 }}>{losers}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Losers</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '12rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
          <input type="text" placeholder="Search stocks..." value={search}
            onChange={e => setSearch(e.target.value)} className="input-field" style={{ paddingLeft: '2.25rem' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'gainers', 'losers'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '0.625rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 500, textTransform: 'capitalize', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                backgroundColor: filter === f ? '#4a9eff' : '#1a2340',
                color: filter === f ? 'white' : 'rgba(255,255,255,0.5)' }}>{f}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#1a2340', borderRadius: '0.75rem', padding: '0 0.75rem' }}>
          <SlidersHorizontal size={14} color="rgba(255,255,255,0.4)" />
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', padding: '0.625rem 0', border: 'none', outline: 'none', cursor: 'pointer' }}>
            <option value="default">Default</option>
            <option value="price-desc">Price ↓</option>
            <option value="price-asc">Price ↑</option>
            <option value="change">Best Change</option>
            <option value="volume">Volume</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {filtered.map(stock => (
          <StockCard key={stock.symbol} stock={stock}
            onBuy={s => setTradeModal({ stock: s, mode: 'buy' })}
            onWatchlist={handleWatchlist}
            isWatched={watchlist.some(w => w.symbol === stock.symbol)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.125rem' }}>No stocks found</p>
        </div>
      )}

      {tradeModal && (
        <TradeModal {...tradeModal} onClose={() => setTradeModal(null)} onSuccess={() => {}} />
      )}
    </div>
  );
}
