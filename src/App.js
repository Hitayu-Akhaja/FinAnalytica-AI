import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Stats from './components/Stats';
import CTA from './components/CTA';
import StockComparison from './components/StockComparison';
import PortfolioInput from './components/PortfolioInput';
import Dashboard from './components/Dashboard';
import About from './components/About';
import SessionStatus from './components/SessionStatus';
import sessionStorageService from './services/sessionStorage';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(() => {
    // Initialize current page from session storage
    return sessionStorageService.getCurrentPage();
  });

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold">Loading Financial Analyst...</h2>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'stocks':
        return <StockComparison />;
      case 'portfolio-input':
        return <PortfolioInput onPageChange={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} />;
      case 'about':
        return <About />;
      default:
        return (
          <>
            <Hero onPageChange={setCurrentPage} />
            <Features onPageChange={setCurrentPage} />
            <Stats />
            <CTA onPageChange={setCurrentPage} />
          </>
        );
    }
  };

  // Handle page changes and save to session storage
  const handlePageChange = (page) => {
    setCurrentPage(page);
    sessionStorageService.updateCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <Navbar onPageChange={handlePageChange} currentPage={currentPage} />
      {renderPage()}
      <SessionStatus />
    </div>
  );
}

export default App; 