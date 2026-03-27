import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Star, MapPin, CheckCircle, Calendar, ShieldCheck, Heart, Share2, Info } from 'lucide-react';

const HotelDetails = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [dates, setDates] = useState({ checkIn: '2026-04-10', checkOut: '2026-04-12' });

  useEffect(() => {
    axios.get(`http://localhost:8080/api/hotels/${id}`)
      .then(res => setHotel(res.data))
      .catch(err => console.error(err));

    axios.get(`http://localhost:8080/api/rooms/hotel/${id}`)
      .then(res => setRooms(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleBook = async (room) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const bookingData = {
        userId: user.id,
        hotelId: hotel.id,
        roomId: room.id,
        checkInDate: dates.checkIn,
        checkOutDate: dates.checkOut
      };

      const res = await axios.post('http://localhost:8080/api/bookings', bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBookingSuccess(res.data.reservationNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed. Please try again.';
      alert(msg);
    }
  };

  if (!hotel) return (
    <div className="container" style={{ padding: '100px', textAlign: 'center' }}>
      <div className="glass" style={{ padding: '40px', borderRadius: '24px' }}>
        <h2 className="animate-pulse">Loading Premium Experience...</h2>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: '40px 0 100px' }}>
      {bookingSuccess && (
        <div className="glass animate-fade-in" style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: '#10b981', padding: '40px', marginBottom: '40px', textAlign: 'center', borderRadius: '24px' }}>
          <div style={{ background: '#10b981', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'white' }}>
             <CheckCircle size={32} />
          </div>
          <h2 style={{ color: '#065f46', marginBottom: '12px', fontSize: '2rem' }}>Reservation Confirmed!</h2>
          <p style={{ color: '#047857', fontSize: '1.1rem', marginBottom: '8px' }}>Your reservation number is: <span style={{ fontWeight: '800' }}>{bookingSuccess}</span></p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>We've sent the itinerary and receipt to your email.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>View My Bookings</button>
            <button className="btn btn-secondary" onClick={() => setBookingSuccess(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em' }}>PREMIUM SELECT</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent)', fontWeight: '700' }}>
               <Star size={16} fill="currentColor" /> {hotel.rating} Rating
            </div>
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '8px', color: 'var(--secondary)' }}>{hotel.name}</h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            <MapPin size={20} color="var(--primary)" /> {hotel.location}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button className="btn btn-secondary" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0 }}><Heart size={20} /></button>
           <button className="btn btn-secondary" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0 }}><Share2 size={20} /></button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '70% 30%', gap: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* Main Gallery */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', height: '500px' }}>
            <div style={{ borderRadius: '24px', overflow: 'hidden' }}>
              <img src={hotel.images?.[0]} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ flex: 1, borderRadius: '24px', overflow: 'hidden' }}>
                <img src={hotel.images?.[1] || hotel.images?.[0]} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
                <img src={hotel.images?.[0]} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700' }}>+12 Photos</div>
              </div>
            </div>
          </div>

          <div className="glass" style={{ padding: '40px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Info size={24} color="var(--primary)" /> Experience the Luxury
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '32px' }}>{hotel.description}</p>
            
            <h4 style={{ fontSize: '1.4rem', marginBottom: '24px' }}>Top Amenities</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {hotel.amenities?.map(a => (
                <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                  <ShieldCheck size={20} color="var(--primary)" /> 
                  <span style={{ fontWeight: '500' }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass" style={{ padding: '32px', borderRadius: '24px', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Plan Your Stay</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>CHECK-IN</label>
                <div style={{ position: 'relative' }}>
                  <Calendar style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} size={18} />
                  <input 
                    type="date" 
                    value={dates.checkIn}
                    onChange={(e) => setDates({...dates, checkIn: e.target.value})}
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>CHECK-OUT</label>
                <div style={{ position: 'relative' }}>
                  <Calendar style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} size={18} />
                  <input 
                    type="date" 
                    value={dates.checkOut}
                    onChange={(e) => setDates({...dates, checkOut: e.target.value})}
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--secondary)' }}>Available Options</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {rooms.map(room => (
                <div key={room.id} style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '20px', transition: '0.3s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700' }}>{room.roomType}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: '800' }}>₹{room.price}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Includes breakfast & free cancellation</p>
                  <button 
                    onClick={() => handleBook(room)} 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '10px', borderRadius: '12px' }}
                  >
                    Select & Book
                  </button>
                </div>
              ))}
            </div>
            
            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              No extra charges apply
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
