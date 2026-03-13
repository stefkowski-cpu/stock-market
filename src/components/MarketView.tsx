import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { companies } from '../data/companies';
import { Industry, INDUSTRY_NAMES, INDUSTRY_COLORS } from '../types';
import StockLogo from './StockLogo';

const allIndustries: Industry[] = [
  'tech', 'energy', 'finance', 'health', 'retail',
  'automotive', 'food', 'entertainment', 'realestate', 'aerospace',
];

const MarketView: React.FC = () => {
  const { currentPrices, getStockChange, selectStock, setActiveTab } = useGameStore();
  const [filterIndustry, setFilterIndustry] = useState<Industry | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change' | 'industry'>('name');

  const filteredCompanies = companies
    .filter((c) => filterIndustry === 'all' || c.industry === filterIndustry)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return (currentPrices[b.id] || 0) - (currentPrices[a.id] || 0);
      if (sortBy === 'industry') {
        const cmp = INDUSTRY_NAMES[a.industry].localeCompare(INDUSTRY_NAMES[b.industry]);
        return cmp !== 0 ? cmp : a.name.localeCompare(b.name);
      }
      const changeA = getStockChange(a.id).percent;
      const changeB = getStockChange(b.id).percent;
      return changeB - changeA;
    });

  const formatCurrency = (val: number) =>
    val.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  const handleStockClick = (id: string) => {
    selectStock(id);
    setActiveTab('stats');
  };

  return (
    <div className="market-view">
      <div className="market-filters">
        <div className="industry-filter">
          <button
            className={`filter-chip ${filterIndustry === 'all' ? 'active' : ''}`}
            onClick={() => setFilterIndustry('all')}
          >
            Alle
          </button>
          {allIndustries.map((ind) => (
            <button
              key={ind}
              className={`filter-chip ${filterIndustry === ind ? 'active' : ''}`}
              onClick={() => setFilterIndustry(ind)}
              style={
                filterIndustry === ind
                  ? { background: INDUSTRY_COLORS[ind], color: '#fff' }
                  : {}
              }
            >
              {INDUSTRY_NAMES[ind]}
            </button>
          ))}
        </div>
        <div className="sort-controls">
          <button
            className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
            onClick={() => setSortBy('name')}
          >
            Name
          </button>
          <button
            className={`sort-btn ${sortBy === 'price' ? 'active' : ''}`}
            onClick={() => setSortBy('price')}
          >
            Preis
          </button>
          <button
            className={`sort-btn ${sortBy === 'change' ? 'active' : ''}`}
            onClick={() => setSortBy('change')}
          >
            Änderung
          </button>
          <button
            className={`sort-btn ${sortBy === 'industry' ? 'active' : ''}`}
            onClick={() => setSortBy('industry')}
          >
            Branche
          </button>
        </div>
      </div>

      <div className="stock-list">
        {filteredCompanies.map((company) => {
          const price = currentPrices[company.id] || 0;
          const change = getStockChange(company.id);
          const isPositive = change.percent >= 0;

          return (
            <div
              key={company.id}
              className="stock-card"
              onClick={() => handleStockClick(company.id)}
            >
              <div className="stock-card-left">
                <StockLogo svg={company.logo} size={44} />
                <div className="stock-info">
                  <div className="stock-name">{company.name}</div>
                  <div className="stock-ticker">
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
              <div className="stock-card-right">
                <div className="stock-price">{formatCurrency(price)}</div>
                <div className={`stock-change ${isPositive ? 'positive' : 'negative'}`}>
                  {isPositive ? '+' : ''}
                  {change.percent.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketView;
