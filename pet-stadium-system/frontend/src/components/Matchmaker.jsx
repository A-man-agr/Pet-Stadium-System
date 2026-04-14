import React, { useState } from 'react';
import { Heart, Search, CheckCircle, Flame } from 'lucide-react';

export default function Matchmaker() {
  const [matches] = useState([
    { id: 1, name: "Max", breed: "Golden Retriever", age: 3, distance: "100m", zone: "Zone A", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200", vibe: "Playful" },
    { id: 2, name: "Bella", breed: "French Bulldog", age: 2, distance: "250m", zone: "Food Court", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=200", vibe: "Chill" },
    { id: 3, name: "Luna", breed: "Husky", age: 1, distance: "50m", zone: "Zone A", image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=200", vibe: "Energetic" }
  ]);

  const [requested, setRequested] = useState({});

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
        <div style={{ background: 'linear-gradient(135deg, #ff4757, #ff9f43)', padding: '12px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(255,71,87,0.4)', display: 'inline-flex' }}>
          <Flame size={32} color="white" />
        </div>
        <h1 style={{ color: 'white' }}>Pet Matchmaker</h1>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '16px' }}>Find nearby pet playdates in the stadium in real-time.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {matches.map(m => (
          <div key={m.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '200px', background: `url(${m.image}) center/cover` }}></div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {m.name} <span style={{ fontSize: '13px', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '12px', fontWeight: 500 }}>{m.vibe}</span>
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '8px 0' }}>{m.breed} • {m.age} yrs old</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#00f2fe', fontSize: '14px', marginBottom: '20px' }}>
                 <Search size={14} /> Currently at {m.zone} ({m.distance} away)
              </div>
              <button 
                onClick={() => setRequested(prev => ({...prev, [m.id]: true}))}
                className="btn" 
                style={{ 
                  width: '100%', 
                  background: requested[m.id] ? 'rgba(46, 213, 115, 0.2)' : 'linear-gradient(135deg, #ff4757, #ff9f43)',
                  border: requested[m.id] ? '1px solid #2ed573' : 'none',
                  color: requested[m.id] ? '#2ed573' : 'white',
                  boxShadow: requested[m.id] ? 'none' : '0 5px 15px rgba(255,71,87,0.3)'
                }}>
                {requested[m.id] ? <><CheckCircle size={18} style={{marginRight: '6px', verticalAlign: 'middle'}}/> Sent Request</> : <><Heart size={18} style={{marginRight: '6px', verticalAlign: 'middle'}}/> Request Playdate</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
