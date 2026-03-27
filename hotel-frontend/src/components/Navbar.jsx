import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, User, LogOut, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000, 
      background: 'rgba(255, 255, 255, 0.8)', 
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0',
      padding: '16px 0'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'var(--secondary)' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Hotel size={24} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Hotelly<span style={{ color: 'var(--primary)' }}>.</span>
          </span>
        </Link>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link to="/" className="hide-mobile" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem' }}>Explore</Link>
          <Link to="/" className="hide-mobile" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem' }}>Resources</Link>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <User size={18} />
                </div>
                {user.name.split(' ')[0]}
              </Link>
              <button onClick={logout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link to="/login" className="btn btn-secondary" style={{ 
                padding: '10px 24px', 
                borderRadius: '12px', 
                fontWeight: '600',
                border: '1px solid #e2e8f0',
                background: 'transparent',
                color: 'var(--text-main)',
                fontSize: '0.9rem'
              }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ 
                padding: '10px 24px', 
                borderRadius: '12px', 
                fontWeight: '700',
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
              }}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
