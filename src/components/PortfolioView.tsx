import React from 'react';
import { useGameStore } from '../store/gameStore';
import { companies, getCompanyById } from '../data/companies';
import StockLogo from './StockLogo';

const PortfolioView: React.FC = () => {
  const {
    portfolio,
    cash,
    currentPrices,
    transactions,
    totalProfitLoss,
    getPortfolioValue,
    getPositionPnL,
    selectStock,
    setActiveTab,
    openTradeModal,
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
