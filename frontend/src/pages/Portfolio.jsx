import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useStocks } from '../context/StockContext';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import TradeModal from '../components/TradeModal';
import { formatINR } from '../utils/currency';

const API = 'http://localhost:5000/api';
const COLORS = ['#4a9eff', '#00d4aa', '#a855f7', '#ffd700', '#ff4757', '#ff6b35', '#00b4d8', '#06d6a0'];

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [tradeModal, setTradeModal] = useState(null);
  const { stocks } = useStocks();
  const { user } = useAuth();

  const fetchPortfolio = () => axios.get(`${API}/portfolio`).then(r => setPortfolio(r.data));
  useEffect(() => { if (user) fetchPortfolio(); }, [user]);

  const holdings = portfolio?.holdings?.map(h => {
    const live = stocks.find(s => s.symbol === h.symbol);
    const currentPrice = live?.price || h.currentPrice || h.avgBuyPrice;
    const value = currentPrice * h.quantity;
    const invested = h.avgBuyPrice * h.quantity;
    const pnl = value - invested;
    const pnlPercent = (pnl / invested) * 100;
    return { ...h, currentPrice, value, invested, pnl, pnlPercent };
  }) || [];

  const totalValue = holdings.reduce((s, h) => s + h.value, 0);
  const totalInvested = holdings.reduce((s, h) => s + h.invested, 0);
  const totalPnL = totalValue - totalInvested;
  const pnlPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  const pieData = holdings.map(h => ({ name: h.symbol, value: parseFloat(h.value.toFixed(2)) }));

  const summaryCards = [
    { label: 'Total Value', value: formatINR(totalValue), color: '#4a9eff' },
    { label: 'Invested', value: formatINR(totalInvested), color: 'white' },
    { label: 'P&L', value: `${totalPnL >= 0 ? '+' : ''}${formatINR(totalPnL)}`, color: totalPnL >= 0 ? '#00d4aa' : '#ff4757' },
    { label: 'Return', value: `${pnlPercent >= 0 ? '+' : ''}${pnlPercent.toFixed(2)}%`, color: pnlPercent >= 0 ? '#00d4aa' : '#ff4757' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>My Portfolio</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Track your investments and performance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        {summaryCards.map(({ label, value, color }) => (
          <div key={label} className="card" style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{label}</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color }}>{value}</p>
          </div>
        ))}
      </div>

      {holdings.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <h2 style={{ fontWeight: 700, color: 'white', marginBottom: '1rem' }}>Allocation</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  formatter={v => [formatINR(v), 'Value']} />
                <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ overflowX: 'auto', gridColumn: 'span 2' }}>
            <h2 style={{ fontWeight: 700, color: 'white', marginBottom: '1rem' }}>Holdings</h2>
            <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Stock', 'Qty', 'Avg Price', 'Current', 'Value', 'P&L', 'Action'].map(h => (
                    <th key={h} style={{ textAlign: 'left', paddingBottom: '0.75rem', paddingRight: '1rem', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {holdings.map(h => (
                  <tr key={h.symbol} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem 1rem 0.75rem 0' }}>
                      <p style={{ fontWeight: 600, color: 'white' }}>{h.symbol}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{h.name}</p>
                    </td>
                    <td style={{ padding: '0.75rem 1rem 0.75rem 0', color: 'rgba(255,255,255,0.7)' }}>{h.quantity}</td>
                    <td style={{ padding: '0.75rem 1rem 0.75rem 0', color: 'rgba(255,255,255,0.7)' }}>{formatINR(h.avgBuyPrice)}</td>
                    <td style={{ padding: '0.75rem 1rem 0.75rem 0' }}>
                      <p style={{ color: 'white' }}>{formatINR(h.currentPrice)}</p>
                      <p style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.125rem', color: h.pnlPercent >= 0 ? '#00d4aa' : '#ff4757' }}>
                        {h.pnlPercent >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {h.pnlPercent?.toFixed(2)}%
                      </p>
                    </td>
                    <td style={{ padding: '0.75rem 1rem 0.75rem 0', color: 'white', fontWeight: 500 }}>{formatINR(h.value)}</td>
                    <td style={{ padding: '0.75rem 1rem 0.75rem 0', fontWeight: 600, color: h.pnl >= 0 ? '#00d4aa' : '#ff4757' }}>
                      {h.pnl >= 0 ? '+' : ''}{formatINR(h.pnl)}
                    </td>
                    <td style={{ padding: '0.75rem 0' }}>
                      <button onClick={() => setTradeModal({ stock: { ...h, change: h.pnl, changePercent: h.pnlPercent }, mode: 'sell', holding: h })}
                        className="btn-danger" style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}>Sell</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.125rem' }}>No holdings yet</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Go to Market to buy your first stock</p>
        </div>
      )}

      {tradeModal && (
        <TradeModal {...tradeModal} onClose={() => setTradeModal(null)} onSuccess={fetchPortfolio} />
      )}
    </div>
  );
}
