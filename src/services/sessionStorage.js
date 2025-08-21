// Session Storage Service for managing application state across page navigation
class SessionStorageService {
  constructor() {
    this.storageKey = 'financialAnalystSession';
    this.sessionData = this.loadSession();
  }

  // Load session data from sessionStorage
  loadSession() {
    try {
      const sessionData = sessionStorage.getItem(this.storageKey);
      return sessionData ? JSON.parse(sessionData) : this.getDefaultSession();
    } catch (error) {
      console.error('Error loading session:', error);
      return this.getDefaultSession();
    }
  }

  // Get default session structure
  getDefaultSession() {
    return {
      portfolioInput: {
        holdings: [{ symbol: '', quantity: 0, purchasePrice: 0.00 }],
        riskTolerance: '',
        investmentGoals: '',
        timeHorizon: '',
        monthlyInvestment: 0,
        availableCapital: 0
      },
      stockComparison: {
        stocks: ['', '', ''],
        chartPeriod: '2y',
        chartInterval: '1d'
      },
      dropdowns: {},
      currentPage: 'home',
      lastUpdated: new Date().toISOString()
    };
  }

  // Save session data to sessionStorage
  saveSession() {
    try {
      this.sessionData.lastUpdated = new Date().toISOString();
      sessionStorage.setItem(this.storageKey, JSON.stringify(this.sessionData));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  // Update portfolio input data
  updatePortfolioInput(data) {
    this.sessionData.portfolioInput = { ...this.sessionData.portfolioInput, ...data };
    this.saveSession();
  }

  // Get portfolio input data
  getPortfolioInput() {
    return this.sessionData.portfolioInput;
  }

  // Update stock comparison data
  updateStockComparison(data) {
    this.sessionData.stockComparison = { ...this.sessionData.stockComparison, ...data };
    this.saveSession();
  }

  // Get stock comparison data
  getStockComparison() {
    return this.sessionData.stockComparison;
  }

  // Update dropdown data
  updateDropdowns(data) {
    this.sessionData.dropdowns = { ...this.sessionData.dropdowns, ...data };
    this.saveSession();
  }

  // Get dropdown data
  getDropdowns() {
    return this.sessionData.dropdowns;
  }

  // Update current page
  updateCurrentPage(page) {
    this.sessionData.currentPage = page;
    this.saveSession();
  }

  // Get current page
  getCurrentPage() {
    return this.sessionData.currentPage;
  }

  // Clear specific section data
  clearSection(section) {
    if (section === 'portfolioInput') {
      this.sessionData.portfolioInput = this.getDefaultSession().portfolioInput;
    } else if (section === 'stockComparison') {
      this.sessionData.stockComparison = this.getDefaultSession().stockComparison;
    } else if (section === 'dropdowns') {
      this.sessionData.dropdowns = {};
    }
    this.saveSession();
  }

  // Clear all session data
  clearAll() {
    this.sessionData = this.getDefaultSession();
    this.saveSession();
  }

  // Get last updated timestamp
  getLastUpdated() {
    return this.sessionData.lastUpdated;
  }

  // Check if session exists
  hasSession() {
    return sessionStorage.getItem(this.storageKey) !== null;
  }

  // Export session data (for debugging)
  exportSession() {
    return { ...this.sessionData };
  }
}

// Create singleton instance
const sessionStorageService = new SessionStorageService();

export default sessionStorageService; 