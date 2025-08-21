import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    # API Configuration
    API_TITLE = 'Stock Comparison API'
    API_VERSION = '1.0.0'
    
    # Cache Configuration
    CACHE_DURATION = int(os.environ.get('CACHE_DURATION', 300))  # 5 minutes
    REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    
    # Rate Limiting
    RATE_LIMIT_ENABLED = os.environ.get('RATE_LIMIT_ENABLED', 'True').lower() == 'true'
    RATE_LIMIT_REQUESTS = int(os.environ.get('RATE_LIMIT_REQUESTS', 100))  # requests per hour
    RATE_LIMIT_WINDOW = int(os.environ.get('RATE_LIMIT_WINDOW', 3600))  # 1 hour
    
    # YFinance Configuration
    YFINANCE_TIMEOUT = int(os.environ.get('YFINANCE_TIMEOUT', 10))  # seconds
    MAX_STOCKS_COMPARE = int(os.environ.get('MAX_STOCKS_COMPARE', 5))
    
    # Logging Configuration
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    # CORS Configuration
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')
    
    # Database Configuration (for future use)
    DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///stocks.db')
    
    # Security Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 3600))  # 1 hour

    # AI Configuration
    GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
    CREWAI_VERBOSE = os.environ.get('CREWAI_VERBOSE', 'False').lower() == 'true'



    @classmethod
    def validate_api_keys(cls):
        """Validate and print API key status"""
        print("\n🔑 API Key Configuration:")
        print("-" * 40)
        
        # AI Configuration
        if cls.GROQ_API_KEY:
            print("✅ GROQ_API_KEY: Configured")
        else:
            print("⚠️  GROQ_API_KEY: Not configured (AI analysis will use fallback)")
        

        
        print("-" * 40)
        
        # Check if required APIs are available
        print("✅ All required API keys are configured")
        return True

    @classmethod
    def get_api_status(cls):
        """Get API configuration status for health checks"""
        return {
            'groq_configured': bool(cls.GROQ_API_KEY),
            'ai_analysis_available': bool(cls.GROQ_API_KEY)
        }

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    CACHE_DURATION = 60  # 1 minute for development

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    CACHE_DURATION = 600  # 10 minutes for production

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    CACHE_DURATION = 0  # No caching for tests

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
} 