import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Tab } from '../types';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'market', label: 'Markt', icon: '📈' },
  { id: 'portfolio', label: 'Depot', icon: '💼' },
  { id: 'news', label: 'News', icon: '📰' },
  { id: 'stats', label: 'Statistik', icon: '📊' },
  { id: 'profile', label: 'Profil', icon: '👤' },
];

const TabBar: React.FC = () => {
  const { activeTab, setActiveTab, news } = useGameStore();
  const unreadCount = news.filter((n) => !n.read).length;

  return (
    <nav className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
          {tab.id === 'news' && unreadCount > 0 && (
            <span className="badge">{unreadCount}</span>
          )}
        </button>
      ))}
    </nav>
  );
};

export default TabBar;
