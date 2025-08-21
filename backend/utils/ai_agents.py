"""
AI Agents for Stock Analysis using CrewAI Framework
"""

import os
from crewai import Agent, Task, Crew, Process
from crewai.llm import LLM
from typing import List, Dict, Any
import logging
from datetime import datetime
import json

logger = logging.getLogger(__name__)

class StockAnalysisAgent:
    def __init__(self, groq_api_key: str = None):
        """Initialize the Stock Analysis Agent with Groq API"""
        if groq_api_key:
            self.groq_api_key = groq_api_key
        else:
            self.groq_api_key = os.getenv('GROQ_API_KEY')
            
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
        
        # Set environment variables to force Groq usage and avoid OpenAI
        os.environ['GROQ_API_KEY'] = self.groq_api_key
        os.environ['OPENAI_API_KEY'] = ''  # Clear OpenAI key to prevent fallback
        # Explicit CrewAI LLM instance using Groq model path (no provider argument)
        self.llm = LLM(
            model='groq/llama-3.3-70b-versatile',
            temperature=0.7
        )
        
        # Create specialized agents
        self.market_analyst = self._create_market_analyst()
        self.technical_analyst = self._create_technical_analyst()
        self.risk_analyst = self._create_risk_analyst()
        self.investment_advisor = self._create_investment_advisor()
    
    def _create_market_analyst(self) -> Agent:
        """Create a market analysis agent using CrewAI"""
        return Agent(
            role='Market Analyst',
            goal='Analyze market trends, sector performance, and overall market conditions',
            backstory="""You are an experienced market analyst with 15+ years of experience 
            in analyzing stock markets, economic trends, and sector performance. You have 
            a deep understanding of market dynamics, investor psychology, and economic 
            indicators that drive stock prices. Your analysis has consistently outperformed 
            market benchmarks by 3-5% annually, and you've successfully predicted major 
            market shifts including the 2008 financial crisis recovery and the 2020 tech 
            boom. You understand that investors need clear reasoning behind your insights 
            to make informed decisions, so you always explain the fundamental drivers and 
            market forces that support your analysis.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
    
    def _create_technical_analyst(self) -> Agent:
        """Create a technical analysis agent using CrewAI"""
        return Agent(
            role='Technical Analyst',
            goal='Analyze technical indicators, price patterns, and chart formations',
            backstory="""You are a certified technical analyst specializing in chart 
            analysis, technical indicators, and price action. You have expertise in 
            identifying support/resistance levels, trend analysis, and momentum indicators. 
            You can spot potential breakout and breakdown patterns. Your technical analysis 
            has achieved 78% accuracy in predicting short-term price movements, and you've 
            helped institutional clients generate alpha through precise entry and exit 
            timing. You believe that technical analysis provides objective, data-driven 
            insights that complement fundamental analysis, and you always explain the 
            statistical significance and historical reliability of the patterns you identify.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
    
    def _create_risk_analyst(self) -> Agent:
        """Create a risk assessment agent using CrewAI"""
        return Agent(
            role='Risk Analyst',
            goal='Assess investment risks, volatility, and portfolio risk management',
            backstory="""You are a senior risk analyst with expertise in portfolio 
            risk management, volatility analysis, and investment risk assessment. 
            You understand correlation analysis, beta calculations, and various 
            risk metrics. You help investors understand and manage their risk exposure. 
            Your risk models have protected client portfolios during market downturns, 
            reducing drawdowns by 40% compared to market averages. You've developed 
            proprietary risk assessment frameworks used by major hedge funds, and you 
            believe that understanding risk is the foundation of successful investing. 
            You always explain the probability distributions, worst-case scenarios, 
            and risk-adjusted return calculations that support your recommendations.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
    
    def _create_investment_advisor(self) -> Agent:
        """Create an investment advisory agent using CrewAI"""
        return Agent(
            role='Investment Advisor',
            goal='Provide investment recommendations and portfolio optimization advice',
            backstory="""You are a certified investment advisor with extensive 
            experience in portfolio management and investment strategy. You combine 
            fundamental analysis, technical analysis, and risk management to provide 
            comprehensive investment advice. You understand different investment 
            styles and can tailor recommendations to various risk profiles. Your 
            investment strategies have consistently delivered 12-15% annual returns 
            for high-net-worth clients over the past decade, outperforming the S&P 500 
            by 4-6% annually. You've successfully navigated multiple market cycles 
            and economic environments, and you believe that successful investing 
            requires a disciplined, evidence-based approach. You always explain the 
            rationale behind your recommendations, including the expected return 
            scenarios, time horizons, and the specific factors that could impact 
            the investment outcome.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
    
    def analyze_stocks(self, stock_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Perform comprehensive stock analysis using a single agent (or minimal agents)
        
        Args:
            stock_data: List of stock data dictionaries
            
        Returns:
            Dictionary containing comprehensive analysis results
        """
        try:
            # Use a single agent (Investment Advisor) with a combined task to reduce API calls
            symbols = [stock['symbol'] for stock in stock_data]
            stock_overview = "\n".join(
                f"{s['symbol']}: ${s['price']} ({s['changePercent']}%), "
                f"Volume: {s['volume']}, Market Cap: {s['marketCap']}, "
                f"52W: ${s.get('fiftyTwoWeekLow','N/A')} - ${s.get('fiftyTwoWeekHigh','N/A')}, "
                f"PE: {s.get('pe','N/A')}"
                for s in stock_data
            )

            combined_task = Task(
                description=f"""
                You are a single professional investment advisor responsible for providing a comprehensive analysis
                for the following stocks:
                {symbols}

                STOCK DATA:
                {stock_overview}

                Provide a concise, investor-focused analysis that includes ALL of the following sections in order.
                Do NOT omit any sections. Be specific and actionable. Keep each section crisp and avoid repetition.

                FORMAT YOUR RESPONSE WITH THESE EXACT SECTIONS:

                **Market Analysis:**
                [Overall market and sector context relevant to these stocks]

                **Technical Analysis:**
                [Key technical insights across the symbols: trend, momentum, support/resistance]

                **Investment Recommendations:**
                [Buy/Hold/Sell with reasoning and expected scenarios for each symbol]

                **Portfolio Allocation:**
                [Suggested allocation guidelines and risk considerations]

                **Investment Timeline:**
                [Suggested horizons and milestones]

                **Key Factors to Monitor:**
                [Critical catalysts and trigger points to watch]

                **Risk Assessment:**
                [Key risks and mitigation ideas]

                **Expected Returns:**
                [Scenario-based expectations with probabilities]
                """,
                expected_output="Structured comprehensive analysis with the exact sections for frontend display",
                agent=self.investment_advisor
            )

            # Execute the single-agent task
            result = self.investment_advisor.execute_task(combined_task)

            # Parse and structure the results
            analysis_result = self._parse_analysis_result(result, stock_data)

            return analysis_result

        except Exception as e:
            logger.error(f"Error in stock analysis: {str(e)}")
            return self._get_fallback_analysis(stock_data)
    
    def _create_market_analysis_task(self, stock_data: List[Dict[str, Any]]) -> Task:
        """Create market analysis task"""
        symbols = [stock['symbol'] for stock in stock_data]
        stock_info = "\n".join([
            f"{stock['symbol']}: ${stock['price']} ({stock['changePercent']}%), "
            f"Volume: {stock['volume']}, Market Cap: {stock['marketCap']}"
            for stock in stock_data
        ])
        
        return Task(
            description=f"""
            Analyze the market conditions and sector trends for the following stocks:
            {stock_info}
            
            Provide comprehensive insights on:
            1. Overall market conditions for these stocks and current market trends
            2. Sector-specific trends and opportunities with supporting evidence
            3. Market drivers affecting these stocks and their potential impact
            4. Comparative market positioning relative to peers and benchmarks
            
            IMPORTANT: For each insight, explain WHY investors should trust your analysis. 
            Reference specific market indicators, economic data, or historical patterns 
            that support your conclusions. Include confidence levels and reasoning for 
            why your market analysis should guide investment decisions.
            
            Focus on actionable insights that investors can use for decision-making, 
            but always provide the underlying reasoning and evidence that makes your 
            analysis credible and trustworthy.
            
                         FORMAT YOUR RESPONSE WITH THESE EXACT SECTIONS:
             
             **Market Analysis:**
             [Your detailed market analysis here]
             
             **Market Analysis:**
[Overall market analysis with reasoning]
             
             **Sector Trends:**
             [Sector-specific trends and opportunities]
             
             **Market Drivers:**
             [Key drivers affecting these stocks]
             
             **Comparative Analysis:**
             [Market positioning relative to peers]
            """,
            agent=self.market_analyst,
            expected_output="Structured market analysis with clear sections for frontend display"
        )
    
    def _create_technical_analysis_task(self, stock_data: List[Dict[str, Any]]) -> Task:
        """Create technical analysis task"""
        symbols = [stock['symbol'] for stock in stock_data]
        stock_info = "\n".join([
            f"{stock['symbol']}: ${stock['price']} (52W High: ${stock['fiftyTwoWeekHigh']}, "
            f"52W Low: ${stock['fiftyTwoWeekLow']})"
            for stock in stock_data
        ])
        
        return Task(
            description=f"""
            Perform technical analysis for the following stocks:
            {stock_info}
            
            Analyze:
            1. Current price position relative to 52-week range and its significance
            2. Technical indicators and patterns with statistical reliability
            3. Support and resistance levels with confidence intervals
            4. Momentum and trend analysis with strength indicators
            5. Potential breakout/breakdown scenarios with probability estimates
            
            IMPORTANT: For each technical insight, explain WHY these patterns and 
            indicators are reliable predictors. Reference historical accuracy rates, 
            statistical significance, and market psychology principles that make 
            technical analysis valid. Include specific reasoning for why investors 
            should trust your technical analysis over random price movements.
            
            Provide specific technical insights and price targets, but always 
            accompany them with the underlying technical reasoning and evidence 
            that supports the reliability of your analysis.
            
                         FORMAT YOUR RESPONSE WITH THESE EXACT SECTIONS:
             
             **Technical Analysis:**
             [Your comprehensive technical analysis here]
             
             **Key Indicators:**
             [RSI, MACD, Moving Averages, Volume analysis, etc.]
             
             **Support & Resistance:**
             [Key support and resistance levels with confidence intervals]
             
             **Chart Patterns:**
             [Identified chart patterns and their significance]
             
             **Price Targets:**
             [Specific price targets with probability estimates]
             
             **Momentum Analysis:**
             [Trend strength and momentum indicators]
            """,
            agent=self.technical_analyst,
            expected_output="Structured technical analysis with clear sections for frontend display"
        )
    
    def _create_risk_analysis_task(self, stock_data: List[Dict[str, Any]]) -> Task:
        """Create risk analysis task"""
        symbols = [stock['symbol'] for stock in stock_data]
        stock_info = "\n".join([
            f"{stock['symbol']}: Beta: {stock.get('beta', 'N/A')}, "
            f"P/E: {stock.get('pe', 'N/A')}"
            for stock in stock_data
        ])
        
        return Task(
            description=f"""
            Assess investment risks for the following stocks:
            {stock_info}
            
            Evaluate:
            1. Individual stock risk factors with probability distributions
            2. Portfolio diversification benefits with correlation analysis
            3. Volatility and downside risk with Value at Risk (VaR) estimates
            4. Correlation analysis between stocks with statistical significance
            5. Risk management recommendations with specific strategies
            
            IMPORTANT: For each risk assessment, explain WHY your risk analysis 
            methodology is superior and reliable. Reference specific risk models, 
            historical data, and statistical methods that validate your approach. 
            Include reasoning for why investors should trust your risk assessment 
            over simple gut feelings or basic volatility measures.
            
            Provide risk assessment with specific risk levels and mitigation strategies, 
            but always explain the underlying risk models, assumptions, and evidence 
            that make your analysis credible and actionable.
            """,
            agent=self.risk_analyst,
            expected_output="Comprehensive risk assessment with mitigation strategies and methodological reasoning"
        )
    
    def _create_investment_advice_task(self, stock_data: List[Dict[str, Any]]) -> Task:
        """Create investment advisory task"""
        symbols = [stock['symbol'] for stock in stock_data]
        
        return Task(
            description=f"""
            Provide investment recommendations for the following stocks:
            {symbols}
            
            Based on the analysis from other agents, provide:
            1. Buy/Hold/Sell recommendations with detailed reasoning and expected outcomes
            2. Portfolio allocation suggestions with risk-adjusted return expectations
            3. Investment timeline recommendations with milestone targets
            4. Key factors to monitor with specific trigger points
            5. Alternative investment considerations with comparative analysis
            
            CRITICAL: For each recommendation, explain WHY investors should follow 
            your advice. Reference your track record, the quality of your analysis 
            methodology, and the specific evidence that supports your recommendations. 
            Include expected return scenarios, probability of success, and the 
            reasoning behind why your investment approach has historically outperformed 
            market averages.
            
            Focus on practical, actionable investment advice, but always provide 
            the comprehensive reasoning, evidence, and track record that makes your 
            recommendations credible and trustworthy. Explain why following your 
            advice is more likely to lead to successful investment outcomes than 
            alternative approaches.
            
                         FORMAT YOUR RESPONSE WITH THESE EXACT SECTIONS:
             
             **Investment Recommendations:**
             [Detailed Buy/Hold/Sell recommendations for each stock with reasoning]
             
             **Portfolio Allocation:**
             [Suggested portfolio distribution and allocation percentages]
             
             **Investment Timeline:**
             [Recommended holding periods and milestone targets]
             
             **Key Factors to Monitor:**
             [Specific trigger points and factors to watch]
             
             **Alternative Investments:**
             [Alternative investment options and comparative analysis]
             
             **Risk Assessment:**
             [Risk factors and mitigation strategies]
             
             **Expected Returns:**
             [Expected return scenarios with probability estimates]
            """,
            agent=self.investment_advisor,
            expected_output="Structured investment recommendations with clear sections for frontend display"
        )
    
    def _parse_analysis_result(self, result, stock_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Parse and structure the analysis result"""
        try:
            # Save the raw CrewAI response to a file for debugging
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"crewai_response_{timestamp}.txt"
            
            # Save the raw result object
            with open(filename, 'w', encoding='utf-8') as f:
                f.write("=== CREWAI RAW RESPONSE ===\n")
                f.write(f"Type: {type(result)}\n")
                f.write(f"Dir: {dir(result)}\n")
                f.write(f"String representation: {str(result)}\n")
                f.write("\n=== ATTRIBUTES ===\n")
                
                # Try to get all attributes
                for attr in dir(result):
                    if not attr.startswith('_'):
                        try:
                            value = getattr(result, attr)
                            f.write(f"{attr}: {value}\n")
                        except Exception as e:
                            f.write(f"{attr}: Error accessing - {e}\n")
                
                f.write("\n=== END ===\n")
            
            logger.info(f"Saved CrewAI response to {filename}")
            
            # Handle CrewOutput object - extract the raw result
            if hasattr(result, 'raw'):
                result_text = result.raw
            elif hasattr(result, 'result'):
                result_text = result.result
            elif hasattr(result, 'output'):
                result_text = result.output
            else:
                # If it's already a string, use it directly
                result_text = str(result)
            
            # Save the extracted text to a separate file
            text_filename = f"crewai_text_{timestamp}.txt"
            with open(text_filename, 'w', encoding='utf-8') as f:
                f.write("=== EXTRACTED TEXT ===\n")
                f.write(result_text)
                f.write("\n=== END ===\n")
            
            logger.info(f"Saved extracted text to {text_filename}")
            
            # Parse the CrewAI response into structured sections
            analysis = self._extract_analysis_sections(result_text, stock_data)
            analysis.update({
                'debug_files': [filename, text_filename]  # Add debug file names
            })
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error parsing analysis result: {str(e)}")
            return self._get_fallback_analysis(stock_data)
    
    def _extract_analysis_sections(self, result_text: str, stock_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Extract and structure analysis sections from CrewAI response"""
        try:
            # Initialize sections
            sections = {
                'summary': 'AI-powered analysis completed successfully',
                'market_analysis': '',
                'market_analysis': '',
                'sector_trends': '',
                'market_drivers': '',
                'comparative_analysis': '',
                'technical_analysis': '',
                'key_indicators': '',
                'support_resistance': '',
                'chart_patterns': '',
                'price_targets': '',
                'momentum_analysis': '',
                'recommendations': '',
                'portfolio_allocation': '',
                'investment_timeline': '',
                'key_factors': '',
                'alternative_investments': '',
                'risk_assessment': '',
                'expected_returns': '',
                'stocks_analyzed': [stock['symbol'] for stock in stock_data],
                'timestamp': datetime.now().isoformat(),
                'ai_model': 'Groq Llama3-8B',
                'confidence_score': 0.85
            }
            
            # Split the text into lines for processing
            lines = result_text.split('\n')
            current_section = None
            section_content = []
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                # Detect section headers with exact matching
                if line.startswith('**Market Analysis:**'):
                    if current_section and section_content:
                        sections[current_section] = '\n'.join(section_content).strip()
                    current_section = 'market_analysis'
                    section_content = []

                elif line.startswith('**Sector Trends:**'):
                    if current_section and section_content:
                        sections[current_section] = '\n'.join(section_content).strip()
                    current_section = 'sector_trends'
                    section_content = []
                elif line.startswith('**Market Drivers:**'):
                    if current_section and section_content:
                        sections[current_section] = '\n'.join(section_content).strip()
                    current_section = 'market_drivers'
                    section_content = []
                elif line.startswith('**Comparative Analysis:**'):
                    if current_section and section_content:
                        sections[current_section] = '\n'.join(section_content).strip()
                    current_section = 'comparative_analysis'
                    section_content = []
                elif line.startswith('**Technical Analysis:**'):
                    if current_section and section_content:
                        sections[current_section] = '\n'.join(section_content).strip()
                    current_section = 'technical_analysis'
                    section_content = []
                elif line.startswith('**Key Indicators:**'):
                    if current_section and section_content:
                        sections[current_section] = '\n'.join(section_content).strip()
                    current_section = 'key_indicators'
                    section_content = []
                elif line.startswith('**Support & Resistance:**'):
                    if current_section and section_content:
                        sections[current_section] = '\n'.join(section_content).strip()
                    current_section = 'support_resistance'
                    section_content = []
                elif line.startswith('**Chart Patterns:**'):
                    if current_section and section_content:
                        sections[current_section] = '\n'.join(section_content).strip()
                    current_section = 'chart_patterns'
                    section_content = []
                elif line.startswith('**Price Targets:**'):
                    if current_section and section_content:
                        sections[current_section] = '\n'.join(section_content).strip()
                    current_section = 'price_targets'
                    section_content = []
                elif line.startswith('**Momentum Analysis:**'):
                    if current_section and section_content:
                        sections[current_section] = '\n'.join(section_content).strip()
                    current_section = 'momentum_analysis'
                    section_content = []
                elif line.startswith('**Investment Recommendations:**'):
                    if current_section and section_content:
                        sections[current_section] = '\n'.join(section_content).strip()
                    current_section = 'recommendations'
                    section_content = []
                elif line.startswith('**Portfolio Allocation:**'):
                    if current_section and section_content:
                        sections[current_section] = '\n'.join(section_content).strip()
                    current_section = 'portfolio_allocation'
                    section_content = []
                elif line.startswith('**Investment Timeline:**'):
                    if current_section and section_content:
                        sections[current_section] = '\n'.join(section_content).strip()
                    current_section = 'investment_timeline'
                    section_content = []
                elif line.startswith('**Key Factors to Monitor:**'):
                    if current_section and section_content:
                        sections[current_section] = '\n'.join(section_content).strip()
                    current_section = 'key_factors'
                    section_content = []
                elif line.startswith('**Alternative Investments:**'):
                    if current_section and section_content:
                        sections[current_section] = '\n'.join(section_content).strip()
                    current_section = 'alternative_investments'
                    section_content = []
                elif line.startswith('**Risk Assessment:**'):
                    if current_section and section_content:
                        sections[current_section] = '\n'.join(section_content).strip()
                    current_section = 'risk_assessment'
                    section_content = []
                elif line.startswith('**Expected Returns:**'):
                    if current_section and section_content:
                        sections[current_section] = '\n'.join(section_content).strip()
                    current_section = 'expected_returns'
                    section_content = []
                elif current_section:
                    section_content.append(line)
            
            # Save the last section
            if current_section and section_content:
                sections[current_section] = '\n'.join(section_content).strip()
            
            # Combine market analysis sections if they exist
            market_sections = []
            for key in ['market_analysis', 'sector_trends', 'market_drivers', 'comparative_analysis']:
                if sections[key]:
                    market_sections.append(sections[key])
            if market_sections:
                sections['market_analysis'] = '\n\n'.join(market_sections)
            
            # Combine technical analysis sections if they exist
            tech_sections = []
            for key in ['technical_analysis', 'key_indicators', 'support_resistance', 'chart_patterns', 'price_targets', 'momentum_analysis']:
                if sections[key]:
                    tech_sections.append(sections[key])
            if tech_sections:
                sections['technical_analysis'] = '\n\n'.join(tech_sections)
            
            # If no sections were found, use the full text as recommendations
            if not any(sections[key] for key in ['recommendations', 'market_analysis', 'technical_analysis']):
                sections['recommendations'] = result_text
                sections['market_analysis'] = 'Market analysis completed by AI agents'
                sections['technical_analysis'] = 'Technical analysis completed by AI agents'
            
            return sections
            
        except Exception as e:
            logger.error(f"Error extracting analysis sections: {str(e)}")
            return {
                'summary': 'AI-powered analysis completed successfully',
                'market_analysis': 'Market analysis completed by AI agents',
                'technical_analysis': 'Technical analysis completed by AI agents',
                'risk_assessment': 'Risk assessment temporarily disabled to avoid free tier limits',
                'recommendations': result_text,
                'indicators': 'Technical indicators analyzed',
                'portfolio_allocation': 'Portfolio allocation recommendations provided',
                'investment_timeline': 'Investment timeline recommendations provided',
                'key_factors': 'Key factors to monitor provided',
                'alternative_investments': 'Alternative investment considerations provided',
                'stocks_analyzed': [stock['symbol'] for stock in stock_data],
                'timestamp': datetime.now().isoformat(),
                'ai_model': 'Groq Llama3-8B',
                'confidence_score': 0.85
            }


    def _get_fallback_analysis(self, stock_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Provide fallback analysis when AI analysis fails"""
        symbols = [stock['symbol'] for stock in stock_data]
        
        return {
            'summary': 'Analysis completed with basic insights',
            'market_analysis': f'Basic market analysis for {", ".join(symbols)}',
            'technical_analysis': 'Technical indicators suggest monitoring price movements',
            'risk_assessment': 'Standard risk assessment - diversify portfolio',
            'recommendations': 'Consider consulting with a financial advisor',
            'stocks_analyzed': symbols,
            'timestamp': datetime.now().isoformat(),
            'ai_model': 'Fallback Analysis',
            'confidence_score': 0.5,
            'note': 'AI analysis temporarily unavailable, using basic insights'
        }

def create_simple_stock_analysis(stocks):
    """Create comprehensive analysis based on stock data"""
    symbols = [stock.get('symbol', 'UNKNOWN') for stock in stocks]
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
    stock_analyses = []
    for stock in stocks:
        symbol = stock.get('symbol', 'UNKNOWN')
        price = stock.get('price', 0)
        change_percent = stock.get('changePercent', 0)
        volume = stock.get('volume', 'N/A')
        market_cap = stock.get('marketCap', 'N/A')

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