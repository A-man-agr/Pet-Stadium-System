import React, { useState } from 'react';
import { Navigation as NavIcon, Clock } from 'lucide-react';

export default function Navigation({ zones }) {
  const [destination, setDestination] = useState('B');
  const [usePetSafe, setUsePetSafe] = useState(false);

  // Provide a dummy route calculation
  const calculatedRoute = usePetSafe 
    ? "Current Location -> Concourse B -> Pet Relief Corridor -> Destination" 
    : "Current Location -> Main Hall -> North Escalator -> Destination";

  return (
    <div className="animate-slide-up">
      <h1 style={{ marginBottom: '10px' }}>Smart Navigation & Queues</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Find the quickest and least crowded paths to your destination.</p>

      <div className="grid-2">
        <div className="glass-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><NavIcon size={20} /> Path Finder</h3>
          
          <div className="form-group" style={{ marginTop: '20px' }}>
             <label>Where do you want to go?</label>
             <select className="input" value={destination} onChange={(e) => setDestination(e.target.value)}>
               {zones.map(z => (
                 <option key={z.id} value={z.id}>{z.name}</option>
               ))}
             </select>
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <input 
              type="checkbox" 
              id="petSafe" 
              checked={usePetSafe} 
              onChange={() => setUsePetSafe(!usePetSafe)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="petSafe" style={{ cursor: 'pointer', color: 'white' }}>Prefer Pet-Safe Route (Avoids loud noises & crowds)</label>
          </div>

          <div style={{ marginTop: '20px', padding: '24px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
            <h4 style={{ color: 'var(--accent-secondary)', fontSize: '12px', letterSpacing: '1px', marginBottom: '20px', textTransform: 'uppercase', fontWeight: 700 }}>Optimal Route Path</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
               {calculatedRoute.split('->').map((step, index, arr) => (
                 <div key={index} style={{ display: 'flex', alignItems: 'stretch', opacity: 0, animation: `slideUp 0.5s ease forwards ${index * 0.15}s` }}>
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '16px', minWidth: '24px' }}>
                      <div style={{ width: index === arr.length -1 ? '18px' : '12px', height: index === arr.length -1 ? '18px' : '12px', borderRadius: '50%', background: index === arr.length -1 ? 'var(--accent-secondary)' : 'var(--accent-primary)', boxShadow: `0 0 10px ${index === arr.length -1 ? 'var(--accent-secondary)' : 'var(--accent-primary)'}`, zIndex: 2, marginTop: '8px' }} />
                      {index < arr.length - 1 && <div style={{ flex: 1, width: '2px', background: 'linear-gradient(to bottom, var(--accent-primary), rgba(138,43,226,0.2))', minHeight: '30px', margin: '4px 0' }} />}
                   </div>
                   <div style={{ padding: '3px 0 24px 0', fontWeight: index === arr.length -1 ? '700' : '500', fontSize: '16px', color: index === arr.length -1 ? '#fff' : 'var(--text-muted)' }}>{step.trim()}</div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="glass-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={20} /> Live Waiting Times</h3>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
             {zones.filter(z => z.waitTime !== undefined).map(z => (
               <div key={z.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-panel)', padding: '12px 16px', borderRadius: '8px' }}>
                 <span style={{ fontWeight: 500 }}>{z.name}</span>
                 <span style={{ 
                   background: z.waitTime > 15 ? 'rgba(255, 71, 87, 0.2)' : 'rgba(46, 213, 115, 0.2)', 
                   color: z.waitTime > 15 ? '#ff4757' : '#2ed573',
                   padding: '4px 10px',
                   borderRadius: '20px',
                   fontSize: '14px',
                   fontWeight: 600
                 }}>
                   {z.waitTime} mins
                 </span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
