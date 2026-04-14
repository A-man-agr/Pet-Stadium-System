import React, { useState, useRef } from 'react';

export default function Dashboard({ stadiumData, setStadiumData }) {
  const [rotation, setRotation] = useState({ x: 60, z: -45 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    setRotation(prev => ({
      x: Math.max(0, Math.min(80, prev.x - deltaY * 0.5)),
      z: prev.z + deltaX * 0.5
    }));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsDragging(false);

  // Simulated heatmap data coordinates for zones
  const renderHeatMap = () => {
    return [
      { top: '20%', left: '30%', type: 'high', label: 'North Entry' },
      { top: '60%', left: '70%', type: 'medium', label: 'Food Stall 1' },
      { top: '80%', left: '20%', type: 'low', label: 'Pet Relief A' },
      { top: '40%', left: '50%', type: 'medium', label: 'Main Concourse' }
    ].map((zone, i) => (
      <React.Fragment key={i}>
        <div 
          className="heat-zone"
          style={{
            position: 'absolute',
            top: zone.top, 
            left: zone.left, 
            background: `var(--heat-${zone.type})`,
            width: zone.type === 'high' ? '120px' : '90px',
            height: zone.type === 'high' ? '120px' : '90px',
            animationDelay: `${i * 0.5}s`,
            transform: 'translateZ(20px)'
          }}
        />
        <div className="zone-label" style={{ 
          position: 'absolute',
          top: `calc(${zone.top} + 20px)`, left: `calc(${zone.left} + 20px)`,
          background: 'rgba(0,0,0,0.7)', padding: '6px 10px', borderRadius: '8px',
          backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)',
          transform: `translateZ(40px) rotateZ(${-rotation.z}deg) rotateX(${-rotation.x}deg)`,
          boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
          transition: isDragging ? 'none' : 'transform 0.1s ease',
          pointerEvents: 'none'
        }}>
          {zone.label}
        </div>
      </React.Fragment>
    ));
  };

  return (
    <div className="animate-slide-up">
      <h1 style={{ marginBottom: '10px' }}>Real-Time Crowd Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Monitor stadium density and receive automated alerts.</p>
      
      <div className="grid-2">
        <div className="glass-panel" style={{ gridColumn: 'span 2', perspective: '1000px' }}>
           <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             Live Map (3D Radar Mode)
             <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '12px', fontWeight: 'normal' }}>Drag Map to Navigate</span>
           </h3>
           <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Red = High Crowd | Yellow = Medium | Green = Low</p>
           <div 
              className="map-container" 
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
              transform: `rotateX(${rotation.x}deg) rotateZ(${rotation.z}deg)`,
              transformStyle: 'preserve-3d',
              boxShadow: '-20px 20px 50px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,242,254,0.2)',
              height: '400px',
              margin: '30px auto',
              width: '90%',
              borderRadius: '30px',
              border: '2px solid rgba(255,255,255,0.05)',
              cursor: isDragging ? 'grabbing' : 'grab',
              transition: isDragging ? 'none' : 'transform 0.1s ease'
           }}>
              {renderHeatMap()}
           </div>
        </div>
        
        <div className="glass-panel">
          <h3>Zone Statistics</h3>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {stadiumData.zones.map(z => {
              const heatColor = z.crowdLevel === 'high' ? 'var(--heat-high)' : (z.crowdLevel === 'medium' ? 'var(--heat-medium)' : 'var(--heat-low)');
              const widthPerc = z.crowdLevel === 'high' ? '90%' : (z.crowdLevel === 'medium' ? '60%' : '20%');
              return (
              <div key={z.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 500 }}>{z.name}</span>
                  <span style={{ color: heatColor, fontWeight: 700, textShadow: `0 0 10px ${heatColor}` }}>{z.crowdLevel.toUpperCase()}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: widthPerc, height: '100%', background: heatColor, borderRadius: '4px', boxShadow: `0 0 10px ${heatColor}` }} />
                </div>
              </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel">
          <h3>Admin Controls</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>Simulate actions for testing the system.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button className="btn" style={{ background: 'rgba(255, 71, 87, 0.2)', border: '1px solid var(--heat-high)', color: '#ff4757' }}
              onClick={() => {
                if(setStadiumData) {
                  setStadiumData(prev => ({
                    ...prev,
                    alerts: [{ id: Date.now(), message: "EMERGENCY: Please evacuate the North Entry immediately.", type: "warning" }, ...prev.alerts]
                  }));
                }
              }}
            >
              Broadcast Emergency Alert
            </button>
            <button className="btn" style={{ background: 'rgba(0, 206, 201, 0.2)', border: '1px solid var(--accent-secondary)' }}
              onClick={() => {
                if(setStadiumData) {
                  setStadiumData(prev => ({
                    ...prev,
                    zones: prev.zones.map(z => z.id === "A" ? { ...z, crowdLevel: "medium", waitTime: 10 } : z),
                    alerts: [{ id: Date.now(), message: "Overflow Corridors opened. North Entry traffic is decreasing.", type: "info" }, ...prev.alerts]
                  }));
                }
              }}
            >
              Open Overflow Corridors
            </button>
          </div>
        </div>

        {/* New Decibel Analytics Panel */}
        <div className="glass-panel" style={{ gridColumn: 'span 2' }}>
          <h3>Live Decibel Analytics</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>Real-time acoustic monitoring to protect pet hearing.</p>
          
          <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-end', height: '150px', padding: '20px', background: 'rgba(0,0,0,0.4)', borderRadius: '16px' }}>
            {['Main Concourse', 'Zone A', 'Food Court', 'South Exit', 'North Entry'].map((zone, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative', width: '30px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
                  <div style={{ 
                    width: '100%', 
                    background: idx === 0 ? 'var(--heat-high)' : idx === 2 ? 'var(--heat-medium)' : 'var(--heat-low)', 
                    animation: `eqBounce ${1 + Math.random()}s infinite alternate ease-in-out`,
                    height: '50%',
                    boxShadow: `0 0 15px ${idx === 0 ? 'var(--heat-high)' : idx === 2 ? 'var(--heat-medium)' : 'var(--heat-low)'}`
                  }}></div>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>{zone}</span>
              </div>
            ))}
          </div>
          <style>{`
            @keyframes eqBounce {
              0% { height: 20%; }
              50% { height: 90%; }
              100% { height: 40%; }
            }
          `}</style>
        </div>

      </div>
    </div>
  );
}
