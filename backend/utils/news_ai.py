"""
News Analysis AI Module using CrewAI Framework
"""

import os
from crewai import Agent, Task, Crew, Process
from crewai.llm import LLM
from typing import List, Dict, Any
import logging
from datetime import datetime
import json

logger = logging.getLogger(__name__)

class NewsAnalysisAgent:
    def __init__(self, groq_api_key: str = None):
        """Initialize the News Analysis Agent with Groq API"""
        # Use the provided API key or get from environment variable
        if groq_api_key:
            self.groq_api_key = groq_api_key
        else:
            self.groq_api_key = os.getenv('GROQ_API_KEY_NEWS')
            
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY_NEWS environment variable is required for news analysis")
        
        # Set environment variables to force Groq usage and avoid OpenAI
        os.environ['GROQ_API_KEY'] = self.groq_api_key
        os.environ['OPENAI_API_KEY'] = ''  # Clear OpenAI key to prevent fallback

        # Configure CrewAI LLM to Groq (no unsupported provider field)
        self.llm = LLM(
            model='groq/llama-3.3-70b-versatile',
            temperature=0.7
        )
        
    def create_news_agent(self) -> Agent:
        """Create the news analysis agent using CrewAI"""
        return Agent(
            role='Financial News Analyst',
            goal='Analyze and gather relevant financial news for given stock symbols',
            backstory="""You are an expert financial news analyst with years of experience 
            in analyzing market trends, company performance, and financial news. You have 
            a deep understanding of how news affects stock prices and market sentiment. 
            You can access current financial news and provide comprehensive analysis.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
    
    def create_sentiment_analysis_agent(self) -> Agent:
        """Create the sentiment analysis agent using CrewAI"""
        return Agent(
            role='Market Sentiment Analyst',
            goal='Analyze news sentiment and determine if it is bearish, bullish, or neutral for stock prices',
            backstory="""You are a specialized market sentiment analyst with deep expertise 
            in interpreting financial news and determining its impact on stock prices. You 
            understand market psychology and can accurately classify news sentiment. You 
            have access to current market data and can provide real-time sentiment analysis.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
    
    def create_headline_agent(self) -> Agent:
        """Create the headline generation agent using CrewAI"""
        return Agent(
            role='Financial Headline Writer',
            goal='Create compelling and accurate headlines from financial news content',
            backstory="""You are an expert financial journalist and headline writer with 
            years of experience in creating engaging, accurate, and informative headlines 
            for financial news. You understand what makes headlines compelling while 
            maintaining journalistic integrity. You can create headlines that capture 
            the essence of financial news and market movements.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
    
    def create_news_analysis_task(self, symbols: List[str]) -> Task:
        """Create a task for analyzing news for multiple stocks using CrewAI"""
        return Task(
            description=f"""
            Analyze financial news for the following stock symbols: {', '.join(symbols)}
            
            For each stock symbol, you should:
            1. Research and analyze recent financial news and market events
            2. Analyze the sentiment and potential impact on stock prices
            3. Identify key events, earnings, or market-moving news
            4. Provide a comprehensive analysis based on current market conditions
            
            IMPORTANT: Focus on providing realistic and current analysis based on your knowledge.
            If you don't have recent specific news, provide analysis based on general market trends
            and typical factors that affect these stocks.
            
            Return the results in a structured JSON format with the following structure:
            {{
                "analysis_timestamp": "ISO timestamp",
                "stocks": [
                    {{
                        "symbol": "STOCK_SYMBOL",
                        "news_summary": "Brief summary of key news and market position",
                        "sentiment": "positive/negative/neutral",
                        "key_events": ["event1", "event2"],
                        "potential_impact": "description of potential price impact",
                        "risk_factors": ["risk1", "risk2"],
                        "recommendation": "brief recommendation based on analysis"
                    }}
                ]
            }}
            """,
            agent=self.create_news_agent(),
            expected_output="JSON formatted news analysis for all provided stock symbols"
        )
    
    def create_sentiment_analysis_task(self, news_data: Dict[str, Any]) -> Task:
        """Create a task for sentiment analysis of news data using CrewAI"""
        return Task(
            description=f"""
            Analyze the sentiment of the provided news data and classify each stock as BEARISH, BULLISH, or NEUTRAL.
            
            News Data: {json.dumps(news_data, indent=2)}
            
            For each stock in the news data:
            1. Analyze the news content and sentiment
            2. Classify as BEARISH, BULLISH, or NEUTRAL
            3. Provide confidence level and reasoning
            4. Identify key factors influencing the sentiment
            
            Return the results in this exact JSON format:
            {{
                "sentiment_analysis_timestamp": "ISO timestamp",
                "sentiments": [
                    {{
                        "symbol": "STOCK_SYMBOL",
                        "sentiment": "BEARISH/BULLISH/NEUTRAL",
                        "confidence": "HIGH/MEDIUM/LOW",
                        "reasoning": "Detailed explanation",
                        "key_factors": ["factor1", "factor2"],
                        "price_impact": "Expected price impact"
                    }}
                ]
            }}
            """,
            agent=self.create_sentiment_analysis_agent(),
            expected_output="JSON formatted sentiment analysis for all stocks"
        )
    
    def create_headline_generation_task(self, news_data: Dict[str, Any]) -> Task:
        """Create a task for generating headlines from news data using CrewAI"""
        return Task(
            description=f"""
            Generate compelling headlines from the provided news data for each stock.
            
            News Data: {json.dumps(news_data, indent=2)}
            
            For each stock in the news data:
            1. Create a concise, factual headline (max 60 characters)
            2. Create an engaging, attention-grabbing headline (max 80 characters)
            3. Create a detailed, informative headline (max 100 characters)
            4. Provide a brief summary and keywords
            
            Return the results in this exact JSON format:
            {{
                "headlines_timestamp": "ISO timestamp",
                "headlines": [
                    {{
                        "symbol": "STOCK_SYMBOL",
                        "headlines": {{
                            "concise": "Short factual headline",
                            "engaging": "Attention-grabbing headline",
                            "detailed": "Comprehensive headline"
                        }},
                        "summary": "Brief summary",
                        "keywords": ["keyword1", "keyword2"]
                    }}
                ]
            }}
            """,
            agent=self.create_headline_agent(),
            expected_output="JSON formatted headlines for all stocks"
        )
    
    def analyze_portfolio_news(self, portfolio_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze news for all stocks in the portfolio using CrewAI"""
        try:
            # Extract stock symbols from portfolio data
            symbols = []
            if 'holdings' in portfolio_data:
                symbols = [holding['symbol'] for holding in portfolio_data['holdings']]
            elif 'stocks' in portfolio_data:
                symbols = portfolio_data['stocks']
            else:
                raise ValueError("Portfolio data must contain 'holdings' or 'stocks'")
            
            if not symbols:
                return {"error": "No stock symbols found in portfolio data"}
            
            # Create the crew for news analysis
            news_crew = Crew(
                agents=[self.create_news_agent()],
                tasks=[self.create_news_analysis_task(symbols)],
                verbose=True,
                process=Process.sequential
            )
            
            # Execute the news analysis
            news_result = news_crew.kickoff()
            
            # Parse the news result
            news_analysis = self._parse_crew_result(news_result)
            
            if 'error' in news_analysis:
                return news_analysis
            
            # Create sentiment analysis crew
            sentiment_crew = Crew(
                agents=[self.create_sentiment_analysis_agent()],
                tasks=[self.create_sentiment_analysis_task(news_analysis)],
                verbose=True,
                process=Process.sequential
            )
            
            # Execute sentiment analysis
            sentiment_result = sentiment_crew.kickoff()
            sentiment_analysis = self._parse_crew_result(sentiment_result)
            
            # Create headline generation crew
            headline_crew = Crew(
                agents=[self.create_headline_agent()],
                tasks=[self.create_headline_generation_task(news_analysis)],
                verbose=True,
                process=Process.sequential
            )
            
            # Execute headline generation
            headline_result = headline_crew.kickoff()
            headline_analysis = self._parse_crew_result(headline_result)
            
            # Combine all results
            combined_result = {
                "analysis_timestamp": datetime.now().isoformat(),
                "news_analysis": news_analysis,
                "sentiment_analysis": sentiment_analysis,
                "headline_analysis": headline_analysis
            }
            
            return combined_result
                
        except Exception as e:
            logger.error(f"Error in portfolio news analysis: {str(e)}")
            return {
                "error": f"Failed to analyze portfolio news: {str(e)}",
                "analysis_timestamp": datetime.now().isoformat()
            }
    
    def _parse_crew_result(self, result) -> Dict[str, Any]:
        """Parse crew result and extract JSON"""
        try:
            # Handle CrewOutput objects
            if hasattr(result, 'raw') and hasattr(result, 'result'):
                result_str = str(result.result)
            elif hasattr(result, 'result'):
                result_str = str(result.result)
            else:
                result_str = str(result)
            
            # Try to extract JSON from the result string
            start_idx = result_str.find('{')
            end_idx = result_str.rfind('}') + 1
            if start_idx != -1 and end_idx != 0:
                json_str = result_str[start_idx:end_idx]
                parsed_result = json.loads(json_str)
            else:
                # If no JSON found, create a structured response
                parsed_result = {
                    "raw_analysis": result_str
                }
            
            return parsed_result
            
        except json.JSONDecodeError as e:
            logger.warning(f"Could not parse JSON from result: {str(e)}")
            # Return structured response with raw result
            return {
                "raw_analysis": str(result),
                "parse_error": str(e)
            }
        except Exception as e:
            logger.error(f"Error parsing crew result: {str(e)}")
            return {
                "raw_analysis": str(result),
                "parse_error": str(e)
            }

def process_portfolio_input(portfolio_input: str) -> Dict[str, Any]:
    """Process portfolio input and return structured JSON"""
    try:
        # Handle different input formats
        if isinstance(portfolio_input, str):
            # Try to parse as JSON first
            try:
                data = json.loads(portfolio_input)
                return data
            except json.JSONDecodeError:
                # Parse as text input
                return parse_text_portfolio_input(portfolio_input)
        elif isinstance(portfolio_input, dict):
            return portfolio_input
        else:
            raise ValueError("Portfolio input must be string or dictionary")
            
    except Exception as e:
        logger.error(f"Error processing portfolio input: {str(e)}")
        return {"error": f"Failed to process portfolio input: {str(e)}"}

def parse_text_portfolio_input(text_input: str) -> Dict[str, Any]:
    """Parse text-based portfolio input into structured format"""
    try:
        lines = text_input.strip().split('\n')
        holdings = []
        
        for line in lines:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
                
            # Try to parse different formats
            # Format: SYMBOL QTY PRICE
            # Format: SYMBOL, QTY, PRICE
            # Format: SYMBOL - QTY @ PRICE
            
            parts = None
            
            # Try comma-separated
            if ',' in line:
                parts = [p.strip() for p in line.split(',')]
            # Try space-separated
            elif ' ' in line:
                parts = line.split()
            # Try dash-separated
            elif ' - ' in line:
                parts = line.split(' - ')
                if len(parts) == 2 and '@' in parts[1]:
                    qty_price = parts[1].split('@')
                    parts = [parts[0]] + qty_price
            
            if parts and len(parts) >= 3:
                try:
                    symbol = parts[0].upper().strip()
                    quantity = float(parts[1].replace(',', ''))
                    purchase_price = float(parts[2].replace('$', '').replace(',', ''))
                    
                    holdings.append({
                        'symbol': symbol,
                        'quantity': quantity,
                        'purchasePrice': purchase_price
                    })
                except (ValueError, IndexError):
                    logger.warning(f"Could not parse line: {line}")
                    continue
        
        return {
            'holdings': holdings,
            'input_format': 'text_parsed',
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error parsing text portfolio input: {str(e)}")
        return {
            'error': f"Failed to parse text input: {str(e)}",
            'holdings': [],
            'timestamp': datetime.now().isoformat()
        }
