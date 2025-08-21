// Stock Data Storage Service
// Handles caching and storage of stock data for different time periods

class StockDataStorage {
  constructor() {
    this.storage = new Map(); // symbol -> period -> data
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes in milliseconds
    this.cacheTimestamps = new Map(); // symbol -> period -> timestamp
  }

  // Generate cache key for symbol and period
  getCacheKey(symbol, period) {
    return `${symbol.toUpperCase()}_${period}`;
  }

  // Check if data is cached and not expired
  isDataCached(symbol, period) {
    const key = this.getCacheKey(symbol, period);
    const timestamp = this.cacheTimestamps.get(key);
    
    if (!timestamp) return false;
    
    const now = Date.now();
    return (now - timestamp) < this.cacheExpiry;
  }

  // Store data for a symbol and period
  storeData(symbol, period, data) {
    const key = this.getCacheKey(symbol, period);
    this.storage.set(key, data);
    this.cacheTimestamps.set(key, Date.now());
  }

  // Retrieve cached data for a symbol and period
  getCachedData(symbol, period) {
    const key = this.getCacheKey(symbol, period);
    return this.storage.get(key);
  }

  // Get data for multiple symbols and a specific period
  getMultipleStocksData(symbols, period) {
    const result = [];
    
    for (const symbol of symbols) {
      const data = this.getCachedData(symbol, period);
      if (data) {
        result.push(data);
      }
    }
    
    return result;
  }

  // Check if all symbols have cached data for a period
  hasAllData(symbols, period) {
    return symbols.every(symbol => this.isDataCached(symbol, period));
  }

  // Clear expired cache entries
  clearExpiredCache() {
    const now = Date.now();
    const expiredKeys = [];
    
    for (const [key, timestamp] of this.cacheTimestamps.entries()) {
      if ((now - timestamp) >= this.cacheExpiry) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => {
      this.storage.delete(key);
      this.cacheTimestamps.delete(key);
    });
  }

  // Clear all cache
  clearAllCache() {
    this.storage.clear();
    this.cacheTimestamps.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      totalEntries: this.storage.size,
      totalTimestamps: this.cacheTimestamps.size,
      symbols: Array.from(new Set(
        Array.from(this.storage.keys()).map(key => key.split('_')[0])
      ))
    };
  }
}

export default new StockDataStorage(); 