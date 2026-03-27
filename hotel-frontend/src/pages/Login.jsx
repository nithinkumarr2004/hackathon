import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      login(res.data, res.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
      <div className="glass animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '48px', borderRadius: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 24px' }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Enter your credentials to access your account</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '0.9rem', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} size={20} />
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '48px', borderRadius: '16px' }}
              />
            </div>
          </div>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
               <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>Password</label>
               <a href="#" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Forgot password?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} size={20} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '48px', borderRadius: '16px' }}
              />
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '16px', fontSize: '1.1rem', fontWeight: '600', marginBottom: '24px' }}>
            Sign In
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '700' }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
