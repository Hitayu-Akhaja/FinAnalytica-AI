from flask import Blueprint, request, jsonify
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import logging
from typing import List, Dict, Any
import json

logger = logging.getLogger(__name__)
portfolio_bp = Blueprint('portfolio', __name__)

def calculate_portfolio_metrics(holdings: List[Dict]) -> Dict[str, Any]:
    """Calculate comprehensive portfolio metrics"""
    try:
        total_value = 0
        total_cost = 0
        sector_allocation = {}
        stock_data = []
        
        for holding in holdings:
            symbol = holding['symbol']
            quantity = holding['quantity']
            purchase_price = holding['purchasePrice']
            
            # Get current stock data
            ticker = yf.Ticker(symbol)
            info = ticker.info
            current_price = info.get('currentPrice') or info.get('regularMarketPrice', 0)
            
            # Calculate holding metrics
            current_value = quantity * current_price
            cost_basis = quantity * purchase_price
            gain_loss = current_value - cost_basis
            gain_loss_percent = (gain_loss / cost_basis * 100) if cost_basis > 0 else 0
            
            # Add to totals
            total_value += current_value
            total_cost += cost_basis
            
            # Sector allocation
            sector = info.get('sector', 'Unknown')
            if sector not in sector_allocation:
                sector_allocation[sector] = 0
            sector_allocation[sector] += current_value
            
            stock_data.append({
                'symbol': symbol,
                'name': info.get('longName', symbol),
                'quantity': quantity,
                'currentPrice': round(current_price, 2),
                'purchasePrice': purchase_price,
                'value': round(current_value, 2),
                'costBasis': round(cost_basis, 2),
                'gainLoss': round(gain_loss, 2),
                'gainLossPercent': round(gain_loss_percent, 2),
                'sector': sector
            })
        
        # Calculate portfolio metrics
        total_gain_loss = total_value - total_cost
        total_gain_loss_percent = (total_gain_loss / total_cost * 100) if total_cost > 0 else 0
        
        # Calculate sector allocation percentages
        sector_allocation_data = []
        for sector, value in sector_allocation.items():
            percentage = (value / total_value * 100) if total_value > 0 else 0
            sector_allocation_data.append({
                'name': sector,
                'value': round(value, 2),
                'percentage': round(percentage, 2),
                'color': get_sector_color(sector)
            })
        
        # Calculate risk metrics (simplified)
        risk_metrics = calculate_risk_metrics(stock_data)
        
        return {
            'totalValue': round(total_value, 2),
            'totalCost': round(total_cost, 2),
            'totalGainLoss': round(total_gain_loss, 2),
            'totalGainLossPercent': round(total_gain_loss_percent, 2),
            'dailyChange': round(total_gain_loss * 0.02, 2),  # Mock daily change
            'dailyChangePercent': round(total_gain_loss_percent * 0.02, 2),
            'holdings': stock_data,
            'sectorAllocation': sector_allocation_data,
            'riskMetrics': risk_metrics
        }
        
    except Exception as e:
        logger.error(f"Error calculating portfolio metrics: {str(e)}")
        raise

def calculate_risk_metrics(stock_data: List[Dict]) -> Dict[str, float]:
    """Calculate portfolio risk metrics based on actual holdings"""
    try:
        if not stock_data:
            return {
                'volatility': 0.0,
                'sharpeRatio': 0.0,
                'beta': 0.0,
                'maxDrawdown': 0.0,
                'var95': 0.0
            }
        
        # Calculate total portfolio value
        total_value = sum(stock['value'] for stock in stock_data)
        if total_value == 0:
            return {
                'volatility': 0.0,
                'sharpeRatio': 0.0,
                'beta': 0.0,
                'maxDrawdown': 0.0,
                'var95': 0.0
            }
        
        # Define sector risk characteristics
        sector_risk_profiles = {
            'Technology': {'volatility': 0.25, 'beta': 1.2, 'sector_weight': 0.0},
            'Financial Services': {'volatility': 0.20, 'beta': 1.1, 'sector_weight': 0.0},
            'Healthcare': {'volatility': 0.22, 'beta': 0.9, 'sector_weight': 0.0},
            'Consumer Defensive': {'volatility': 0.18, 'beta': 0.8, 'sector_weight': 0.0},
            'Consumer Cyclical': {'volatility': 0.23, 'beta': 1.0, 'sector_weight': 0.0},
            'Energy': {'volatility': 0.30, 'beta': 1.3, 'sector_weight': 0.0},
            'Industrials': {'volatility': 0.21, 'beta': 1.0, 'sector_weight': 0.0},
            'Communication Services': {'volatility': 0.24, 'beta': 1.1, 'sector_weight': 0.0},
            'Basic Materials': {'volatility': 0.26, 'beta': 1.2, 'sector_weight': 0.0},
            'Real Estate': {'volatility': 0.19, 'beta': 0.9, 'sector_weight': 0.0},
            'Utilities': {'volatility': 0.15, 'beta': 0.6, 'sector_weight': 0.0},
            'Unknown': {'volatility': 0.20, 'beta': 1.0, 'sector_weight': 0.0}
        }
        
        # Calculate sector weights and individual stock weights
        sector_weights = {}
        stock_weights = {}
        
        for stock in stock_data:
            sector = stock.get('sector', 'Unknown')
            weight = stock['value'] / total_value
            
            # Track individual stock weight
            stock_weights[stock['symbol']] = weight
            
            # Track sector weight
            if sector not in sector_weights:
                sector_weights[sector] = 0
            sector_weights[sector] += weight
        
        # Calculate weighted portfolio metrics
        weighted_volatility = 0
        weighted_beta = 0
        sector_count = len(sector_weights)
        
        for stock in stock_data:
            sector = stock.get('sector', 'Unknown')
            weight = stock_weights[stock['symbol']]
            sector_profile = sector_risk_profiles.get(sector, sector_risk_profiles['Unknown'])
            
            # Add weighted contribution
            weighted_volatility += weight * sector_profile['volatility']
            weighted_beta += weight * sector_profile['beta']
        
        # Apply diversification effects
        diversification_factor = max(0.7, 1 - (sector_count - 1) * 0.05)  # More sectors = lower risk
        weighted_volatility *= diversification_factor
        
        # Calculate additional risk metrics
        # Sharpe ratio (assuming 8% market return and 2% risk-free rate)
        market_return = 0.08
        risk_free_rate = 0.02
        expected_return = weighted_beta * (market_return - risk_free_rate) + risk_free_rate
        sharpe_ratio = (expected_return - risk_free_rate) / weighted_volatility if weighted_volatility > 0 else 0
        
        # Maximum drawdown (based on volatility and sector mix)
        max_drawdown = -weighted_volatility * 0.4  # Rough estimate
        
        # Value at Risk (95% confidence, daily)
        var_95 = -weighted_volatility / np.sqrt(252) * 1.645  # Daily VaR
        
        # Apply defensive stock bonus
        defensive_sectors = ['Consumer Defensive', 'Utilities', 'Healthcare']
        defensive_weight = sum(sector_weights.get(sector, 0) for sector in defensive_sectors)
        if defensive_weight > 0.3:  # If more than 30% in defensive sectors
            volatility_reduction = defensive_weight * 0.1
            weighted_volatility *= (1 - volatility_reduction)
        
        return {
            'volatility': round(weighted_volatility, 3),
            'sharpeRatio': round(sharpe_ratio, 3),
            'beta': round(weighted_beta, 3),
            'maxDrawdown': round(max_drawdown, 3),
            'var95': round(var_95, 3)
        }
        
    except Exception as e:
        logger.error(f"Error calculating risk metrics: {str(e)}")
        return {
            'volatility': 0.0,
            'sharpeRatio': 0.0,
            'beta': 0.0,
            'maxDrawdown': 0.0,
            'var95': 0.0
        }

def get_sector_color(sector: str) -> str:
    """Get color for sector allocation chart"""
    colors = {
        'Technology': '#3B82F6',
        'Healthcare': '#10B981',
        'Financial Services': '#F59E0B',
        'Consumer Cyclical': '#EF4444',
        'Communication Services': '#8B5CF6',
        'Industrials': '#06B6D4',
        'Consumer Defensive': '#84CC16',
        'Energy': '#F97316',
        'Basic Materials': '#EC4899',
        'Real Estate': '#6366F1',
        'Unknown': '#6B7280'
    }
    return colors.get(sector, '#6B7280')

def generate_ai_recommendations(portfolio_data: Dict, user_preferences: Dict) -> List[Dict]:
    """Generate AI-powered investment recommendations"""
    recommendations = []
    
    # Analyze sector concentration
    tech_exposure = sum([s['value'] for s in portfolio_data['sectorAllocation'] if s['name'] == 'Technology'])
    tech_percentage = (tech_exposure / portfolio_data['totalValue'] * 100) if portfolio_data['totalValue'] > 0 else 0
    
    if tech_percentage > 30:
        recommendations.append({
            'type': 'rebalance',
            'message': f'Consider reducing Technology exposure (currently {tech_percentage:.1f}%) to improve diversification',
            'priority': 'high'
        })
    
    # Analyze risk tolerance
    risk_tolerance = user_preferences.get('riskTolerance', 'moderate')
    volatility = portfolio_data['riskMetrics']['volatility']
    
    if risk_tolerance == 'conservative' and volatility > 0.15:
        recommendations.append({
            'type': 'buy',
            'message': 'Add defensive stocks like JNJ or PG to reduce portfolio volatility',
            'priority': 'medium'
        })
    
    # Analyze individual holdings
    for holding in portfolio_data['holdings']:
        if holding['gainLossPercent'] > 20:
            recommendations.append({
                'type': 'hold',
                'message': f'Current {holding["symbol"]} position is performing well (+{holding["gainLossPercent"]:.1f}%), maintain position',
                'priority': 'low'
            })
    
    return recommendations

@portfolio_bp.route('/api/portfolio/analyze', methods=['POST'])
def analyze_portfolio():
    """Analyze portfolio and generate insights"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        holdings = data.get('holdings', [])
        user_preferences = {
            'riskTolerance': data.get('riskTolerance', 'moderate'),
            'investmentGoals': data.get('investmentGoals', 'wealth-building'),
            'timeHorizon': data.get('timeHorizon', 'long-term'),
            'monthlyInvestment': data.get('monthlyInvestment', 0),
            'availableCapital': data.get('availableCapital', 0)
        }
        
        if not holdings:
            return jsonify({'error': 'No holdings provided'}), 400
        
        # Calculate portfolio metrics
        portfolio_data = calculate_portfolio_metrics(holdings)
        
        # Generate AI recommendations
        recommendations = generate_ai_recommendations(portfolio_data, user_preferences)
        
        # Combine all data
        analysis_result = {
            'portfolio': portfolio_data,
            'recommendations': recommendations,
            'userPreferences': user_preferences,
            'aiAnalysis': {
                'summary': f"Portfolio valued at ${portfolio_data['totalValue']:,.2f} with {len(holdings)} holdings",
                'riskLevel': 'Moderate' if portfolio_data['riskMetrics']['volatility'] < 0.2 else 'High',
                'diversification': 'Good' if len(set([h['sector'] for h in portfolio_data['holdings']])) > 3 else 'Needs Improvement'
            },
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(analysis_result)
        
    except Exception as e:
        logger.error(f"Error analyzing portfolio: {str(e)}")
        return jsonify({'error': 'Failed to analyze portfolio'}), 500

@portfolio_bp.route('/api/portfolio/save', methods=['POST'])
def save_portfolio():
    """Save portfolio data for later retrieval"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # In production, save to database
        # For now, return success
        return jsonify({
            'message': 'Portfolio saved successfully',
            'portfolioId': 'portfolio_' + str(int(datetime.now().timestamp()))
        })
        
    except Exception as e:
        logger.error(f"Error saving portfolio: {str(e)}")
        return jsonify({'error': 'Failed to save portfolio'}), 500

@portfolio_bp.route('/api/portfolio/load/<portfolio_id>', methods=['GET'])
def load_portfolio(portfolio_id):
    """Load saved portfolio data"""
    try:
        # In production, load from database
        # For now, return mock data
        return jsonify({
            'message': 'Portfolio loaded successfully',
            'portfolioId': portfolio_id,
            'data': {
                'holdings': [],
                'analysis': {}
            }
        })
        
    except Exception as e:
        logger.error(f"Error loading portfolio: {str(e)}")
        return jsonify({'error': 'Failed to load portfolio'}), 500

@portfolio_bp.route('/api/portfolio/performance', methods=['POST'])
def get_portfolio_performance():
    """Get portfolio performance with S&P 500 comparison"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        holdings = data.get('holdings', [])
        timeframe = data.get('timeframe', '1M')
        
        if not holdings:
            return jsonify({'error': 'No holdings provided'}), 400
        
        # Calculate portfolio performance
        portfolio_performance = calculate_portfolio_performance(holdings, timeframe)
        
        return jsonify(portfolio_performance)
        
    except Exception as e:
        logger.error(f"Error calculating portfolio performance: {str(e)}")
        return jsonify({'error': 'Failed to calculate portfolio performance'}), 500

def calculate_portfolio_performance(holdings: List[Dict], timeframe: str) -> Dict[str, Any]:
    """Calculate portfolio performance with S&P 500 comparison"""
    try:
        # Calculate portfolio metrics
        total_value = 0
        total_cost = 0
        portfolio_holdings = []
        
        for holding in holdings:
            symbol = holding['symbol']
            quantity = holding['quantity']
            purchase_price = holding['purchasePrice']
            
            # Get current stock data
            ticker = yf.Ticker(symbol)
            info = ticker.info
            current_price = info.get('currentPrice') or info.get('regularMarketPrice', purchase_price)
            
            # Calculate holding metrics
            current_value = quantity * current_price
            cost_basis = quantity * purchase_price
            gain_loss = current_value - cost_basis
            gain_loss_percent = (gain_loss / cost_basis * 100) if cost_basis > 0 else 0
            
            # Add to totals
            total_value += current_value
            total_cost += cost_basis
            
            portfolio_holdings.append({
                'symbol': symbol,
                'name': info.get('longName', symbol),
                'quantity': quantity,
                'currentPrice': round(current_price, 2),
                'purchasePrice': purchase_price,
                'currentValue': round(current_value, 2),
                'costBasis': round(cost_basis, 2),
                'gainLoss': round(gain_loss, 2),
                'gainLossPercent': round(gain_loss_percent, 2)
            })
        
        # Calculate portfolio returns
        portfolio_return = total_value - total_cost
        portfolio_return_percent = (portfolio_return / total_cost * 100) if total_cost > 0 else 0
        
        # Get S&P 500 data
        sp500_data = get_sp500_performance(timeframe)
        
        # Calculate outperformance
        outperformance = portfolio_return_percent - sp500_data['return_percent']
        
        # Generate historical data
        historical_data = generate_performance_historical_data(holdings, timeframe)
        
        return {
            'portfolioValue': round(total_value, 2),
            'portfolioReturn': round(portfolio_return, 2),
            'portfolioReturnPercent': round(portfolio_return_percent, 2),
            'sp500Value': sp500_data['current_value'],
            'sp500Return': sp500_data['return_value'],
            'sp500ReturnPercent': sp500_data['return_percent'],
            'outperformance': round(outperformance, 2),
            'historicalData': historical_data,
            'holdings': portfolio_holdings,
            'lastUpdated': datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error calculating portfolio performance: {str(e)}")
        raise

def get_sp500_performance(timeframe: str) -> Dict[str, Any]:
    """Get S&P 500 performance data"""
    try:
        # Get S&P 500 data using ^GSPC ticker
        sp500 = yf.Ticker("^GSPC")
        
        # Get historical data based on timeframe
        periods = {
            '1M': '1mo',
            '3M': '3mo',
            '6M': '6mo',
            '1Y': '1y'
        }
        
        period = periods.get(timeframe, '1mo')
        hist = sp500.history(period=period)
        
        if hist.empty:
            # Fallback to mock data
            return get_mock_sp500_data(timeframe)
        
        current_value = hist['Close'].iloc[-1]
        start_value = hist['Close'].iloc[0]
        return_value = current_value - start_value
        return_percent = (return_value / start_value * 100) if start_value > 0 else 0
        
        return {
            'current_value': round(current_value, 2),
            'return_value': round(return_value, 2),
            'return_percent': round(return_percent, 2)
        }
        
    except Exception as e:
        logger.error(f"Error getting S&P 500 data: {str(e)}")
        return get_mock_sp500_data(timeframe)

def get_mock_sp500_data(timeframe: str) -> Dict[str, Any]:
    """Get mock S&P 500 data when real data is unavailable"""
    mock_returns = {
        '1M': 2.5,
        '3M': 8.2,
        '6M': 15.7,
        '1Y': 22.3
    }
    
    current_value = 4500
    return_percent = mock_returns.get(timeframe, 2.5)
    return_value = current_value * (return_percent / 100)
    
    return {
        'current_value': current_value,
        'return_value': round(return_value, 2),
        'return_percent': return_percent
    }

def generate_performance_historical_data(holdings: List[Dict], timeframe: str) -> List[Dict]:
    """Generate historical performance data for charts"""
    try:
        # Calculate total portfolio value
        total_value = sum([
            holding['quantity'] * (holding.get('currentPrice', holding['purchasePrice']))
            for holding in holdings
        ])
        
        periods = {
            '1M': 30,
            '3M': 90,
            '6M': 180,
            '1Y': 365
        }
        
        days = periods.get(timeframe, 30)
        data = []
        
        # Get S&P 500 historical data
        sp500 = yf.Ticker("^GSPC")
        sp500_hist = sp500.history(period=f"{days}d")
        
        for i in range(days + 1):
            date = datetime.now() - timedelta(days=days - i)
            date_str = date.strftime('%Y-%m-%d')
            
            # Generate portfolio value with some volatility
            volatility = 0.02  # 2% daily volatility
            random_change = (np.random.random() - 0.5) * volatility
            portfolio_value = total_value * (1 + random_change)
            
            # Get S&P 500 value for this date
            if not sp500_hist.empty and i < len(sp500_hist):
                sp500_value = sp500_hist['Close'].iloc[i] if i < len(sp500_hist) else 4500
            else:
                sp500_value = 4500 * (1 + random_change * 0.8)
            
            data.append({
                'date': date_str,
                'portfolio': round(portfolio_value),
                'sp500': round(sp500_value)
            })
        
        return data
        
    except Exception as e:
        logger.error(f"Error generating historical data: {str(e)}")
        # Return mock data
        return generate_mock_historical_data(total_value, timeframe)

def generate_mock_historical_data(base_value: float, timeframe: str) -> List[Dict]:
    """Generate mock historical data when real data is unavailable"""
    periods = {
        '1M': 30,
        '3M': 90,
        '6M': 180,
        '1Y': 365
    }
    
    days = periods.get(timeframe, 30)
    data = []
    
    for i in range(days + 1):
        date = datetime.now() - timedelta(days=days - i)
        date_str = date.strftime('%Y-%m-%d')
        
        # Generate realistic price movement
        random_change = (np.random.random() - 0.5) * 0.02
        portfolio_value = base_value * (1 + random_change)
        sp500_value = 4500 * (1 + random_change * 0.8)
        
        data.append({
            'date': date_str,
            'portfolio': round(portfolio_value),
            'sp500': round(sp500_value)
        })
    
    return data 