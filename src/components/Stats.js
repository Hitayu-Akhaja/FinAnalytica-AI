import React, { useState, useEffect, useMemo } from 'react';

const Stats = () => {
  const [counts, setCounts] = useState({
    stocks: 0,
    timeframes: 0,
    features: 0,
    apis: 0
  });

  const stats = useMemo(() => [
    {
      number: 5000,
      suffix: '+',
      label: 'Stocks Available',
      description: 'Real-time data from global markets'
    },
    {
      number: 9,
      suffix: '',
      label: 'Time Frames',
      description: 'From 1 day to 5 years analysis'
    },
    {
      number: 6,
      suffix: '',
      label: 'Core Features',
      description: 'Comprehensive analysis tools'
    },
    {
      number: 2,
      suffix: '',
      label: 'Data Sources',
      description: 'Yahoo Finance, AI Models'
    }
  ], []);

  useEffect(() => {
    const animateCounters = () => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        
        const progress = currentStep / steps;
        
        setCounts({
          stocks: Math.floor(stats[0].number * progress),
          timeframes: Math.floor(stats[1].number * progress),
          features: Math.floor(stats[2].number * progress),
          apis: Math.floor(stats[3].number * progress)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    };

    // Start animation when component mounts
    const timeout = setTimeout(animateCounters, 500);
    return () => clearTimeout(timeout);
  }, []); // Remove stats dependency since it's now memoized

  return (
    <section className="py-20 bg-gradient-to-r from-primary-900 via-primary-800 to-purple-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Platform
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Capabilities
            </span>
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Discover the comprehensive range of features and data sources that power our advanced financial analysis platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105 h-48 flex flex-col justify-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                  {index === 0 && counts.stocks.toLocaleString()}
                  {index === 1 && counts.timeframes}
                  {index === 2 && counts.features}
                  {index === 3 && counts.apis}
                  {stat.suffix}
                </div>
                <div className="text-xl font-semibold text-white mb-2">
                  {stat.label}
                </div>
                <div className="text-gray-300 text-sm">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="mt-16 text-center">
          <p className="text-gray-300 mb-8">Powered by cutting-edge technology</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-white font-bold text-xl">React</div>
            <div className="text-white font-bold text-xl">Python</div>
            <div className="text-white font-bold text-xl">CrewAI</div>
            <div className="text-white font-bold text-xl">Yahoo Finance</div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats; 