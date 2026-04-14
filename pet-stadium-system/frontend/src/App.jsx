import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import PetCare from './components/PetCare';
import Navigation from './components/Navigation';
import Chatbot from './components/Chatbot';
import RadarTracker from './components/RadarTracker';
import Matchmaker from './components/Matchmaker';
import { Map, Footprints, Stethoscope, AlertTriangle, Menu, CloudRain, PartyPopper, Radar, HeartHandshake, Settings } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weather, setWeather] = useState('none');
  const [stadiumData, setStadiumData] = useState({ zones: [], alerts: [] });
  
  useEffect(() => {
    setStadiumData({
      alerts: [
        { id: 1, message: "North Entry is experiencing high traffic. Please use East Entry.", type: "warning" },
        { id: 2, message: "Pet Relief Zone A has fresh water refilled.", type: "info" }
      ],
      zones: [
        { id: "A", name: "North Entry", crowdLevel: "high", waitTime: 25 },
        { id: "B", name: "Food Stall 1", crowdLevel: "medium", waitTime: 15 },
        { id: "C", name: "Pet Relief Zone A", crowdLevel: "low", waitTime: 2 }
      ]
    });
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard stadiumData={stadiumData} setStadiumData={setStadiumData} />;
      case 'petcare': return <PetCare />;
      case 'navigation': return <Navigation zones={stadiumData.zones} />;
      case 'radar': return <RadarTracker />;
      case 'matchmaker': return <Matchmaker />;
      default: return <Dashboard stadiumData={stadiumData} setStadiumData={setStadiumData} />;
    }
  };

  const renderWeather = () => {
    if (weather === 'none') return null;
    const particles = Array.from({ length: 50 });
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', overflow: 'hidden', zIndex: 100 }}>
        {particles.map((_, i) => {
          const left = Math.random() * 100 + 'vw';
          const animDuration = Math.random() * 2 + 2 + 's'; 
          const animDelay = Math.random() * 2 + 's';
          if (weather === 'rain') {
             return <div key={i} style={{ position: 'absolute', top: '-20px', left, width: '2px', height: '20px', background: 'linear-gradient(transparent, #00f2fe)', animation: `fallRain ${animDuration} linear infinite ${animDelay}` }} />
          } else {
             const colors = ['#8a2be2', '#00f2fe', '#4facfe', '#ff4757', '#2ed573'];
             const bg = colors[Math.floor(Math.random() * colors.length)];
             return <div key={i} style={{ position: 'absolute', top: '-20px', left, width: '10px', height: '10px', background: bg, animation: `fallConfetti ${animDuration} ease-in infinite ${animDelay}`, transform: `rotate(${Math.random()*360}deg)` }} />
          }
        })}
        <style>{`
          @keyframes fallRain { 0% { transform: translateY(-20px); opacity: 1; } 100% { transform: translateY(110vh); opacity: 0; } }
          @keyframes fallConfetti { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
        `}</style>
      </div>
    );
  };

  return (
    <div className="layout">
      {renderWeather()}
      {/* Background Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      {/* Sidebar */}
      <div className="sidebar" style={{ zIndex: 10 }}>
        <div className="logo" style={{ marginBottom: '20px' }}>
          <Footprints size={28} /> PetStadium
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="nav-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', marginTop: '10px', marginBottom: '5px' }}>Core Systems</div>
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <Map size={20} /> Crowd Dashboard
          </div>
          <div className={`nav-item ${activeTab === 'navigation' ? 'active' : ''}`} onClick={() => setActiveTab('navigation')}>
            <Menu size={20} /> Smart Routes
          </div>
          <div className={`nav-item ${activeTab === 'petcare' ? 'active' : ''}`} onClick={() => setActiveTab('petcare')}>
            <Stethoscope size={20} /> Pet Care & Diet
          </div>

          <div className="nav-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', marginTop: '15px', marginBottom: '5px' }}>Advanced Features</div>
          <div className={`nav-item ${activeTab === 'radar' ? 'active' : ''}`} onClick={() => setActiveTab('radar')}>
            <Radar size={20} /> VIP Tracker
          </div>
          <div className={`nav-item ${activeTab === 'matchmaker' ? 'active' : ''}`} onClick={() => setActiveTab('matchmaker')}>
            <HeartHandshake size={20} /> Pet Matchmaker
          </div>
        </div>
        
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Weather Toggle */}
          <div className="glass-panel" style={{ padding: '12px' }}>
             <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}><Settings size={14} /> Env Simulator</div>
             <div style={{ display: 'flex', gap: '5px' }}>
               <button onClick={() => setWeather('none')} style={{ flex: 1, padding: '5px', background: weather === 'none' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Off</button>
               <button onClick={() => setWeather('rain')} style={{ flex: 1, padding: '5px', background: weather === 'rain' ? '#00f2fe' : 'rgba(255,255,255,0.1)', color: weather === 'rain' ? 'black' : 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}><CloudRain size={14} style={{ margin: '0 auto' }} /></button>
               <button onClick={() => setWeather('confetti')} style={{ flex: 1, padding: '5px', background: weather === 'confetti' ? '#2ed573' : 'rgba(255,255,255,0.1)', color: weather === 'confetti' ? 'black' : 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}><PartyPopper size={14} style={{ margin: '0 auto' }} /></button>
             </div>
          </div>

          {stadiumData.alerts.length > 0 && (
            <div className="glass-panel" style={{ padding: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ff4757', fontWeight: 600, marginBottom: '10px' }}>
                <AlertTriangle size={18} /> Active Alerts
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {stadiumData.alerts[0].message}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ zIndex: 10 }}>
        {renderContent()}
      </div>

      {/* Persistent Chatbot Widget */}
      <div style={{ zIndex: 110 }}>
        <Chatbot />
      </div>
    </div>
  );
}
