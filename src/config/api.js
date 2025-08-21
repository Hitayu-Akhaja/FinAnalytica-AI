// API Configuration
export const API_CONFIG = {
  // Groq API Configuration
  GROQ_API_KEY: process.env.REACT_APP_GROQ_API_KEY || 'your-groq-api-key-here',
  
  // Backend API Configuration
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  
  // Environment
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || 'development'
};

// Validate required API keys
export const validateAPIKeys = () => {
  const missingKeys = [];
  
  if (!API_CONFIG.GROQ_API_KEY || API_CONFIG.GROQ_API_KEY === 'your-groq-api-key-here') {
    missingKeys.push('REACT_APP_GROQ_API_KEY');
  }
  
  if (missingKeys.length > 0) {
    console.warn('Missing API keys:', missingKeys);
    console.warn('Please set up your environment variables. See README.md for instructions.');
    return false;
  }
  
  return true;
};


