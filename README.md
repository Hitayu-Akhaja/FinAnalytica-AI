# FinAnalytica AI - Advanced Portfolio Management & AI-Powered Analysis

A comprehensive financial analysis platform that combines modern React frontend with AI-powered backend services for portfolio management, stock analysis, and market insights. Built with React 18, Flask, and cutting-edge AI technologies including CrewAI and Groq.

## 🚀 Key Features

### 📊 Advanced Portfolio Management
- **Portfolio Optimization**: AI-driven portfolio analysis and optimization
- **Real-time Tracking**: Live portfolio performance monitoring
- **Risk Assessment**: Comprehensive risk analysis and diversification insights
- **Performance Analytics**: Detailed performance metrics and historical analysis

### 🤖 AI-Powered Analysis
- **Intelligent Stock Analysis**: AI agents providing deep market insights
- **News Sentiment Analysis**: Real-time news analysis and sentiment scoring
- **Market Trend Prediction**: Advanced trend analysis using AI models
- **Investment Recommendations**: Personalized investment suggestions

### 📈 Stock Analysis Tools
- **Multi-Stock Comparison**: Compare up to 3 stocks with interactive charts
- **Real-time Data**: Live market data from Yahoo Finance
- **Technical Indicators**: Comprehensive technical analysis tools
- **Fundamental Analysis**: Key financial metrics and ratios

### 📰 News & Market Intelligence
- **Real-time News Feed**: Latest financial news and market updates
- **Sentiment Analysis**: AI-powered news sentiment scoring
- **Market Impact Analysis**: How news affects stock performance
- **Custom News Alerts**: Personalized news monitoring

### 🎨 Modern UI/UX
- **Responsive Design**: Optimized for all devices
- **Dark Theme**: Professional dark mode interface
- **Interactive Charts**: Beautiful data visualization with Plotly and Recharts
- **Smooth Animations**: Engaging user experience with smooth transitions

## 🛠️ Tech Stack

### Frontend
- **React 18**: Latest React features with hooks and modern patterns
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Plotly.js**: Interactive charts and data visualization
- **Recharts**: Additional charting capabilities
- **React Router**: Client-side routing
- **Node Fetch**: HTTP client for API calls

### Backend
- **Flask**: Python web framework for API development
- **YFinance**: Real-time stock data and market information
- **Pandas & NumPy**: Data manipulation and numerical computing
- **CrewAI**: AI agent framework for intelligent analysis
- **Groq**: High-performance AI inference platform
- **LangChain**: AI/LLM application framework
- **BeautifulSoup4**: Web scraping for news and data
- **DuckDuckGo Search**: Web search integration

### Development Tools
- **PostCSS & Autoprefixer**: CSS processing and optimization
- **ESLint**: Code quality and consistency
- **Gunicorn**: Production WSGI server

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (3.8 or higher)
- **Git**

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd financial-analyst
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend development server**
   ```bash
   npm start
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended)**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp env_example.txt .env
   # Edit .env with your API keys
   ```

5. **Start the backend server**
   ```bash
   python app.py
   # Or for production: gunicorn app:app
   ```

### Environment Variables

Create a `.env` file in the backend directory with:
```env
GROQ_API_KEY=your_groq_api_key_here
# Add other API keys as needed
```

## 🎯 Core Features Deep Dive

### Portfolio Management System
- **Portfolio Input**: Easy portfolio creation with stock symbols and weights
- **Performance Tracking**: Real-time portfolio value and performance metrics
- **Risk Analysis**: Portfolio risk assessment and diversification analysis
- **AI Optimization**: Intelligent portfolio optimization suggestions

### AI Analysis Engine
- **CrewAI Integration**: Multi-agent AI system for comprehensive analysis
- **News Sentiment**: Real-time news sentiment analysis for stocks
- **Market Intelligence**: AI-powered market trend analysis
- **Investment Insights**: Personalized investment recommendations

### Stock Comparison Tool
- **Multi-Stock Analysis**: Compare up to 3 stocks simultaneously
- **Interactive Charts**: Real-time price charts with multiple timeframes
- **Comprehensive Metrics**: P/E ratios, market cap, volume, technical indicators
- **Smart Search**: Company name, symbol, or sector-based search

### News & Market Intelligence
- **Real-time News**: Latest financial news and market updates
- **Sentiment Scoring**: AI-powered sentiment analysis
- **Market Impact**: Analysis of news impact on stock performance
- **Custom Alerts**: Personalized news monitoring

## 📁 Project Structure

```
financial-analyst/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration settings
│   ├── routes/
│   │   ├── ai_routes.py       # AI analysis endpoints
│   │   ├── news_routes.py     # News and sentiment endpoints
│   │   ├── portfolio_routes.py # Portfolio management endpoints
│   │   └── __init__.py
│   ├── utils/
│   │   ├── ai_agents.py       # AI agent implementations
│   │   ├── news_ai.py         # News analysis utilities
│   │   └── __init__.py
│   ├── requirements.txt       # Python dependencies
│   ├── env_example.txt        # Environment variables template
│   └── run.py                 # Application entry point
├── src/
│   ├── components/
│   │   ├── Dashboard.js       # Main dashboard component
│   │   ├── PortfolioInput.js  # Portfolio creation interface
│   │   ├── StockComparison.js # Stock comparison tool
│   │   ├── StockChart.js      # Interactive charts
│   │   ├── CompanyDropdown.js # Stock search dropdown
│   │   ├── AIAnalysisResults.js # AI analysis display
│   │   ├── Navbar.js          # Navigation component
│   │   ├── Hero.js            # Landing page hero
│   │   ├── Features.js        # Features showcase
│   │   ├── Stats.js           # Statistics display
│   │   ├── About.js           # About page
│   │   ├── SessionStatus.js   # Session management
│   │   └── ui/                # Reusable UI components
│   ├── services/
│   │   ├── aiAnalysisService.js      # AI analysis API calls
│   │   ├── aiRecommendationService.js # AI recommendations
│   │   ├── portfolioService.js       # Portfolio management
│   │   ├── portfolioPerformanceService.js # Performance tracking
│   │   ├── yfinanceService.js        # Stock data service
│   │   ├── stockDataStorage.js       # Data caching
│   │   └── sessionStorage.js         # Session management
│   ├── config/
│   │   └── api.js             # API configuration
│   ├── App.js                 # Main application component
│   ├── index.js               # Application entry point
│   └── index.css              # Global styles
├── public/
│   ├── index.html             # HTML template
│   └── logos/                 # Application logos
├── package.json               # Frontend dependencies
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
└── README.md                  # This file
```

## 🚀 Deployment

### Frontend Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

3. **Deploy to Netlify**
   - Build the project: `npm run build`
   - Drag the `build` folder to Netlify
   - Or connect your GitHub repository

### Backend Deployment

1. **Using Gunicorn**
   ```bash
   cd backend
   gunicorn app:app -w 4 -b 0.0.0.0:5000
   ```

2. **Using Docker** (if Dockerfile is available)
   ```bash
   docker build -t financial-analyst-backend .
   docker run -p 5000:5000 financial-analyst-backend
   ```

## 🔧 Configuration

### Tailwind CSS Customization
Edit `tailwind.config.js` to customize:
- Color schemes
- Font families
- Animation durations
- Responsive breakpoints

### API Configuration
Update `src/config/api.js` to configure:
- Backend API endpoints
- Request timeouts
- Error handling

### Environment Variables
Configure backend environment variables in `.env`:
- API keys for AI services
- Database connections
- Logging levels

## 🧪 Testing

### Frontend Testing
```bash
npm test
```

### Backend Testing
```bash
cd backend
python -m pytest
```

## 📊 API Endpoints

### Portfolio Management
- `POST /api/portfolio/create` - Create new portfolio
- `GET /api/portfolio/analyze` - Analyze portfolio performance
- `POST /api/portfolio/optimize` - AI portfolio optimization

### Stock Analysis
- `GET /api/stocks/info` - Get stock information
- `GET /api/stocks/compare` - Compare multiple stocks
- `GET /api/stocks/chart` - Get chart data

### AI Analysis
- `POST /api/ai/analyze` - AI stock analysis
- `GET /api/ai/recommendations` - Investment recommendations
- `POST /api/ai/news-sentiment` - News sentiment analysis

### News & Market Data
- `GET /api/news/latest` - Latest financial news
- `GET /api/news/sentiment` - News sentiment analysis
- `GET /api/market/trends` - Market trend analysis

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the project documentation
- **Issues**: Create an issue in the repository
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the development team


## 🎉 Acknowledgments

- **Yahoo Finance** for real-time market data
- **CrewAI** for AI agent framework
- **Groq** for high-performance AI inference
- **React Team** for the amazing frontend framework
- **Flask Team** for the Python web framework

---

**Built with ❤️ using React, Flask, and AI technologies**

*Empowering investors with intelligent financial analysis and portfolio management tools.* 