import React, { useState, useEffect } from 'react';
import SetupPersona from './components/SetupPersona';
import ChatRoom from './components/ChatRoom';
import type { Persona } from './types';

const HEARTS = [
  { left: '5%',  delay: '0s',  dur: '12s' },
  { left: '18%', delay: '2.5s',dur: '14s' },
  { left: '35%', delay: '5s',  dur: '10s' },
  { left: '55%', delay: '1s',  dur: '13s' },
  { left: '72%', delay: '4s',  dur: '11s' },
  { left: '88%', delay: '3s',  dur: '15s' },
];

const App: React.FC = () => {
  const [activePersona, setActivePersona] = useState<Persona | null>(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) return;

    const cursor = document.querySelector('.cursor') as HTMLElement | null;

    const onMove = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY + 'px';
      }
      const trail = document.createElement('div');
      trail.className = 'trail';
      trail.innerHTML = '💖';
      trail.style.left = e.clientX + 'px';
      trail.style.top  = e.clientY + 'px';
      document.body.appendChild(trail);
      setTimeout(() => trail.remove(), 800);
    };

    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <div className="cursor" />
      {HEARTS.map((h, i) => (
        <div
          key={i}
          className="heart-float"
          style={{ left: h.left, animationDelay: h.delay, animationDuration: h.dur }}
        >
          ❤
        </div>
      ))}

      {activePersona ? (
        <ChatRoom persona={activePersona} onReset={() => setActivePersona(null)} />
      ) : (
        <SetupPersona onSetupComplete={setActivePersona} />
      )}
    </>
  );
};

export default App;
