import React, { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useGameStore } from '../store/gameStore';
import { companies, getCompanyById } from '../data/companies';
import { INDUSTRY_NAMES, INDUSTRY_COLORS } from '../types';
import StockLogo from './StockLogo';

type TimeRange = '7d' | '30d' | '90d' | 'all';

const StatsView: React.FC = () => {
  const {
    selectedStock,
    selectStock,
    priceHistory,
    currentPrices,
    getStockChange,
    portfolio,
    openTradeModal,
  } = useGameStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const company = selectedStock ? getCompanyById(selectedStock) : null;
  const history = selectedStock ? priceHistory[selectedStock] || [] : [];

  const getFilteredHistory = () => {
    const days =
      timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : history.length;
    return history.slice(-days);
  };

  const filteredHistory = getFilteredHistory();

  const chartData = filteredHistory.map((h, i) => ({
    day: i + 1,
    preis: h.close,
    hoch: h.high,
    tief: h.low,
    volumen: h.volume,
    open: h.open,
    close: h.close,
  }));

  // Calculate statistics
  const calcStats = () => {
    if (filteredHistory.length < 2) return null;
    const closes = filteredHistory.map((h) => h.close);
    const volumes = filteredHistory.map((h) => h.volume);
    const returns = closes.slice(1).map((c, i) => (c - closes[i]) / closes[i]);

    const avg = closes.reduce((s, c) => s + c, 0) / closes.length;
    const high52 = Math.max(...closes);
    const low52 = Math.min(...closes);
    const avgVol = Math.round(volumes.reduce((s, v) => s + v, 0) / volumes.length);
    const volatility = Math.sqrt(
      returns.reduce((s, r) => s + r * r, 0) / returns.length
    ) * Math.sqrt(252) * 100;

    // Simple Moving Averages
    const sma20 = closes.length >= 20
      ? closes.slice(-20).reduce((s, c) => s + c, 0) / 20
      : null;
    const sma50 = closes.length >= 50
      ? closes.slice(-50).reduce((s, c) => s + c, 0) / 50
      : null;

    return {
      avg: Math.round(avg * 100) / 100,
      high52: Math.round(high52 * 100) / 100,
      low52: Math.round(low52 * 100) / 100,
      avgVol,
      volatility: Math.round(volatility * 100) / 100,
      sma20: sma20 ? Math.round(sma20 * 100) / 100 : null,
      sma50: sma50 ? Math.round(sma50 * 100) / 100 : null,
      totalReturn: Math.round(
        ((closes[closes.length - 1] - closes[0]) / closes[0]) * 10000
      ) / 100,
    };
  };

  const stats = calcStats();
  const position = portfolio.find((p) => p.companyId === selectedStock);

  if (!company) {
    return (
      <div className="stats-view">
        <h3 className="section-title">Aktie auswählen</h3>
        <div className="stock-grid">
          {companies.map((c) => {
            const change = getStockChange(c.id);
            return (
              <div
                key={c.id}
                className="stock-mini-card"
                onClick={() => selectStock(c.id)}
              >
                <StockLogo svg={c.logo} size={32} />
                <span className="mini-ticker">{c.ticker}</span>
                <span className={`mini-change ${change.percent >= 0 ? 'positive' : 'negative'}`}>
                  {change.percent >= 0 ? '+' : ''}{change.percent.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const price = currentPrices[company.id] || 0;
  const change = getStockChange(company.id);
  const isPositive = change.percent >= 0;

  const formatCurrency = (val: number) =>
    val.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <div>Eröffnung: {formatCurrency(data.open)}</div>
          <div>Schluss: {formatCurrency(data.close)}</div>
          <div>Hoch: {formatCurrency(data.hoch)}</div>
          <div>Tief: {formatCurrency(data.tief)}</div>
          <div>Volumen: {data.volumen?.toLocaleString('de-DE')}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="stats-view">
      <button className="back-btn" onClick={() => selectStock(null)}>
        ← Alle Aktien
      </button>

      <div className="stock-detail-header">
        <StockLogo svg={company.logo} size={56} />
        <div className="detail-info">
          <h2>{company.name}</h2>
          <div className="detail-ticker">
            {company.ticker}
            <span
              className="industry-tag"
              style={{ background: INDUSTRY_COLORS[company.industry] }}
            >
              {INDUSTRY_NAMES[company.industry]}
            </span>
          </div>
        </div>
      </div>

      <div className="price-display">
        <span className="current-price">{formatCurrency(price)}</span>
        <span className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : ''}{formatCurrency(change.absolute)} ({change.percent.toFixed(2)}%)
        </span>
      </div>

      <p className="company-description">{company.description}</p>

      <div className="trade-buttons">
        <button
          className="trade-btn buy"
          onClick={() => openTradeModal('buy')}
        >
          Kaufen
        </button>
        <button
          className="trade-btn sell"
          onClick={() => openTradeModal('sell')}
          disabled={!position}
        >
          Verkaufen
        </button>
      </div>

      {position && (
        <div className="position-summary">
          <span>Deine Position: {position.shares} Aktien</span>
          <span>Ø Kaufpreis: {formatCurrency(position.avgBuyPrice)}</span>
        </div>
      )}

      <div className="time-range-selector">
        {(['7d', '30d', '90d', 'all'] as TimeRange[]).map((range) => (
          <button
            key={range}
            className={`range-btn ${timeRange === range ? 'active' : ''}`}
            onClick={() => setTimeRange(range)}
          >
            {range === 'all' ? 'Max' : range}
          </button>
        ))}
      </div>

      <div className="chart-container">
        <h4>Kursverlauf</h4>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={company.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={company.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
            <XAxis dataKey="day" stroke="#666" tick={{ fontSize: 11 }} />
            <YAxis stroke="#666" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="preis"
              stroke={company.color}
              fill="url(#colorPrice)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h4>Hoch / Tief</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
            <XAxis dataKey="day" stroke="#666" tick={{ fontSize: 11 }} />
            <YAxis stroke="#666" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="hoch" stroke="#4CAF50" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="tief" stroke="#F44336" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="preis" stroke={company.color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h4>Handelsvolumen</h4>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
            <XAxis dataKey="day" stroke="#666" tick={{ fontSize: 11 }} />
            <YAxis stroke="#666" tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="volumen" fill={company.color} opacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {stats && (
        <div className="stats-grid">
          <h4>Kennzahlen</h4>
          <div className="stat-item">
            <span className="stat-key">Durchschnittspreis</span>
            <span className="stat-val">{formatCurrency(stats.avg)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-key">52W-Hoch</span>
            <span className="stat-val positive">{formatCurrency(stats.high52)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-key">52W-Tief</span>
            <span className="stat-val negative">{formatCurrency(stats.low52)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-key">Ø Volumen</span>
            <span className="stat-val">{stats.avgVol.toLocaleString('de-DE')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-key">Volatilität (ann.)</span>
            <span className="stat-val">{stats.volatility}%</span>
          </div>
          {stats.sma20 && (
            <div className="stat-item">
              <span className="stat-key">SMA 20</span>
              <span className="stat-val">{formatCurrency(stats.sma20)}</span>
            </div>
          )}
          {stats.sma50 && (
            <div className="stat-item">
              <span className="stat-key">SMA 50</span>
              <span className="stat-val">{formatCurrency(stats.sma50)}</span>
            </div>
          )}
          <div className="stat-item">
            <span className="stat-key">Gesamtrendite</span>
            <span className={`stat-val ${stats.totalReturn >= 0 ? 'positive' : 'negative'}`}>
              {stats.totalReturn >= 0 ? '+' : ''}{stats.totalReturn}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsView;
