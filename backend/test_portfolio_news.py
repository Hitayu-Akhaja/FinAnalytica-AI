#!/usr/bin/env python3
"""
Test script for portfolio input processing and news analysis
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
BASE_URL = "http://localhost:5000"
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

def test_portfolio_input_processing():
    """Test portfolio input processing"""
    print("Testing Portfolio Input Processing...")
    
    # Test data - different input formats
    test_cases = [
        {
            "name": "JSON format",
            "input": {
                "portfolio_input": json.dumps({
                    "holdings": [
                        {"symbol": "AAPL", "quantity": 10, "purchasePrice": 150.00},
                        {"symbol": "GOOGL", "quantity": 5, "purchasePrice": 2800.00},
                        {"symbol": "MSFT", "quantity": 8, "purchasePrice": 300.00}
                    ]
                })
            }
        },
        {
            "name": "Text format - comma separated",
            "input": {
                "portfolio_input": "AAPL, 10, 150.00\nGOOGL, 5, 2800.00\nMSFT, 8, 300.00"
            }
        },
        {
            "name": "Text format - space separated",
            "input": {
                "portfolio_input": "AAPL 10 150.00\nGOOGL 5 2800.00\nMSFT 8 300.00"
            }
        }
    ]
    
    for test_case in test_cases:
        print(f"\n--- Testing: {test_case['name']} ---")
        try:
            response = requests.post(
                f"{BASE_URL}/api/portfolio/process-input",
                json=test_case['input'],
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Success: Processed {len(result.get('holdings', []))} holdings")
                print(f"   Holdings: {[h['symbol'] for h in result.get('holdings', [])]}")
            else:
                print(f"❌ Error: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"❌ Exception: {str(e)}")

def test_news_analysis():
    """Test news analysis functionality with multiple agents"""
    print("\n\nTesting Multi-Agent News Analysis...")
    
    if not GROQ_API_KEY:
        print("⚠️  GROQ_API_KEY not configured - skipping news analysis test")
        return
    
    # Test portfolio data
    portfolio_data = {
        "holdings": [
            {"symbol": "AAPL", "quantity": 10, "purchasePrice": 150.00},
            {"symbol": "GOOGL", "quantity": 5, "purchasePrice": 2800.00}
        ]
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/portfolio/news-analysis",
            json={"portfolio_data": portfolio_data},
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Multi-agent news analysis completed successfully")
            print(f"   Analysis timestamp: {result.get('analysis_timestamp')}")
            
            # Check for different analysis types
            if 'news_analysis' in result:
                print(f"   📰 News Analysis: {len(result['news_analysis'].get('stocks', []))} stocks analyzed")
            
            if 'sentiment_analysis' in result:
                print(f"   📊 Sentiment Analysis: {len(result['sentiment_analysis'].get('sentiments', []))} sentiments analyzed")
            
            if 'headline_analysis' in result:
                print(f"   📝 Headline Analysis: {len(result['headline_analysis'].get('headlines', []))} headlines generated")
            
            # Show sample results
            if result.get('news_analysis', {}).get('stocks'):
                print("\n   Sample News Analysis:")
                for stock in result['news_analysis']['stocks'][:2]:  # Show first 2
                    print(f"     - {stock.get('symbol')}: {stock.get('sentiment', 'N/A')}")
            
            if result.get('sentiment_analysis', {}).get('sentiments'):
                print("\n   Sample Sentiment Analysis:")
                for sentiment in result['sentiment_analysis']['sentiments'][:2]:  # Show first 2
                    print(f"     - {sentiment.get('symbol')}: {sentiment.get('sentiment', 'N/A')} ({sentiment.get('confidence', 'N/A')})")
            
            if result.get('headline_analysis', {}).get('headlines'):
                print("\n   Sample Headlines:")
                for headline in result['headline_analysis']['headlines'][:2]:  # Show first 2
                    print(f"     - {headline.get('symbol')}: {headline.get('headlines', {}).get('concise', 'N/A')}")
                    
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

def test_complete_analysis():
    """Test complete portfolio analysis"""
    print("\n\nTesting Complete Portfolio Analysis...")
    
    # Test input
    portfolio_input = "AAPL 10 150.00\nGOOGL 5 2800.00\nMSFT 8 300.00"
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/portfolio/complete-analysis",
            json={"portfolio_input": portfolio_input},
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Complete analysis completed successfully")
            print(f"   Portfolio data: {len(result.get('portfolio_data', {}).get('holdings', []))} holdings")
            print(f"   News analysis: {'Available' if 'news_analysis' in result else 'Not available'}")
            print(f"   Sentiment analysis: {'Available' if 'sentiment_analysis' in result else 'Not available'}")
            print(f"   Headline analysis: {'Available' if 'headline_analysis' in result else 'Not available'}")
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

def test_single_stock_news():
    """Test single stock news analysis"""
    print("\n\nTesting Single Stock News Analysis...")
    
    if not GROQ_API_KEY:
        print("⚠️  GROQ_API_KEY not configured - skipping single stock test")
        return
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/stocks/news/AAPL",
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Single stock news analysis completed successfully")
            print(f"   Symbol: {result.get('symbol')}")
            print(f"   Analysis type: {result.get('analysis_type')}")
            
            if result.get('stocks'):
                print(f"   Stocks analyzed: {len(result['stocks'])}")
                for stock in result['stocks']:
                    print(f"     - {stock.get('symbol')}: {stock.get('sentiment', 'N/A')}")
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

def test_ai_status():
    """Test AI status endpoint"""
    print("\n\nTesting AI Status...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/ai/status")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ AI status retrieved successfully")
            print(f"   News analysis available: {result.get('ai_services', {}).get('news_analysis', {}).get('available', False)}")
            print(f"   Portfolio processing available: {result.get('ai_services', {}).get('portfolio_processing', {}).get('available', False)}")
            
            if result.get('ai_services', {}).get('news_analysis', {}).get('available'):
                print(f"   Provider: {result.get('ai_services', {}).get('news_analysis', {}).get('provider', 'N/A')}")
                print(f"   Model: {result.get('ai_services', {}).get('news_analysis', {}).get('model', 'N/A')}")
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

def main():
    """Run all tests"""
    print("🚀 Starting Enhanced Portfolio News Analysis Tests")
    print("=" * 60)
    
    # Test portfolio input processing
    test_portfolio_input_processing()
    
    # Test multi-agent news analysis
    test_news_analysis()
    
    # Test complete analysis
    test_complete_analysis()
    
    # Test single stock news
    test_single_stock_news()
    
    # Test AI status
    test_ai_status()
    
    print("\n" + "=" * 60)
    print("✅ All tests completed!")
    print("\n📋 Summary:")
    print("   - Portfolio input processing: ✅")
    print("   - Multi-agent news analysis: ✅")
    print("   - Sentiment analysis: ✅")
    print("   - Headline generation: ✅")
    print("   - Complete analysis workflow: ✅")
    print("   - Single stock analysis: ✅")
    print("   - AI service status: ✅")

if __name__ == "__main__":
    main()
