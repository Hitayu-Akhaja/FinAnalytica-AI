import React, { useState, useEffect } from 'react';
import sessionStorageService from '../services/sessionStorage';

const SessionStatus = () => {
  const [lastSaved, setLastSaved] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateLastSaved = () => {
      const timestamp = sessionStorageService.getLastUpdated();
      if (timestamp) {
        setLastSaved(new Date(timestamp));
        setIsVisible(true);
        
        // Hide the indicator after 3 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      }
    };

    // Update when session changes
    const handleStorageChange = (e) => {
      if (e.key === sessionStorageService.storageKey) {
        updateLastSaved();
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Initial check
    updateLastSaved();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (!isVisible || !lastSaved) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg border border-green-400/30 flex items-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">Auto-saved</span>
        <span className="text-xs opacity-75">
          {lastSaved.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default SessionStatus; 