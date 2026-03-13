import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Industry, INDUSTRY_NAMES, INDUSTRY_COLORS } from '../types';
import { getCompanyById } from '../data/companies';

const NewsView: React.FC = () => {
  const {
    news,
    markNewsRead,
    selectStock,
    setActiveTab,
    setMarketFilter,
    setMarketSort,
  } = useGameStore();
  const sortedNews = [...news].reverse();

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'global': return 'Weltweit';
      case 'industry': return 'Branche';
      case 'company': return 'Unternehmen';
      case 'market': return 'Markt';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'global': return '#4A90D9';
      case 'industry': return '#F5A623';
      case 'company': return '#7ED321';
      case 'market': return '#D0021B';
      default: return '#999';
    }
  };

  const handleCompanyClick = (e: React.MouseEvent, companyId: string) => {
    e.stopPropagation();
    selectStock(companyId);
    setActiveTab('stats');
  };

  const handleIndustryClick = (e: React.MouseEvent, industry: Industry) => {
    e.stopPropagation();
    setMarketFilter(industry);
    setMarketSort('industry');
    setActiveTab('market');
  };

  if (sortedNews.length === 0) {
    return (
      <div className="news-view">
        <div className="empty-state">
          <p>Noch keine Nachrichten.</p>
          <p>Drücke "Nächster Tag" um das Spiel voranzutreiben!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="news-view">
      <h3 className="section-title">Nachrichten-Ticker</h3>
      <div className="news-list">
        {sortedNews.map((item) => (
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
                {Math.abs(item.impact) > 0.5
                  ? 'Stark'
                  : Math.abs(item.impact) > 0.25
                  ? 'Mittel'
                  : 'Leicht'}
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
                const company = getCompanyById(compId);
                if (!company) return null;
                return (
                  <span
                    key={compId}
                    className="news-tag company-tag news-tag-clickable"
                    onClick={(e) => handleCompanyClick(e, compId)}
                  >
                    {company.ticker}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsView;
