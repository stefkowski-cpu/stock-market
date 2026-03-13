import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import {
  GameState,
  PortfolioItem,
  Transaction,
  Tab,
  StockPrice,
  NewsItem,
  Achievement,
  Industry,
} from '../types';
import { companies } from '../data/companies';
import { defaultAchievements } from '../data/achievements';
import { generateNews } from '../data/newsTemplates';
import {
  generateDayCandle,
  calculateNewsImpacts,
  updateMarketSentiment,
  calculateXPForTrade,
  levelFromXP,
} from '../engine/simulation';

const STARTING_CASH = 50000;

function initializePrices(): Record<string, number> {
  const prices: Record<string, number> = {};
  for (const c of companies) {
    prices[c.id] = c.basePrice;
  }
  return prices;
}

function initializeHistory(): Record<string, StockPrice[]> {
  const history: Record<string, StockPrice[]> = {};
  for (const c of companies) {
    // Generate 30 days of initial history
    const days: StockPrice[] = [];
    let price = c.basePrice * (0.8 + Math.random() * 0.4);
    for (let i = 30; i >= 0; i--) {
      const open = price;
      const change = (Math.random() - 0.48) * c.volatility * 0.04 * price;
      const close = Math.max(1, price + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.02);
      const low = Math.min(open, close) * (1 - Math.random() * 0.02);
      days.push({
        timestamp: Date.now() - i * 86400000,
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
        volume: Math.floor(50000 + Math.random() * 200000),
      });
      price = close;
    }
    history[c.id] = days;
  }
  return history;
}

interface GameStore extends GameState {
  activeTab: Tab;
  selectedStock: string | null;
  showTradeModal: boolean;
  tradeType: 'buy' | 'sell';
  newAchievement: Achievement | null;

  // Actions
  setActiveTab: (tab: Tab) => void;
  selectStock: (id: string | null) => void;
  openTradeModal: (type: 'buy' | 'sell') => void;
  closeTradeModal: () => void;
  executeTrade: (companyId: string, shares: number, type: 'buy' | 'sell') => boolean;
  advanceDay: () => void;
  markNewsRead: (id: string) => void;
  setDayInterval: (ms: number) => void;
  setPaused: (paused: boolean) => void;
  togglePaused: () => void;
  clearNewAchievement: () => void;
  resetGame: () => void;
  getPortfolioValue: () => number;
  getTotalValue: () => number;
  getStockChange: (companyId: string) => { absolute: number; percent: number };
  getPositionPnL: (item: PortfolioItem) => { absolute: number; percent: number };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      cash: STARTING_CASH,
      portfolio: [],
      transactions: [],
      priceHistory: initializeHistory(),
      currentPrices: initializePrices(),
      news: [],
      achievements: [...defaultAchievements],
      level: 1,
      xp: 0,
      dayCount: 0,
      totalProfitLoss: 0,
      dayIntervalMs: 5000,
      paused: false,
      lastTickTime: Date.now(),
      marketOpen: true,
      marketSentiment: 0,
      activeTab: 'market',
      selectedStock: null,
      showTradeModal: false,
      tradeType: 'buy',
      newAchievement: null,

      setActiveTab: (tab) => set({ activeTab: tab }),
      selectStock: (id) => set({ selectedStock: id }),
      openTradeModal: (type) => set({ showTradeModal: true, tradeType: type }),
      closeTradeModal: () => set({ showTradeModal: false }),
      clearNewAchievement: () => set({ newAchievement: null }),

      setDayInterval: (ms) => set({ dayIntervalMs: ms }),
      setPaused: (paused) => set({ paused }),
      togglePaused: () => set((state) => ({ paused: !state.paused })),

      executeTrade: (companyId, shares, type) => {
        const state = get();
        const price = state.currentPrices[companyId];
        if (!price || shares <= 0) return false;

        const total = price * shares;

        if (type === 'buy') {
          if (total > state.cash) return false;

          const existing = state.portfolio.find((p) => p.companyId === companyId);
          let newPortfolio: PortfolioItem[];

          if (existing) {
            const newShares = existing.shares + shares;
            const newAvg =
              (existing.avgBuyPrice * existing.shares + price * shares) / newShares;
            newPortfolio = state.portfolio.map((p) =>
              p.companyId === companyId
                ? { ...p, shares: newShares, avgBuyPrice: Math.round(newAvg * 100) / 100 }
                : p
            );
          } else {
            newPortfolio = [
              ...state.portfolio,
              { companyId, shares, avgBuyPrice: price },
            ];
          }

          const transaction: Transaction = {
            id: uuid(),
            companyId,
            type: 'buy',
            shares,
            price,
            timestamp: Date.now(),
            total,
          };

          const newXP = state.xp + calculateXPForTrade(total);

          set({
            cash: Math.round((state.cash - total) * 100) / 100,
            portfolio: newPortfolio,
            transactions: [...state.transactions, transaction],
            xp: newXP,
            level: levelFromXP(newXP),
          });
        } else {
          // Sell
          const existing = state.portfolio.find((p) => p.companyId === companyId);
          if (!existing || existing.shares < shares) return false;

          const profitLoss = (price - existing.avgBuyPrice) * shares;
          let newPortfolio: PortfolioItem[];

          if (existing.shares === shares) {
            newPortfolio = state.portfolio.filter((p) => p.companyId !== companyId);
          } else {
            newPortfolio = state.portfolio.map((p) =>
              p.companyId === companyId
                ? { ...p, shares: p.shares - shares }
                : p
            );
          }

          const transaction: Transaction = {
            id: uuid(),
            companyId,
            type: 'sell',
            shares,
            price,
            timestamp: Date.now(),
            total,
          };

          const newXP = state.xp + calculateXPForTrade(total);

          set({
            cash: Math.round((state.cash + total) * 100) / 100,
            portfolio: newPortfolio,
            transactions: [...state.transactions, transaction],
            totalProfitLoss: Math.round((state.totalProfitLoss + profitLoss) * 100) / 100,
            xp: newXP,
            level: levelFromXP(newXP),
          });
        }

        // Check achievements after trade
        setTimeout(() => checkAchievements(get, set), 100);

        return true;
      },

      advanceDay: () => {
        const state = get();

        // Generate news (1-3 per day)
        const newsCount = 1 + Math.floor(Math.random() * 3);
        const newNews: NewsItem[] = [];
        for (let i = 0; i < newsCount; i++) {
          newNews.push(generateNews(state.dayCount));
        }

        const allNews = [...state.news, ...newNews].slice(-50); // Keep last 50 news

        // Calculate impacts
        const impacts = calculateNewsImpacts(newNews);
        const newSentiment = updateMarketSentiment(state.marketSentiment, newNews);

        // Update prices
        const newPrices: Record<string, number> = {};
        const newHistory: Record<string, StockPrice[]> = { ...state.priceHistory };

        for (const company of companies) {
          const currentPrice = state.currentPrices[company.id];
          const candle = generateDayCandle(company, currentPrice, newSentiment, impacts);
          newPrices[company.id] = candle.close;

          const history = [...(state.priceHistory[company.id] || []), candle];
          // Keep last 365 days
          newHistory[company.id] = history.slice(-365);
        }

        set({
          currentPrices: newPrices,
          priceHistory: newHistory,
          news: allNews,
          dayCount: state.dayCount + 1,
          marketSentiment: newSentiment,
          lastTickTime: Date.now(),
        });

        // Check achievements
        setTimeout(() => checkAchievements(get, set), 100);
      },

      markNewsRead: (id) => {
        const state = get();
        set({
          news: state.news.map((n) => (n.id === id ? { ...n, read: true } : n)),
        });
      },

      resetGame: () => {
        set({
          cash: STARTING_CASH,
          portfolio: [],
          transactions: [],
          priceHistory: initializeHistory(),
          currentPrices: initializePrices(),
          news: [],
          achievements: [...defaultAchievements],
          level: 1,
          xp: 0,
          dayCount: 0,
          totalProfitLoss: 0,
          dayIntervalMs: 5000,
          paused: false,
          lastTickTime: Date.now(),
          marketOpen: true,
          marketSentiment: 0,
          activeTab: 'market',
          selectedStock: null,
          showTradeModal: false,
          newAchievement: null,
        });
      },

      getPortfolioValue: () => {
        const state = get();
        return state.portfolio.reduce((sum, item) => {
          const price = state.currentPrices[item.companyId] || 0;
          return sum + price * item.shares;
        }, 0);
      },

      getTotalValue: () => {
        const state = get();
        const portfolioValue = state.portfolio.reduce((sum, item) => {
          const price = state.currentPrices[item.companyId] || 0;
          return sum + price * item.shares;
        }, 0);
        return Math.round((state.cash + portfolioValue) * 100) / 100;
      },

      getStockChange: (companyId) => {
        const state = get();
        const history = state.priceHistory[companyId];
        if (!history || history.length < 2) return { absolute: 0, percent: 0 };
        const prev = history[history.length - 2].close;
        const curr = state.currentPrices[companyId];
        return {
          absolute: Math.round((curr - prev) * 100) / 100,
          percent: Math.round(((curr - prev) / prev) * 10000) / 100,
        };
      },

      getPositionPnL: (item) => {
        const state = get();
        const currentPrice = state.currentPrices[item.companyId] || 0;
        const absolute = (currentPrice - item.avgBuyPrice) * item.shares;
        const percent = ((currentPrice - item.avgBuyPrice) / item.avgBuyPrice) * 100;
        return {
          absolute: Math.round(absolute * 100) / 100,
          percent: Math.round(percent * 100) / 100,
        };
      },
    }),
    {
      name: 'stock-market-game',
    }
  )
);

function checkAchievements(get: () => GameStore, set: (partial: Partial<GameStore>) => void) {
  const state = get();
  const achievements = [...state.achievements];
  let newlyUnlocked: Achievement | null = null;

  const check = (id: string, condition: boolean) => {
    const idx = achievements.findIndex((a) => a.id === id);
    if (idx >= 0 && !achievements[idx].unlocked && condition) {
      achievements[idx] = { ...achievements[idx], unlocked: true, unlockedAt: Date.now() };
      newlyUnlocked = achievements[idx];
    }
  };

  check('first_trade', state.transactions.length > 0);
  check('portfolio_5', state.portfolio.length >= 5);
  check('profit_1000', state.totalProfitLoss >= 1000);
  check('profit_10000', state.totalProfitLoss >= 10000);
  check('profit_100000', state.totalProfitLoss >= 100000);
  check('week_1', state.dayCount >= 7);
  check('month_1', state.dayCount >= 30);
  check('millionaire', state.getTotalValue() >= 1000000);

  // All industries check
  const industriesInPortfolio = new Set(
    state.portfolio.map((p) => {
      const company = companies.find((c) => c.id === p.companyId);
      return company?.industry;
    })
  );
  check('all_industries', industriesInPortfolio.size >= 10);

  // News reader
  const readCount = state.news.filter((n) => n.read).length;
  check('news_reader', readCount >= 50);

  // Double up
  const hasDoubledPosition = state.portfolio.some((p) => {
    const currentPrice = state.currentPrices[p.companyId] || 0;
    return currentPrice >= p.avgBuyPrice * 2;
  });
  check('double_up', hasDoubledPosition);

  if (newlyUnlocked) {
    set({ achievements, newAchievement: newlyUnlocked });
  } else {
    set({ achievements });
  }
}
