import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, TrendingUp, Briefcase, Star, Bell, Newspaper, ArrowLeftRight, Clock, HelpCircle, User, LogOut } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/market', label: 'Market', icon: TrendingUp },
  { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { path: '/watchlist', label: 'Watchlist', icon: Star },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/news', label: 'News', icon: Newspaper },
  { path: '/compare', label: 'Compare', icon: ArrowLeftRight },
  { path: '/transactions', label: 'History', icon: Clock },
  { path: '/help', label: 'Help', icon: HelpCircle },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Navbar() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
      width: '4.5rem',
      backgroundColor: 'rgba(10,14,26,0.97)',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '1rem',
      paddingBottom: '1rem',
    }}>
      {/* Logo */}
      <div style={{
        width: '2.5rem', height: '2.5rem', backgroundColor: '#4a9eff',
        borderRadius: '0.75rem', display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginBottom: '1.5rem', flexShrink: 0
      }}>
        <TrendingUp size={18} color="white" />
      </div>

      {/* Nav Items */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', flex: 1, width: '100%' }}>
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path} title={label}
              style={{
                width: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '0.65rem 0', gap: '0.2rem',
                textDecoration: 'none', transition: 'all 0.2s',
                color: active ? '#4a9eff' : 'rgba(255,255,255,0.4)',
                backgroundColor: active ? 'rgba(74,158,255,0.12)' : 'transparent',
                borderLeft: `3px solid ${active ? '#4a9eff' : 'transparent'}`,
                borderRight: '3px solid transparent',
              }}>
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span style={{ fontSize: '0.55rem', fontWeight: active ? 700 : 500, whiteSpace: 'nowrap' }}>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <button onClick={() => { logout(); navigate('/login'); }} title="Logout"
        style={{
          width: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '0.65rem 0', gap: '0.2rem',
          border: 'none', cursor: 'pointer', transition: 'all 0.2s',
          color: '#ff4757', backgroundColor: 'transparent',
          borderLeft: '3px solid transparent', borderRight: '3px solid transparent',
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,71,87,0.1)'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
        <LogOut size={20} strokeWidth={1.8} />
        <span style={{ fontSize: '0.55rem', fontWeight: 500 }}>Logout</span>
      </button>
    </nav>
  );
}
