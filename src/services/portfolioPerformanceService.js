/**
 * Portfolio Performance Service for comparing portfolio performance with S&P 500
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

class PortfolioPerformanceService {
  /**
   * Get portfolio performance data with S&P 500 comparison
   * @param {Array} holdings - Portfolio holdings with symbols, quantities, and purchase prices
   * @param {string} timeframe - Time period (1M, 3M, 6M, 1Y)
   * @returns {Promise} - Portfolio performance data with S&P 500 comparison
   */
  async getPortfolioPerformance(holdings, timeframe = '1M') {
    try {
      if (!holdings || holdings.length === 0) {
        return this.getEmptyPerformanceData();
      }

      const response = await fetch(`${API_BASE_URL}/portfolio/performance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          holdings,
          timeframe 
        })
      });

      if (!response.ok) {
        throw new Error(`Portfolio performance API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching portfolio performance:', error);
      return this.getFallbackPerformanceData(holdings, timeframe);
    }
  }

  /**
   * Get empty performance data when no holdings
   * @returns {Object} - Empty performance data structure
   */
  getEmptyPerformanceData() {
    return {
      portfolioValue: 0,
      portfolioReturn: 0,
      portfolioReturnPercent: 0,
      sp500Value: 0,
      sp500Return: 0,
      sp500ReturnPercent: 0,
      outperformance: 0,
      historicalData: [],
      holdings: [],
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get fallback performance data when API fails
   * @param {Array} holdings - Portfolio holdings
   * @param {string} timeframe - Time period
   * @returns {Object} - Fallback performance data
   */
  getFallbackPerformanceData(holdings, timeframe) {
    // Calculate basic portfolio metrics
    let totalValue = 0;
    let totalCost = 0;
    
    holdings.forEach(holding => {
      const currentValue = (holding.quantity || 0) * (holding.currentPrice || holding.purchasePrice || 0);
      const costBasis = (holding.quantity || 0) * (holding.purchasePrice || 0);
      totalValue += currentValue;
      totalCost += costBasis;
    });

    const portfolioReturn = totalValue - totalCost;
    const portfolioReturnPercent = totalCost > 0 ? (portfolioReturn / totalCost) * 100 : 0;

    // Generate mock S&P 500 data
    const sp500ReturnPercent = this.getMockSP500Return(timeframe);
    const sp500Value = 4500; // Mock S&P 500 value
    const sp500Return = sp500Value * (sp500ReturnPercent / 100);

    // Generate historical data
    const historicalData = this.generateMockHistoricalData(totalValue, timeframe);

    return {
      portfolioValue: totalValue,
      portfolioReturn: portfolioReturn,
      portfolioReturnPercent: portfolioReturnPercent,
      sp500Value: sp500Value,
      sp500Return: sp500Return,
      sp500ReturnPercent: sp500ReturnPercent,
      outperformance: portfolioReturnPercent - sp500ReturnPercent,
      historicalData: historicalData,
      holdings: holdings.map(holding => ({
        ...holding,
        currentValue: (holding.quantity || 0) * (holding.currentPrice || holding.purchasePrice || 0),
        costBasis: (holding.quantity || 0) * (holding.purchasePrice || 0),
        gainLoss: ((holding.quantity || 0) * (holding.currentPrice || holding.purchasePrice || 0)) - 
                  ((holding.quantity || 0) * (holding.purchasePrice || 0)),
        gainLossPercent: holding.purchasePrice > 0 ? 
          (((holding.currentPrice || holding.purchasePrice) - holding.purchasePrice) / holding.purchasePrice) * 100 : 0
      })),
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get mock S&P 500 return based on timeframe
   * @param {string} timeframe - Time period
   * @returns {number} - Mock return percentage
   */
  getMockSP500Return(timeframe) {
    const returns = {
      '1M': 2.5,
      '3M': 8.2,
      '6M': 15.7,
      '1Y': 22.3
    };
    return returns[timeframe] || 2.5;
  }

  /**
   * Generate mock historical data for charts
   * @param {number} baseValue - Base portfolio value
   * @param {string} timeframe - Time period
   * @returns {Array} - Historical data points
   */
  generateMockHistoricalData(baseValue, timeframe) {
    const periods = {
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365
    };
    
    const days = periods[timeframe] || 30;
    const data = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic price movement
      const randomChange = (Math.random() - 0.5) * 0.02; // 2% daily volatility
      const portfolioValue = baseValue * (1 + randomChange);
      const sp500Value = 4500 * (1 + randomChange * 0.8); // Slightly less volatile
      
      data.push({
        date: date.toISOString().split('T')[0],
        portfolio: Math.round(portfolioValue),
        sp500: Math.round(sp500Value)
      });
    }
    
    return data;
  }

  /**
   * Format currency values
   * @param {number} value - Value to format
   * @returns {string} - Formatted currency string
   */
  formatCurrency(value) {
    if (!value && value !== 0) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  /**
   * Format percentage values
   * @param {number} value - Value to format
   * @returns {string} - Formatted percentage string
   */
  formatPercentage(value) {
    if (!value && value !== 0) return '0.00%';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  }
}

// Export singleton instance
const portfolioPerformanceService = new PortfolioPerformanceService();
export default portfolioPerformanceService;

