import React, { useState, useRef, useEffect } from 'react';
import type { Persona, Message } from '../types';

interface Props {
  persona: Persona;
  onReset: () => void;
}

const avatarImages: Record<string, string> = {
  'Pria':   '/male.png',
  'Wanita': '/female.png',
  'Netral': '',
};

const userEmoji = '🙂';

const buildName = (persona: Persona): string => {
  const maleNames   = ['Levy', 'Eren', 'Nico'];
  const femaleNames = ['Naykilla', 'Bernadya', 'Erika'];
  const neutralNames = ['Alex', 'Kai'];
  const pool = persona.gender === 'Pria' ? maleNames : persona.gender === 'Wanita' ? femaleNames : neutralNames;
  return pool[Math.floor(Math.random() * pool.length)];
};

const ChatRoom: React.FC<Props> = ({ persona, onReset }) => {
  const [displayName] = useState(() => buildName(persona));
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hai ${persona.userName} 😊\nAku ${displayName}, ${persona.pekerjaan} yang siap mendengarkanmu.\nCeritakan apa yang ada di benakmu hari ini, ya.`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const aiAvatarUrl = avatarImages[persona.gender] || '';

  useEffect(() => {
    const map: Record<string, string> = { Pria: 'theme-male', Netral: 'theme-neutral' };
    document.body.className = map[persona.gender] || '';
    return () => { document.body.className = ''; };
  }, [persona.gender]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://dear-diary-beige-one.vercel.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona, messages: [...messages, userMessage] })
      });

      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Maaf, ada kendala koneksi. Coba lagi ya? 🙏'
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="avatar-wrapper">
          <div className="avatar-circle">
            {aiAvatarUrl && <img src={aiAvatarUrl} alt="AI Avatar" className="avatar-img" />}
            <div className="avatar-status" />
          </div>
          <div className="persona-name">{displayName}</div>
          <div className="persona-title">{persona.pekerjaan}</div>
          <div className="persona-tags">
            <span className="tag">{persona.gender}</span>
            <span className="tag">{persona.umur}</span>
          </div>
        </div>

        <div className="divider" />

        <div className="info-cards">
          <div className="info-card">
            <div className="info-card-icon">💗</div>
            <div className="info-card-text">Tempat aman untuk bercerita dan didengarkan.</div>
          </div>
          <div className="info-card">
            <div className="info-card-icon">🔒</div>
            <div className="info-card-text">Privasi & kerahasiaan Anda dijaga sepenuhnya.</div>
          </div>
          <div className="info-card">
            <div className="info-card-icon">🌿</div>
            <div className="info-card-text">Tanpa menghakimi. Tanpa tekanan. Hanya empati.</div>
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="btn-end-session" onClick={onReset}>
            Akhiri Sesi 👋
          </button>
        </div>
      </div>

      <div className="chat-area">
        <div className="chat-header">
          <div className="chat-header-icon">💖</div>
          <div className="chat-header-title">
            <h2>Dear Diary</h2>
            <span>Sesi aktif bersama {displayName} · {persona.gayaBicara}</span>
          </div>
        </div>

        <div className="messages-area">
          {messages.map((msg, idx) => (
            <div key={idx} className={`msg-row ${msg.role === 'user' ? 'user' : 'bot'}`}>
              <div className="msg-avatar">
                {msg.role === 'user' ? (
                  userEmoji
                ) : (
                  aiAvatarUrl && <img src={aiAvatarUrl} alt="AI Avatar" className="avatar-img" />
                )}
              </div>
              <div className={`bubble ${msg.role === 'user' ? 'user' : 'bot'}`}>
                {msg.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>{line}{i < msg.content.split('\n').length - 1 && <br />}</React.Fragment>
                ))}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="typing-row">
              <div className="msg-avatar">
                {aiAvatarUrl && <img src={aiAvatarUrl} alt="AI Avatar" className="avatar-img" />}
              </div>
              <div className="typing-bubble">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="chat-footer" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="Tulis ceritamu di sini..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
          <button type="submit" className="btn-send" disabled={isLoading || !input.trim()}>
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
