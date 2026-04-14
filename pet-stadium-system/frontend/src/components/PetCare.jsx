import React, { useState } from 'react';
import { ShieldCheck, Utensils } from 'lucide-react';

export default function PetCare() {
  const [formData, setFormData] = useState({ ownerName: '', petName: '', dietType: 'omnivore' });
  const [passQR, setPassQR] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    /* 
      // Normally we'd POST to backend:
      fetch('http://localhost:5000/api/pets/register', { ... })
    */
    
    // Simulate generation of QR
    setTimeout(() => {
      setPassQR(`PASS-${Math.floor(Math.random()*100000)}`);
    }, 500);
  };

  return (
    <div className="animate-slide-up">
      <h1 style={{ marginBottom: '10px' }}>Pet Care & Registration</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Register your pet and receive customized diet plans & entry passes.</p>

      <div className="grid-2">
        <div className="glass-panel">
          <h3>Register Your Pet</h3>
          <form style={{ marginTop: '20px' }} onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Owner Name</label>
              <input required className="input" placeholder="John Doe" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Pet Name</label>
              <input required className="input" placeholder="Buddy" value={formData.petName} onChange={e => setFormData({...formData, petName: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Dietary Needs</label>
              <select className="input" value={formData.dietType} onChange={e => setFormData({...formData, dietType: e.target.value})}>
                <option value="omnivore">Standard</option>
                <option value="vegetarian">Vegetarian / Sensitive Stomach</option>
                <option value="raw">Raw Diet</option>
              </select>
            </div>
            <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }}>Generate Digital Pass</button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {passQR && (
            <div className="glass-panel hologram-pass" style={{ 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.4), rgba(0, 242, 254, 0.4))',
              position: 'relative',
              overflow: 'hidden',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.1s ease',
              border: '2px solid rgba(255,255,255,0.4)',
              boxShadow: '0 20px 50px rgba(0,242,254,0.3)',
              cursor: 'pointer'
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.style.transform = `perspective(1000px) rotateX(${(rect.height/2 - y) / 10}deg) rotateY(${(x - rect.width/2) / 10}deg) scale(1.02)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            }}
            >
              <div style={{ 
                position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%', 
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                transform: 'skewX(-20deg)', animation: 'shimmer 2.5s infinite', zIndex: 0
              }} />
              <style>{`@keyframes shimmer { 0% { left: -100%; } 100% { left: 200%; } }`}</style>
              
              <div style={{ position: 'relative', zIndex: 1, transformStyle: 'preserve-3d' }}>
                <ShieldCheck size={48} color="var(--accent-secondary)" style={{ margin: '0 auto 10px auto', transform: 'translateZ(30px)' }} />
                <h3 style={{ color: 'white', textShadow: '0 0 15px rgba(0,242,254,1)', transform: 'translateZ(40px)', fontSize: '24px' }}>Official Pet Pass</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', marginBottom: '20px', transform: 'translateZ(20px)' }}>CLEARANCE LEVEL: APPROVED</p>
                
                <div style={{ background: '#fff', padding: '15px', margin: '0 auto', display: 'inline-block', borderRadius: '12px', color: '#000', fontWeight: 'bold', transform: 'translateZ(50px)', boxShadow: '0 15px 30px rgba(0,0,0,0.6)' }}>
                  <div style={{ width: '120px', height: '120px', background: `url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${passQR}') center/cover` }}></div>
                  <div style={{ marginTop: '10px', fontSize: '15px', letterSpacing: '2px' }}>{passQR}</div>
                </div>
              </div>
            </div>
          )}

          <div className="glass-panel">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Utensils size={20} /> Recommended Diet Options</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '10px', lineHeight: '1.6' }}>
              Based on your selection, we recommend the <strong>Sweet Potato & Pea Nibbles</strong> available at <strong>Food Stall 1</strong>.
              <br/><br/>
              Nearest Water Station: <strong>Pet Relief Zone A (2 min walk)</strong>.
            </p>
            <button className="btn" style={{ width: '100%', marginTop: '20px', background: 'transparent', border: '1px solid var(--accent-primary)' }}>
              Order Food for Pickup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
