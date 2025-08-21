import React from 'react';

const Hero = ({ onPageChange }) => {

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-primary-400 rounded-full mr-2 animate-pulse"></span>
            AI-Powered Financial Analysis Platform
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Master Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
              Investment Strategy
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Compare stocks, analyze portfolios, track performance, and get AI-powered insights with real-time market data and advanced analytics.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            <div className="text-center p-4 rounded-lg bg-dark-800/50 border border-gray-700">
              <div className="text-2xl font-bold text-primary-400 mb-1">📊</div>
              <div className="text-sm text-gray-300">Stock Comparison</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-dark-800/50 border border-gray-700">
              <div className="text-2xl font-bold text-purple-400 mb-1">🤖</div>
              <div className="text-sm text-gray-300">AI Analysis</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-dark-800/50 border border-gray-700">
              <div className="text-2xl font-bold text-green-400 mb-1">📈</div>
              <div className="text-sm text-gray-300">Portfolio Tracking</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-dark-800/50 border border-gray-700">
              <div className="text-2xl font-bold text-blue-400 mb-1">📊</div>
              <div className="text-sm text-gray-300">Performance Analytics</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button 
              onClick={() => onPageChange('stocks')}
              className="btn-primary text-lg px-8 py-4"
            >
              Compare Stocks
            </button>
            <button 
              onClick={() => onPageChange('portfolio-input')}
              className="btn-secondary text-lg px-8 py-4"
            >
              Analyze Portfolio
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">Real-time</div>
              <div className="text-gray-400">Market Data</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">AI-Powered</div>
              <div className="text-gray-400">Insights</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">Advanced</div>
              <div className="text-gray-400">Analytics</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 