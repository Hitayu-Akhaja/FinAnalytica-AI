import React, { useState, useEffect } from 'react';
import yfinanceService from '../services/yfinanceService';
import stockDataStorage from '../services/stockDataStorage';
import StockChart from './StockChart';
import CompanyDropdown from './CompanyDropdown';
import sessionStorageService from '../services/sessionStorage';


const StockComparison = () => {
  // Initialize state from session storage
  const sessionData = sessionStorageService.getStockComparison();
  
  const [stocks, setStocks] = useState(sessionData.stocks);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chartPeriod, setChartPeriod] = useState(sessionData.chartPeriod);
  const [chartInterval, setChartInterval] = useState(sessionData.chartInterval);
  const [isChangingPeriod, setIsChangingPeriod] = useState(false);
  const [resetDropdowns, setResetDropdowns] = useState(false);
  const [showRestoreNotification, setShowRestoreNotification] = useState(false);

  // Check if data was restored from session
  useEffect(() => {
    if (sessionStorageService.hasSession()) {
      const sessionData = sessionStorageService.getStockComparison();
      const hasData = sessionData.stocks.some(stock => stock.trim() !== '');
      
      if (hasData) {
        setShowRestoreNotification(true);
        setTimeout(() => setShowRestoreNotification(false), 5000);
      }
    }
  }, []);

  // Save state changes to session storage
  useEffect(() => {
    sessionStorageService.updateStockComparison({
      stocks,
      chartPeriod,
      chartInterval
    });
  }, [stocks, chartPeriod, chartInterval]);

  // Auto-fetch data when stocks are selected
  useEffect(() => {
    const validStocks = stocks.filter(stock => stock.trim() !== '');
    console.log('Stocks changed:', validStocks);
    if (validStocks.length > 0) {
      // Clear any existing data first
      setStockData([]);
      // Fetch data for selected stocks
      fetchStockData(chartPeriod, chartInterval);
    }
  }, [stocks]); // eslint-disable-line react-hooks/exhaustive-deps

  // Available periods for chart
  const periods = [
    { value: '1d', label: '1D', interval: '5m' },
    { value: '5d', label: '5D', interval: '15m' },
    { value: '1mo', label: '1M', interval: '1h' },
    { value: '3mo', label: '3M', interval: '1d' },
    { value: '6mo', label: '6M', interval: '1d' },
    { value: '1y', label: '1Y', interval: '1d' },
    { value: '2y', label: '2Y', interval: '1d' },
    { value: '5y', label: '5Y', interval: '1d' },
    { value: 'max', label: 'MAX', interval: '1d' }
  ];

  const handleStockInput = (index, value) => {
    const newStocks = [...stocks];
    newStocks[index] = value.toUpperCase();
    setStocks(newStocks);
  };

  const fetchStockData = async (period = chartPeriod, interval = chartInterval) => {
    setLoading(true);
    setError('');
    
    try {
      let validStocks = stocks.filter(stock => stock.trim() !== '');
      
      if (validStocks.length === 0) {
        setError('Please enter at least one stock symbol');
        setLoading(false);
        return;
      }

      // Check if we have cached data for all stocks and this period
      const cachedStocks = validStocks.filter(stock => stockDataStorage.isDataCached(stock, period));
      const uncachedStocks = validStocks.filter(stock => !stockDataStorage.isDataCached(stock, period));
      
      if (cachedStocks.length > 0 && uncachedStocks.length === 0) {
        // All stocks are cached, use cached data
        console.log('Using cached data for period:', period);
        const cachedData = stockDataStorage.getMultipleStocksData(validStocks, period);
        setStockData(cachedData);
        setLoading(false);
        return;
      } else if (cachedStocks.length > 0) {
        // Some stocks are cached, fetch only uncached ones
        console.log('Fetching data for uncached stocks:', uncachedStocks);
        validStocks = uncachedStocks; // Only fetch uncached stocks
      }

      // Add timeout protection for large datasets
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 second timeout
      });

      // Fetch data using yfinance service with period and interval
      const dataPromise = yfinanceService.getMultipleStocksData(validStocks, period, interval);
      const data = await Promise.race([dataPromise, timeoutPromise]);
      
      if (data && data.length > 0) {
        // Store data in cache for each stock
        data.forEach(stockData => {
          stockDataStorage.storeData(stockData.symbol, period, stockData);
        });
        
        // Combine cached and fresh data
        let allStockData = [];
        if (cachedStocks && cachedStocks.length > 0) {
          const cachedData = stockDataStorage.getMultipleStocksData(cachedStocks, period);
          allStockData = [...cachedData, ...data];
        } else {
          allStockData = data;
        }
        
        console.log('Setting stock data:', allStockData.map(s => s.symbol));
        setStockData(allStockData);
      } else {
        setError('No data found for the entered stock symbols');
      }
    } catch (err) {
      if (err.message === 'Request timeout') {
        setError('Request timed out. Please try a shorter time period or try again.');
      } else {
        setError('Failed to fetch stock data. Please try again.');
      }
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setStocks(['', '', '']);
    setStockData([]);
    setError('');
    setResetDropdowns(true);
    // Reset the reset flag after a short delay
    setTimeout(() => setResetDropdowns(false), 100);
    // Clear session storage for stock comparison
    sessionStorageService.clearSection('stockComparison');
  };

  const handlePeriodChange = (period) => {
    if (isChangingPeriod || loading) return; // Prevent rapid changes
    
    setIsChangingPeriod(true);
    setChartPeriod(period.value);
    setChartInterval(period.interval);
    
    // Get current valid stocks
    const validStocks = stocks.filter(stock => stock.trim() !== '');
    
    if (validStocks.length > 0) {
      // Re-fetch data with new period and interval
      fetchStockData(period.value, period.interval).finally(() => {
        setIsChangingPeriod(false);
      });
    } else {
      setIsChangingPeriod(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Stock Comparison Tool
          </h1>
          <p className="text-xl text-gray-300">
            Search and compare up to 3 companies with real-time data and interactive charts
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Your selections are automatically saved</span>
          </div>
        </div>

        {/* Restore Notification */}
        {showRestoreNotification && (
          <div className="mb-6 bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-blue-300 font-medium">Selections Restored</p>
                <p className="text-blue-200 text-sm">Your previous stock selections have been automatically restored</p>
              </div>
            </div>
          </div>
        )}

        {/* Stock Input Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20" style={{ position: 'relative', zIndex: 10 }}>
          <h2 className="text-2xl font-semibold text-white mb-6">
            Search & Select Companies
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {stocks.map((stock, index) => (
              <div key={index} className="relative" style={{ position: 'relative', zIndex: 999999 }}>
                <CompanyDropdown
                  onSelect={(symbol) => handleStockInput(index, symbol)}
                  placeholder={`Search for Stock ${index + 1}...`}
                  className="w-full"
                  reset={resetDropdowns}
                />
                {stock && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-gray-300">Selected: {stock}</span>
                    <button
                      onClick={() => handleStockInput(index, '')}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={clearAll}
              className="px-6 py-3 border border-white/20 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              Clear All
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Stock Comparison Results */}
        {stockData.length > 0 && (
          <div className="space-y-8" style={{ position: 'relative', zIndex: 1 }}>
            {/* Summary Cards - Aligned with dropdown columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stocks.map((stock, index) => {
                const stockInfo = stockData.find(s => s.symbol === stock);
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    {stockInfo ? (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white">{stockInfo.symbol}</h3>
                            <p className="text-gray-400 text-sm">{stockInfo.name}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white">${stockInfo.price}</div>
                            <div className={`text-sm ${stockInfo.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {stockInfo.change >= 0 ? '+' : ''}{stockInfo.change} ({stockInfo.changePercent}%)
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Volume:</span>
                            <span className="text-white">{stockInfo.volume}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Market Cap:</span>
                            <span className="text-white">{stockInfo.marketCap}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">P/E Ratio:</span>
                            <span className="text-white">{stockInfo.pe}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-400 py-8">
                        <p>No stock selected</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Chart Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20" style={{ minHeight: '500px' }}>
              <h3 className="text-2xl font-semibold text-white mb-6">
                Price Comparison Chart
              </h3>
              
              {chartPeriod === 'max' && (
                <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    📊 MAX period shows 5 years of data with enhanced Plotly charts for better performance and interactivity.
                  </p>
                </div>
              )}
              
              <StockChart 
                data={stockData.map(stock => ({
                  symbol: stock.symbol,
                  data: stock.chartData
                }))}
                symbols={stockData.map(stock => stock.symbol)}
                colors={['#3B82F6', '#10B981', '#F59E0B']}
                selectedPeriod={chartPeriod}
                onPeriodChange={handlePeriodChange}
                periods={periods}
                loading={loading}
              />
              
              {loading && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                    <span className="text-blue-300 text-sm">
                      {chartPeriod === 'max' ? 'Loading MAX data with Plotly charts...' : 'Loading data...'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Comparison Table */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Detailed Comparison
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-3 px-4 text-gray-400 font-medium">Metric</th>
                      {stockData.map((stock, index) => (
                        <th key={index} className="py-3 px-4 text-white font-semibold">
                          {stock.symbol}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4 text-gray-400">Current Price</td>
                      {stockData.map((stock, index) => (
                        <td key={index} className="py-3 px-4 text-white">
                          ${stock.price}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4 text-gray-400">Daily Change</td>
                      {stockData.map((stock, index) => (
                        <td key={index} className={`py-3 px-4 ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4 text-gray-400">Open</td>
                      {stockData.map((stock, index) => (
                        <td key={index} className="py-3 px-4 text-white">
                          ${stock.open || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4 text-gray-400">Day High</td>
                      {stockData.map((stock, index) => (
                        <td key={index} className="py-3 px-4 text-white">
                          ${stock.high || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4 text-gray-400">Day Low</td>
                      {stockData.map((stock, index) => (
                        <td key={index} className="py-3 px-4 text-white">
                          ${stock.low || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4 text-gray-400">52-Week High</td>
                      {stockData.map((stock, index) => (
                        <td key={index} className="py-3 px-4 text-white">
                          ${stock.fiftyTwoWeekHigh || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4 text-gray-400">52-Week Low</td>
                      {stockData.map((stock, index) => (
                        <td key={index} className="py-3 px-4 text-white">
                          ${stock.fiftyTwoWeekLow || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4 text-gray-400">Volume</td>
                      {stockData.map((stock, index) => (
                        <td key={index} className="py-3 px-4 text-white">
                          {stock.volume}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4 text-gray-400">Market Cap</td>
                      {stockData.map((stock, index) => (
                        <td key={index} className="py-3 px-4 text-white">
                          {stock.marketCap}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-400">P/E Ratio</td>
                      {stockData.map((stock, index) => (
                        <td key={index} className="py-3 px-4 text-white">
                          {stock.pe}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {stockData.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">📊</div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              Stock Comparison
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Search and select up to 3 companies from the dropdown menus above to compare their performance, 
              view interactive charts, and analyze key metrics side by side. You can search by company name, 
              stock symbol, or sector.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-2xl mb-2">🔍</div>
                <h4 className="text-white font-semibold mb-2">Search Companies</h4>
                <p className="text-sm text-gray-400">Type company names, symbols, or sectors to find stocks</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-2xl mb-2">📈</div>
                <h4 className="text-white font-semibold mb-2">Compare Performance</h4>
                <p className="text-sm text-gray-400">View side-by-side charts and key metrics</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="text-white font-semibold mb-2">Real-time Data</h4>
                <p className="text-sm text-gray-400">Get live stock data powered by yfinance API</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockComparison; 