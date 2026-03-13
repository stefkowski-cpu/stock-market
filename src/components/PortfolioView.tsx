import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useGameStore } from '../store/gameStore';
import { getCompanyById } from '../data/companies';
import { INDUSTRY_COLORS } from '../types';
import StockLogo from './StockLogo';

const PortfolioView: React.FC = () => {
  const {
    portfolio,
    cash,
    currentPrices,
    priceHistory,
    transactions,
    totalProfitLoss,
    getPortfolioValue,
    getPositionPnL,
    selectStock,
    setActiveTab,
  } = useGameStore();

  const portfolioValue = getPortfolioValue();
  const totalValue = cash + portfolioValue;

  const formatCurrency = (val: number) =>
    val.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  const handleStockClick = (id: string) => {
    selectStock(id);
    setActiveTab('stats');
  };

  const recentTransactions = [...transactions].reverse().slice(0, 10);

  // Pie chart data for portfolio allocation
  const pieData = portfolio.map((item) => {
    const company = getCompanyById(item.companyId);
    const price = currentPrices[item.companyId] || 0;
    const value = price * item.shares;
    return {
      name: company?.ticker || item.companyId,
      fullName: company?.name || item.companyId,
      value: Math.round(value * 100) / 100,
      color: company?.color || '#666',
      industry: company?.industry,
    };
  }).sort((a, b) => b.value - a.value);

  // Add cash as a slice
  const pieDataWithCash = [
    ...pieData,
    { name: 'Bargeld', fullName: 'Bargeld', value: Math.round(cash * 100) / 100, color: '#555570', industry: undefined },
  ];

  // Build a combined portfolio value history from price history
  const buildPortfolioHistory = () => {
    if (portfolio.length === 0) return [];

    // Find the shortest common history length
    const lengths = portfolio.map((p) => (priceHistory[p.companyId] || []).length);
    const minLen = Math.min(...lengths, 60);
    if (minLen < 2) return [];

    const data = [];
    for (let i = Math.max(0, lengths[0] - minLen); i < lengths[0]; i++) {
      let totalVal = cash;
      for (const item of portfolio) {
        const hist = priceHistory[item.companyId];
        if (hist && hist[i]) {
          totalVal += hist[i].close * item.shares;
        }
      }
      data.push({
        day: i + 1,
        wert: Math.round(totalVal * 100) / 100,
      });
    }
    return data;
  };

  const portfolioHistory = buildPortfolioHistory();

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      const pct = ((d.value / totalValue) * 100).toFixed(1);
      return (
        <div className="chart-tooltip">
          <div style={{ fontWeight: 700 }}>{d.fullName}</div>
          <div>{formatCurrency(d.value)}</div>
          <div>{pct}%</div>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }: any) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
        {name}
      </text>
    );
  };

  return (
    <div className="portfolio-view">
      <div className="portfolio-summary">
        <div className="summary-card">
          <span className="summary-label">Gesamtwert</span>
          <span className="summary-value">{formatCurrency(totalValue)}</span>
        </div>
        <div className="summary-row">
          <div className="summary-card small">
            <span className="summary-label">Bargeld</span>
            <span className="summary-value">{formatCurrency(cash)}</span>
          </div>
          <div className="summary-card small">
            <span className="summary-label">Investiert</span>
            <span className="summary-value">{formatCurrency(portfolioValue)}</span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-label">Realisierter Gewinn/Verlust</span>
          <span className={`summary-value ${totalProfitLoss >= 0 ? 'positive' : 'negative'}`}>
            {totalProfitLoss >= 0 ? '+' : ''}
            {formatCurrency(totalProfitLoss)}
          </span>
        </div>
      </div>

      {portfolio.length > 0 && (
        <>
          <h3 className="section-title">Depot-Verteilung</h3>
          <div className="chart-container portfolio-chart">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieDataWithCash}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={45}
                  paddingAngle={2}
                  label={renderCustomLabel}
                  labelLine={false}
                >
                  {pieDataWithCash.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {pieDataWithCash.map((entry, i) => (
                <div key={i} className="pie-legend-item">
                  <span className="pie-legend-dot" style={{ background: entry.color }} />
                  <span className="pie-legend-name">{entry.name}</span>
                  <span className="pie-legend-pct">
                    {((entry.value / totalValue) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {portfolioHistory.length > 2 && (
            <div className="chart-container">
              <h4>Depotwert-Verlauf</h4>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={portfolioHistory}>
                  <defs>
                    <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                  <XAxis dataKey="day" stroke="#666" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#666" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value)), 'Depotwert']}
                    contentStyle={{
                      background: '#12122a',
                      border: '1px solid #2a2a45',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="wert"
                    stroke="#6366f1"
                    fill="url(#colorPortfolio)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      <h3 className="section-title">Meine Positionen</h3>
      {portfolio.length === 0 ? (
        <div className="empty-state">
          <p>Du hast noch keine Aktien.</p>
          <p>Gehe zum Markt und kaufe deine ersten Aktien!</p>
        </div>
      ) : (
        <div className="positions-list">
          {portfolio.map((item) => {
            const company = getCompanyById(item.companyId);
            if (!company) return null;
            const price = currentPrices[item.companyId] || 0;
            const pnl = getPositionPnL(item);
            const marketValue = price * item.shares;

            return (
              <div
                key={item.companyId}
                className="position-card"
                onClick={() => handleStockClick(item.companyId)}
              >
                <div className="position-left">
                  <StockLogo svg={company.logo} size={40} />
                  <div className="position-info">
                    <div className="position-name">{company.name}</div>
                    <div className="position-shares">
                      {item.shares} Aktien @ {formatCurrency(item.avgBuyPrice)}
                    </div>
                  </div>
                </div>
                <div className="position-right">
                  <div className="position-value">{formatCurrency(marketValue)}</div>
                  <div className={`position-pnl ${pnl.absolute >= 0 ? 'positive' : 'negative'}`}>
                    {pnl.absolute >= 0 ? '+' : ''}
                    {formatCurrency(pnl.absolute)} ({pnl.percent.toFixed(1)}%)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <h3 className="section-title">Letzte Transaktionen</h3>
      {recentTransactions.length === 0 ? (
        <div className="empty-state">Noch keine Transaktionen.</div>
      ) : (
        <div className="transactions-list">
          {recentTransactions.map((tx) => {
            const company = getCompanyById(tx.companyId);
            if (!company) return null;
            return (
              <div key={tx.id} className="transaction-item">
                <div className={`tx-type ${tx.type}`}>
                  {tx.type === 'buy' ? 'KAUF' : 'VERKAUF'}
                </div>
                <div className="tx-details">
                  <span className="tx-company">{company.ticker}</span>
                  <span className="tx-shares">{tx.shares} x {formatCurrency(tx.price)}</span>
                </div>
                <div className="tx-total">{formatCurrency(tx.total)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PortfolioView;
