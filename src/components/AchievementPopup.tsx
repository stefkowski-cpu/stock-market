import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

const AchievementPopup: React.FC = () => {
  const { newAchievement, clearNewAchievement } = useGameStore();

  useEffect(() => {
    if (newAchievement) {
      const timer = setTimeout(clearNewAchievement, 3000);
      return () => clearTimeout(timer);
    }
  }, [newAchievement, clearNewAchievement]);

  if (!newAchievement) return null;

  return (
    <div className="achievement-popup">
      <div className="achievement-popup-content">
        <span className="popup-icon">{newAchievement.icon}</span>
        <div>
          <div className="popup-title">Erfolg freigeschaltet!</div>
          <div className="popup-name">{newAchievement.name}</div>
          <div className="popup-desc">{newAchievement.description}</div>
        </div>
      </div>
    </div>
  );
};

export default AchievementPopup;
