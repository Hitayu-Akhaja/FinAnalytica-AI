import React from 'react';

const LogoBanner = () => {
  const popularStocks = [
    { 
      symbol: 'AAPL', 
      name: 'Apple Inc.',
      color: 'from-gray-600 to-gray-800'
    },
    { 
      symbol: 'MSFT', 
      name: 'Microsoft',
      color: 'from-blue-600 to-blue-800'
    },
    { 
      symbol: 'GOOGL', 
      name: 'Alphabet',
      color: 'from-red-500 to-red-700'
    },
    { 
      symbol: 'AMZN', 
      name: 'Amazon',
      color: 'from-orange-500 to-orange-700'
    },
    { 
      symbol: 'TSLA', 
      name: 'Tesla',
      color: 'from-red-600 to-red-800'
    },
    { 
      symbol: 'NVDA', 
      name: 'NVIDIA',
      color: 'from-green-600 to-green-800'
    },
    { 
      symbol: 'META', 
      name: 'Meta',
      color: 'from-blue-500 to-blue-700'
    },
    { 
      symbol: 'NFLX', 
      name: 'Netflix',
      color: 'from-red-500 to-red-700'
    },
    { 
      symbol: 'JPM', 
      name: 'JPMorgan',
      color: 'from-blue-700 to-blue-900'
    },
    { 
      symbol: 'JNJ', 
      name: 'Johnson & Johnson',
      color: 'from-red-600 to-red-800'
    },
    { 
      symbol: 'V', 
      name: 'Visa',
      color: 'from-blue-600 to-blue-800'
    },
    { 
      symbol: 'PG', 
      name: 'Procter & Gamble',
      color: 'from-blue-500 to-blue-700'
    }
  ];

  // Duplicate the array for seamless scrolling
  const duplicatedStocks = [...popularStocks, ...popularStocks];

  return (
    <section className="py-12 bg-gradient-to-r from-dark-800 to-dark-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            Popular Stocks You Can Analyze
          </h3>
          <p className="text-gray-400">
            Compare these top stocks and thousands more with real-time data
          </p>
        </div>
        
        <div className="relative w-full">
          {/* Marquee scrolling banner */}
          <div className="whitespace-nowrap animate-marquee flex items-center space-x-8 px-6">
            {duplicatedStocks.map((stock, index) => (
              <div 
                key={index}
                className="flex flex-col items-center bg-dark-700/50 rounded-lg p-4 border border-gray-600 hover:border-primary-500 transition-all duration-300 min-w-[140px] group"
              >
                <div className="w-12 h-12 mb-3 flex items-center justify-center">
                  <div className={`w-10 h-10 bg-gradient-to-r ${stock.color} rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300`}>
                    {stock.symbol.charAt(0)}
                  </div>
                </div>
                <div className="text-lg font-bold text-white mb-1 group-hover:text-primary-400 transition-colors duration-300">
                  {stock.symbol}
                </div>
                <div className="text-xs text-gray-400 text-center">
                  {stock.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoBanner; 