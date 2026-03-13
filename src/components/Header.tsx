import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { xpForNextLevel, xpForLevel } from '../engine/simulation';

const SPEED_PRESETS = [
  { label: '5s', ms: 5000 },
  { label: '10s', ms: 10000 },
  { label: '30s', ms: 30000 },
  { label: '1m', ms: 60000 },
  { label: '5m', ms: 300000 },
  { label: '15m', ms: 900000 },
  { label: '30m', ms: 1800000 },
  { label: '1h', ms: 3600000 },
];

function formatInterval(ms: number): string {
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3600000) return `${Math.round(ms / 60000)}m`;
  return '1h';
}

const Header: React.FC = () => {
  const {
    cash,
    level,
    xp,
    dayCount,
    getTotalValue,
    dayIntervalMs,
    paused,
    setDayInterval,
    togglePaused,
    advanceDay,
  } = useGameStore();
  const [showSpeedPanel, setShowSpeedPanel] = useState(false);

  const totalValue = getTotalValue();
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForNextLevel(level);
  const xpProgress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  const formatCurrency = (val: number) =>
    val.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  // Map ms to slider value (logarithmic scale: 5s=0 .. 1h=100)
  const msToSlider = (ms: number): number => {
    const minLog = Math.log(5000);
    const maxLog = Math.log(3600000);
    return ((Math.log(ms) - minLog) / (maxLog - minLog)) * 100;
  };

  const sliderToMs = (val: number): number => {
    const minLog = Math.log(5000);
    const maxLog = Math.log(3600000);
    const ms = Math.exp(minLog + (val / 100) * (maxLog - minLog));
    // Snap to nice values
    if (ms < 7500) return 5000;
    if (ms < 20000) return 10000;
    if (ms < 45000) return 30000;
    if (ms < 150000) return 60000;
    if (ms < 600000) return 300000;
    if (ms < 1350000) return 900000;
    if (ms < 2700000) return 1800000;
    return 3600000;
  };

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="header-brand">
          <h1>VirtualBörse</h1>
          <span className="day-counter">Tag {dayCount}</span>
        </div>
        <div className="header-controls">
          <button
            className={`pause-btn ${paused ? 'is-paused' : 'is-playing'}`}
            onClick={togglePaused}
            title={paused ? 'Fortsetzen' : 'Pause'}
          >
            {paused ? '▶' : '⏸'}
          </button>
          <button
            className="speed-indicator-btn"
            onClick={() => setShowSpeedPanel(!showSpeedPanel)}
            title="Geschwindigkeit einstellen"
          >
            {paused ? 'Pause' : `1 Tag = ${formatInterval(dayIntervalMs)}`}
          </button>
          <button className="advance-btn" onClick={advanceDay} title="Nächster Tag">
            ▶▶
          </button>
        </div>
      </div>

      {showSpeedPanel && (
        <div className="speed-panel">
          <div className="speed-panel-header">
            <span>Spielgeschwindigkeit</span>
            <button className="speed-panel-close" onClick={() => setShowSpeedPanel(false)}>✕</button>
          </div>
          <div className="speed-slider-row">
            <span className="speed-label-left">5s</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={msToSlider(dayIntervalMs)}
              onChange={(e) => setDayInterval(sliderToMs(Number(e.target.value)))}
              className="speed-slider"
            />
            <span className="speed-label-right">1h</span>
          </div>
          <div className="speed-current">
            1 Spieltag = <strong>{formatInterval(dayIntervalMs)}</strong> Echtzeit
          </div>
          <div className="speed-presets">
            {SPEED_PRESETS.map((p) => (
              <button
                key={p.ms}
                className={`speed-preset-btn ${dayIntervalMs === p.ms ? 'active' : ''}`}
                onClick={() => setDayInterval(p.ms)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="header-stats">
        <div className="stat">
          <span className="stat-label">Bargeld</span>
          <span className="stat-value">{formatCurrency(cash)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Gesamtwert</span>
          <span className="stat-value highlight">{formatCurrency(totalValue)}</span>
        </div>
        <div className="stat level-stat">
          <span className="stat-label">Level {level}</span>
          <div className="xp-bar">
            <div className="xp-fill" style={{ width: `${Math.min(100, xpProgress)}%` }} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
