import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, CheckCircle, Clock, MapPin, User, Settings, LogOut, Package } from 'lucide-react';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0 });

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:8080/api/bookings/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setBookings(res.data);
        setStats({
          total: res.data.length,
          active: res.data.filter(b => b.status === 'CONFIRMED').length
        });
      })
      .catch(err => console.error(err));
    }
  }, [user, token]);

  if (!user) return (
    <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
      <div className="glass" style={{ padding: '40px', borderRadius: '24px', maxWidth: '500px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '16px' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Please login to view your personal dashboard and manage bookings.</p>
        <button className="btn btn-primary" onClick={() => window.location.href='/login'}>Sign In Now</button>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: '60px 0 100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
        <div>
          <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', letterSpacing: '0.1em' }}>USER DASHBOARD</span>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginTop: '8px' }}>Welcome back, <span style={{ color: 'var(--primary)' }}>{user.name.split(' ')[0]}</span></h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button className="btn btn-secondary" style={{ display: 'flex', gap: '8px' }}><Settings size={18} /> Settings</button>
           <button className="btn btn-primary" onClick={logout} style={{ display: 'flex', gap: '8px', background: '#ef4444' }}><LogOut size={18} /> Logout</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
         <div className="glass" style={{ padding: '24px', borderRadius: '20px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Bookings</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>{stats.total}</h2>
         </div>
         <div className="glass" style={{ padding: '24px', borderRadius: '20px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Active Reservations</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#10b981' }}>{stats.active}</h2>
         </div>
         <div className="glass" style={{ padding: '24px', borderRadius: '20px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Loyalty Points</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent)' }}>2450</h2>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass" style={{ padding: '32px', borderRadius: '24px' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 20px' }}>
               <User size={40} />
            </div>
            <h3 style={{ textAlign: 'center', marginBottom: '4px' }}>{user.name}</h3>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>Member since 2024</p>
            
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 0 24px' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)', fontWeight: '500' }}>
                  <Package size={18} color="var(--primary)" /> Bookings
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                  <Settings size={18} /> Preferences
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                  <Calendar size={18} /> Schedule
               </div>
            </div>
          </div>
        </div>

        <div>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
             <h3 style={{ fontSize: '1.5rem' }}>Upcoming Reservations</h3>
             <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Past Bookings</button>
           </div>
          
          {bookings.length === 0 ? (
            <div className="glass" style={{ padding: '80px', textAlign: 'center', borderRadius: '24px' }}>
              <Package size={48} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '8px' }}>No bookings yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Discover our premium handpicked stays and start your journey.</p>
              <button className="btn btn-primary" onClick={() => window.location.href='/'}>Explore Hotels</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '24px' }}>
              {bookings.map((booking, idx) => (
                <div key={booking.id} className="glass animate-fade-in" style={{ padding: '32px', borderRadius: '24px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', animationDelay: `${idx * 0.1}s` }}>
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '16px', background: '#f1f5f9', overflow: 'hidden' }}>
                       <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945" alt="Hotel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h4 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Reservation {booking.reservationNumber}</h4>
                        <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>{booking.status}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                         <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>DATES</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                               <Calendar size={14} color="var(--primary)" /> {booking.checkInDate} — {booking.checkOutDate}
                            </p>
                         </div>
                         <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>LOCATION</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                               <MapPin size={14} color="var(--primary)" /> Premium Stay
                            </p>
                         </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button className="btn btn-primary" style={{ padding: '10px 20px' }}>Manage Itinerary</button>
                    <button className="btn btn-secondary" style={{ padding: '10px 20px' }}>View Receipt</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
