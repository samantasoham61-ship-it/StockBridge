import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const STOCKS = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NFLX', 'JPM', 'V'];

function StockCanvas() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Floating ticker particles
    const particles = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      symbol: STOCKS[i % STOCKS.length],
      price: (Math.random() * 900 + 50).toFixed(2),
      change: (Math.random() * 6 - 3).toFixed(2),
      speed: Math.random() * 0.4 + 0.15,
      opacity: Math.random() * 0.25 + 0.08,
      size: Math.random() * 4 + 10,
    }));

    // Candlestick chart lines in background
    const lines = Array.from({ length: 8 }, () => {
      const points = [];
      let y = Math.random() * window.innerHeight;
      const startX = Math.random() * window.innerWidth * 0.5;
      for (let i = 0; i < 40; i++) {
        y += (Math.random() - 0.48) * 18;
        y = Math.max(50, Math.min(window.innerHeight - 50, y));
        points.push({ x: startX + i * 28, y });
      }
      return {
        points,
        color: Math.random() > 0.5 ? '#00d4aa' : '#4a9eff',
        opacity: Math.random() * 0.12 + 0.04,
        width: Math.random() * 1 + 0.5,
      };
    });

    // Grid dots
    const dots = [];
    for (let x = 0; x < window.innerWidth; x += 60) {
      for (let y = 0; y < window.innerHeight; y += 60) {
        dots.push({ x, y, opacity: Math.random() * 0.08 + 0.02 });
      }
    }

    let tick = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick++;

      // Grid dots
      dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74,158,255,${d.opacity})`;
        ctx.fill();
      });

      // Chart lines
      lines.forEach(line => {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.globalAlpha = line.opacity;
        ctx.lineWidth = line.width;
        line.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Floating stock labels
      particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < -40) {
          p.y = canvas.height + 40;
          p.x = Math.random() * canvas.width;
          p.price = (Math.random() * 900 + 50).toFixed(2);
          p.change = (Math.random() * 6 - 3).toFixed(2);
        }

        const isUp = parseFloat(p.change) >= 0;
        const color = isUp ? '#00d4aa' : '#ff4757';

        ctx.globalAlpha = p.opacity;
        ctx.font = `bold ${p.size}px monospace`;
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText(p.symbol, p.x, p.y);

        ctx.font = `${p.size - 2}px monospace`;
        ctx.fillStyle = color;
        ctx.fillText(`${isUp ? '▲' : '▼'} ${Math.abs(p.change)}%`, p.x, p.y + p.size + 2);
        ctx.globalAlpha = 1;
      });

      // Animated glowing orbs
      const t = tick * 0.008;
      [
        { cx: canvas.width * 0.15, cy: canvas.height * 0.25, r: 180, color: '74,158,255' },
        { cx: canvas.width * 0.85, cy: canvas.height * 0.7, r: 220, color: '0,212,170' },
        { cx: canvas.width * 0.5, cy: canvas.height * 0.9, r: 150, color: '168,85,247' },
      ].forEach(orb => {
        const pulse = Math.sin(t + orb.r) * 0.015 + 0.04;
        const grad = ctx.createRadialGradient(orb.cx, orb.cy, 0, orb.cx, orb.cy, orb.r);
        grad.addColorStop(0, `rgba(${orb.color},${pulse})`);
        grad.addColorStop(1, `rgba(${orb.color},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.cx, orb.cy, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
  );
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const switchTab = (toLogin) => {
    if (animating || toLogin === isLogin) return;
    setAnimating(true);
    setVisible(false);
    setTimeout(() => {
      setIsLogin(toLogin);
      setForm({ name: '', email: '', password: '' });
      setVisible(true);
      setAnimating(false);
    }, 280);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate('/dashboard');
      toast.success(`Welcome${isLogin ? ' back' : ''}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', position: 'relative' }}>
      <StockCanvas />

      <div style={{ width: '100%', maxWidth: '28rem', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '4rem', height: '4rem', backgroundColor: 'rgba(74,158,255,0.2)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid rgba(74,158,255,0.3)', boxShadow: '0 0 24px rgba(74,158,255,0.2)' }}>
            <TrendingUp size={32} color="#4a9eff" />
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white' }}>StockSync</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Real-time stock management platform</p>
        </div>

        <div className="card" style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(15,22,41,0.85)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', backgroundColor: '#1a2340', borderRadius: '0.75rem', padding: '0.25rem', marginBottom: '1.5rem', position: 'relative' }}>
            {/* Sliding pill */}
            <div style={{
              position: 'absolute', top: '0.25rem', bottom: '0.25rem',
              width: 'calc(50% - 0.25rem)',
              left: isLogin ? '0.25rem' : 'calc(50%)',
              backgroundColor: '#4a9eff',
              borderRadius: '0.5rem',
              transition: 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 12px rgba(74,158,255,0.4)',
            }} />
            {['Login', 'Register'].map(tab => {
              const active = (isLogin && tab === 'Login') || (!isLogin && tab === 'Register');
              return (
                <button key={tab} onClick={() => switchTab(tab === 'Login')}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                    backgroundColor: 'transparent', position: 'relative', zIndex: 1,
                    color: active ? 'white' : 'rgba(255,255,255,0.5)',
                    transition: 'color 0.3s ease',
                  }}>
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Animated form wrapper */}
          <div style={{
            transition: 'opacity 0.28s ease, transform 0.28s ease',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
          }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!isLogin && (
              <div>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', display: 'block', marginBottom: '0.375rem' }}>Full Name</label>
                <input type="text" placeholder="John Doe" required={!isLogin}
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field" />
              </div>
            )}
            <div>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', display: 'block', marginBottom: '0.375rem' }}>Email</label>
              <input type="email" placeholder="you@example.com" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field" />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', display: 'block', marginBottom: '0.375rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" required
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-field" style={{ paddingRight: '2.5rem' }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', opacity: loading ? 0.5 : 1 }}>
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          </div> {/* end animated wrapper */}

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={() => toast('Google login coming soon! Use email & password for now.', { icon: '🔔' })}
            style={{
              width: '100%', marginTop: '0.75rem', padding: '0.75rem',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
              color: 'white', fontSize: '0.9rem', fontWeight: 500
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
          >
            {/* Google SVG icon */}
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.5 39.5 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2C40.8 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/>
            </svg>
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginTop: '1rem' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => switchTab(!isLogin)} style={{ color: '#4a9eff', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>

        <div style={{ marginTop: '1rem', backgroundColor: 'rgba(74,158,255,0.1)', border: '1px solid rgba(74,158,255,0.2)', borderRadius: '0.75rem', padding: '0.75rem', textAlign: 'center' }}>
          <p style={{ color: '#4a9eff', fontSize: '0.75rem' }}>Demo: Register with any email & password to get started</p>
        </div>
      </div>
    </div>
  );
}
