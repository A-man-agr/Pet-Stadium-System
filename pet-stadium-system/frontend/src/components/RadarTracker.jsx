import React, { useState, useEffect } from 'react';
import { Radar, Target } from 'lucide-react';

export default function RadarTracker() {
  const [blips, setBlips] = useState([]);
  const [scanRot, setScanRot] = useState(0);
  const [petId, setPetId] = useState('');

  // Radar logic
  useEffect(() => {
    const sweep = setInterval(() => {
      setScanRot(prev => (prev + 5) % 360);
      
      // Randomly spawn blips
      if(Math.random() > 0.7) {
        setBlips(prev => {
          const newBlip = {
            id: Date.now(),
            angle: Math.random() * 360,
            distance: Math.random() * 40 + 10,
            opacity: 1
          };
          // Fade old blips
          return [...prev.map(b => ({...b, opacity: b.opacity - 0.1})).filter(b => b.opacity > 0), newBlip];
        });
      }
    }, 50);
    return () => clearInterval(sweep);
  }, []);

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <h1 style={{ marginBottom: '10px', color: '#00f2fe', textShadow: '0 0 20px #00f2fe' }}>VIP Radar Tracking</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Military-grade real-time VIP & Pet geospatial tracking.</p>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <input 
          className="input" 
          placeholder="Enter VIP Pet ID..." 
          value={petId} onChange={e => setPetId(e.target.value)} 
          style={{ width: '250px', background: 'rgba(0,242,254,0.1)', border: '1px solid #00f2fe' }}
        />
        <button className="btn" style={{ background: '#00f2fe', color: 'black' }} onClick={() => setBlips([{ id: petId, angle: scanRot + 10, distance: 30, opacity: 1, vip: true }])}>
          <Target size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Track
        </button>
      </div>

      <div style={{ 
        width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,242,254,0.1) 0%, rgba(0,0,0,0.8) 100%)', 
        border: '2px solid rgba(0,242,254,0.5)', position: 'relative', overflow: 'hidden', boxShadow: '0 0 50px rgba(0,242,254,0.2), inset 0 0 50px rgba(0,242,254,0.3)'
      }}>
        {/* Radar Rings */}
        <div style={{ position: 'absolute', top: '25%', left: '25%', width: '50%', height: '50%', borderRadius: '50%', border: '1px dashed rgba(0,242,254,0.3)' }} />
        <div style={{ position: 'absolute', top: '0', left: '50%', width: '1px', height: '100%', background: 'rgba(0,242,254,0.2)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '0', width: '100%', height: '1px', background: 'rgba(0,242,254,0.2)' }} />

        {/* Semantic Sweeper using Conic Gradient via style tag */}
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%',
          background: 'conic-gradient(from 0deg, transparent 70%, rgba(0,242,254,0.6) 100%)',
          transform: `rotate(${scanRot}deg)` 
        }} />

        {/* Blips */}
        {blips.map(b => {
          const rad = (b.angle - 90) * (Math.PI / 180);
          const x = 200 + Math.cos(rad) * (b.distance * 4); // 400px diameter, 200 center
          const y = 200 + Math.sin(rad) * (b.distance * 4);
          return (
            <div key={b.id} style={{
              position: 'absolute', left: x, top: y, width: b.vip ? '16px' : '8px', height: b.vip ? '16px' : '8px',
              background: b.vip ? '#ff4757' : '#00f2fe', borderRadius: '50%', opacity: b.opacity,
              boxShadow: `0 0 10px ${b.vip ? '#ff4757' : '#00f2fe'}`, transform: 'translate(-50%, -50%)',
              animation: 'pulse 1s infinite'
            }} />
          )
        })}
      </div>
    </div>
  );
}
