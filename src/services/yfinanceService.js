// YFinance API Service
// Note: This is a placeholder structure. In a real implementation, you would need to:
// 1. Set up a backend server to proxy yfinance requests (to avoid CORS issues)
// 2. Use yfinance Python library on the backend
// 3. Create API endpoints for stock data

class YFinanceService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    this.advancedUrl = `${this.baseUrl}/advanced`;
  }

  // Fetch basic stock information
  async getStockInfo(symbol) {
    try {
      const response = await fetch(`${this.baseUrl}/stock/info/${symbol}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching stock info:', error);
      throw error;
    }
  }

  // Fetch historical data for charts
  async getHistoricalData(symbol, period = '1y', interval = '1d') {
    try {
      const response = await fetch(
        `${this.baseUrl}/stock/history/${symbol}?period=${period}&interval=${interval}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }

  // Fetch multiple stocks data for comparison
  async getMultipleStocksData(symbols, period = '1y', interval = '1d') {
    try {
      const response = await fetch(`${this.baseUrl}/stocks/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbols, period, interval }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching multiple stocks data:', error);
      throw error;
    }
  }

  // Get real-time quote
  async getQuote(symbol) {
    try {
      const response = await fetch(`${this.baseUrl}/stock/quote/${symbol}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching quote:', error);
      throw error;
    }
  }

  // Search for stocks
  async searchStocks(query) {
    try {
      const response = await fetch(`${this.baseUrl}/stocks/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching stocks:', error);
      throw error;
    }
  }

  // Get stock financials
  async getFinancials(symbol) {
    try {
      const response = await fetch(`${this.baseUrl}/stock/financials/${symbol}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching financials:', error);
      throw error;
    }
  }

  // Advanced Analysis Methods
  async getTechnicalAnalysis(symbol) {
    try {
      const response = await fetch(`${this.advancedUrl}/technical-analysis/${symbol}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching technical analysis:', error);
      throw error;
    }
  }

  async getAdvancedComparison(symbols) {
    try {
      const response = await fetch(`${this.advancedUrl}/advanced-comparison`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbols }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching advanced comparison:', error);
      throw error;
    }
  }

  async getPortfolioAnalysis(portfolio) {
    try {
      const response = await fetch(`${this.advancedUrl}/portfolio-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ portfolio }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching portfolio analysis:', error);
      throw error;
    }
  }


}

// Mock data for development (when backend is not available)
const mockStockData = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 150.25,
    change: 2.15,
    changePercent: 1.45,
    volume: '45.2M',
    marketCap: '2.4T',
    pe: 25.6,
    high: 152.80,
    low: 148.90,
    open: 149.50,
    previousClose: 148.10,
    chartData: generateMockChartData(150.25, '1y')
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 188.92,
    change: -15.20,
    changePercent: -0.55,
    volume: '12.8M',
    marketCap: '1.8T',
    pe: 28.3,
    high: 2765.40,
    low: 2740.20,
    open: 2755.50,
    previousClose: 2766.00,
    chartData: generateMockChartData(188.92, '1y')
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 380.45,
    change: 8.75,
    changePercent: 2.35,
    volume: '28.9M',
    marketCap: '2.8T',
    pe: 32.1,
    high: 382.10,
    low: 375.80,
    open: 375.20,
    previousClose: 371.70,
    chartData: generateMockChartData(380.45, '1y')
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 245.30,
    change: -5.20,
    changePercent: -2.08,
    volume: '89.5M',
    marketCap: '780B',
    pe: 65.2,
    high: 252.40,
    low: 243.10,
    open: 248.60,
    previousClose: 250.50,
    chartData: generateMockChartData(245.30, '1y')
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 214.73,
    change: 3.45,
    changePercent: 2.42,
    volume: '52.3M',
    marketCap: '1.5T',
    pe: 45.8,
    high: 147.20,
    low: 142.90,
    open: 143.50,
    previousClose: 142.35,
    chartData: generateMockChartData(214.73, '1y')
  },
  META: {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 485.58,
    change: 12.45,
    changePercent: 2.63,
    volume: '18.7M',
    marketCap: '1.2T',
    pe: 24.8,
    high: 487.20,
    low: 478.90,
    open: 480.50,
    previousClose: 473.13,
    chartData: generateMockChartData(485.58, '1y')
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.28,
    change: -15.72,
    changePercent: -1.76,
    volume: '42.1M',
    marketCap: '2.1T',
    pe: 68.9,
    high: 890.40,
    low: 870.20,
    open: 885.50,
    previousClose: 891.00,
    chartData: generateMockChartData(875.28, '1y')
  }
};

// Generate mock chart data for different periods
function generateMockChartData(currentPrice, period = '1y') {
  const data = [];
  let basePrice = currentPrice * 0.95; // Start 5% below current price
  
  // Determine number of data points based on period
  let dataPoints;
  let interval;
  
  switch (period) {
    case '1d':
      dataPoints = 78; // 6.5 hours * 12 (5-minute intervals)
      interval = 5 * 60 * 1000; // 5 minutes
      break;
    case '5d':
      dataPoints = 65; // 5 days * 13 (1-hour intervals)
      interval = 60 * 60 * 1000; // 1 hour
      break;
    case '1mo':
      dataPoints = 30; // 30 days
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    case '3mo':
      dataPoints = 90; // 90 days
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    case '6mo':
      dataPoints = 180; // 180 days
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    case '1y':
      dataPoints = 365; // 365 days
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    case '2y':
      dataPoints = 730; // 2 years
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    case '5y':
      dataPoints = 1825; // 5 years
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    case 'max':
      dataPoints = 1825; // 5 years (Plotly can handle this much better)
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    default:
      dataPoints = 365;
      interval = 24 * 60 * 60 * 1000;
  }
  
  const startDate = new Date();
  startDate.setTime(startDate.getTime() - (dataPoints * interval));
  
  for (let i = 0; i < dataPoints; i++) {
    const date = new Date(startDate.getTime() + (i * interval));
    
    // Add realistic price movement with trend and volatility
    const trend = 0.0001; // Slight upward trend
    const volatility = 0.02; // 2% daily volatility
    const randomWalk = (Math.random() - 0.5) * volatility;
    
    basePrice = basePrice * (1 + trend + randomWalk);
    
    // Ensure price doesn't go negative
    basePrice = Math.max(basePrice, currentPrice * 0.1);
    
    // Format date based on period
    let dateString;
    if (period === '1d' || period === '5d') {
      // For intraday periods, include time
      dateString = date.toISOString().replace('T', ' ').substring(0, 16);
    } else {
      // For longer periods, just date
      dateString = date.toISOString().split('T')[0];
    }
    
    data.push({
      date: dateString,
      price: parseFloat(basePrice.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 500000
    });
  }
  
  return data;
}

// Enhanced service with mock data fallback
class EnhancedYFinanceService extends YFinanceService {
  async getStockInfo(symbol) {
    try {
      return await super.getStockInfo(symbol);
    } catch (error) {
      // Fallback to mock data
      console.warn('Using mock data for', symbol);
      return mockStockData[symbol.toUpperCase()] || null;
    }
  }

  async getMultipleStocksData(symbols, period = '1y', interval = '1d') {
    try {
      console.log('Attempting to fetch real data for:', symbols);
      return await super.getMultipleStocksData(symbols, period, interval);
    } catch (error) {
      // Fallback to mock data
      console.warn('Using mock data for multiple stocks:', symbols);
      const result = symbols.map(symbol => {
        const stockData = mockStockData[symbol.toUpperCase()];
        if (stockData) {
          // Generate period-specific data
          return {
            ...stockData,
            chartData: generateMockChartData(stockData.price, period)
          };
        }
        console.warn('No mock data available for:', symbol);
        return null;
      }).filter(Boolean);
      console.log('Mock data result:', result.map(s => s.symbol));
      return result;
    }
  }

  async getHistoricalData(symbol, period = '1y', interval = '1d') {
    try {
      return await super.getHistoricalData(symbol, period, interval);
    } catch (error) {
      // Fallback to mock data
      console.warn('Using mock historical data for', symbol);
      const stockData = mockStockData[symbol.toUpperCase()];
      return stockData ? { data: generateMockChartData(stockData.price, period) } : null;
    }
  }

  // Generate data for a specific symbol and period
  generatePeriodData(symbol, period) {
    const stockData = mockStockData[symbol.toUpperCase()];
    if (!stockData) return null;
    
    return {
      ...stockData,
      chartData: generateMockChartData(stockData.price, period)
    };
  }
}

export default new EnhancedYFinanceService(); 