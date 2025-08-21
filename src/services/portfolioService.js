import aiRecommendationService from './aiRecommendationService';

const API_BASE_URL = 'http://localhost:5000/api';

export const portfolioService = {
  // Analyze portfolio and generate insights
  async analyzePortfolio(portfolioData) {
    try {
      console.log('Sending portfolio data to backend:', portfolioData);
      
      const response = await fetch(`${API_BASE_URL}/portfolio/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolioData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Portfolio analysis result:', result);
      return result;
    } catch (error) {
      console.error('Error analyzing portfolio:', error);
      
      // If backend is not available, return mock data for development
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        console.warn('Backend not available, using mock data');
        return await this.generateMockAnalysis(portfolioData);
      }
      
      throw error;
    }
  },

  // Generate mock analysis for development/testing
  async generateMockAnalysis(portfolioData) {
    const holdings = portfolioData.holdings || [];
    const totalValue = holdings.reduce((sum, holding) => {
      const currentPrice = this.getMockPrice(holding.symbol);
      return sum + (holding.quantity * currentPrice);
    }, 0);

    const totalCost = holdings.reduce((sum, holding) => {
      return sum + (holding.quantity * holding.purchasePrice);
    }, 0);

    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

    // Generate mock holdings data
    const mockHoldings = holdings.map(holding => {
      const currentPrice = this.getMockPrice(holding.symbol);
      const value = holding.quantity * currentPrice;
      const costBasis = holding.quantity * holding.purchasePrice;
      const gainLoss = value - costBasis;
      const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

      return {
        symbol: holding.symbol,
        name: this.getMockCompanyName(holding.symbol),
        quantity: holding.quantity,
        currentPrice: currentPrice,
        purchasePrice: holding.purchasePrice,
        value: value,
        costBasis: costBasis,
        gainLoss: gainLoss,
        gainLossPercent: gainLossPercent,
        sector: this.getMockSector(holding.symbol)
      };
    });

    // Generate mock sector allocation
    const sectorAllocation = this.generateMockSectorAllocation(mockHoldings);

    // Generate dynamic risk metrics based on portfolio composition
    const riskMetrics = this.calculateMockRiskMetrics(mockHoldings);

    // Generate AI-powered recommendations
    const recommendations = await this.generateAIRecommendations(portfolioData, mockHoldings, riskMetrics);

    return {
      portfolio: {
        totalValue: totalValue,
        totalCost: totalCost,
        totalGainLoss: totalGainLoss,
        totalGainLossPercent: totalGainLossPercent,
        holdings: mockHoldings,
        sectorAllocation: sectorAllocation,
        riskMetrics: riskMetrics
      },
      recommendations: recommendations,
      userPreferences: portfolioData,
      aiAnalysis: {
        summary: `Portfolio valued at $${totalValue.toLocaleString()} with ${holdings.length} holdings`,
        riskLevel: riskMetrics.volatility < 0.15 ? 'Low' : riskMetrics.volatility < 0.25 ? 'Moderate' : 'High',
        diversification: sectorAllocation.length > 3 ? 'Good' : 'Needs Improvement'
      },
      timestamp: new Date().toISOString()
    };
  },

  // Mock price generator
  getMockPrice(symbol) {
    const basePrices = {
      'AAPL': 150, 'MSFT': 300, 'GOOGL': 2800, 'AMZN': 3300, 'META': 350,
      'TSLA': 800, 'NVDA': 500, 'NFLX': 600, 'CRM': 250, 'ADBE': 500,
      'JPM': 150, 'BAC': 40, 'WFC': 50, 'GS': 350, 'MS': 100,
      'JNJ': 170, 'PFE': 40, 'UNH': 450, 'MRNA': 300, 'BNTX': 200,
      'KO': 55, 'PG': 140, 'WMT': 140, 'MCD': 250, 'SBUX': 100, 'NKE': 150
    };
    
    const basePrice = basePrices[symbol] || 100;
    const variation = 0.9 + Math.random() * 0.2; // ±10% variation
    return Math.round(basePrice * variation * 100) / 100;
  },

  // Mock company name generator
  getMockCompanyName(symbol) {
    const names = {
      'AAPL': 'Apple Inc.', 'MSFT': 'Microsoft Corporation', 'GOOGL': 'Alphabet Inc.',
      'AMZN': 'Amazon.com Inc.', 'META': 'Meta Platforms Inc.', 'TSLA': 'Tesla Inc.',
      'NVDA': 'NVIDIA Corporation', 'NFLX': 'Netflix Inc.', 'CRM': 'Salesforce Inc.',
      'ADBE': 'Adobe Inc.', 'JPM': 'JPMorgan Chase & Co.', 'BAC': 'Bank of America Corp.',
      'WFC': 'Wells Fargo & Company', 'GS': 'Goldman Sachs Group Inc.', 'MS': 'Morgan Stanley',
      'JNJ': 'Johnson & Johnson', 'PFE': 'Pfizer Inc.', 'UNH': 'UnitedHealth Group Inc.',
      'MRNA': 'Moderna Inc.', 'BNTX': 'BioNTech SE', 'KO': 'Coca-Cola Company',
      'PG': 'Procter & Gamble Co.', 'WMT': 'Walmart Inc.', 'MCD': "McDonald's Corporation",
      'SBUX': 'Starbucks Corporation', 'NKE': 'Nike Inc.'
    };
    
    return names[symbol] || `${symbol} Corporation`;
  },

  // Mock sector generator
  getMockSector(symbol) {
    const sectors = {
      'AAPL': 'Technology', 'MSFT': 'Technology', 'GOOGL': 'Technology',
      'AMZN': 'Technology', 'META': 'Technology', 'TSLA': 'Technology',
      'NVDA': 'Technology', 'NFLX': 'Technology', 'CRM': 'Technology',
      'ADBE': 'Technology', 'JPM': 'Financial', 'BAC': 'Financial',
      'WFC': 'Financial', 'GS': 'Financial', 'MS': 'Financial',
      'JNJ': 'Healthcare', 'PFE': 'Healthcare', 'UNH': 'Healthcare',
      'MRNA': 'Healthcare', 'BNTX': 'Healthcare', 'KO': 'Consumer',
      'PG': 'Consumer', 'WMT': 'Consumer', 'MCD': 'Consumer',
      'SBUX': 'Consumer', 'NKE': 'Consumer'
    };
    
    return sectors[symbol] || 'Technology';
  },

  // Generate mock sector allocation
  generateMockSectorAllocation(holdings) {
    const sectorMap = {};
    
    holdings.forEach(holding => {
      if (!sectorMap[holding.sector]) {
        sectorMap[holding.sector] = 0;
      }
      sectorMap[holding.sector] += holding.value;
    });

    const totalValue = Object.values(sectorMap).reduce((sum, value) => sum + value, 0);
    
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'];
    
    return Object.entries(sectorMap).map(([sector, value], index) => ({
      name: sector,
      value: value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
      color: colors[index % colors.length]
    }));
  },

  // Calculate dynamic risk metrics based on portfolio composition
  calculateMockRiskMetrics(holdings) {
    if (!holdings || holdings.length === 0) {
      return {
        volatility: 0.0,
        sharpeRatio: 0.0,
        beta: 0.0,
        maxDrawdown: 0.0,
        var95: 0.0
      };
    }

    // Calculate total portfolio value
    const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);
    if (totalValue === 0) {
      return {
        volatility: 0.0,
        sharpeRatio: 0.0,
        beta: 0.0,
        maxDrawdown: 0.0,
        var95: 0.0
      };
    }

    // Define sector risk characteristics
    const sectorRiskProfiles = {
      'Technology': { volatility: 0.25, beta: 1.2 },
      'Financial': { volatility: 0.20, beta: 1.1 },
      'Healthcare': { volatility: 0.22, beta: 0.9 },
      'Consumer': { volatility: 0.18, beta: 0.8 },
      'Energy': { volatility: 0.30, beta: 1.3 },
      'Industrials': { volatility: 0.21, beta: 1.0 },
      'Communication Services': { volatility: 0.24, beta: 1.1 },
      'Basic Materials': { volatility: 0.26, beta: 1.2 },
      'Real Estate': { volatility: 0.19, beta: 0.9 },
      'Utilities': { volatility: 0.15, beta: 0.6 },
      'Unknown': { volatility: 0.20, beta: 1.0 }
    };

    // Calculate sector weights and individual stock weights
    const sectorWeights = {};
    const stockWeights = {};

    holdings.forEach(stock => {
      const sector = stock.sector || 'Unknown';
      const weight = stock.value / totalValue;

      // Track individual stock weight
      stockWeights[stock.symbol] = weight;

      // Track sector weight
      if (!sectorWeights[sector]) {
        sectorWeights[sector] = 0;
      }
      sectorWeights[sector] += weight;
    });

    // Calculate weighted portfolio metrics
    let weightedVolatility = 0;
    let weightedBeta = 0;
    const sectorCount = Object.keys(sectorWeights).length;

    holdings.forEach(stock => {
      const sector = stock.sector || 'Unknown';
      const weight = stockWeights[stock.symbol];
      const sectorProfile = sectorRiskProfiles[sector] || sectorRiskProfiles['Unknown'];

      // Add weighted contribution
      weightedVolatility += weight * sectorProfile.volatility;
      weightedBeta += weight * sectorProfile.beta;
    });

    // Apply diversification effects
    const diversificationFactor = Math.max(0.7, 1 - (sectorCount - 1) * 0.05); // More sectors = lower risk
    weightedVolatility *= diversificationFactor;

    // Calculate additional risk metrics
    // Sharpe ratio (assuming 8% market return and 2% risk-free rate)
    const marketReturn = 0.08;
    const riskFreeRate = 0.02;
    const expectedReturn = weightedBeta * (marketReturn - riskFreeRate) + riskFreeRate;
    const sharpeRatio = weightedVolatility > 0 ? (expectedReturn - riskFreeRate) / weightedVolatility : 0;

    // Maximum drawdown (based on volatility and sector mix)
    const maxDrawdown = -weightedVolatility * 0.4; // Rough estimate

    // Value at Risk (95% confidence, daily)
    const var95 = -(weightedVolatility / Math.sqrt(252)) * 1.645; // Daily VaR

    // Apply defensive stock bonus
    const defensiveSectors = ['Consumer', 'Utilities', 'Healthcare'];
    const defensiveWeight = defensiveSectors.reduce((sum, sector) => sum + (sectorWeights[sector] || 0), 0);
    if (defensiveWeight > 0.3) { // If more than 30% in defensive sectors
      const volatilityReduction = defensiveWeight * 0.1;
      weightedVolatility *= (1 - volatilityReduction);
    }

    return {
      volatility: Math.round(weightedVolatility * 1000) / 1000,
      sharpeRatio: Math.round(sharpeRatio * 1000) / 1000,
      beta: Math.round(weightedBeta * 1000) / 1000,
      maxDrawdown: Math.round(maxDrawdown * 1000) / 1000,
      var95: Math.round(var95 * 1000) / 1000
    };
  },

  // Generate AI-powered recommendations using agentic framework
  async generateAIRecommendations(portfolioData, holdings, riskMetrics) {
    try {
      // Prepare data for AI analysis
      const analysisData = {
        holdings: holdings,
        riskMetrics: riskMetrics,
        userPreferences: {
          riskTolerance: portfolioData.riskTolerance,
          investmentGoals: portfolioData.investmentGoals,
          timeHorizon: portfolioData.timeHorizon,
          monthlyInvestment: portfolioData.monthlyInvestment,
          availableCapital: portfolioData.availableCapital
        },
        portfolioMetrics: {
          totalValue: holdings.reduce((sum, h) => sum + h.value, 0),
          totalGainLoss: holdings.reduce((sum, h) => sum + h.gainLoss, 0),
          sectorDiversification: [...new Set(holdings.map(h => h.sector))].length
        }
      };

      // Get AI recommendations
      const aiResult = await aiRecommendationService.generateRecommendations(analysisData);
      
      // Transform AI recommendations to match expected format
      const recommendations = aiResult.recommendations.map(rec => ({
        type: rec.type,
        symbol: rec.symbol,
        message: rec.reasoning,
        priority: rec.priority,
        confidence: rec.confidence,
        agentCount: rec.agentCount,
        buyVotes: rec.buyVotes,
        sellVotes: rec.sellVotes,
        holdVotes: rec.holdVotes
      }));

      return recommendations;
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      
      // Fallback to basic recommendations if AI fails
      return this.generateBasicRecommendations(portfolioData, holdings, riskMetrics);
    }
  },

  // Generate basic recommendations as fallback
  generateBasicRecommendations(portfolioData, holdings, riskMetrics) {
    const recommendations = [];
    
    // Analyze sector concentration
    const sectors = [...new Set(holdings.map(h => h.sector))];
    if (sectors.length < 3) {
      recommendations.push({
        type: 'rebalance',
        message: 'Consider diversifying across more sectors to reduce concentration risk',
        priority: 'high'
      });
    }

    // Analyze risk tolerance
    const riskTolerance = portfolioData.riskTolerance;
    if (riskTolerance === 'conservative' && riskMetrics.volatility > 0.15) {
      recommendations.push({
        type: 'buy',
        message: 'Add defensive stocks like JNJ or PG to reduce portfolio volatility',
        priority: 'medium'
      });
    }

    // Analyze individual holdings
    holdings.forEach(holding => {
      if (holding.gainLossPercent > 20) {
        recommendations.push({
          type: 'hold',
          message: `${holding.symbol} is performing well (+${holding.gainLossPercent.toFixed(1)}%), maintain position`,
          priority: 'low'
        });
      } else if (holding.gainLossPercent < -10) {
        recommendations.push({
          type: 'review',
          message: `Review ${holding.symbol} position (${holding.gainLossPercent.toFixed(1)}% loss)`,
          priority: 'medium'
        });
      }
    });

    return recommendations;
  },

  // Save portfolio data
  async savePortfolio(portfolioData) {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolioData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving portfolio:', error);
      throw error;
    }
  },

  // Load saved portfolio
  async loadPortfolio(portfolioId) {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/load/${portfolioId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error loading portfolio:', error);
      throw error;
    }
  },

  // Get stock information for validation
  async getStockInfo(symbol) {
    try {
      const response = await fetch(`${API_BASE_URL}/stock/info/${symbol}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting stock info:', error);
      throw error;
    }
  },

  // Validate portfolio data
  validatePortfolioData(portfolioData) {
    const errors = [];

    // Check if holdings exist
    if (!portfolioData.holdings || portfolioData.holdings.length === 0) {
      errors.push('At least one holding is required');
    }

    // Validate each holding
    portfolioData.holdings.forEach((holding, index) => {
      if (!holding.symbol || holding.symbol.trim() === '') {
        errors.push(`Holding ${index + 1}: Stock symbol is required`);
      }
      if (!holding.quantity || holding.quantity <= 0) {
        errors.push(`Holding ${index + 1}: Quantity must be greater than 0`);
      }
      if (!holding.purchasePrice || holding.purchasePrice <= 0) {
        errors.push(`Holding ${index + 1}: Purchase price must be greater than 0`);
      }
    });

    // Validate user preferences
    if (!portfolioData.riskTolerance) {
      errors.push('Risk tolerance is required');
    }
    if (!portfolioData.investmentGoals) {
      errors.push('Investment goals are required');
    }
    if (!portfolioData.timeHorizon) {
      errors.push('Time horizon is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Format portfolio data for display
  formatPortfolioData(portfolioData) {
    return {
      ...portfolioData,
      holdings: portfolioData.holdings.map(holding => ({
        ...holding,
        symbol: holding.symbol.toUpperCase(),
        quantity: parseInt(holding.quantity),
        purchasePrice: parseFloat(holding.purchasePrice)
      }))
    };
  }
}; 