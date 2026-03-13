import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getCompanyById } from '../data/companies';
import StockLogo from './StockLogo';

const TradeModal: React.FC = () => {
  const {
    showTradeModal,
    tradeType,
    selectedStock,
    currentPrices,
    cash,
    portfolio,
    closeTradeModal,
    executeTrade,
  } = useGameStore();

  const [sharesInput, setSharesInput] = useState('1');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const shares = parseInt(sharesInput) || 0;

  if (!showTradeModal || !selectedStock) return null;

  const company = getCompanyById(selectedStock);
  if (!company) return null;

  const price = currentPrices[selectedStock] || 0;
  const total = price * shares;
  const position = portfolio.find((p) => p.companyId === selectedStock);
  const maxBuyShares = Math.floor(cash / price);
  const maxSellShares = position?.shares || 0;

  const formatCurrency = (val: number) =>
    val.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  const handleTrade = () => {
    setError('');
    setSuccess(false);

    if (shares <= 0) {
      setError('Ungültige Anzahl');
      return;
    }

    if (tradeType === 'buy' && total > cash) {
      setError('Nicht genug Bargeld');
      return;
    }

    if (tradeType === 'sell' && shares > maxSellShares) {
      setError('Nicht genug Aktien');
      return;
    }

    const result = executeTrade(selectedStock, shares, tradeType);
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        closeTradeModal();
        setSharesInput('1');
        setSuccess(false);
      }, 800);
    } else {
      setError('Handel fehlgeschlagen');
    }
  };

  const maxShares = tradeType === 'buy' ? maxBuyShares : maxSellShares;

  const setShares = (n: number) => {
    const clamped = Math.max(0, Math.min(n, maxShares));
    setSharesInput(String(clamped));
  };

  const handleMax = () => {
    setShares(maxShares);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow empty field so user can clear and retype
    if (raw === '') {
      setSharesInput('');
      return;
    }
    // Only digits
    const cleaned = raw.replace(/\D/g, '');
    if (cleaned === '') {
      setSharesInput('');
      return;
    }
    const num = Math.min(parseInt(cleaned), maxShares);
    setSharesInput(String(num));
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleInputBlur = () => {
    // If empty or 0 on blur, reset to 1
    if (!sharesInput || parseInt(sharesInput) <= 0) {
      setSharesInput('1');
    }
  };

  const sliderValue = maxShares > 0 ? (shares / maxShares) * 100 : 0;

  return (
    <div className="modal-overlay" onClick={closeTradeModal}>
      <div className="trade-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{tradeType === 'buy' ? 'Kaufen' : 'Verkaufen'}</h3>
          <button className="modal-close" onClick={closeTradeModal}>
            ✕
          </button>
        </div>

        <div className="modal-stock-info">
          <StockLogo svg={company.logo} size={48} />
          <div>
            <div className="modal-stock-name">{company.name}</div>
            <div className="modal-stock-price">Aktueller Kurs: {formatCurrency(price)}</div>
          </div>
        </div>

        {tradeType === 'buy' ? (
          <div className="modal-available">
            Verfügbar: {formatCurrency(cash)} (max. {maxBuyShares} Aktien)
          </div>
        ) : (
          <div className="modal-available">
            Im Depot: {maxSellShares} Aktien
          </div>
        )}

        <div className="shares-input-group">
          <label>Anzahl Aktien</label>
          <div className="shares-controls">
            <button onClick={() => setShares(shares - 1)}>−</button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={sharesInput}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            <button onClick={() => setShares(shares + 1)}>+</button>
            <button className="max-btn" onClick={handleMax}>
              MAX
            </button>
          </div>
          {maxShares > 1 && (
            <div className="shares-slider-row">
              <input
                type="range"
                min={0}
                max={maxShares}
                step={1}
                value={shares}
                onChange={(e) => setShares(Number(e.target.value))}
                className="shares-slider"
              />
              <div className="shares-slider-labels">
                <span>0</span>
                <span>{maxShares}</span>
              </div>
            </div>
          )}
        </div>

        <div className="trade-summary">
          <div className="trade-summary-row">
            <span>Preis pro Aktie</span>
            <span>{formatCurrency(price)}</span>
          </div>
          <div className="trade-summary-row">
            <span>Anzahl</span>
            <span>{shares}</span>
          </div>
          <div className="trade-summary-row total">
            <span>Gesamt</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {error && <div className="trade-error">{error}</div>}
        {success && (
          <div className="trade-success">
            {tradeType === 'buy' ? 'Gekauft' : 'Verkauft'}! ✓
          </div>
        )}

        <button
          className={`execute-trade-btn ${tradeType}`}
          onClick={handleTrade}
          disabled={success}
        >
          {tradeType === 'buy'
            ? `${shares} Aktien kaufen`
            : `${shares} Aktien verkaufen`}
        </button>
      </div>
    </div>
  );
};

export default TradeModal;
