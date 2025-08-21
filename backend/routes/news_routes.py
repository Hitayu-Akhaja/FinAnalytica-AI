"""
News Analysis Routes using CrewAI Framework
"""

from flask import Blueprint, request, jsonify
import logging
import os
from datetime import datetime
from typing import Dict, Any
import json

from utils.news_ai import NewsAnalysisAgent, process_portfolio_input

logger = logging.getLogger(__name__)
news_bp = Blueprint('news', __name__)

# Initialize the news analysis agent
def get_news_agent():
    """Get or create the news analysis agent"""
    groq_api_key = os.getenv('GROQ_API_KEY_NEWS')
    if not groq_api_key:
        logger.error("GROQ_API_KEY_NEWS not configured")
        return None
    
    return NewsAnalysisAgent(groq_api_key)

@news_bp.route('/api/portfolio/process-input', methods=['POST'])
def process_portfolio_input_route():
    """Process portfolio input and return structured JSON"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Get portfolio input from request
        portfolio_input = data.get('portfolio_input', '')
        
        if not portfolio_input:
            return jsonify({'error': 'Portfolio input is required'}), 400
        
        # Process the input
        result = process_portfolio_input(portfolio_input)
        
        if 'error' in result:
            return jsonify(result), 400
        
        # Add metadata
        result['processed_at'] = datetime.now().isoformat()
        result['input_type'] = 'portfolio_input'
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error processing portfolio input: {str(e)}")
        return jsonify({'error': f'Failed to process portfolio input: {str(e)}'}), 500

@news_bp.route('/api/portfolio/news-analysis', methods=['POST'])
def analyze_portfolio_news_route():
    """Analyze news for stocks in the portfolio using CrewAI and Groq"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Get portfolio data from request
        portfolio_data = data.get('portfolio_data', {})
        
        if not portfolio_data:
            return jsonify({'error': 'Portfolio data is required'}), 400
        
        # Get the news analysis agent
        news_agent = get_news_agent()
        if not news_agent:
            return jsonify({'error': 'News analysis service not available - GROQ_API_KEY_NEWS not configured'}), 503
        
        # Analyze news for the portfolio
        analysis_result = news_agent.analyze_portfolio_news(portfolio_data)
        
        if 'error' in analysis_result:
            return jsonify(analysis_result), 400
        
        # Add metadata
        analysis_result['request_timestamp'] = datetime.now().isoformat()
        analysis_result['analysis_type'] = 'portfolio_news'
        
        return jsonify(analysis_result)
        
    except Exception as e:
        logger.error(f"Error analyzing portfolio news: {str(e)}")
        return jsonify({'error': f'Failed to analyze portfolio news: {str(e)}'}), 500

@news_bp.route('/api/stocks/news/<symbol>', methods=['GET'])
def get_stock_news_route(symbol):
    """Get news analysis for a specific stock symbol"""
    try:
        if not symbol:
            return jsonify({'error': 'Stock symbol is required'}), 400
        
        # Get the news analysis agent
        news_agent = get_news_agent()
        if not news_agent:
            return jsonify({'error': 'News analysis service not available - GROQ_API_KEY_NEWS not configured'}), 503
        
        # Create portfolio data with single stock
        portfolio_data = {
            'stocks': [symbol.upper()]
        }
        
        # Analyze news for the single stock
        analysis_result = news_agent.analyze_portfolio_news(portfolio_data)
        
        if 'error' in analysis_result:
            return jsonify(analysis_result), 400
        
        # Add metadata
        analysis_result['request_timestamp'] = datetime.now().isoformat()
        analysis_result['analysis_type'] = 'single_stock_news'
        analysis_result['symbol'] = symbol.upper()
        
        return jsonify(analysis_result)
        
    except Exception as e:
        logger.error(f"Error getting stock news for {symbol}: {str(e)}")
        return jsonify({'error': f'Failed to get stock news: {str(e)}'}), 500

@news_bp.route('/api/portfolio/complete-analysis', methods=['POST'])
def complete_portfolio_analysis_route():
    """Complete portfolio analysis including input processing and news analysis"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Get portfolio input from request
        portfolio_input = data.get('portfolio_input', '')
        
        if not portfolio_input:
            return jsonify({'error': 'Portfolio input is required'}), 400
        
        # Step 1: Process portfolio input
        processed_data = process_portfolio_input(portfolio_input)
        
        if 'error' in processed_data:
            return jsonify(processed_data), 400
        
        # Step 2: Analyze news for the portfolio
        news_agent = get_news_agent()
        news_analysis = None
        
        if news_agent:
            news_analysis = news_agent.analyze_portfolio_news(processed_data)
        else:
            news_analysis = {
                'error': 'News analysis not available - GROQ_API_KEY_NEWS not configured',
                'analysis_timestamp': datetime.now().isoformat()
            }
        
        # Combine results
        complete_analysis = {
            'portfolio_data': processed_data,
            'news_analysis': news_analysis,
            'analysis_timestamp': datetime.now().isoformat(),
            'analysis_type': 'complete_portfolio_analysis'
        }
        
        return jsonify(complete_analysis)
        
    except Exception as e:
        logger.error(f"Error in complete portfolio analysis: {str(e)}")
        return jsonify({'error': f'Failed to complete portfolio analysis: {str(e)}'}), 500

@news_bp.route('/api/news/status', methods=['GET'])
def get_news_status():
    """Get the status of news analysis services"""
    try:
        groq_api_key_news = os.getenv('GROQ_API_KEY_NEWS')
        
        status = {
            'news_services': {
                'news_analysis': {
                    'available': bool(groq_api_key_news),
                    'provider': 'Groq API',
                    'model': 'llama-3.3-70b-versatile',
                    'api_key': 'GROQ_API_KEY_NEWS'
                },
                'portfolio_processing': {
                    'available': True,
                    'features': ['JSON parsing', 'Text parsing', 'Multiple formats']
                }
            },
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(status)
        
    except Exception as e:
        logger.error(f"Error getting news status: {str(e)}")
        return jsonify({'error': f'Failed to get news status: {str(e)}'}), 500

@news_bp.route('/api/news/health', methods=['GET'])
def news_health_route():
    """Check news analysis service health"""
    try:
        groq_api_key_news = os.getenv('GROQ_API_KEY_NEWS')
        
        status = {
            'status': 'healthy',
            'news_services': {
                'news_analysis': {
                    'available': bool(groq_api_key_news),
                    'method': 'crewai_analysis',
                    'groq_api': {
                        'available': bool(groq_api_key_news),
                        'configured': bool(groq_api_key_news),
                        'api_key': 'GROQ_API_KEY_NEWS'
                    }
                },
                'portfolio_processing': {
                    'available': True,
                    'features': ['JSON parsing', 'Text parsing', 'Multiple formats']
                }
            },
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(status)
        
    except Exception as e:
        logger.error(f"Error checking news health: {str(e)}")
        return jsonify({'error': f'Health check failed: {str(e)}'}), 500
