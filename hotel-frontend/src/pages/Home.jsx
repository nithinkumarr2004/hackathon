import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Star, Filter, ArrowUpDown, Wifi, Coffee, Wind, Tv, Car, Shield } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [priceRange, setPriceRange] = useState(20000);
  const [sortBy, setSortBy] = useState('featured');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const amenitiesList = [
    { name: 'WiFi', icon: <Wifi size={14} /> },
    { name: 'Pool', icon: <Coffee size={14} /> },
    { name: 'Spa', icon: <Wind size={14} /> },
    { name: 'Gym', icon: <Tv size={14} /> },
    { name: 'Restaurant', icon: <Coffee size={14} /> },
    { name: 'Free Parking', icon: <Car size={14} /> }
  ];

  useEffect(() => {
    fetchHotels();
  }, [search, minRating, selectedAmenities, priceRange, sortBy]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8080/api/hotels/search', {
        params: {
          location: search,
          minRating: minRating > 0 ? minRating : null,
          amenities: selectedAmenities.length > 0 ? selectedAmenities.join(',') : null
        }
      });
      
      let filtered = res.data;
      
      // Client-side Price Filtering
      filtered = filtered.filter(h => {
        const prices = h.priceRange.split('-').map(p => parseInt(p.replace(/[^0-9]/g, '')));
        return prices[0] <= priceRange;
      });

      // Sorting
      if (sortBy === 'priceLow') filtered.sort((a, b) => parseInt(a.priceRange) - parseInt(b.priceRange));
      if (sortBy === 'priceHigh') filtered.sort((a, b) => parseInt(b.priceRange) - parseInt(a.priceRange));
      if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

      setHotels(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (name) => {
    setSelectedAmenities(prev => 
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  const getCategoryColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'heritage': return '#b45309';
      case 'iconic': return '#4338ca';
      case 'mountain': return '#047857';
      case 'design': return '#be185d';
      case 'backpacker': return '#115e59';
      default: return 'var(--primary)';
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px' }}>
      
      {/* Side Filters */}
      <aside style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
        <div className="glass" style={{ padding: '24px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Filters</h3>
            <button 
              onClick={() => {setSearch(''); setMinRating(0); setSelectedAmenities([]); setPriceRange(20000);}}
              style={{ background: 'none', color: 'var(--primary)', border: 'none', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
            >
              Clear All
            </button>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Price Range (per night)
            </label>
            <input 
              type="range" 
              min="1000" 
              max="20000" 
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              style={{ width: '100%', marginBottom: '10px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: '600' }}>
              <span>₹1,000</span>
              <span>₹{priceRange.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Minimum Rating
            </label>
            {[4.5, 4.0, 3.0].map(r => (
              <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={minRating === r} 
                  onChange={() => setMinRating(minRating === r ? 0 : r)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{r}+ Stars</span>
              </label>
            ))}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Amenities
            </label>
            {amenitiesList.map(a => (
              <label key={a.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={selectedAmenities.includes(a.name)} 
                  onChange={() => toggleAmenity(a.name)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ fontSize: '0.95rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {a.icon} {a.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>
              Explore <span className="gradient-text">Hotels</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{hotels.length} luxury stays found in major cities</p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '8px' }}>SORT BY:</span>
            {['featured', 'priceLow', 'priceHigh', 'rating'].map(opt => (
              <button 
                key={opt}
                onClick={() => setSortBy(opt)}
                className={`btn ${sortBy === opt ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                {opt === 'priceLow' ? 'Price ↑' : opt === 'priceHigh' ? 'Price ↓' : opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Global Search Bar with Calendar */}
        <div className="glass" style={{ padding: '16px', borderRadius: '20px', marginBottom: '40px', display: 'flex', gap: '16px' }}>
          <div style={{ flex: 2, position: 'relative' }}>
            <MapPin style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} size={20} />
            <input 
              type="text" 
              list="major-cities"
              placeholder="Where are you going? (e.g. Udaipur, Mumbai)" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: '48px', border: 'none', background: 'rgba(255,255,255,0.5)' }}
            />
            <datalist id="major-cities">
              <option value="Udaipur" />
              <option value="Mumbai" />
              <option value="Shimla" />
              <option value="New Delhi" />
              <option value="Goa" />
              <option value="Bangalore" />
            </datalist>
          </div>
          <div style={{ flex: 1.5, position: 'relative', display: 'flex', gap: '8px' }}>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Check-in"
              customInput={<CalendarInput icon={<Calendar size={20} />} />}
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="Check-out"
              customInput={<CalendarInput icon={<Calendar size={20} />} />}
            />
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <Users style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} size={20} />
            <select style={{ width: '100%', paddingLeft: '48px', border: 'none', appearance: 'none', background: 'rgba(255,255,255,0.5)' }}>
              <option>2 Guests</option>
              <option>1 Guest</option>
              <option>4 Guests</option>
            </select>
          </div>
          <button className="btn btn-primary" style={{ padding: '0 32px' }}>Search</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>Loading premium collection...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
            {hotels.map(h => (
              <Link to={`/hotel/${h.id}`} key={h.id} className="card animate-fade-in" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ position: 'relative', height: '240px' }}>
                  <img src={h.images[0]} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ 
                    position: 'absolute', top: '20px', left: '20px', 
                    background: getCategoryColor(h.category), color: 'white', 
                    padding: '6px 14px', borderRadius: '8px', fontSize: '0.75rem', 
                    fontWeight: '800', letterSpacing: '0.1em' 
                  }}>
                    {h.category?.toUpperCase()}
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        📍 {h.location}
                      </span>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '4px' }}>{h.name}</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fef3c7', padding: '4px 8px', borderRadius: '8px' }}>
                      <Star size={16} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ fontWeight: '700', color: '#92400e' }}>{h.rating} / 5</span>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.6' }}>
                    {h.description.slice(0, 100)}...
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                    {h.amenities.slice(0, 4).map(a => (
                      <span key={a} style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '4px 10px', borderRadius: '20px', fontWeight: '600', color: 'var(--text-main)' }}>
                        {a}
                      </span>
                    ))}
                    {h.amenities.length > 4 && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>+{h.amenities.length - 4}</span>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                      Starting from <br />
                      <span style={{ fontSize: '1.5rem', color: 'var(--secondary)', fontWeight: '900' }}>₹{h.priceRange.split('-')[0]}</span>
                    </div>
                    {/* Availability Badge */}
                    <div style={{ position: 'absolute', bottom: '16px', right: '16px', zIndex: 10 }}>
                      <span style={{ 
                        background: h.availableRooms > 0 ? '#dcfce7' : '#fee2e2', 
                        color: h.availableRooms > 0 ? '#166534' : '#991b1b', 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: '700',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        {h.availableRooms > 0 ? `${h.availableRooms} Rooms Left` : 'Sold Out'}
                      </span>
                    </div>
                    <button className="btn btn-secondary" style={{ padding: '10px 24px' }}>Details</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const CalendarInput = ({ value, onClick, placeholder, icon }) => (
  <div onClick={onClick} style={{ position: 'relative', width: '100%' }}>
    <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', zIndex: 1 }}>
      {icon}
    </div>
    <input 
      readOnly 
      value={value} 
      placeholder={placeholder}
      style={{ width: '100%', paddingLeft: '48px', border: 'none', background: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
    />
  </div>
);

export default Home;
;
