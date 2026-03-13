import React from 'react';

interface Props {
  svg: string;
  size?: number;
  className?: string;
}

const StockLogo: React.FC<Props> = ({ svg, size = 40, className = '' }) => {
  return (
    <div
      className={`stock-logo ${className}`}
      style={{ width: size, height: size, minWidth: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default StockLogo;
