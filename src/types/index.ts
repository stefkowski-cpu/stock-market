export interface Company {
  id: string;
  name: string;
  ticker: string;
  industry: Industry;
  description: string;
  logo: string; // SVG string
  color: string;
  basePrice: number;
  volatility: number; // 0-1, how volatile the stock is
  momentum: number; // current trend direction
  fundamentalStrength: number; // 0-1, company quality
}

export type Industry =
  | 'tech'
  | 'energy'
  | 'finance'
  | 'health'
  | 'retail'
  | 'automotive'
  | 'food'
  | 'entertainment'
  | 'realestate'
  | 'aerospace';

export const INDUSTRY_NAMES: Record<Industry, string> = {
  tech: 'Technologie',
  energy: 'Energie',
  finance: 'Finanzen',
  health: 'Gesundheit',
  retail: 'Einzelhandel',
  automotive: 'Automobil',
  food: 'Lebensmittel',
  entertainment: 'Unterhaltung',
  realestate: 'Immobilien',
  aerospace: 'Luft- & Raumfahrt',
};

export const INDUSTRY_COLORS: Record<Industry, string> = {
  tech: '#4A90D9',
  energy: '#F5A623',
  finance: '#7ED321',
  health: '#D0021B',
  retail: '#9013FE',
  automotive: '#4A4A4A',
  food: '#F8E71C',
  entertainment: '#FF6B9D',
  realestate: '#8B572A',
  aerospace: '#50E3C2',
};

export interface StockPrice {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PortfolioItem {
  companyId: string;
  shares: number;
  avgBuyPrice: number;
}

export interface Transaction {
  id: string;
  companyId: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  timestamp: number;
  total: number;
}

export interface NewsItem {
  id: string;
  headline: string;
  content: string;
  timestamp: number;
  impact: number; // -1 to 1
  affectedIndustries: Industry[];
  affectedCompanies: string[]; // company IDs
  category: 'market' | 'industry' | 'company' | 'global';
  read: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface GameState {
  cash: number;
  portfolio: PortfolioItem[];
  transactions: Transaction[];
  priceHistory: Record<string, StockPrice[]>;
  currentPrices: Record<string, number>;
  news: NewsItem[];
  achievements: Achievement[];
  level: number;
  xp: number;
  dayCount: number;
  totalProfitLoss: number;
  dayIntervalMs: number; // milliseconds per game day (5000 = 5s, up to 3600000 = 1h)
  paused: boolean;
  lastTickTime: number;
  marketOpen: boolean;
  marketSentiment: number; // -1 to 1
}

export type Tab = 'market' | 'portfolio' | 'news' | 'stats' | 'profile';
