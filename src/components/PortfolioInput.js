import React, { useState, useEffect } from 'react';
import CompanyDropdown from './CompanyDropdown';
import { portfolioService } from '../services/portfolioService';
import sessionStorageService from '../services/sessionStorage';

const PortfolioInput = ({ onPageChange }) => {
  // Initialize state from session storage
  const sessionData = sessionStorageService.getPortfolioInput();
  
  const [holdings, setHoldings] = useState(sessionData.holdings || [{ symbol: '', quantity: 0, purchasePrice: 0.00 }]);
  const [riskTolerance, setRiskTolerance] = useState(sessionData.riskTolerance || '');
  const [investmentGoals, setInvestmentGoals] = useState(sessionData.investmentGoals || '');
  const [timeHorizon, setTimeHorizon] = useState(sessionData.timeHorizon || '');
  const [monthlyInvestment, setMonthlyInvestment] = useState(sessionData.monthlyInvestment || 0);
  const [availableCapital, setAvailableCapital] = useState(sessionData.availableCapital || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRestoreNotification, setShowRestoreNotification] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Check if data was restored from session
  useEffect(() => {
    if (sessionStorageService.hasSession()) {
      const sessionData = sessionStorageService.getPortfolioInput();
      const hasData = sessionData.holdings?.some(h => h.symbol) || 
                     sessionData.riskTolerance || 
                     sessionData.investmentGoals || 
                     sessionData.timeHorizon ||
                     sessionData.monthlyInvestment > 0 ||
                     sessionData.availableCapital > 0;
      
      if (hasData) {
        setShowRestoreNotification(true);
        setTimeout(() => setShowRestoreNotification(false), 5000);
      }
    }
  }, []);

  // Save state changes to session storage
  useEffect(() => {
    sessionStorageService.updatePortfolioInput({
      holdings,
      riskTolerance,
      investmentGoals,
      timeHorizon,
      monthlyInvestment,
      availableCapital
    });
  }, [holdings, riskTolerance, investmentGoals, timeHorizon, monthlyInvestment, availableCapital]);

  const addHolding = () => {
    const newHolding = { symbol: '', quantity: 0, purchasePrice: 0.00 };
    const updatedHoldings = [...holdings, newHolding];
    setHoldings(updatedHoldings);
  };

  const updateHolding = (index, field, value) => {
    const newHoldings = [...holdings];
    
    // Prevent negative values for quantity and purchase price
    if (field === 'quantity') {
      newHoldings[index][field] = Math.max(0, parseInt(value) || 0);
    } else if (field === 'purchasePrice') {
      newHoldings[index][field] = Math.max(0, parseFloat(value) || 0.00);
    } else {
      newHoldings[index][field] = value;
    }
    
    setHoldings(newHoldings);
    
    // Clear validation errors for this field
    if (validationErrors[`${index}_${field}`]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${index}_${field}`];
        return newErrors;
      });
    }
  };

  const handleStockSelect = (index, symbol) => {
    const newHoldings = [...holdings];
    newHoldings[index].symbol = symbol;
    setHoldings(newHoldings);
    
    // Clear validation error for symbol
    if (validationErrors[`${index}_symbol`]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${index}_symbol`];
        return newErrors;
      });
    }
  };

  const removeHolding = (index) => {
    if (holdings.length > 1) {
      setHoldings(holdings.filter((_, i) => i !== index));
      
      // Clear validation errors for this holding
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        Object.keys(newErrors).forEach(key => {
          if (key.startsWith(`${index}_`)) {
            delete newErrors[key];
          }
        });
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate holdings
    holdings.forEach((holding, index) => {
      if (!holding.symbol || holding.symbol.trim() === '') {
        errors[`${index}_symbol`] = 'Stock symbol is required';
      }
      if (!holding.quantity || holding.quantity <= 0) {
        errors[`${index}_quantity`] = 'Quantity must be greater than 0';
      }
      if (!holding.purchasePrice || holding.purchasePrice <= 0) {
        errors[`${index}_purchasePrice`] = 'Purchase price must be greater than 0';
      }
    });
    
    // Validate user preferences
    if (!riskTolerance) {
      errors.riskTolerance = 'Risk tolerance is required';
    }
    if (!investmentGoals) {
      errors.investmentGoals = 'Investment goals are required';
    }
    if (!timeHorizon) {
      errors.timeHorizon = 'Time horizon is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for API
      const portfolioData = {
        holdings: holdings.filter(holding => 
          holding.symbol && holding.quantity > 0 && holding.purchasePrice > 0
        ),
        riskTolerance,
        investmentGoals,
        timeHorizon,
        monthlyInvestment: parseInt(monthlyInvestment) || 0,
        availableCapital: parseInt(availableCapital) || 0
      };
      
      // Call backend API using portfolio service
      const analysisResult = await portfolioService.analyzePortfolio(portfolioData);
      
      // Store the analysis result in localStorage for the dashboard
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
      localStorage.setItem('portfolioAnalysis', JSON.stringify(analysisResult));
      
      // Navigate to dashboard after successful analysis
      onPageChange('dashboard');
      
    } catch (error) {
      console.error('Error submitting portfolio:', error);
      alert('Failed to analyze portfolio. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (index, field) => {
    return validationErrors[`${index}_${field}`] || validationErrors[field];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Portfolio Analysis</h1>
          <p className="text-lg text-gray-300">Enter your investment details to generate AI-powered insights</p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Your data is automatically saved as you type</span>
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
                <p className="text-blue-300 font-medium">Data Restored</p>
                <p className="text-blue-200 text-sm">Your previous form data has been automatically restored</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="glass-effect rounded-2xl shadow-xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Current Holdings Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Current Holdings</h2>
                  <p className="text-gray-300 text-sm">Enter your current stock positions for analysis</p>
                </div>
              </div>
              
              {/* Holdings List */}
              <div className="space-y-4">
                {holdings.map((holding, index) => (
                  <div key={index} className="relative">
                    <div className="bg-dark-700/50 rounded-lg border border-white/10 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white">Holding #{index + 1}</h3>
                        {holdings.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeHolding(index)}
                            className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Stock Symbol */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            Stock Symbol <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <CompanyDropdown
                              onSelect={(symbol) => handleStockSelect(index, symbol)}
                              placeholder="Search for stock..."
                              className="w-full"
                              instanceId={`holding_${index}`}
                            />
                            {getFieldError(index, 'symbol') && (
                              <p className="text-red-400 text-sm mt-1">{getFieldError(index, 'symbol')}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Quantity */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            Quantity <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={holding.quantity}
                            onChange={(e) => updateHolding(index, 'quantity', e.target.value)}
                            className={`w-full px-3 py-2 bg-dark-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                              getFieldError(index, 'quantity') ? 'border-red-500' : 'border-gray-600'
                            }`}
                            placeholder="0"
                          />
                          {getFieldError(index, 'quantity') && (
                            <p className="text-red-400 text-sm mt-1">{getFieldError(index, 'quantity')}</p>
                          )}
                        </div>
                        
                        {/* Purchase Price */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            Purchase Price ($) <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-400">$</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={holding.purchasePrice}
                              onChange={(e) => updateHolding(index, 'purchasePrice', e.target.value)}
                              className={`w-full pl-8 pr-3 py-2 bg-dark-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                getFieldError(index, 'purchasePrice') ? 'border-red-500' : 'border-gray-600'
                              }`}
                              placeholder="0.00"
                            />
                          </div>
                          {getFieldError(index, 'purchasePrice') && (
                            <p className="text-red-400 text-sm mt-1">{getFieldError(index, 'purchasePrice')}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add Holding Button */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={addHolding}
                    className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 font-medium p-3 rounded-lg hover:bg-primary-400/10 transition-colors border border-primary-400/30 hover:border-primary-400/50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Another Holding</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Investment Profile Section */}
            <div className="grid grid-cols-1 gap-8">
              {/* Risk Tolerance */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Risk Tolerance</h2>
                </div>
                <p className="text-gray-300">How comfortable are you with investment volatility?</p>
                <select
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(e.target.value)}
                  className={`w-full px-3 py-2 bg-dark-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white ${
                    getFieldError('riskTolerance') ? 'border-red-500' : 'border-gray-600'
                  }`}
                >
                  <option value="">Select your risk tolerance</option>
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
                {getFieldError('riskTolerance') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('riskTolerance')}</p>
                )}
              </div>

              {/* Investment Goals */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Investment Goals</h2>
                </div>
                <p className="text-gray-300">What are your primary investment objectives?</p>
                <select
                  value={investmentGoals}
                  onChange={(e) => setInvestmentGoals(e.target.value)}
                  className={`w-full px-3 py-2 bg-dark-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white ${
                    getFieldError('investmentGoals') ? 'border-red-500' : 'border-gray-600'
                  }`}
                >
                  <option value="">Select your investment goal</option>
                  <option value="retirement">Retirement Planning</option>
                  <option value="wealth-building">Wealth Building</option>
                  <option value="income">Income Generation</option>
                  <option value="capital-preservation">Capital Preservation</option>
                  <option value="education">Education Funding</option>
                </select>
                {getFieldError('investmentGoals') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('investmentGoals')}</p>
                )}
              </div>

              {/* Time Horizon */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Time Horizon</h2>
                </div>
                <p className="text-gray-300">How long do you plan to invest?</p>
                <select
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(e.target.value)}
                  className={`w-full px-3 py-2 bg-dark-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white ${
                    getFieldError('timeHorizon') ? 'border-red-500' : 'border-gray-600'
                  }`}
                >
                  <option value="">Select time horizon</option>
                  <option value="short-term">Short-term (1-3 years)</option>
                  <option value="medium-term">Medium-term (3-10 years)</option>
                  <option value="long-term">Long-term (10+ years)</option>
                </select>
                {getFieldError('timeHorizon') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('timeHorizon')}</p>
                )}
              </div>
            </div>

            {/* Additional Investment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Monthly Investment */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Monthly Investment</h2>
                </div>
                <p className="text-gray-300">How much can you invest monthly?</p>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">$</span>
                  <input
                    type="number"
                    min="0"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-8 pr-3 py-2 bg-dark-600 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Available Capital */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Available Capital</h2>
                </div>
                <p className="text-gray-300">Additional funds available to invest?</p>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">$</span>
                  <input
                    type="number"
                    min="0"
                    value={availableCapital}
                    onChange={(e) => setAvailableCapital(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-8 pr-3 py-2 bg-dark-600 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg ${
                  isSubmitting 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Analyzing Portfolio...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generate AI Analysis</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PortfolioInput; 