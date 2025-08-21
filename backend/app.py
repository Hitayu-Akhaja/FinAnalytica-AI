from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import logging
from functools import wraps
import time
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from routes.ai_routes import ai_bp
from routes.news_routes import news_bp
from routes.portfolio_routes import portfolio_bp
from config import config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Register routes
app.register_blueprint(ai_bp)
app.register_blueprint(news_bp)
app.register_blueprint(portfolio_bp)

# Cache for storing stock data (in production, use Redis or similar)
stock_cache = {}
cache_duration = 300  # 5 minutes

# Load API keys from environment variables
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

# Make API keys available in app context
app.GROQ_API_KEY = GROQ_API_KEY

# Log API key status on app initialization
def log_api_key_status():
    """Log the status of API key configuration"""
    logger.info("🔑 API Key Configuration Status:")
    logger.info(f"GROQ_API_KEY: {'Configured' if GROQ_API_KEY else 'Not configured'}")
    
    if not GROQ_API_KEY:
        logger.warning("⚠️ GROQ_API_KEY not configured - AI features will use fallback methods")
    else:
        logger.info("✅ GROQ_API_KEY is configured")

# Log API key status on startup
log_api_key_status()

def cache_result(func):
    """Decorator to cache API results"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        cache_key = f"{func.__name__}_{str(args)}_{str(kwargs)}"
        current_time = time.time()
        
        # Check if cached data is still valid
        if cache_key in stock_cache:
            cached_data, timestamp = stock_cache[cache_key]
            if current_time - timestamp < cache_duration:
                logger.info(f"Returning cached data for {cache_key}")
                return cached_data
        
        # Get fresh data
        result = func(*args, **kwargs)
        stock_cache[cache_key] = (result, current_time)
        return result
    
    return wrapper

def format_number(num):
    """Format large numbers with K, M, B, T suffixes"""
    if num is None:
        return "N/A"
    
    if num >= 1e12:
        return f"{num/1e12:.1f}T"
    elif num >= 1e9:
        return f"{num/1e9:.1f}B"
    elif num >= 1e6:
        return f"{num/1e6:.1f}M"
    elif num >= 1e3:
        return f"{num/1e3:.1f}K"
    else:
        return f"{num:.0f}"

def get_stock_info(symbol):
    """Get comprehensive stock information"""
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        # Get current price and change
        current_price = info.get('currentPrice') or info.get('regularMarketPrice')
        previous_close = info.get('previousClose')
        
        if current_price and previous_close:
            change = current_price - previous_close
            change_percent = (change / previous_close) * 100
        else:
            change = 0
            change_percent = 0
        
        # Format volume
        volume = info.get('volume', 0)
        formatted_volume = format_number(volume)
        
        # Format market cap
        market_cap = info.get('marketCap', 0)
        formatted_market_cap = format_number(market_cap)
        
        stock_data = {
            'symbol': symbol.upper(),
            'name': info.get('longName', symbol.upper()),
            'price': round(current_price, 2) if current_price else 0,
            'change': round(change, 2),
            'changePercent': round(change_percent, 2),
            'volume': formatted_volume,
            'marketCap': formatted_market_cap,
            'pe': round(info.get('trailingPE', 0), 2),
            'high': round(info.get('dayHigh', 0), 2),
            'low': round(info.get('dayLow', 0), 2),
            'open': round(info.get('open', 0), 2),
            'previousClose': round(previous_close, 2) if previous_close else 0,
            'fiftyTwoWeekHigh': round(info.get('fiftyTwoWeekHigh', 0), 2),
            'fiftyTwoWeekLow': round(info.get('fiftyTwoWeekLow', 0), 2),
            'beta': round(info.get('beta', 0), 2),
            'dividendYield': round(info.get('dividendYield', 0) * 100, 2) if info.get('dividendYield') else 0,
            'sector': info.get('sector', 'N/A'),
            'industry': info.get('industry', 'N/A'),
            'marketCapRaw': market_cap,
            'volumeRaw': volume
        }
        
        return stock_data
    
    except Exception as e:
        logger.error(f"Error fetching stock info for {symbol}: {str(e)}")
        return None

def get_historical_data(symbol, period='1y', interval='1d'):
    """Get historical price data for charts"""
    try:
        ticker = yf.Ticker(symbol)
        history = ticker.history(period=period, interval=interval)
        
        if history.empty:
            return []
        
        # Convert to list of dictionaries
        chart_data = []
        for index, row in history.iterrows():
            # Handle different date formats for intraday vs daily data
            if interval in ['1m', '2m', '5m', '15m', '30m', '60m', '90m']:
                # Intraday data - include time
                date_str = index.strftime('%Y-%m-%d %H:%M:%S')
            else:
                # Daily data - just date
                date_str = index.strftime('%Y-%m-%d')
            
            chart_data.append({
                'date': date_str,
                'price': round(row['Close'], 2),
                'volume': int(row['Volume']),
                'open': round(row['Open'], 2),
                'high': round(row['High'], 2),
                'low': round(row['Low'], 2)
            })
        
        return chart_data
    
    except Exception as e:
        logger.error(f"Error fetching historical data for {symbol}: {str(e)}")
        return []

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    # Get current environment
    env = os.environ.get('FLASK_ENV', 'development')
    current_config = config[env]
    
    # Get API status
    api_status = current_config.get_api_status()
    
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'Stock Comparison API',
        'environment': env,
        'api_configuration': api_status,
        'features': {
            'ai_analysis': api_status['ai_analysis_available'],
            'stock_data': True,  # YFinance is always available
            'portfolio_analysis': True
        }
    })

@app.route('/api/stock/info/<symbol>', methods=['GET'])
@cache_result
def get_stock_info_endpoint(symbol):
    """Get basic stock information"""
    try:
        stock_data = get_stock_info(symbol)
        if stock_data:
            return jsonify(stock_data)
        else:
            return jsonify({'error': f'Could not fetch data for {symbol}'}), 404
    
    except Exception as e:
        logger.error(f"Error in stock info endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/stock/history/<symbol>', methods=['GET'])
@cache_result
def get_stock_history_endpoint(symbol):
    """Get historical data for charts"""
    try:
        period = request.args.get('period', '1y')
        interval = request.args.get('interval', '1d')
        
        chart_data = get_historical_data(symbol, period, interval)
        return jsonify({'data': chart_data})
    
    except Exception as e:
        logger.error(f"Error in stock history endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/stocks/compare', methods=['POST'])
def compare_stocks():
    """Compare multiple stocks"""
    try:
        data = request.get_json()
        symbols = data.get('symbols', [])
        period = data.get('period', '1y')  # Default to 1 year
        interval = data.get('interval', '1d')  # Default to daily
        
        if not symbols:
            return jsonify({'error': 'No symbols provided'}), 400
        
        if len(symbols) > 5:  # Limit to 5 stocks for performance
            return jsonify({'error': 'Maximum 5 stocks allowed'}), 400
        
        results = []
        for symbol in symbols:
            symbol = symbol.upper().strip()
            
            # Get stock info
            stock_info = get_stock_info(symbol)
            if stock_info:
                # Get historical data with the specified period and interval
                chart_data = get_historical_data(symbol, period, interval)
                stock_info['chartData'] = chart_data
                results.append(stock_info)
            else:
                logger.warning(f"Could not fetch data for {symbol}")
        
        return jsonify(results)
    
    except Exception as e:
        logger.error(f"Error in compare stocks endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/stock/quote/<symbol>', methods=['GET'])
@cache_result
def get_quote(symbol):
    """Get real-time quote"""
    try:
        stock_data = get_stock_info(symbol)
        if stock_data:
            return jsonify(stock_data)
        else:
            return jsonify({'error': f'Could not fetch quote for {symbol}'}), 404
    
    except Exception as e:
        logger.error(f"Error in quote endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/stocks/search', methods=['GET'])
def search_stocks():
    """Search for stocks by name or symbol"""
    try:
        query = request.args.get('q', '').strip()
        if not query or len(query) < 2:
            return jsonify({'error': 'Query must be at least 2 characters'}), 400
        
        # This is a simplified search - in production, you'd use a proper stock database
        # For now, we'll search through some common stocks
        common_stocks = [
            {'symbol': 'AAPL', 'name': 'Apple Inc.'},
            {'symbol': 'GOOGL', 'name': 'Alphabet Inc.'},
            {'symbol': 'MSFT', 'name': 'Microsoft Corporation'},
            {'symbol': 'TSLA', 'name': 'Tesla, Inc.'},
            {'symbol': 'AMZN', 'name': 'Amazon.com, Inc.'},
            {'symbol': 'META', 'name': 'Meta Platforms, Inc.'},
            {'symbol': 'NVDA', 'name': 'NVIDIA Corporation'},
            {'symbol': 'NFLX', 'name': 'Netflix, Inc.'},
            {'symbol': 'JPM', 'name': 'JPMorgan Chase & Co.'},
            {'symbol': 'JNJ', 'name': 'Johnson & Johnson'},
            {'symbol': 'V', 'name': 'Visa Inc.'},
            {'symbol': 'PG', 'name': 'Procter & Gamble Co.'},
            {'symbol': 'UNH', 'name': 'UnitedHealth Group Incorporated'},
            {'symbol': 'HD', 'name': 'The Home Depot, Inc.'},
            {'symbol': 'MA', 'name': 'Mastercard Incorporated'},
            {'symbol': 'DIS', 'name': 'The Walt Disney Company'},
            {'symbol': 'PYPL', 'name': 'PayPal Holdings, Inc.'},
            {'symbol': 'ADBE', 'name': 'Adobe Inc.'},
            {'symbol': 'CRM', 'name': 'Salesforce, Inc.'},
            {'symbol': 'NKE', 'name': 'NIKE, Inc.'}
        ]
        
        # Filter stocks based on query
        query_lower = query.lower()
        results = []
        for stock in common_stocks:
            if (query_lower in stock['symbol'].lower() or 
                query_lower in stock['name'].lower()):
                results.append(stock)
        
        return jsonify(results[:10])  # Limit to 10 results
    
    except Exception as e:
        logger.error(f"Error in search endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/stock/financials/<symbol>', methods=['GET'])
@cache_result
def get_financials(symbol):
    """Get detailed financial information"""
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        financials = {
            'symbol': symbol.upper(),
            'name': info.get('longName', symbol.upper()),
            'marketCap': format_number(info.get('marketCap', 0)),
            'enterpriseValue': format_number(info.get('enterpriseValue', 0)),
            'trailingPE': round(info.get('trailingPE', 0), 2),
            'forwardPE': round(info.get('forwardPE', 0), 2),
            'priceToBook': round(info.get('priceToBook', 0), 2),
            'priceToSales': round(info.get('priceToSalesTrailing12Months', 0), 2),
            'dividendYield': round(info.get('dividendYield', 0) * 100, 2) if info.get('dividendYield') else 0,
            'payoutRatio': round(info.get('payoutRatio', 0) * 100, 2) if info.get('payoutRatio') else 0,
            'beta': round(info.get('beta', 0), 2),
            'fiftyTwoWeekHigh': round(info.get('fiftyTwoWeekHigh', 0), 2),
            'fiftyTwoWeekLow': round(info.get('fiftyTwoWeekLow', 0), 2),
            'fiftyDayAverage': round(info.get('fiftyDayAverage', 0), 2),
            'twoHundredDayAverage': round(info.get('twoHundredDayAverage', 0), 2),
            'sector': info.get('sector', 'N/A'),
            'industry': info.get('industry', 'N/A'),
            'country': info.get('country', 'N/A'),
            'website': info.get('website', 'N/A'),
            'businessSummary': info.get('longBusinessSummary', 'N/A')
        }
        
        return jsonify(financials)
    
    except Exception as e:
        logger.error(f"Error in financials endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/stocks/trending', methods=['GET'])
def get_trending_stocks():
    """Get trending stocks (most active)"""
    try:
        # This would typically fetch from a trending stocks API
        # For now, return some popular stocks
        trending_stocks = [
            {'symbol': 'AAPL', 'name': 'Apple Inc.', 'volume': '45.2M'},
            {'symbol': 'TSLA', 'name': 'Tesla, Inc.', 'volume': '89.5M'},
            {'symbol': 'NVDA', 'name': 'NVIDIA Corporation', 'volume': '67.3M'},
            {'symbol': 'AMD', 'name': 'Advanced Micro Devices, Inc.', 'volume': '52.1M'},
            {'symbol': 'SPY', 'name': 'SPDR S&P 500 ETF Trust', 'volume': '123.4M'}
        ]
        
        return jsonify(trending_stocks)
    
    except Exception as e:
        logger.error(f"Error in trending stocks endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500











@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 