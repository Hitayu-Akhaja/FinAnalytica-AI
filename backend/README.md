# Stock Comparison API Backend

A powerful Python Flask backend for stock comparison and analysis using yfinance data.

## 🚀 Features

### Core Functionality
- **Real-time Stock Data**: Fetch live stock data using yfinance
- **Multi-Stock Comparison**: Compare up to 5 stocks simultaneously
- **Technical Analysis**: Calculate advanced technical indicators
- **Performance Metrics**: Risk-adjusted returns, volatility, Sharpe ratio
- **Portfolio Analysis**: Portfolio-level metrics and recommendations
- **Market Sentiment**: Sentiment analysis based on technical indicators

### Technical Indicators
- **Moving Averages**: SMA 20, SMA 50, EMA 12, EMA 26
- **MACD**: Moving Average Convergence Divergence
- **RSI**: Relative Strength Index
- **Bollinger Bands**: Upper, Middle, Lower bands
- **Volatility**: Historical and implied volatility

### Performance Metrics
- **Total Return**: Overall performance
- **Annualized Return**: Yearly performance
- **Sharpe Ratio**: Risk-adjusted returns
- **Maximum Drawdown**: Worst historical decline
- **Beta**: Market correlation
- **Volatility**: Price variability

## 📁 Project Structure

```
backend/
├── app.py                 # Main Flask application
├── config.py             # Configuration settings
├── run.py                # Application runner
├── requirements.txt      # Python dependencies
├── env_example.txt       # Environment variables example
├── README.md            # This file
├── utils/
│   └── __init__.py        # Utils initialization
└── routes/
    └── __init__.py        # Routes initialization
```

## 🛠️ Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Setup Instructions

1. **Clone the repository** (if not already done)
2. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

3. **Create virtual environment**:
   ```bash
   python -m venv venv
   ```

4. **Activate virtual environment**:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

5. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

6. **Set up environment variables**:
   ```bash
   # Copy example file
   cp env_example.txt .env
   
   # Edit .env file with your settings
   ```

7. **Run the application**:
   ```bash
   python run.py
   ```

The API will be available at `http://localhost:5000`

## 🔌 API Endpoints

### Basic Endpoints

#### Health Check
```http
GET /api/health
```
Returns API health status.

#### Stock Information
```http
GET /api/stock/info/{symbol}
```
Get basic stock information for a symbol.

#### Historical Data
```http
GET /api/stock/history/{symbol}?period=1y&interval=1d
```
Get historical price data for charts.

#### Stock Comparison
```http
POST /api/stocks/compare
Content-Type: application/json

{
  "symbols": ["AAPL", "GOOGL", "MSFT"]
}
```
Compare multiple stocks side by side.

#### Real-time Quote
```http
GET /api/stock/quote/{symbol}
```
Get real-time stock quote.

#### Stock Search
```http
GET /api/stocks/search?q=apple
```
Search for stocks by name or symbol.

#### Financial Information
```http
GET /api/stock/financials/{symbol}
```
Get detailed financial information.

#### Trending Stocks
```http
GET /api/stocks/trending
```
Get trending/most active stocks.

### Advanced Endpoints

#### Technical Analysis
```http
GET /api/advanced/technical-analysis/{symbol}
```
Get detailed technical analysis with indicators.

#### Advanced Comparison
```http
POST /api/advanced/advanced-comparison
Content-Type: application/json

{
  "symbols": ["AAPL", "GOOGL", "MSFT"]
}
```
Advanced comparison with technical analysis and recommendations.

#### Portfolio Analysis
```http
POST /api/advanced/portfolio-analysis
Content-Type: application/json

{
  "portfolio": [
    {"symbol": "AAPL", "weight": 0.4},
    {"symbol": "GOOGL", "weight": 0.3},
    {"symbol": "MSFT", "weight": 0.3}
  ]
}
```
Analyze a portfolio of stocks with weights.

#### Market Sentiment
```http
GET /api/advanced/market-sentiment/{symbol}
```
Get market sentiment analysis for a stock.

## 📊 Response Examples

### Stock Comparison Response
```json
{
  "stocks": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "price": 150.25,
      "change": 2.15,
      "changePercent": 1.45,
      "volume": "45.2M",
      "marketCap": "2.4T",
      "pe": 25.6,
      "chartData": [...],
      "technical_analysis": {
        "rsi": 65.4,
        "sma_20": 148.30,
        "macd": 0.0234,
        "volatility": 18.5
      },
      "performance_metrics": {
        "total_return": 12.5,
        "sharpe_ratio": 1.2,
        "max_drawdown": -8.3
      }
    }
  ],
  "comparison": {
    "performance_ranking": [...],
    "recommendations": [...],
    "risk_analysis": {...}
  },
  "portfolio_metrics": {
    "portfolio_return": 10.2,
    "portfolio_volatility": 15.8,
    "diversification_score": 0.45
  }
}
```

### Technical Analysis Response
```json
{
  "symbol": "AAPL",
  "technical_indicators": {
    "rsi": 65.4,
    "sma_20": 148.30,
    "sma_50": 145.80,
    "ema_12": 149.20,
    "ema_26": 147.10,
    "macd": 0.0234,
    "macd_signal": 0.0189,
    "bb_upper": 152.40,
    "bb_middle": 148.30,
    "bb_lower": 144.20,
    "volatility": 18.5,
    "price_vs_sma20": 1.31,
    "price_vs_sma50": 3.05
  },
  "performance_metrics": {
    "total_return": 12.5,
    "annualized_return": 15.2,
    "volatility": 18.5,
    "sharpe_ratio": 1.2,
    "max_drawdown": -8.3,
    "beta": 1.0,
    "risk_adjusted_return": 1.2
  },
  "analysis_summary": [
    "RSI indicates neutral momentum",
    "Price is above 20-day moving average",
    "Good risk-adjusted returns"
  ]
}
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_ENV` | Flask environment | `development` |
| `FLASK_DEBUG` | Debug mode | `True` |
| `SECRET_KEY` | Flask secret key | Auto-generated |
| `CACHE_DURATION` | Cache duration in seconds | `300` |
| `YFINANCE_TIMEOUT` | YFinance timeout | `10` |
| `MAX_STOCKS_COMPARE` | Max stocks for comparison | `5` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000` |

### Configuration Classes

- **DevelopmentConfig**: Development settings with shorter cache
- **ProductionConfig**: Production settings with longer cache
- **TestingConfig**: Testing settings with no cache

## 🔧 Development

### Running in Development Mode
```bash
export FLASK_ENV=development
export FLASK_DEBUG=True
python run.py
```

### Running in Production Mode
```bash
export FLASK_ENV=production
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

### Testing
```bash
# Run tests (when implemented)
python -m pytest tests/

# Run with coverage
python -m pytest --cov=app tests/
```

## 🚀 Deployment

### Using Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

### Using Docker (Dockerfile example)
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]
```

### Environment Setup for Production
1. Set `FLASK_ENV=production`
2. Set `FLASK_DEBUG=False`
3. Configure proper `SECRET_KEY`
4. Set up Redis for caching
5. Configure CORS origins
6. Set up logging

## 📈 Performance Optimization

### Caching Strategy
- **In-Memory Cache**: 5-minute cache for stock data
- **Redis Cache**: For production (optional)
- **Cache Decorator**: Automatic caching for expensive operations

### Rate Limiting
- **Default**: 100 requests per hour per IP
- **Configurable**: Via environment variables
- **Per-Endpoint**: Different limits for different endpoints

### Error Handling
- **Graceful Degradation**: Fallback to cached data
- **User-Friendly Errors**: Clear error messages
- **Logging**: Comprehensive error logging

## 🔒 Security

### CORS Configuration
- **Development**: Allow localhost:3000
- **Production**: Configure allowed origins
- **Flexible**: Multiple origins supported

### Rate Limiting
- **Protection**: Against abuse and DoS
- **Configurable**: Limits and windows
- **Per-IP**: Individual IP tracking

### Input Validation
- **Symbol Validation**: Check stock symbol format
- **Parameter Validation**: Validate all inputs
- **Sanitization**: Clean user inputs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

This project is part of the Financial Analyst application.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with details
4. Contact the development team

## 🔮 Future Enhancements

- **Real-time WebSocket**: Live price updates
- **Database Integration**: Store user portfolios
- **Authentication**: User accounts and saved comparisons
- **Advanced Charts**: More chart types and indicators
- **News Integration**: Stock news and sentiment
- **Screening**: Stock screening and filtering
- **Alerts**: Price alerts and notifications 