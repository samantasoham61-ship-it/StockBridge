import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, TrendingUp, Shield, Lightbulb, DollarSign, BarChart2 } from 'lucide-react';

const faqs = [
  { q: 'How do I buy a stock?', a: 'Go to the Market page, hover over any stock card and click the green + button. A trade modal will open — set your quantity and confirm the purchase.' },
  { q: 'How is my P&L calculated?', a: 'P&L (Profit & Loss) = (Current Price − Avg Buy Price) × Quantity. It updates live as stock prices change every 5 seconds.' },
  { q: 'What is a Watchlist?', a: 'A watchlist lets you track stocks without buying them. Click the ★ icon on any stock card to add it. You can buy directly from the Watchlist page.' },
  { q: 'How do Price Alerts work?', a: 'Go to Alerts, set a target price and condition (above/below). When the live price crosses your target, a notification pops up instantly.' },
  { q: 'Are the prices real?', a: 'Prices are simulated in real-time using realistic market movement algorithms, updating every 5 seconds via WebSocket. They mirror real market behavior.' },
  { q: 'How is Avg Buy Price calculated?', a: 'If you buy the same stock multiple times, the avg buy price is recalculated as: (Old Qty × Old Avg + New Qty × New Price) ÷ Total Qty.' },
];

const guides = [
  {
    icon: TrendingUp, color: '#00d4aa', title: 'Getting Started',
    steps: ['Register an account on the login page', 'Visit the Market page to see live stock prices', 'Click + on any stock card to buy shares', 'Track your investments on the Portfolio page']
  },
  {
    icon: BarChart2, color: '#4a9eff', title: 'Reading Stock Cards',
    steps: ['Symbol & name shown at the top', 'Green badge = price going up, Red = going down', 'Large number is the current price in ₹', 'H/L shows today\'s high and low prices']
  },
  {
    icon: Shield, color: '#a855f7', title: 'Managing Risk',
    steps: ['Never invest more than you can afford to lose', 'Diversify across multiple stocks', 'Use Price Alerts to monitor key price levels', 'Review your Portfolio P&L regularly']
  },
  {
    icon: Lightbulb, color: '#ffd700', title: 'Pro Tips',
    steps: ['Use the Watchlist to shortlist stocks before buying', 'Check Market Sentiment on Dashboard before trading', 'Volume Leaders show which stocks are most active', 'Set both upper and lower alerts for each stock']
  },
];

const glossary = [
  { term: 'P&L', def: 'Profit & Loss — the gain or loss on your investment' },
  { term: 'Portfolio', def: 'The collection of all stocks you currently own' },
  { term: 'Avg Buy Price', def: 'The average price at which you bought a stock across all purchases' },
  { term: 'Volume', def: 'Number of shares traded in a given period — higher volume = more activity' },
  { term: 'Market Cap', def: 'Total market value of a company = Share Price × Total Shares' },
  { term: 'Bull Market', def: 'A market where prices are rising or expected to rise' },
  { term: 'Bear Market', def: 'A market where prices are falling or expected to fall' },
  { term: 'Diversification', def: 'Spreading investments across different stocks to reduce risk' },
  { term: 'Watchlist', def: 'A saved list of stocks you want to monitor without buying' },
  { term: 'Price Alert', def: 'A notification triggered when a stock reaches your target price' },
];

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left'
      }}>
        <span style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>{q}</span>
        {open ? <ChevronUp size={18} color="#4a9eff" /> : <ChevronDown size={18} color="rgba(255,255,255,0.4)" />}
      </button>
      {open && (
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', lineHeight: 1.7, paddingBottom: '1rem' }}>{a}</p>
      )}
    </div>
  );
}

export default function Help() {
  const [activeTab, setActiveTab] = useState('guides');
  const tabs = [
    { id: 'guides', label: 'Guides', icon: BookOpen },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'glossary', label: 'Glossary', icon: DollarSign },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(74,158,255,0.15), rgba(0,212,170,0.1))', border: '1px solid rgba(74,158,255,0.2)', borderRadius: '1rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: 'rgba(74,158,255,0.2)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HelpCircle size={22} color="#4a9eff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Help & Investor Guide</h1>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Everything you need to know to start investing confidently on StockSync.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', backgroundColor: '#1a2340', borderRadius: '0.75rem', padding: '0.25rem', gap: '0.25rem' }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            padding: '0.6rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
            fontWeight: 600, fontSize: '0.875rem',
            backgroundColor: activeTab === id ? '#4a9eff' : 'transparent',
            color: activeTab === id ? 'white' : 'rgba(255,255,255,0.5)'
          }}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Guides Tab */}
      {activeTab === 'guides' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {guides.map(({ icon: Icon, color, title, steps }) => (
            <div key={title} className="card" style={{ borderTop: `2px solid ${color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '2.25rem', height: '2.25rem', backgroundColor: `${color}20`, borderRadius: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={color} />
                </div>
                <h3 style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>{title}</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ width: '1.4rem', height: '1.4rem', borderRadius: '50%', backgroundColor: `${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.1rem' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color }}>{i + 1}</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', lineHeight: 1.6 }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="card">
          <h2 style={{ fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Frequently Asked Questions</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1rem' }}>Click any question to expand the answer.</p>
          {faqs.map((f, i) => <FAQ key={i} {...f} />)}
        </div>
      )}

      {/* Glossary Tab */}
      {activeTab === 'glossary' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {glossary.map(({ term, def }) => (
            <div key={term} style={{ backgroundColor: '#1a2340', borderRadius: '0.875rem', padding: '1rem', borderLeft: '3px solid #4a9eff' }}>
              <p style={{ color: '#4a9eff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>{term}</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', lineHeight: 1.6 }}>{def}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
