import React from 'react';
import { useGameStore } from '../store/gameStore';
import { xpForNextLevel, xpForLevel } from '../engine/simulation';

const Header: React.FC = () => {
  const { cash, level, xp, dayCount, getTotalValue, gameSpeed, setGameSpeed, advanceDay } =
    useGameStore();

  const totalValue = getTotalValue();
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForNextLevel(level);
  const xpProgress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  const formatCurrency = (val: number) =>
    val.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="header-brand">
          <h1>BörsenGame</h1>
          <span className="day-counter">Tag {dayCount}</span>
        </div>
        <div className="header-controls">
          <div className="speed-controls">
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                className={`speed-btn ${gameSpeed === s ? 'active' : ''}`}
                onClick={() => setGameSpeed(s)}
              >
                {s}x
              </button>
            ))}
          </div>
          <button className="advance-btn" onClick={advanceDay}>
            Nächster Tag ▶
          </button>
        </div>
      </div>

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
