import { Company, StockPrice, NewsItem, Industry } from '../types';

/**
 * Geometric Brownian Motion inspired price simulation
 * with news impact, sector correlation, and mean reversion
 */

// Random normal using Box-Muller transform
function randomNormal(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export function simulatePrice(
  company: Company,
  currentPrice: number,
  marketSentiment: number,
  newsImpacts: { industry: Record<Industry, number>; company: Record<string, number> },
  dt: number = 1
): { newPrice: number; volume: number } {
  const mu = 0.0002; // slight upward drift
  const sigma = company.volatility * 0.02;

  // Mean reversion toward fundamental value
  const fundamentalPrice = company.basePrice * (0.5 + company.fundamentalStrength);
  const meanReversionStrength = 0.001;
  const meanReversion = meanReversionStrength * (fundamentalPrice - currentPrice) / currentPrice;

  // Market sentiment effect
  const sentimentEffect = marketSentiment * 0.005;

  // News impact
  const industryImpact = newsImpacts.industry[company.industry] || 0;
  const companyImpact = newsImpacts.company[company.id] || 0;
  const newsEffect = (industryImpact * 0.02) + (companyImpact * 0.04);

  // Momentum
  const momentumEffect = company.momentum * 0.003;

  // Total drift
  const totalDrift = mu + meanReversion + sentimentEffect + newsEffect + momentumEffect;

  // GBM step
  const randomShock = sigma * randomNormal() * Math.sqrt(dt);
  const priceChange = totalDrift * dt + randomShock;
  const newPrice = Math.max(0.01, currentPrice * (1 + priceChange));

  // Volume simulation (higher on volatile days)
  const baseVolume = 100000 * (0.5 + company.fundamentalStrength);
  const volumeMultiplier = 1 + Math.abs(priceChange) * 50 + Math.abs(newsEffect) * 20;
  const volume = Math.floor(baseVolume * volumeMultiplier * (0.8 + Math.random() * 0.4));

  return { newPrice: Math.round(newPrice * 100) / 100, volume };
}

export function generateDayCandle(
  company: Company,
  openPrice: number,
  marketSentiment: number,
  newsImpacts: { industry: Record<Industry, number>; company: Record<string, number> }
): StockPrice {
  let price = openPrice;
  let high = openPrice;
  let low = openPrice;
  let totalVolume = 0;

  // Simulate intraday movement with ~10 steps
  for (let i = 0; i < 10; i++) {
    const { newPrice, volume } = simulatePrice(company, price, marketSentiment, newsImpacts, 0.1);
    price = newPrice;
    high = Math.max(high, price);
    low = Math.min(low, price);
    totalVolume += volume;
  }

  return {
    timestamp: Date.now(),
    open: openPrice,
    high: Math.round(high * 100) / 100,
    low: Math.round(low * 100) / 100,
    close: Math.round(price * 100) / 100,
    volume: totalVolume,
  };
}

export function calculateNewsImpacts(
  news: NewsItem[]
): { industry: Record<Industry, number>; company: Record<string, number> } {
  const industryImpacts: Record<string, number> = {};
  const companyImpacts: Record<string, number> = {};

  // Only consider recent news (last 5 items)
  const recentNews = news.slice(-5);

  for (const item of recentNews) {
    const decayFactor = 0.8; // recent news has more impact
    for (const ind of item.affectedIndustries) {
      industryImpacts[ind] = (industryImpacts[ind] || 0) + item.impact * decayFactor;
    }
    for (const compId of item.affectedCompanies) {
      companyImpacts[compId] = (companyImpacts[compId] || 0) + item.impact * decayFactor;
    }
  }

  return {
    industry: industryImpacts as Record<Industry, number>,
    company: companyImpacts,
  };
}

export function updateMarketSentiment(current: number, news: NewsItem[]): number {
  const recentNews = news.slice(-3);
  let sentimentShift = 0;

  for (const item of recentNews) {
    if (item.category === 'global') {
      sentimentShift += item.impact * 0.3;
    } else {
      sentimentShift += item.impact * 0.1;
    }
  }

  // Mean reversion to 0
  const newSentiment = current * 0.95 + sentimentShift;
  return Math.max(-1, Math.min(1, newSentiment));
}

export function calculateXPForTrade(tradeValue: number): number {
  return Math.floor(Math.sqrt(tradeValue) * 2);
}

export function levelFromXP(xp: number): number {
  // Each level needs progressively more XP
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpForLevel(level: number): number {
  return (level - 1) * (level - 1) * 100;
}

export function xpForNextLevel(level: number): number {
  return level * level * 100;
}
