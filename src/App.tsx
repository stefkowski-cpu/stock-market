import React, { useEffect, useRef } from 'react';
import './App.css';
import { useGameStore } from './store/gameStore';
import Header from './components/Header';
import TabBar from './components/TabBar';
import MarketView from './components/MarketView';
import PortfolioView from './components/PortfolioView';
import NewsView from './components/NewsView';
import StatsView from './components/StatsView';
import ProfileView from './components/ProfileView';
import TradeModal from './components/TradeModal';
import AchievementPopup from './components/AchievementPopup';

function App() {
  const { activeTab, dayIntervalMs, paused, advanceDay } = useGameStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!paused) {
      intervalRef.current = setInterval(() => {
        advanceDay();
      }, dayIntervalMs);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dayIntervalMs, paused, advanceDay]);

  const renderTab = () => {
    switch (activeTab) {
      case 'market':
        return <MarketView />;
      case 'portfolio':
        return <PortfolioView />;
      case 'news':
        return <NewsView />;
      case 'stats':
        return <StatsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <MarketView />;
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="app-content">{renderTab()}</main>
      <TabBar />
      <TradeModal />
      <AchievementPopup />
    </div>
  );
}

export default App;
