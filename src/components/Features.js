import React from 'react';

const Features = ({ onPageChange }) => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Multi-Stock Comparison",
      description: "Compare up to 5 stocks side-by-side with interactive charts, multiple timeframes, and real-time data from Yahoo Finance API.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "AI-Powered Analysis",
      description: "Get intelligent portfolio recommendations and analysis using advanced AI models with CrewAI integration for personalized insights.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: "Portfolio Management",
      description: "Create and manage investment portfolios with detailed performance tracking, risk analysis, and diversification metrics.",
      color: "from-green-500 to-emerald-500"
    },

    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: "Performance Tracking",
      description: "Advanced portfolio performance metrics with historical data, benchmark comparisons, and predictive analytics.",
      color: "from-indigo-500 to-purple-500"
    },

  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-dark-900 to-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Powerful Tools for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
              Smart Investors
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the comprehensive suite of features that make Financial Analyst your complete investment research and portfolio management solution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card p-8 border border-gray-700 bg-dark-800/50 backdrop-blur-sm group hover:border-primary-500/50 transition-all duration-300"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-primary-400 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Feature Demo Section */}
        <div className="mt-20 text-center">
          <div className="bg-dark-800/50 border border-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Experience These Features?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Start exploring our platform with real market data and AI-powered insights. No registration required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => onPageChange('stocks')}
                className="btn-primary text-lg px-8 py-4"
              >
                Try Stock Comparison
              </button>
              <button 
                onClick={() => onPageChange('portfolio-input')}
                className="btn-secondary text-lg px-8 py-4"
              >
                Build Your Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features; 