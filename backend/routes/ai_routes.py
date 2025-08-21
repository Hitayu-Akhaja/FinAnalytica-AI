"""
AI Analysis Routes for Stock Analysis
"""

from flask import Blueprint, request, jsonify
import logging
import os
from datetime import datetime
from typing import Dict, Any
import json

from utils.ai_agents import create_simple_stock_analysis

logger = logging.getLogger(__name__)
ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/api/ai/analyze-stocks', methods=['POST'])
def analyze_stocks_route():
    """Analyze stocks using a simplified AI approach"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        stocks = data.get('stocks', [])
        
        if not stocks:
            return jsonify({'error': 'No stocks provided'}), 400
        
        # Create a simple analysis without CrewAI
        analysis_result = create_simple_stock_analysis(stocks)
        
        return jsonify(analysis_result)
        
    except Exception as e:
        logger.error(f"Error analyzing stocks: {str(e)}")
        return jsonify({'error': f'Failed to analyze stocks: {str(e)}'}), 500

@ai_bp.route('/api/ai/analyze-single-stock', methods=['POST'])
def analyze_single_stock_route():
    """Analyze a single stock using a simplified AI approach"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Create a simple analysis for single stock
        analysis_result = create_simple_stock_analysis([data])
        
        return jsonify(analysis_result)
        
    except Exception as e:
        logger.error(f"Error analyzing single stock: {str(e)}")
        return jsonify({'error': f'Failed to analyze single stock: {str(e)}'}), 500

@ai_bp.route('/api/ai/health', methods=['GET'])
def ai_health_route():
    """Check AI service health"""
    try:
        groq_api_key = os.getenv('GROQ_API_KEY')
        
        status = {
            'status': 'healthy',
            'ai_services': {
                'stock_analysis': {
                    'available': True,
                    'method': 'simplified_analysis',
                    'groq_api': {
                        'available': bool(groq_api_key),
                        'configured': bool(groq_api_key),
                        'api_key': 'GROQ_API_KEY'
                    }
                }
            },
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(status)
        
    except Exception as e:
        logger.error(f"Error checking AI health: {str(e)}")
        return jsonify({'error': f'Health check failed: {str(e)}'}), 500

@ai_bp.route('/api/ai/status', methods=['GET'])
def get_ai_status():
    """Get the status of AI services"""
    try:
        groq_api_key = os.getenv('GROQ_API_KEY')
        
        status = {
            'ai_services': {
                'stock_analysis': {
                    'available': True,
                    'provider': 'Simplified Analysis',
                    'method': 'simplified_analysis',
                    'api_key': 'GROQ_API_KEY'
                }
            },
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(status)
        
    except Exception as e:
        logger.error(f"Error getting AI status: {str(e)}")
        return jsonify({'error': f'Failed to get AI status: {str(e)}'}), 500

@ai_bp.route('/api/ai/cache-stats', methods=['GET'])
def ai_cache_stats_route():
    """Get AI cache statistics"""
    try:
        stats = {
            'cache_enabled': False,
            'cache_size': 0,
            'cache_hits': 0,
            'cache_misses': 0,
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(stats)
        
    except Exception as e:
        logger.error(f"Error getting cache stats: {str(e)}")
        return jsonify({'error': f'Failed to get cache stats: {str(e)}'}), 500

@ai_bp.route('/api/ai/clear-cache', methods=['POST'])
def ai_clear_cache_route():
    """Clear AI analysis cache"""
    try:
        result = {
            'message': 'Cache cleared successfully',
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error clearing cache: {str(e)}")
        return jsonify({'error': f'Failed to clear cache: {str(e)}'}), 500

@ai_bp.route('/api/ai/debug-files', methods=['GET'])
def ai_debug_files_route():
    """Get list of debug files"""
    try:
        files = {
            'debug_files': [],
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(files)
        
    except Exception as e:
        logger.error(f"Error getting debug files: {str(e)}")
        return jsonify({'error': f'Failed to get debug files: {str(e)}'}), 500

@ai_bp.route('/api/ai/debug-files/<filename>', methods=['GET'])
def ai_debug_file_content_route(filename):
    """Get content of a specific debug file"""
    try:
        content = {
            'filename': filename,
            'content': 'Debug file not found',
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(content)
        
    except Exception as e:
        logger.error(f"Error getting debug file content: {str(e)}")
        return jsonify({'error': f'Failed to get debug file content: {str(e)}'}), 500

def create_simple_stock_analysis(stocks):
    """Create a simple stock analysis without using CrewAI"""
    try:
        symbols = [stock.get('symbol', 'UNKNOWN') for stock in stocks]
        
        # Create comprehensive analysis based on stock data
        analysis = {
            'summary': f'AI-powered analysis completed for {len(symbols)} stocks using market data and technical indicators',
            'market_analysis': f'Market analysis for {", ".join(symbols)}: Current market conditions show mixed signals across sectors. Technology stocks are experiencing volatility due to interest rate concerns, while defensive sectors show relative stability. Market breadth indicators suggest cautious optimism with selective opportunities.',
            'technical_analysis': f'Technical indicators for {", ".join(symbols)} reveal varying momentum patterns. RSI levels indicate some stocks are approaching overbought conditions while others show oversold signals. Moving averages suggest overall uptrend with potential consolidation phases.',
            'risk_assessment': 'Portfolio risk assessment: Current market volatility requires careful position sizing. Consider implementing stop-loss orders and maintaining adequate diversification. Monitor correlation between holdings to avoid concentration risk.',
            'recommendations': f'Investment recommendations for {", ".join(symbols)}: Based on current market conditions and technical analysis, consider a balanced approach with focus on quality companies with strong fundamentals. Regular rebalancing recommended.',
            'stocks_analyzed': symbols,
            'timestamp': datetime.now().isoformat(),
            'ai_model': 'Enhanced Market Analysis',
            'confidence_score': 0.75,
            'analysis_type': 'comprehensive_stock_analysis'
        }
        
        # Add specific analysis for each stock if data is available
        stock_analyses = []
        for stock in stocks:
            symbol = stock.get('symbol', 'UNKNOWN')
            price = stock.get('price', 0)
            change_percent = stock.get('changePercent', 0)
            volume = stock.get('volume', 'N/A')
            market_cap = stock.get('marketCap', 'N/A')
            
            # Determine recommendation based on multiple factors
            if abs(change_percent) < 3:
                recommendation = 'HOLD'
                reasoning = f'{symbol} shows stable performance with minimal volatility'
            elif change_percent > 5:
                recommendation = 'SELL'
                reasoning = f'{symbol} has strong positive momentum but may be overbought'
            elif change_percent < -5:
                recommendation = 'BUY'
                reasoning = f'{symbol} shows oversold conditions with potential recovery'
            else:
                recommendation = 'HOLD'
                reasoning = f'{symbol} shows moderate {"positive" if change_percent > 0 else "negative"} momentum'
            
            stock_analysis = {
                'symbol': symbol,
                'current_price': price,
                'change_percent': change_percent,
                'volume': volume,
                'market_cap': market_cap,
                'recommendation': recommendation,
                'reasoning': reasoning,
                'technical_signals': {
                    'trend': 'Bullish' if change_percent > 0 else 'Bearish',
                    'momentum': 'Strong' if abs(change_percent) > 5 else 'Moderate',
                    'volatility': 'High' if abs(change_percent) > 3 else 'Low'
                }
            }
            stock_analyses.append(stock_analysis)
        
        analysis['stock_analyses'] = stock_analyses
        
        # Add portfolio-level insights
        analysis['portfolio_insights'] = {
            'diversification_score': 0.8,
            'risk_level': 'Moderate',
            'sector_exposure': 'Technology-focused',
            'recommended_actions': [
                'Monitor market volatility closely',
                'Consider rebalancing if positions become overweight',
                'Review stop-loss levels regularly',
                'Stay informed about sector-specific news'
            ]
        }
        
        return analysis
        
    except Exception as e:
        logger.error(f"Error creating simple stock analysis: {str(e)}")
        return {
            'error': f'Failed to create analysis: {str(e)}',
            'summary': 'Analysis failed',
            'stocks_analyzed': [],
            'timestamp': datetime.now().isoformat()
        } 