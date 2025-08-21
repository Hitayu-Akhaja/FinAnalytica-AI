import React from 'react';

const CTA = ({ onPageChange }) => {

  return (
    <section className="py-20 bg-gradient-to-r from-primary-900 via-purple-900 to-primary-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Start Your Investment
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Analysis Journey
            </span>
          </h2>
          
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Experience the power of AI-driven financial analysis with real-time market data, comprehensive portfolio tracking, 
            and intelligent insights. No registration required - start exploring immediately.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button 
              onClick={() => onPageChange('stocks')}
              className="btn-primary text-lg px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              Compare Stocks Now
            </button>
            <button 
              onClick={() => onPageChange('portfolio-input')}
              className="btn-secondary text-lg px-8 py-4 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
            >
              Analyze Portfolio
            </button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-yellow-400 mb-2">3 Stocks</div>
              <div className="text-gray-300">Side-by-Side Comparison</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-yellow-400 mb-2">AI Analysis</div>
              <div className="text-gray-300">Personalized Insights</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-yellow-400 mb-2">Real-time</div>
              <div className="text-gray-300">Market Data</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA; 