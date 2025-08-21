import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import NestedPieChart from './NestedPieChart';
import AIAnalysisResults from './AIAnalysisResults';
import portfolioPerformanceService from '../services/portfolioPerformanceService';

const Dashboard = ({ onPageChange }) => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('1M');
  const [selectedMetric, setSelectedMetric] = useState('value');

  useEffect(() => {
    loadPortfolioData();
  }, []);

  useEffect(() => {
    if (portfolioData?.holdings && portfolioData.holdings.length > 0) {
      loadPerformanceData();
    }
  }, [timeframe, portfolioData?.holdings]);

  const loadPerformanceData = async () => {
    try {
      const performance = await portfolioPerformanceService.getPortfolioPerformance(
        portfolioData.holdings, 
        timeframe
      );
      setPerformanceData(performance);
    } catch (error) {
      console.error('Error loading performance data:', error);
    }
  };

  const loadPortfolioData = async () => {
    try {
      // Load portfolio data from localStorage
      const storedPortfolioData = localStorage.getItem('portfolioData');
      const storedAnalysis = localStorage.getItem('portfolioAnalysis');
      
      if (storedPortfolioData && storedAnalysis) {
        const portfolio = JSON.parse(storedPortfolioData);
        const analysis = JSON.parse(storedAnalysis);
        
        // Combine portfolio data with analysis results
        const combinedData = {
          ...analysis.portfolio,
          recommendations: analysis.recommendations || [],
          aiAnalysis: analysis.aiAnalysis || {},
          userPreferences: analysis.userPreferences || {}
        };
        
        setPortfolioData(combinedData);

        // Load performance data
        if (portfolio.holdings && portfolio.holdings.length > 0) {
          const performance = await portfolioPerformanceService.getPortfolioPerformance(
            portfolio.holdings, 
            timeframe
          );
          setPerformanceData(performance);
        }
      } else {
        setError('No portfolio data found. Please create a portfolio first.');
      }
    } catch (err) {
      console.error('Error parsing stored portfolio data:', err);
      setError('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  // Generate historical data for charts
  const generateHistoricalData = () => {
    if (performanceData?.historicalData) {
      return performanceData.historicalData.map(item => ({
        date: item.date,
        value: item.portfolio,
        benchmark: item.sp500
      }));
    }
    
    if (!portfolioData) return [];
    
    const baseValue = portfolioData.totalValue || 100000;
    const data = [];
    const periods = {
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365
    };
    
    const days = periods[timeframe] || 30;
    const volatility = portfolioData.riskMetrics?.volatility || 0.18;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic price movement
      const randomChange = (Math.random() - 0.5) * volatility * 0.1;
      const value = baseValue * (1 + randomChange);
      const benchmark = baseValue * (1 + randomChange * 0.8); // Slightly less volatile
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value),
        benchmark: Math.round(benchmark)
      });
    }
    
    return data;
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (!value && value !== 0) return '0.0%';
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getRiskLevel = (volatility) => {
    if (volatility < 0.15) return { level: 'Low', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (volatility < 0.25) return { level: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { level: 'High', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const getDiversificationScore = (holdings) => {
    if (!holdings || holdings.length === 0) return { score: 'Poor', color: 'text-red-400', bg: 'bg-red-500/20' };
    
    const sectors = new Set(holdings.map(h => h.sector).filter(Boolean));
    const sectorCount = sectors.size;
    
    if (sectorCount >= 5) return { score: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (sectorCount >= 3) return { score: 'Good', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { score: 'Poor', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  // Transform holdings data to match NestedPieChart expected format
  const transformHoldingsData = (holdings) => {
    if (!holdings || holdings.length === 0) return [];
    
    console.log('Original holdings data:', holdings);
    
    const transformed = holdings.map(holding => ({
      symbol: holding.symbol || '',
      name: holding.name || holding.symbol || '',
      value: holding.value || holding.currentValue || 0,
      sector: holding.sector || 'Unknown'
    }));
    
    console.log('Transformed holdings data:', transformed);
    return transformed;
  };

  // Sample holdings for demonstration when no data is available
  const getSampleHoldings = () => {
    return [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        value: 25000,
        sector: 'Technology',
        quantity: 100,
        purchasePrice: 150.00,
        currentPrice: 175.00,
        gainLoss: 2500,
        gainLossPercent: 16.67
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        value: 30000,
        sector: 'Technology',
        quantity: 80,
        purchasePrice: 280.00,
        currentPrice: 375.00,
        gainLoss: 7600,
        gainLossPercent: 33.93
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        value: 20000,
        sector: 'Technology',
        quantity: 120,
        purchasePrice: 120.00,
        currentPrice: 166.67,
        gainLoss: 5600,
        gainLossPercent: 38.89
      },
      {
        symbol: 'JNJ',
        name: 'Johnson & Johnson',
        value: 15000,
        sector: 'Healthcare',
        quantity: 150,
        purchasePrice: 85.00,
        currentPrice: 100.00,
        gainLoss: 2250,
        gainLossPercent: 17.65
      },
      {
        symbol: 'JPM',
        name: 'JPMorgan Chase & Co.',
        value: 18000,
        sector: 'Financial Services',
        quantity: 200,
        purchasePrice: 75.00,
        currentPrice: 90.00,
        gainLoss: 3000,
        gainLossPercent: 20.00
      }
    ];
  };

  // Calculate portfolio growth projections
  const calculatePortfolioProjections = () => {
    const currentValue = portfolioData.totalValue || 23900.6;
    // Try multiple possible locations for monthlyInvestment
    const monthlyInvestment = portfolioData.userPreferences?.monthlyInvestment || 
                             portfolioData.monthlyInvestment || 
                             portfolioData.availableCapital || 
                             0;
    
    const scenarios = [
      { name: 'Conservative', annualReturn: 0.05 },
      { name: 'Moderate', annualReturn: 0.08 },
      { name: 'Aggressive', annualReturn: 0.12 }
    ];

    return scenarios.map(scenario => {
      const years = [1, 3, 5];
      const projections = years.map(year => {
        // Calculate compound growth with monthly contributions
        const monthlyRate = scenario.annualReturn / 12;
        const totalMonths = year * 12;
        
        // Future value of current portfolio
        const futureValueOfCurrent = currentValue * Math.pow(1 + scenario.annualReturn, year);
        
        // Future value of monthly investments
        const futureValueOfContributions = monthlyInvestment > 0 
          ? monthlyInvestment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
          : 0;
        
        const totalValue = futureValueOfCurrent + futureValueOfContributions;
        const growthPercent = ((totalValue - currentValue) / currentValue) * 100;
        
        return {
          year,
          value: totalValue,
          growthPercent
        };
      });

      return {
        ...scenario,
        projections
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No Portfolio Data</h2>
          <p className="text-gray-300 mb-6">{error || 'Please create a portfolio first to view the dashboard.'}</p>
          <button
                          onClick={() => onPageChange('portfolio-input')}
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Analyze Portfolio
          </button>
        </div>
      </div>
    );
  }

  const historicalData = generateHistoricalData();
  const riskLevel = getRiskLevel(portfolioData.riskMetrics?.volatility);
  const diversificationScore = getDiversificationScore(portfolioData.holdings);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio Dashboard</h1>
          <p className="text-gray-300">Real-time portfolio analytics and AI-powered insights</p>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-effect rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Portfolio vs S&P 500</p>
                <p className="text-2xl font-bold text-white">
                  {performanceData ? formatCurrency(performanceData.portfolioValue) : formatCurrency(portfolioData.totalValue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Portfolio:</span>
                <span className={`text-sm font-medium ${performanceData?.portfolioReturnPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {performanceData ? formatPercentage(performanceData.portfolioReturnPercent) : formatPercentage(portfolioData.totalGainLossPercent)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">S&P 500:</span>
                <span className={`text-sm font-medium ${performanceData?.sp500ReturnPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {performanceData ? formatPercentage(performanceData.sp500ReturnPercent) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Outperformance</p>
                <p className={`text-2xl font-bold ${performanceData?.outperformance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {performanceData ? formatPercentage(performanceData.outperformance) : 'N/A'}
                </p>
              </div>
              <div className={`w-12 h-12 ${performanceData?.outperformance >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-lg flex items-center justify-center`}>
                <svg className={`w-6 h-6 ${performanceData?.outperformance >= 0 ? 'text-green-400' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${performanceData?.outperformance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {performanceData?.outperformance >= 0 ? 'Beating' : 'Underperforming'}
              </span>
              <span className="text-gray-400 text-sm ml-2">vs S&P 500</span>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Risk Level</p>
                <p className={`text-2xl font-bold ${riskLevel.color}`}>{riskLevel.level}</p>
              </div>
              <div className={`w-12 h-12 ${riskLevel.bg} rounded-lg flex items-center justify-center`}>
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${riskLevel.color}`}>{(portfolioData.riskMetrics?.volatility * 100).toFixed(1)}%</span>
              <span className="text-gray-400 text-sm ml-2">Volatility</span>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Diversification</p>
                <p className={`text-2xl font-bold ${diversificationScore.color}`}>{diversificationScore.score}</p>
              </div>
              <div className={`w-12 h-12 ${diversificationScore.bg} rounded-lg flex items-center justify-center`}>
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-purple-400 text-sm font-medium">{portfolioData.holdings?.length || 0} holdings</span>
              <span className="text-gray-400 text-sm ml-2">Across sectors</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Portfolio Performance Chart */}
          <div className="glass-effect rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Portfolio vs S&P 500 Performance</h3>
              <div className="flex space-x-2">
                {['1M', '3M', '6M', '1Y'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      timeframe === period
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value, name) => [formatCurrency(value), name]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                  name="Portfolio"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke="#6B7280" 
                  strokeWidth={2} 
                  name="S&P 500"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sector Allocation Chart */}
          <div className="glass-effect rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-6">Sector & Stock Allocation</h3>
            {(!portfolioData.holdings || portfolioData.holdings.length === 0) && (
              <div className="text-sm text-yellow-300 mb-4">
                📊 Showing sample data - create a portfolio to see your actual allocation
              </div>
            )}
            <NestedPieChart holdings={transformHoldingsData(portfolioData.holdings || getSampleHoldings())} />
          </div>
        </div>



        {/* Holdings Table and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Holdings Table */}
          <div className="lg:col-span-2 glass-effect rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-6">Current Holdings</h3>
            {portfolioData.holdings && portfolioData.holdings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-2 text-gray-300 font-medium">Stock</th>
                      <th className="text-right py-3 px-2 text-gray-300 font-medium">Quantity</th>
                      <th className="text-right py-3 px-2 text-gray-300 font-medium">Purchase Price</th>
                      <th className="text-right py-3 px-2 text-gray-300 font-medium">Current Price</th>
                      <th className="text-right py-3 px-2 text-gray-300 font-medium">Value</th>
                      <th className="text-right py-3 px-2 text-gray-300 font-medium">Change</th>
                      <th className="text-right py-3 px-2 text-gray-300 font-medium">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(performanceData?.holdings || portfolioData.holdings).map((holding, index) => {
                      const performanceHolding = performanceData?.holdings?.find(h => h.symbol === holding.symbol);
                      const displayHolding = performanceHolding || holding;
                      
                      return (
                        <tr key={index} className="border-b border-gray-800/50 hover:bg-dark-700/30">
                          <td className="py-3 px-2">
                            <div>
                              <div className="font-medium text-white">{displayHolding.symbol}</div>
                              <div className="text-sm text-gray-400">{displayHolding.name}</div>
                            </div>
                          </td>
                          <td className="text-right py-3 px-2 text-white">{displayHolding.quantity}</td>
                          <td className="text-right py-3 px-2 text-white">{formatCurrency(displayHolding.purchasePrice)}</td>
                          <td className="text-right py-3 px-2 text-white">{formatPrice(displayHolding.currentPrice)}</td>
                          <td className="text-right py-3 px-2 text-white">{formatCurrency(displayHolding.currentValue || displayHolding.value)}</td>
                          <td className={`text-right py-3 px-2 font-medium ${(displayHolding.gainLoss || displayHolding.gainLoss) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(displayHolding.gainLoss || displayHolding.gainLoss)}
                          </td>
                          <td className={`text-right py-3 px-2 font-medium ${(displayHolding.gainLossPercent || displayHolding.gainLossPercent) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatPercentage(displayHolding.gainLossPercent || displayHolding.gainLossPercent)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No holdings data available</p>
              </div>
            )}
          </div>

          {/* AI Recommendations */}
          <div className="glass-effect rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-6">AI Recommendations</h3>
            {portfolioData.recommendations && portfolioData.recommendations.length > 0 ? (
              <div className="space-y-4">
                {portfolioData.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 rounded-lg border border-white/10">
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        rec.priority === 'high' ? 'bg-red-400' : 
                        rec.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            rec.type === 'buy' ? 'bg-green-500/20 text-green-400' :
                            rec.type === 'sell' ? 'bg-red-500/20 text-red-400' :
                            rec.type === 'hold' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {rec.type.toUpperCase()}
                          </span>
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {rec.priority}
                          </span>
                          {rec.confidence && (
                            <span className="text-xs text-gray-400">
                              {Math.round(rec.confidence * 100)}% confidence
                            </span>
                          )}
                          {rec.agentCount && (
                            <span className="text-xs text-blue-400">
                              {rec.agentCount} agents
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-300">{rec.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No recommendations available</p>
              </div>
            )}
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="mt-8 glass-effect rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6">Risk Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Beta</p>
              <p className="text-2xl font-bold text-white">{portfolioData.riskMetrics?.beta?.toFixed(2) || 'N/A'}</p>
              <p className="text-xs text-gray-500">Market correlation</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">VaR (95%)</p>
              <p className="text-2xl font-bold text-red-400">
                {portfolioData.riskMetrics?.var95 ? `${(portfolioData.riskMetrics.var95 * 100).toFixed(2)}%` : 'N/A'}
              </p>
              <p className="text-xs text-gray-500">Daily risk</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Max Drawdown</p>
              <p className="text-2xl font-bold text-red-400">
                {portfolioData.riskMetrics?.maxDrawdown ? `${(portfolioData.riskMetrics.maxDrawdown * 100).toFixed(1)}%` : 'N/A'}
              </p>
              <p className="text-xs text-gray-500">Historical peak</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Sharpe Ratio</p>
              <p className="text-2xl font-bold text-green-400">{portfolioData.riskMetrics?.sharpeRatio?.toFixed(2) || 'N/A'}</p>
              <p className="text-xs text-gray-500">Risk-adjusted return</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Volatility</p>
              <p className="text-2xl font-bold text-yellow-400">
                {portfolioData.riskMetrics?.volatility ? `${(portfolioData.riskMetrics.volatility * 100).toFixed(1)}%` : 'N/A'}
              </p>
              <p className="text-xs text-gray-500">Annualized</p>
            </div>
          </div>
        </div>

        {/* Portfolio Growth Projections */}
        <div className="mt-8 glass-effect rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6">Portfolio Growth Projections</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {calculatePortfolioProjections().map((scenario, index) => (
              <div key={scenario.name} className="bg-dark-700/50 rounded-lg p-4 border border-white/10">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-bold text-white mb-2">{scenario.name} Scenario</h4>
                  <p className="text-sm text-gray-400">{scenario.annualReturn * 100}% annual return</p>
                </div>
                <div className="space-y-3">
                  {scenario.projections.map(projection => (
                    <div key={projection.year} className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Year {projection.year}:</span>
                      <div className="text-right">
                        <div className="font-medium text-white text-sm">
                          {formatCurrency(projection.value)}
                        </div>
                        <div className="text-green-400 text-xs">
                          {formatPercentage(projection.growthPercent)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Current Value:</p>
                <p className="text-white font-semibold">{formatCurrency(portfolioData.totalValue || 23900.6)}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Monthly Investment:</p>
                <p className="text-white font-semibold">{formatCurrency(portfolioData.userPreferences?.monthlyInvestment || portfolioData.monthlyInvestment || portfolioData.availableCapital || 0)}</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-3 italic">
              Projections based on historical performance and market conditions.
            </p>
          </div>
        </div>

        {/* AI Analysis Results */}
        <div className="mt-8">
          <AIAnalysisResults 
            portfolioData={portfolioData}
            onAnalysisComplete={(results) => {
              console.log('AI Analysis completed:', results);
              // You can store the results or trigger other actions here
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 