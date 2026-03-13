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
  Legend,
} from 'recharts';
import { useGameStore } from '../store/gameStore';
import { companies, getCompanyById } from '../data/companies';
import { INDUSTRY_NAMES, INDUSTRY_COLORS, Industry } from '../types';
import StockLogo from './StockLogo';

type TimeRange = '7d' | '30d' | '90d' | 'all';

const COMPARE_COLORS = [
  '#6366f1', '#22c55e', '#ef4444', '#f59e0b', '#06b6d4',
  '#ec4899', '#8b5cf6', '#14b8a6', '#f97316', '#64748b',
];

const StatsView: React.FC = () => {
  const {
    selectedStock,
    selectStock,
    priceHistory,
    currentPrices,
    getStockChange,
    portfolio,
    openTradeModal,
    news,
    markNewsRead,
    setActiveTab,
    setMarketFilter,
    setMarketSort,
  } = useGameStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareSearch, setShowCompareSearch] = useState(false);
  const [compareSearch, setCompareSearch] = useState('');

  const company = selectedStock ? getCompanyById(selectedStock) : null;
  const history = selectedStock ? priceHistory[selectedStock] || [] : [];

  const getFilteredHistory = (h: typeof history) => {
    const days =
      timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : h.length;
    return h.slice(-days);
  };

  const filteredHistory = getFilteredHistory(history);

  const chartData = filteredHistory.map((h, i) => ({
    day: i + 1,
    preis: h.close,
    hoch: h.high,
    tief: h.low,
    volumen: h.volume,
    open: h.open,
    close: h.close,
  }));

  // Build comparison chart data (normalized to % change from first day)
  const buildCompareData = () => {
    if (compareIds.length === 0) return [];
    // Find the shortest history length for the time range
    const allHistories = compareIds.map((id) => getFilteredHistory(priceHistory[id] || []));
    const minLen = Math.min(...allHistories.map((h) => h.length));
    if (minLen < 2) return [];

    const data: any[] = [];
    for (let i = 0; i < minLen; i++) {
      const point: any = { day: i + 1 };
      compareIds.forEach((id, idx) => {
        const h = allHistories[idx];
        const basePrice = h[0].close;
        point[id] = basePrice > 0 ? Math.round(((h[i].close - basePrice) / basePrice) * 10000) / 100 : 0;
      });
      data.push(point);
    }
    return data;
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 10) return prev;
      return [...prev, id];
    });
  };

  const compareData = buildCompareData();

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

  // Filtered companies for compare search
  const compareSearchResults = compareSearch.trim()
    ? companies.filter((c) =>
        !compareIds.includes(c.id) &&
        (c.name.toLowerCase().includes(compareSearch.toLowerCase()) ||
         c.ticker.toLowerCase().includes(compareSearch.toLowerCase()))
      ).slice(0, 8)
    : companies.filter((c) => !compareIds.includes(c.id)).slice(0, 8);

  if (!company) {
    return (
      <div className="stats-view">
        {/* Compare Chart Section */}
        <h3 className="section-title">Aktienvergleich</h3>
        <div className="compare-section">
          <div className="compare-selected-chips">
            {compareIds.map((id, idx) => {
              const c = getCompanyById(id);
              if (!c) return null;
              return (
                <span
                  key={id}
                  className="compare-chip"
                  style={{ borderColor: COMPARE_COLORS[idx % COMPARE_COLORS.length] }}
                  onClick={() => toggleCompare(id)}
                >
                  <span
                    className="compare-chip-dot"
                    style={{ background: COMPARE_COLORS[idx % COMPARE_COLORS.length] }}
                  />
                  {c.ticker} ✕
                </span>
              );
            })}
            <button
              className="compare-add-btn"
              onClick={() => setShowCompareSearch(!showCompareSearch)}
            >
              + Aktie
            </button>
          </div>

          {showCompareSearch && (
            <div className="compare-search-panel">
              <input
                className="compare-search-input"
                type="text"
                placeholder="Aktie suchen..."
                value={compareSearch}
                onChange={(e) => setCompareSearch(e.target.value)}
                autoFocus
              />
              <div className="compare-search-results">
                {compareSearchResults.map((c) => (
                  <div
                    key={c.id}
                    className="compare-search-item"
                    onClick={() => {
                      toggleCompare(c.id);
                      setCompareSearch('');
                      setShowCompareSearch(false);
                    }}
                  >
                    <StockLogo svg={c.logo} size={24} />
                    <span className="compare-search-name">{c.ticker}</span>
                    <span className="compare-search-full">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {compareIds.length >= 2 && compareData.length > 0 && (
            <>
              <div className="time-range-selector" style={{ marginTop: 12 }}>
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
                <h4>Performance-Vergleich (%)</h4>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={compareData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                    <YAxis
                      stroke="var(--text-muted)"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(value: any, name: any) => {
                        const c = getCompanyById(String(name));
                        return [`${Number(value).toFixed(2)}%`, c?.ticker || String(name)];
                      }}
                    />
                    <Legend
                      formatter={(value) => {
                        const c = getCompanyById(value);
                        return c?.ticker || value;
                      }}
                    />
                    {compareIds.map((id, idx) => (
                      <Line
                        key={id}
                        type="monotone"
                        dataKey={id}
                        stroke={COMPARE_COLORS[idx % COMPARE_COLORS.length]}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {compareIds.length < 2 && (
            <div className="compare-hint">
              Wähle mindestens 2 Aktien aus, um den Vergleichschart anzuzeigen.
            </div>
          )}
        </div>

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
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
            <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
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
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
            <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
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
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
            <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="volumen" fill={company.color} opacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Company News */}
      {(() => {
        const companyNews = news
          .filter((n) => n.affectedCompanies.includes(company.id))
          .reverse()
          .slice(0, 20);
        if (companyNews.length === 0) return null;

        const getCategoryColor = (cat: string) => {
          switch (cat) {
            case 'global': return '#4A90D9';
            case 'industry': return '#F5A623';
            case 'company': return '#7ED321';
            default: return '#999';
          }
        };
        const getCategoryLabel = (cat: string) => {
          switch (cat) {
            case 'global': return 'Weltweit';
            case 'industry': return 'Branche';
            case 'company': return 'Unternehmen';
            default: return cat;
          }
        };

        const handleIndustryClick = (e: React.MouseEvent, ind: Industry) => {
          e.stopPropagation();
          setMarketFilter(ind);
          setMarketSort('industry');
          setActiveTab('market');
        };

        const handleCompanyTagClick = (e: React.MouseEvent, compId: string) => {
          e.stopPropagation();
          if (compId !== company.id) {
            selectStock(compId);
          }
        };

        return (
          <>
            <h3 className="section-title">Nachrichten zu {company.ticker}</h3>
            <div className="detail-news-list">
              {companyNews.map((item) => (
                <div
                  key={item.id}
                  className={`news-card ${item.read ? 'read' : 'unread'}`}
                  onClick={() => markNewsRead(item.id)}
                >
                  <div className="news-header">
                    <div className="news-header-left">
                      {item.dayNumber != null && (
                        <span className="news-day">Tag {item.dayNumber}</span>
                      )}
                      <span
                        className="news-category"
                        style={{ background: getCategoryColor(item.category) }}
                      >
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                    <span
                      className={`news-impact ${item.impact > 0 ? 'positive' : item.impact < 0 ? 'negative' : ''}`}
                    >
                      {item.impact > 0 ? '▲' : item.impact < 0 ? '▼' : '—'}
                      {' '}
                      {Math.abs(item.impact) > 0.5 ? 'Stark' : Math.abs(item.impact) > 0.25 ? 'Mittel' : 'Leicht'}
                    </span>
                  </div>
                  <h4 className="news-headline">{item.headline}</h4>
                  <p className="news-content">{item.content}</p>
                  <div className="news-tags">
                    {item.affectedIndustries.map((ind) => (
                      <span
                        key={ind}
                        className="news-tag news-tag-clickable"
                        style={{ borderColor: INDUSTRY_COLORS[ind], color: INDUSTRY_COLORS[ind] }}
                        onClick={(e) => handleIndustryClick(e, ind)}
                      >
                        {INDUSTRY_NAMES[ind]}
                      </span>
                    ))}
                    {item.affectedCompanies.map((compId) => {
                      const c = getCompanyById(compId);
                      if (!c) return null;
                      return (
                        <span
                          key={compId}
                          className={`news-tag company-tag ${compId !== company.id ? 'news-tag-clickable' : ''}`}
                          onClick={(e) => handleCompanyTagClick(e, compId)}
                        >
                          {c.ticker}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      })()}

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
