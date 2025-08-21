import React, { useState, useEffect } from 'react';

const MarketTicker = () => {
  const [tickerData, setTickerData] = useState([
    { symbol: 'AAPL', price: 175.43, change: 2.34, changePercent: 1.35 },
    { symbol: 'MSFT', price: 378.85, change: -1.23, changePercent: -0.32 },
    { symbol: 'GOOGL', price: 142.56, change: 0.87, changePercent: 0.61 },
    { symbol: 'AMZN', price: 145.24, change: 3.12, changePercent: 2.20 },
    { symbol: 'TSLA', price: 248.50, change: -5.67, changePercent: -2.23 },
    { symbol: 'NVDA', price: 485.09, change: 12.45, changePercent: 2.64 },
    { symbol: 'META', price: 334.92, change: 4.23, changePercent: 1.28 },
    { symbol: 'NFLX', price: 485.09, change: -2.34, changePercent: -0.48 },
    { symbol: 'JPM', price: 172.34, change: 1.45, changePercent: 0.85 },
    { symbol: 'JNJ', price: 168.45, change: -0.67, changePercent: -0.40 },
    { symbol: 'PG', price: 156.78, change: 0.89, changePercent: 0.57 },
    { symbol: 'V', price: 267.89, change: 2.34, changePercent: 0.88 },
    { symbol: 'WMT', price: 67.45, change: -0.23, changePercent: -0.34 },
    { symbol: 'HD', price: 378.92, change: 3.45, changePercent: 0.92 },
    { symbol: 'DIS', price: 89.67, change: -1.23, changePercent: -1.35 }
  ]);

  const [isScrolling, setIsScrolling] = useState(true);

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setTickerData(prevData => 
        prevData.map(stock => ({
          ...stock,
          price: stock.price + (Math.random() - 0.5) * 2,
          change: stock.change + (Math.random() - 0.5) * 0.5,
          changePercent: ((stock.change + (Math.random() - 0.5) * 0.5) / stock.price) * 100
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatChange = (change) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(change);
  };

  const formatChangePercent = (changePercent) => {
    return `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
  };

  return (
    <div className="bg-dark-800 border-b border-white/10 overflow-hidden">
      <div className="relative">
        {/* Scrolling ticker */}
        <div 
          className={`flex whitespace-nowrap ${isScrolling ? 'animate-scroll' : ''}`}
          style={{
            animation: isScrolling ? 'scroll 60s linear infinite' : 'none'
          }}
          onMouseEnter={() => setIsScrolling(false)}
          onMouseLeave={() => setIsScrolling(true)}
        >
          {/* Duplicate the ticker items for seamless scrolling */}
          {[...tickerData, ...tickerData].map((stock, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 px-6 py-3 border-r border-white/10"
            >
              <div className="text-white font-semibold text-sm">{stock.symbol}</div>
              <div className="text-white text-sm">{formatPrice(stock.price)}</div>
              <div className={`text-sm font-medium ${
                stock.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatChange(stock.change)}
              </div>
              <div className={`text-sm font-medium ${
                stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatChangePercent(stock.changePercent)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default MarketTicker; 