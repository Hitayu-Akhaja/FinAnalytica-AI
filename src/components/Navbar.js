import React, { useState, useEffect } from 'react';

const Navbar = ({ onPageChange, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass-effect' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white">
                <span className="text-primary-400">FinAnalytica</span> AI
              </h1>
            </div>
          </div>

          {/* Desktop Navigation - Centered from logo end */}
          <div className="hidden md:flex flex-1 justify-start ml-40">
            <div className="flex items-baseline space-x-8">
              <button 
                onClick={() => onPageChange('home')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentPage === 'home' 
                    ? 'text-primary-400' 
                    : 'text-white hover:text-primary-400'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => onPageChange('portfolio-input')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentPage === 'portfolio-input' 
                    ? 'text-primary-400' 
                    : 'text-white hover:text-primary-400'
                }`}
              >
                Portfolio Input
              </button>
              <button 
                onClick={() => onPageChange('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentPage === 'dashboard' 
                    ? 'text-primary-400' 
                    : 'text-white hover:text-primary-400'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => onPageChange('stocks')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentPage === 'stocks' 
                    ? 'text-primary-400' 
                    : 'text-white hover:text-primary-400'
                }`}
              >
                Stock Comparison
              </button>
              <button 
                onClick={() => onPageChange('about')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentPage === 'about' 
                    ? 'text-primary-400' 
                    : 'text-white hover:text-primary-400'
                }`}
              >
                About
              </button>
            </div>
          </div>





          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-primary-400 focus:outline-none focus:text-primary-400"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-effect">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button 
              onClick={() => {
                onPageChange('home');
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                currentPage === 'home' 
                  ? 'text-primary-400' 
                  : 'text-white hover:text-primary-400'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => {
                onPageChange('portfolio-input');
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                currentPage === 'portfolio-input' 
                  ? 'text-primary-400' 
                  : 'text-white hover:text-primary-400'
              }`}
            >
              Portfolio Input
            </button>
            <button 
              onClick={() => {
                onPageChange('dashboard');
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                currentPage === 'dashboard' 
                  ? 'text-primary-400' 
                  : 'text-white hover:text-primary-400'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => {
                onPageChange('stocks');
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                currentPage === 'stocks' 
                  ? 'text-primary-400' 
                  : 'text-white hover:text-primary-400'
              }`}
            >
              Stock Comparison
            </button>
            <button 
              onClick={() => {
                onPageChange('about');
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                currentPage === 'about' 
                  ? 'text-primary-400' 
                  : 'text-white hover:text-primary-400'
              }`}
            >
              About
            </button>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 