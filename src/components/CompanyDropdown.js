import React, { useState, useEffect, useRef } from 'react';

const CompanyDropdown = ({ onSelect, placeholder = "Search companies...", className = "", instanceId = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Popular companies with their stock symbols
  const popularCompanies = [
    // Technology
    { name: "Apple Inc.", symbol: "AAPL", sector: "Technology" },
    { name: "Microsoft Corporation", symbol: "MSFT", sector: "Technology" },
    { name: "Alphabet Inc. (Google)", symbol: "GOOGL", sector: "Technology" },
    { name: "Amazon.com Inc.", symbol: "AMZN", sector: "Technology" },
    { name: "Meta Platforms Inc. (Facebook)", symbol: "META", sector: "Technology" },
    { name: "Tesla Inc.", symbol: "TSLA", sector: "Technology" },
    { name: "NVIDIA Corporation", symbol: "NVDA", sector: "Technology" },
    { name: "Netflix Inc.", symbol: "NFLX", sector: "Technology" },
    { name: "Salesforce Inc.", symbol: "CRM", sector: "Technology" },
    { name: "Adobe Inc.", symbol: "ADBE", sector: "Technology" },
    
    // Financial
    { name: "JPMorgan Chase & Co.", symbol: "JPM", sector: "Financial" },
    { name: "Bank of America Corp.", symbol: "BAC", sector: "Financial" },
    { name: "Wells Fargo & Company", symbol: "WFC", sector: "Financial" },
    { name: "Goldman Sachs Group Inc.", symbol: "GS", sector: "Financial" },
    { name: "Morgan Stanley", symbol: "MS", sector: "Financial" },
    
    // Healthcare
    { name: "Johnson & Johnson", symbol: "JNJ", sector: "Healthcare" },
    { name: "Pfizer Inc.", symbol: "PFE", sector: "Healthcare" },
    { name: "UnitedHealth Group Inc.", symbol: "UNH", sector: "Healthcare" },
    { name: "Moderna Inc.", symbol: "MRNA", sector: "Healthcare" },
    { name: "BioNTech SE", symbol: "BNTX", sector: "Healthcare" },
    
    // Consumer
    { name: "Coca-Cola Company", symbol: "KO", sector: "Consumer" },
    { name: "Procter & Gamble Co.", symbol: "PG", sector: "Consumer" },
    { name: "Walmart Inc.", symbol: "WMT", sector: "Consumer" },
    { name: "McDonald's Corporation", symbol: "MCD", sector: "Consumer" },
    { name: "Starbucks Corporation", symbol: "SBUX", sector: "Consumer" },
    { name: "Nike Inc.", symbol: "NKE", sector: "Consumer" },
    
    // Energy
    { name: "Exxon Mobil Corporation", symbol: "XOM", sector: "Energy" },
    { name: "Chevron Corporation", symbol: "CVX", sector: "Energy" },
    { name: "ConocoPhillips", symbol: "COP", sector: "Energy" },
    
    // Industrial
    { name: "Boeing Company", symbol: "BA", sector: "Industrial" },
    { name: "General Electric Company", symbol: "GE", sector: "Industrial" },
    { name: "3M Company", symbol: "MMM", sector: "Industrial" },
    
    // Communication
    { name: "AT&T Inc.", symbol: "T", sector: "Communication" },
    { name: "Verizon Communications Inc.", symbol: "VZ", sector: "Communication" },
    { name: "Disney (Walt Disney Co.)", symbol: "DIS", sector: "Communication" },
    
    // Real Estate
    { name: "American Tower Corporation", symbol: "AMT", sector: "Real Estate" },
    { name: "Simon Property Group Inc.", symbol: "SPG", sector: "Real Estate" },
    
    // Materials
    { name: "Dow Inc.", symbol: "DOW", sector: "Materials" },
    { name: "DuPont de Nemours Inc.", symbol: "DD", sector: "Materials" },
    
    // Utilities
    { name: "NextEra Energy Inc.", symbol: "NEE", sector: "Utilities" },
    { name: "Duke Energy Corporation", symbol: "DUK", sector: "Utilities" },
    
    // Cryptocurrency Related
    { name: "Coinbase Global Inc.", symbol: "COIN", sector: "Technology" },
    { name: "MicroStrategy Incorporated", symbol: "MSTR", sector: "Technology" },
    
    // Electric Vehicles
    { name: "Rivian Automotive Inc.", symbol: "RIVN", sector: "Technology" },
    { name: "Lucid Group Inc.", symbol: "LCID", sector: "Technology" },
    
    // Gaming
    { name: "Activision Blizzard Inc.", symbol: "ATVI", sector: "Technology" },
    { name: "Electronic Arts Inc.", symbol: "EA", sector: "Technology" },
    
    // Semiconductor
    { name: "Intel Corporation", symbol: "INTC", sector: "Technology" },
    { name: "Advanced Micro Devices Inc.", symbol: "AMD", sector: "Technology" },
    { name: "Qualcomm Incorporated", symbol: "QCOM", sector: "Technology" },
    
    // E-commerce
    { name: "Shopify Inc.", symbol: "SHOP", sector: "Technology" },
    { name: "eBay Inc.", symbol: "EBAY", sector: "Technology" },
    
    // Social Media
    { name: "Twitter Inc.", symbol: "TWTR", sector: "Technology" },
    { name: "Snap Inc.", symbol: "SNAP", sector: "Technology" },
    { name: "Pinterest Inc.", symbol: "PINS", sector: "Technology" },
    
    // Streaming
    { name: "Spotify Technology S.A.", symbol: "SPOT", sector: "Technology" },
    { name: "Roku Inc.", symbol: "ROKU", sector: "Technology" },
    
    // Cloud Computing
    { name: "Oracle Corporation", symbol: "ORCL", sector: "Technology" },
    { name: "IBM Corporation", symbol: "IBM", sector: "Technology" },
    { name: "Cisco Systems Inc.", symbol: "CSCO", sector: "Technology" },
    
    // Biotechnology
    { name: "Gilead Sciences Inc.", symbol: "GILD", sector: "Healthcare" },
    { name: "Amgen Inc.", symbol: "AMGN", sector: "Healthcare" },
    { name: "Biogen Inc.", symbol: "BIIB", sector: "Healthcare" },
    
    // Insurance
    { name: "Berkshire Hathaway Inc.", symbol: "BRK.A", sector: "Financial" },
    { name: "AIG (American International Group)", symbol: "AIG", sector: "Financial" },
    
    // Airlines
    { name: "Delta Air Lines Inc.", symbol: "DAL", sector: "Industrial" },
    { name: "American Airlines Group Inc.", symbol: "AAL", sector: "Industrial" },
    { name: "United Airlines Holdings Inc.", symbol: "UAL", sector: "Industrial" },
    
    // Hotels
    { name: "Marriott International Inc.", symbol: "MAR", sector: "Consumer" },
    { name: "Hilton Worldwide Holdings Inc.", symbol: "HLT", sector: "Consumer" },
    
    // Food & Beverage
    { name: "PepsiCo Inc.", symbol: "PEP", sector: "Consumer" },
    { name: "Kraft Heinz Company", symbol: "KHC", sector: "Consumer" },
    { name: "General Mills Inc.", symbol: "GIS", sector: "Consumer" },
    
    // Entertainment
    { name: "Warner Bros. Discovery Inc.", symbol: "WBD", sector: "Communication" },
    
    // Retail
    { name: "Target Corporation", symbol: "TGT", sector: "Consumer" },
    { name: "Costco Wholesale Corporation", symbol: "COST", sector: "Consumer" },
    { name: "Home Depot Inc.", symbol: "HD", sector: "Consumer" },
    { name: "Lowe's Companies Inc.", symbol: "LOW", sector: "Consumer" }
  ];

  // Filter companies based on search term
  const filteredCompanies = popularCompanies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (company) => {
    setSelectedCompany(company);
    setSearchTerm(company.name);
    setIsOpen(false);
    onSelect(company.symbol);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedCompany(null);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const clearSelection = () => {
    setSelectedCompany(null);
    setSearchTerm('');
    onSelect('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={inputRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
        
        {/* Clear button */}
        {selectedCompany && (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        )}
        
        {/* Dropdown arrow */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          ▼
        </button>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 max-h-96 overflow-y-auto bg-gray-900 border border-gray-600 rounded-lg shadow-2xl z-50"
        >
          {filteredCompanies.length > 0 ? (
            <div className="py-2">
              {filteredCompanies.map((company) => (
                <button
                  key={company.symbol}
                  onClick={() => handleSelect(company)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-150 border-b border-gray-700/50 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">{company.name}</div>
                      <div className="text-sm text-gray-300">{company.symbol}</div>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-700/80 px-2 py-1 rounded border border-gray-600">
                      {company.sector}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-gray-400 text-center bg-gray-800">
              {searchTerm ? `No companies found matching "${searchTerm}"` : 'Start typing to search for companies'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyDropdown; 