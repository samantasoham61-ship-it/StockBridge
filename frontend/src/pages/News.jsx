import { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, TrendingDown, RefreshCw, ExternalLink } from 'lucide-react';

const generateNews = () => {
  const templates = [
    { title: '{sym} Surges {pct}% After Strong Earnings Report', sentiment: 'positive' },
    { title: '{sym} Hits All-Time High Amid Market Rally', sentiment: 'positive' },
    { title: 'Analysts Upgrade {sym} to Buy, Target Price Raised', sentiment: 'positive' },
    { title: '{sym} Announces $5B Share Buyback Program', sentiment: 'positive' },
    { title: '{sym} Beats Revenue Estimates by {pct}%', sentiment: 'positive' },
    { title: '{sym} Partners with AI Firm to Boost Growth', sentiment: 'positive' },
    { title: '{sym} Drops {pct}% on Weak Quarterly Guidance', sentiment: 'negative' },
    { title: 'Regulatory Probe Weighs on {sym} Stock', sentiment: 'negative' },
    { title: '{sym} Misses Earnings Estimates, Shares Fall', sentiment: 'negative' },
    { title: 'Analysts Downgrade {sym} Amid Macro Concerns', sentiment: 'negative' },
    { title: 'Fed Rate Decision Creates Volatility in {sym}', sentiment: 'neutral' },
    { title: '{sym} Consolidates Ahead of Earnings Release', sentiment: 'neutral' },
    { title: 'Market Watch: {sym} Trading Range Tightens', sentiment: 'neutral' },
    { title: 'Institutional Investors Increase {sym} Holdings', sentiment: 'positive' },
    { title: '{sym} CEO Speaks at Global Tech Summit', sentiment: 'neutral' },
  ];

  const stocks = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NFLX', 'JPM', 'V'];
  const sources = ['Bloomberg', 'Reuters', 'CNBC', 'Financial Times', 'WSJ', 'MarketWatch', 'Economic Times'];
  const categories = ['Earnings', 'Analysis', 'Market', 'Technology', 'Economy', 'Regulation'];

  return Array.from({ length: 20 }, (_, i) => {
    const tmpl = templates[i % templates.length];
    const sym = stocks[Math.floor(Math.random() * stocks.length)];
    const pct = (Math.random() * 8 + 1).toFixed(1);
    const minsAgo = Math.floor(Math.random() * 300) + 5;
    return {
      id: i,
      title: tmpl.title.replace('{sym}', sym).replace('{pct}', pct),
      sentiment: tmpl.sentiment,
      symbol: sym,
      source: sources[Math.floor(Math.random() * sources.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      time: minsAgo < 60 ? `${minsAgo}m ago` : `${Math.floor(minsAgo / 60)}h ago`,
      summary: `${sym} stock ${tmpl.sentiment === 'positive' ? 'gained momentum' : tmpl.sentiment === 'negative' ? 'faced selling pressure' : 'remained range-bound'} as investors reacted to the latest developments. Market participants are closely watching upcoming catalysts.`,
    };
  }).sort((a, b) => parseInt(a.time) - parseInt(b.time));
};

export default function News() {
  const [news, setNews] = useState([]);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = () => setNews(generateNews());

  useEffect(() => { load(); }, []);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => { load(); setRefreshing(false); }, 800);
  };

  const filtered = news.filter(n => filter === 'all' || n.sentiment === filter || n.symbol === filter);
  const symbols = [...new Set(news.map(n => n.symbol))];

  const sentimentColor = { positive: '#00d4aa', negative: '#ff4757', neutral: '#ffd700' };
  const sentimentBg = { positive: 'rgba(0,212,170,0.1)', negative: 'rgba(255,71,87,0.1)', neutral: 'rgba(255,215,0,0.1)' };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Newspaper size={24} color="#4a9eff" /> Market News
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{news.length} stories · Updated just now</p>
        </div>
        <button onClick={refresh} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', backgroundColor: '#1a2340', border: 'none', borderRadius: '0.75rem', color: '#4a9eff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} /> Refresh
        </button>
      </div>

      {/* Sentiment summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        {['positive', 'negative', 'neutral'].map(s => {
          const count = news.filter(n => n.sentiment === s).length;
          return (
            <div key={s} style={{ backgroundColor: sentimentBg[s], border: `1px solid ${sentimentColor[s]}30`, borderRadius: '0.875rem', padding: '0.875rem', textAlign: 'center', cursor: 'pointer' }}
              onClick={() => setFilter(filter === s ? 'all' : s)}>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: sentimentColor[s] }}>{count}</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'capitalize', marginTop: '0.2rem' }}>
                {s === 'positive' ? '🐂 Bullish' : s === 'negative' ? '🐻 Bearish' : '⚖️ Neutral'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Symbol filter chips */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} style={{ padding: '0.3rem 0.75rem', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, backgroundColor: filter === 'all' ? '#4a9eff' : '#1a2340', color: filter === 'all' ? 'white' : 'rgba(255,255,255,0.5)' }}>All</button>
        {symbols.map(sym => (
          <button key={sym} onClick={() => setFilter(filter === sym ? 'all' : sym)}
            style={{ padding: '0.3rem 0.75rem', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, backgroundColor: filter === sym ? '#4a9eff' : '#1a2340', color: filter === sym ? 'white' : 'rgba(255,255,255,0.5)' }}>
            {sym}
          </button>
        ))}
      </div>

      {/* News Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(n => (
          <div key={n.id} className="card" style={{ cursor: 'pointer', transition: 'border-color 0.2s', borderColor: expanded === n.id ? sentimentColor[n.sentiment] + '40' : undefined }}
            onClick={() => setExpanded(expanded === n.id ? null : n.id)}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', backgroundColor: sentimentBg[n.sentiment], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {n.sentiment === 'positive' ? <TrendingUp size={16} color={sentimentColor[n.sentiment]} /> : n.sentiment === 'negative' ? <TrendingDown size={16} color={sentimentColor[n.sentiment]} /> : <Newspaper size={16} color={sentimentColor[n.sentiment]} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.1rem 0.5rem', borderRadius: '9999px', backgroundColor: 'rgba(74,158,255,0.15)', color: '#4a9eff' }}>{n.symbol}</span>
                  <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: '9999px', backgroundColor: sentimentBg[n.sentiment], color: sentimentColor[n.sentiment], fontWeight: 600 }}>{n.category}</span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{n.source} · {n.time}</span>
                </div>
                <p style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.5 }}>{n.title}</p>
                {expanded === n.id && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', lineHeight: 1.7 }}>{n.summary}</p>
                    <button style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#4a9eff', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
                      <ExternalLink size={13} /> Read full article
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
