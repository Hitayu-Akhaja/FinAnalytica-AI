import { API_CONFIG, validateAPIKeys } from '../config/api';

// Validate API keys
validateAPIKeys();

// Agentic Framework - Specialized Agents
class PortfolioAnalysisAgents {
  constructor() {
    this.agents = {
      marketAnalyst: {
        name: "Market Analyst",
        role: "Analyze market conditions, sector trends, and macroeconomic factors",
        temperature: 0.3
      },
      riskManager: {
        name: "Risk Manager", 
        role: "Assess portfolio risk, diversification, and volatility",
        temperature: 0.2
      },
      technicalAnalyst: {
        name: "Technical Analyst",
        role: "Analyze price patterns, technical indicators, and momentum",
        temperature: 0.4
      },
      fundamentalAnalyst: {
        name: "Fundamental Analyst",
        role: "Evaluate company fundamentals, financial health, and growth prospects",
        temperature: 0.3
      },
      portfolioOptimizer: {
        name: "Portfolio Optimizer",
        role: "Provide specific buy/sell/hold recommendations and portfolio rebalancing advice",
        temperature: 0.2
      }
    };
  }

  async analyzeWithAgent(agentKey, data, context) {
    const agent = this.agents[agentKey];
    
    try {
      // Make request to backend AI API
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/ai/analyze-stocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stocks: data.stocks || [data], // Handle both single stock and portfolio data
          agent: agentKey,
          context: context
        })
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Error with ${agent.name}:`, error);
      return { error: `Failed to get analysis from ${agent.name}` };
    }
  }

  buildAgentPrompt(agent, data, context) {
    const basePrompt = `
Analyze the following portfolio data and provide insights as ${agent.name}:

PORTFOLIO DATA:
${JSON.stringify(data, null, 2)}

CONTEXT:
${JSON.stringify(context, null, 2)}

Provide your analysis in the following JSON format:
{
  "analysis": "Detailed analysis of the portfolio from your perspective",
  "key_findings": ["finding1", "finding2", "finding3"],
  "risk_factors": ["risk1", "risk2", "risk3"],
  "opportunities": ["opportunity1", "opportunity2"],
  "recommendations": [
    {
      "type": "buy|sell|hold",
      "symbol": "STOCK_SYMBOL",
      "reasoning": "Detailed reasoning",
      "priority": "high|medium|low",
      "confidence": 0.85
    }
  ]
}
`;

    // Agent-specific prompts
    const agentPrompts = {
      marketAnalyst: `
Focus on:
- Current market conditions and trends
- Sector performance analysis
- Macroeconomic factors affecting the portfolio
- Market volatility and trends
`,
      riskManager: `
Focus on:
- Portfolio diversification assessment
- Risk metrics analysis (beta, volatility, VaR)
- Concentration risk evaluation
- Correlation analysis between holdings
`,
      technicalAnalyst: `
Focus on:
- Price trend analysis for each holding
- Technical indicators (RSI, MACD, moving averages)
- Support and resistance levels
- Momentum and volume analysis
`,
      fundamentalAnalyst: `
Focus on:
- Company financial health and ratios
- Growth prospects and competitive position
- Valuation metrics (P/E, P/B, etc.)
- Industry position and market share
`,
      portfolioOptimizer: `
Focus on:
- Specific buy/sell/hold recommendations
- Portfolio rebalancing suggestions
- Position sizing recommendations
- Risk-adjusted return optimization
`
    };

    return basePrompt + (agentPrompts[agent.name] || '');
  }

  async generateComprehensiveRecommendations(portfolioData) {
    const context = {
      timestamp: new Date().toISOString(),
      marketConditions: "bull_market", // This could be dynamic
      userPreferences: portfolioData.userPreferences || {}
    };

    try {
      // Use the backend AI API for comprehensive analysis
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/ai/analyze-stocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stocks: portfolioData.stocks || portfolioData.holdings || [],
          context: context
        })
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const analysisResult = await response.json();
      
      // Transform backend response to match expected format
      const combinedAnalysis = this.transformBackendResponse(analysisResult, portfolioData);
      
      return combinedAnalysis;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return {
        recommendations: [],
        analysis: "Unable to generate recommendations at this time.",
        error: error.message
      };
    }
  }

  transformBackendResponse(backendResult, portfolioData) {
    // Transform the backend CrewAI response to match the expected frontend format
    return {
      recommendations: this.extractRecommendations(backendResult),
      analysis: backendResult.market_analysis || backendResult.summary || 'AI analysis completed',
      technicalAnalysis: backendResult.technical_analysis || 'Technical analysis completed',
      riskAssessment: backendResult.risk_assessment || 'Risk assessment completed',
      portfolioAllocation: backendResult.portfolio_allocation || 'Portfolio allocation recommendations provided',
      investmentTimeline: backendResult.investment_timeline || 'Investment timeline recommendations provided',
      keyFactors: backendResult.key_factors || 'Key factors to monitor provided',
      alternativeInvestments: backendResult.alternative_investments || 'Alternative investment considerations provided',
      expectedReturns: backendResult.expected_returns || 'Expected return scenarios provided',
      keyFindings: this.extractKeyFindings(backendResult),
      riskFactors: this.extractRiskFactors(backendResult),
      opportunities: this.extractOpportunities(backendResult),
      generatedAt: backendResult.timestamp || new Date().toISOString(),
      aiModel: backendResult.ai_model || 'Groq Llama3-8B',
      confidenceScore: backendResult.confidence_score || 0.85,
      stocksAnalyzed: backendResult.stocks_analyzed || []
    };
  }

  extractRecommendations(backendResult) {
    const recommendations = [];
    
    // Extract from recommendations section
    if (backendResult.recommendations) {
      const recText = backendResult.recommendations;
      // Parse recommendations text to extract structured data
      // This is a simplified parser - you might want to improve this
      const lines = recText.split('\n');
      let currentRec = null;
      
      for (const line of lines) {
        if (line.includes('BUY') || line.includes('SELL') || line.includes('HOLD')) {
          if (currentRec) {
            recommendations.push(currentRec);
          }
          currentRec = {
            type: line.includes('BUY') ? 'buy' : line.includes('SELL') ? 'sell' : 'hold',
            symbol: this.extractSymbol(line),
            reasoning: line,
            priority: 'medium',
            confidence: 0.8
          };
        } else if (currentRec && line.trim()) {
          currentRec.reasoning += ' ' + line.trim();
        }
      }
      
      if (currentRec) {
        recommendations.push(currentRec);
      }
    }
    
    return recommendations.length > 0 ? recommendations : [
      {
        type: 'hold',
        symbol: 'GENERAL',
        reasoning: 'Consider consulting with a financial advisor for personalized recommendations',
        priority: 'medium',
        confidence: 0.7
      }
    ];
  }

  extractSymbol(text) {
    // Simple symbol extraction - look for common stock symbols
    const symbolMatch = text.match(/\b[A-Z]{1,5}\b/);
    return symbolMatch ? symbolMatch[0] : 'UNKNOWN';
  }

  extractKeyFindings(backendResult) {
    const findings = [];
    
    // Extract key findings from various sections
    if (backendResult.market_analysis) {
      findings.push('Market analysis completed');
    }
    if (backendResult.technical_analysis) {
      findings.push('Technical analysis completed');
    }
    if (backendResult.risk_assessment) {
      findings.push('Risk assessment completed');
    }
    
    return findings.length > 0 ? findings : ['AI analysis completed successfully'];
  }

  extractRiskFactors(backendResult) {
    const risks = [];
    
    if (backendResult.risk_assessment) {
      risks.push('Market volatility risk');
      risks.push('Sector concentration risk');
    }
    
    return risks.length > 0 ? risks : ['General market risks apply'];
  }

  extractOpportunities(backendResult) {
    const opportunities = [];
    
    if (backendResult.market_analysis) {
      opportunities.push('Market analysis opportunities identified');
    }
    if (backendResult.technical_analysis) {
      opportunities.push('Technical analysis opportunities identified');
    }
    
    return opportunities.length > 0 ? opportunities : ['Consider diversifying portfolio'];
  }

  synthesizeRecommendations(agentResults, portfolioData) {
    // This method is now handled by the backend
    // Return a basic structure for compatibility
    return {
      recommendations: [],
      analysis: "Analysis completed by backend AI agents",
      keyFindings: ["AI analysis completed"],
      riskFactors: ["General market risks"],
      opportunities: ["Diversification opportunities"],
      generatedAt: new Date().toISOString(),
      agentCount: 3
    };
  }

  aggregateRecommendations(recommendations, portfolioData) {
    // This method is now handled by the backend
    return recommendations;
  }
}

// Main service class
class AIRecommendationService {
  constructor() {
    this.agents = new PortfolioAnalysisAgents();
  }

  async generateRecommendations(portfolioData) {
    try {
      console.log('Generating AI recommendations with backend API...');
      
      const recommendations = await this.agents.generateComprehensiveRecommendations(portfolioData);
      
      console.log('AI recommendations generated successfully:', recommendations);
      
      return recommendations;
    } catch (error) {
      console.error('Error in AI recommendation service:', error);
      throw new Error('Failed to generate AI recommendations');
    }
  }

  async getRealTimeMarketAnalysis(symbols) {
    try {
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/ai/analyze-stocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stocks: symbols.map(symbol => ({ symbol, price: 0, changePercent: 0 })),
        analysisType: 'market_conditions'
        })
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting market analysis:', error);
      return { error: 'Unable to get market analysis' };
    }
  }
}

// Export singleton instance
const aiRecommendationService = new AIRecommendationService();
export default aiRecommendationService;
