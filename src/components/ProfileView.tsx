import React from 'react';
import { useGameStore } from '../store/gameStore';
import { xpForNextLevel, xpForLevel } from '../engine/simulation';

const ProfileView: React.FC = () => {
  const {
    level,
    xp,
    dayCount,
    totalProfitLoss,
    achievements,
    transactions,
    portfolio,
    cash,
    getTotalValue,
    resetGame,
  } = useGameStore();

  const totalValue = getTotalValue();
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForNextLevel(level);
  const xpProgress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalAchievements = achievements.length;

  const formatCurrency = (val: number) =>
    val.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  const getLevelTitle = (lvl: number) => {
    if (lvl < 3) return 'Anfänger';
    if (lvl < 5) return 'Händler';
    if (lvl < 8) return 'Investor';
    if (lvl < 12) return 'Portfolio-Manager';
    if (lvl < 16) return 'Fondsmanager';
    if (lvl < 20) return 'Börsen-Profi';
    if (lvl < 25) return 'Wall-Street-Wolf';
    return 'Börsen-Legende';
  };

  const handleReset = () => {
    if (window.confirm('Spiel wirklich zurücksetzen? Alle Fortschritte gehen verloren!')) {
      resetGame();
    }
  };

  return (
    <div className="profile-view">
      <div className="profile-header">
        <div className="avatar">
          <span className="avatar-level">{level}</span>
        </div>
        <div className="profile-title">
          <h2>{getLevelTitle(level)}</h2>
          <p>Level {level}</p>
        </div>
      </div>

      <div className="xp-section">
        <div className="xp-bar-large">
          <div className="xp-fill" style={{ width: `${Math.min(100, xpProgress)}%` }} />
        </div>
        <div className="xp-text">
          {xp - currentLevelXP} / {nextLevelXP - currentLevelXP} XP
        </div>
      </div>

      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <span className="pstat-value">{dayCount}</span>
          <span className="pstat-label">Spieltage</span>
        </div>
        <div className="profile-stat-card">
          <span className="pstat-value">{transactions.length}</span>
          <span className="pstat-label">Trades</span>
        </div>
        <div className="profile-stat-card">
          <span className="pstat-value">{formatCurrency(totalValue)}</span>
          <span className="pstat-label">Gesamtwert</span>
        </div>
        <div className="profile-stat-card">
          <span className={`pstat-value ${totalProfitLoss >= 0 ? 'positive' : 'negative'}`}>
            {totalProfitLoss >= 0 ? '+' : ''}{formatCurrency(totalProfitLoss)}
          </span>
          <span className="pstat-label">Gewinn/Verlust</span>
        </div>
      </div>

      <h3 className="section-title">
        Erfolge ({unlockedCount}/{totalAchievements})
      </h3>
      <div className="achievements-grid">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={`achievement-card ${a.unlocked ? 'unlocked' : 'locked'}`}
          >
            <span className="achievement-icon">{a.unlocked ? a.icon : '🔒'}</span>
            <div className="achievement-info">
              <span className="achievement-name">{a.name}</span>
              <span className="achievement-desc">{a.description}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="profile-actions">
        <button className="reset-btn" onClick={handleReset}>
          Spiel zurücksetzen
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
