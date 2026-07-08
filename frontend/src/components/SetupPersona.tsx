import React, { useState, useEffect } from 'react';
import type { Persona } from '../types';

interface Props {
  onSetupComplete: (persona: Persona) => void;
}

const genderThemeMap: Record<string, string> = {
  'Pria': 'theme-male',
  'Wanita': '',
  'Netral': 'theme-neutral',
};

const options = {
  umur: [
    { value: '20-30 tahun', label: '20–30 thn', icon: '🧑' },
    { value: '30-45 tahun', label: '30–45 thn', icon: '👨' },
    { value: '45-60 tahun', label: '45–60 thn', icon: '🧔' },
    { value: '60+ tahun', label: '60+ thn', icon: '👴' },
  ],
  gender: [
    { value: 'Pria', label: 'Pria', icon: '♂️' },
    { value: 'Wanita', label: 'Wanita', icon: '♀️' },
    { value: 'Netral', label: 'Netral', icon: '⚧️' },
  ],
  pekerjaan: [
    { value: 'Psikolog Klinis', label: 'Psikolog Klinis', icon: '🧠' },
    { value: 'Teman Curhat', label: 'Teman Curhat', icon: '🤝' },
    { value: 'Orang Tua', label: 'Ibu / Ayah', icon: '👩' },
    { value: 'Pacar', label: 'Pasangan', icon: '💑' },
  ],
  gayaBicara: [
    { value: 'Empatik dan Profesional', label: 'Empatik & Profesional', icon: '💼' },
    { value: 'Santai dan Hangat (seperti sahabat)', label: 'Santai & Hangat', icon: '☕' },
    { value: 'Tegas namun Peduli', label: 'Tegas & Peduli', icon: '💪' },
    { value: 'Penuh Humor', label: 'Penuh Humor', icon: '😄' },
  ],
};

type PersonaKey = keyof typeof options;

const RadioGroup: React.FC<{
  name: PersonaKey;
  value: string;
  opts: { value: string; label: string; icon: string }[];
  onChange: (name: PersonaKey, value: string) => void;
}> = ({ name, value, opts, onChange }) => (
  <div className="radio-group">
    {opts.map((opt) => (
      <label
        key={opt.value}
        className={`radio-card ${value === opt.value ? 'selected' : ''}`}
        htmlFor={`${name}-${opt.value}`}
      >
        <input
          type="radio"
          id={`${name}-${opt.value}`}
          name={name}
          value={opt.value}
          checked={value === opt.value}
          onChange={() => onChange(name, opt.value)}
        />
        <span className="radio-icon">{opt.icon}</span>
        <span className="radio-label">{opt.label}</span>
      </label>
    ))}
  </div>
);

const SetupPersona: React.FC<Props> = ({ onSetupComplete }) => {
  const [persona, setPersona] = useState<Persona>({
    umur: '20-30 tahun',
    gender: 'Wanita',
    pekerjaan: 'Psikolog Klinis',
    gayaBicara: 'Empatik dan Profesional',
    userName: '',
  });

  useEffect(() => {
    const themeClass = genderThemeMap[persona.gender] || '';
    document.body.className = themeClass;
    return () => { document.body.className = ''; };
  }, [persona.gender]);

  const handleChange = (name: PersonaKey, value: string) => {
    setPersona(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!persona.userName.trim()) return;
    onSetupComplete(persona);
  };

  return (
    <div className="setup-page">
      <div className="setup-card">
        <div className="setup-logo">
          <span className="icon">🌸</span>
          <h1>Dear Diary</h1>
          <p>Tentukan siapa yang ingin kamu ajak bicara hari ini 💖</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label className="section-label">✍️ Nama Anda</label>
            <input
              type="text"
              className="chat-input"
              placeholder="Masukkan namamu..."
              value={persona.userName}
              onChange={(e) => setPersona(prev => ({ ...prev, userName: e.target.value }))}
              required
              style={{ width: '100%', cursor: 'auto' }}
            />
          </div>
          <div className="setup-logo">
            <h2>Kriteria Pendengar</h2>
          </div>
          <div className="form-section">
            <label className="section-label">🎂 Rentang Umur</label>
            <RadioGroup name="umur" value={persona.umur} opts={options.umur} onChange={handleChange} />
          </div>

          <div className="form-section">
            <label className="section-label">👤 Gender</label>
            <RadioGroup name="gender" value={persona.gender} opts={options.gender} onChange={handleChange} />
          </div>

          <div className="divider-setup" />

          <div className="form-section">
            <label className="section-label">💼 Latar Belakang</label>
            <RadioGroup name="pekerjaan" value={persona.pekerjaan} opts={options.pekerjaan} onChange={handleChange} />
          </div>

          <div className="form-section">
            <label className="section-label">🗣️ Gaya Bicara</label>
            <RadioGroup name="gayaBicara" value={persona.gayaBicara} opts={options.gayaBicara} onChange={handleChange} />
          </div>

          <button type="submit" className="btn-start">
            Mulai Konsultasi ✨
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupPersona;
