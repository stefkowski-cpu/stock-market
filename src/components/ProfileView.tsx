import React from 'react';
import { useGameStore } from '../store/gameStore';
import { xpForNextLevel, xpForLevel } from '../engine/simulation';
import { ThemeMode } from '../types';

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
    theme,
    getTotalValue,
    resetGame,
    setTheme,
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
    if (window.confirm('Spiel wirklich zurücksetzen? Alle Fortschritte gehen verloren! Das Spiel startet bei Tag 1 mit 50.000€ Startkapital.')) {
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

      <h3 className="section-title">Einstellungen</h3>
      <div className="settings-section">
        <div className="setting-item">
          <div className="setting-label">
            <span className="setting-name">Darstellung</span>
            <span className="setting-desc">Wähle zwischen hellem und dunklem Design</span>
          </div>
          <div className="theme-toggle">
            <button
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              Dunkel
            </button>
            <button
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              Hell
            </button>
          </div>
        </div>
        <div className="setting-item">
          <div className="setting-label">
            <span className="setting-name">Spiel zurücksetzen</span>
            <span className="setting-desc">Startet das Spiel bei Tag 1 neu (50.000€ Startkapital)</span>
          </div>
          <button className="reset-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      <h3 className="section-title">Anleitung</h3>
      <div className="guide-section">
        <div className="guide-card">
          <span className="guide-icon">💰</span>
          <div className="guide-text">
            <span className="guide-title">Startkapital</span>
            <span className="guide-desc">Du startest mit 50.000 €. Kaufe und verkaufe Aktien, um dein Vermögen zu vermehren.</span>
          </div>
        </div>
        <div className="guide-card">
          <span className="guide-icon">📈</span>
          <div className="guide-text">
            <span className="guide-title">Markt</span>
            <span className="guide-desc">Durchsuche 100 echte Unternehmen aus 10 Branchen. Sortiere nach Name, Preis, Änderung oder Branche.</span>
          </div>
        </div>
        <div className="guide-card">
          <span className="guide-icon">📰</span>
          <div className="guide-text">
            <span className="guide-title">Nachrichten</span>
            <span className="guide-desc">Nachrichten beeinflussen die Kurse. Klicke auf Branchen- oder Unternehmens-Tags, um direkt dorthin zu springen.</span>
          </div>
        </div>
        <div className="guide-card">
          <span className="guide-icon">📊</span>
          <div className="guide-text">
            <span className="guide-title">Statistik</span>
            <span className="guide-desc">Analysiere Kurscharts, Kennzahlen und Unternehmensnews. Vergleiche bis zu 10 Aktien gleichzeitig.</span>
          </div>
        </div>
        <div className="guide-card">
          <span className="guide-icon">💼</span>
          <div className="guide-text">
            <span className="guide-title">Depot</span>
            <span className="guide-desc">Verfolge dein Portfolio mit Gewinn/Verlust-Anzeige und Allokations-Diagramm. Klicke auf eine Position für die Detailansicht.</span>
          </div>
        </div>
        <div className="guide-card">
          <span className="guide-icon">⏱️</span>
          <div className="guide-text">
            <span className="guide-title">Spielgeschwindigkeit</span>
            <span className="guide-desc">Stelle die Tagesdauer ein (5s bis 1h), pausiere jederzeit oder klicke ▶▶ für den nächsten Tag.</span>
          </div>
        </div>
        <div className="guide-card">
          <span className="guide-icon">⭐</span>
          <div className="guide-text">
            <span className="guide-title">Level & Erfolge</span>
            <span className="guide-desc">Jeder Trade bringt XP. Steige im Level auf und schalte Erfolge frei – vom Anfänger zur Börsen-Legende!</span>
          </div>
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
    </div>
  );
};

export default ProfileView;
