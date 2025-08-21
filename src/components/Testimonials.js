import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Individual Investor",
      company: "Retail Trader",
      rating: 5,
      content: "The stock comparison feature is fantastic! I can easily compare up to 5 stocks side-by-side with different timeframes. The charts are interactive and the data is always up-to-date.",
      avatar: "AC"
    },
    {
      name: "Maria Rodriguez",
      role: "Portfolio Manager",
      company: "Independent Advisor",
      rating: 5,
      content: "The AI-powered portfolio analysis is incredible. It provides personalized recommendations and insights that help me make better investment decisions for my clients.",
      avatar: "MR"
    },
    {
      name: "David Kim",
      role: "Financial Analyst",
      company: "Research Firm",
      rating: 5,
      content: "The AI-powered analysis feature is a game-changer. I can quickly get comprehensive insights about my portfolio holdings and make informed decisions based on advanced analytics.",
      avatar: "DK"
    },
    {
      name: "Sarah Johnson",
      role: "Investment Enthusiast",
      company: "Personal Investor",
      rating: 5,
      content: "Love the portfolio tracking feature! The performance metrics and risk analysis help me understand how my investments are performing and where I can improve.",
      avatar: "SJ"
    },
    {
      name: "Michael Thompson",
      role: "Day Trader",
      company: "Active Trader",
      rating: 5,
      content: "The real-time market data integration with Yahoo Finance is seamless. I can track multiple stocks simultaneously and the session storage keeps my data persistent.",
      avatar: "MT"
    },
    {
      name: "Lisa Wang",
      role: "Financial Blogger",
      company: "Investment Content Creator",
      rating: 5,
      content: "The portfolio performance tracking feature helps me stay on top of my investments. It's perfect for monitoring my portfolio's performance and identifying optimization opportunities.",
      avatar: "LW"
    }
  ];

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${
              index < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-b from-dark-800 to-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            User
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
              Experiences
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how our platform's features are helping investors make better decisions and manage their portfolios more effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card p-8 border border-gray-700 bg-dark-800/50 backdrop-blur-sm hover:border-primary-500/50 transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  <p className="text-primary-400 text-sm">{testimonial.company}</p>
                </div>
              </div>

              <StarRating rating={testimonial.rating} />

              <blockquote className="mt-6 text-gray-300 leading-relaxed italic">
                "{testimonial.content}"
              </blockquote>
            </div>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">4 Core Features</div>
              <div className="text-gray-300 mb-4">Comprehensive investment analysis platform</div>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                <span className="bg-primary-500/20 px-3 py-1 rounded-full">Stock Comparison</span>
                <span className="bg-purple-500/20 px-3 py-1 rounded-full">AI Analysis</span>
                <span className="bg-green-500/20 px-3 py-1 rounded-full">Portfolio Tracking</span>
                <span className="bg-blue-500/20 px-3 py-1 rounded-full">Performance Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 