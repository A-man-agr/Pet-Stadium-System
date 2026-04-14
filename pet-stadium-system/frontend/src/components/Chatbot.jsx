import React, { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hi! Ask me anything about the stadium, crowds, or your pet.' }]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if(!inputVal.trim()) return;
    
    const userMsg = inputVal.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputVal('');
    setIsTyping(true);

    // Simulated rule-based logic natively in frontend for simplicity
    setTimeout(() => {
      let reply = "I'm sorry, I couldn't understand that. Try asking about pet zones, crowded areas, or pet diets!";
      const lower = userMsg.toLowerCase();

      if (lower.includes('nearest') && lower.includes('pet zone')) {
        reply = "The nearest pet zone is Pet Relief Zone A. It’s currently experiencing low crowds. Waiting time is 2 minutes.";
      } else if (lower.includes('exit') && lower.includes('least crowded')) {
        reply = "The South Exit has medium crowds, but the East Entry is the least crowded way out right now.";
      } else if (lower.includes('feed') || lower.includes('diet')) {
        reply = "If your pet prefers vegetarian, we offer a specialized sweet potato jerky at Food Stall 1.";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="chatbot-widget">
      <style>{`
        @keyframes botPulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 242, 254, 0.7); }
          70% { box-shadow: 0 0 0 20px rgba(0, 242, 254, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 242, 254, 0); }
        }
        .typing-dot {
          width: 6px; height: 6px; background: white; border-radius: 50%; display: inline-block; animation: typing 1.4s infinite ease-in-out both; margin: 0 2px;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typing { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
      `}</style>
      
      {isOpen ? (
        <div style={{ animation: 'slideUp 0.3s ease-out', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="chat-header" onClick={() => setIsOpen(false)} style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))' }}>
            <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Bot size={18} /> Nexa AI</span>
            <X size={18} />
          </div>
          <div className="chat-body" style={{ background: 'rgba(15, 17, 26, 0.9)', height: '350px' }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{ display: 'flex' }}>
                <div style={{
                  padding: '12px 18px', borderRadius: '18px', marginBottom: '12px', maxWidth: '85%', fontSize: '14px', lineHeight: '1.4',
                  ...(m.sender === 'bot' 
                    ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', borderBottomLeftRadius: '4px' } 
                    : { background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-hover))', color: 'white', marginLeft: 'auto', borderBottomRightRadius: '4px' })
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 18px', borderRadius: '18px', borderBottomLeftRadius: '4px' }}>
                  <span className="typing-dot"></span><span className="typing-dot"></span><span className="typing-dot"></span>
                </div>
              </div>
            )}
          </div>
          <div className="chat-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.8)' }}>
            <input 
              style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
            />
            <button onClick={handleSend} style={{ background: 'var(--accent-primary)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => setIsOpen(true)}
          style={{
            alignSelf: 'flex-end',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            width: '64px', height: '64px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(0, 242, 254, 0.4)',
            color: 'white',
            animation: 'botPulse 2s infinite'
          }}>
          <Bot size={32} />
        </div>
      )}
    </div>
  );
}
