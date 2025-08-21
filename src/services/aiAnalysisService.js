/**
 * AI Analysis Service for connecting to the agentic AI backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class AIAnalysisService {
    /**
     * Analyze multiple stocks using the agentic AI framework
     * @param {Array} stocks - Array of stock data objects
     * @returns {Promise} - AI analysis results
     */
    async analyzeStocks(stocks) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/analyze-stocks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stocks }),
            });

            if (!response.ok) {
                throw new Error(`AI Analysis failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error in AI analysis:', error);
            throw error;
        }
    }

    /**
     * Analyze a single stock using the agentic AI framework
     * @param {Object} stock - Stock data object
     * @returns {Promise} - AI analysis results
     */
    async analyzeSingleStock(stock) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/analyze-single-stock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(stock),
            });

            if (!response.ok) {
                throw new Error(`AI Analysis failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error in single stock AI analysis:', error);
            throw error;
        }
    }

    /**
     * Check AI service health
     * @returns {Promise} - Health status
     */
    async checkHealth() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/health`);
            
            if (!response.ok) {
                throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error checking AI service health:', error);
            throw error;
        }
    }

    /**
     * Get cache statistics
     * @returns {Promise} - Cache statistics
     */
    async getCacheStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/cache-stats`);
            
            if (!response.ok) {
                throw new Error(`Cache stats failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting cache stats:', error);
            throw error;
        }
    }

    /**
     * Clear AI analysis cache
     * @returns {Promise} - Clear cache result
     */
    async clearCache() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/clear-cache`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Clear cache failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error clearing cache:', error);
            throw error;
        }
    }

    /**
     * Get list of debug files
     * @returns {Promise} - Debug files list
     */
    async getDebugFiles() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/debug-files`);
            
            if (!response.ok) {
                throw new Error(`Debug files failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting debug files:', error);
            throw error;
        }
    }

    /**
     * Get content of a specific debug file
     * @param {string} filename - Name of the debug file
     * @returns {Promise} - File content
     */
    async getDebugFileContent(filename) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/debug-files/${filename}`);
            
            if (!response.ok) {
                throw new Error(`Debug file content failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting debug file content:', error);
            throw error;
        }
    }

    /**
     * Format stock data for AI analysis
     * @param {Array} stockData - Raw stock data from yfinance
     * @returns {Array} - Formatted stock data for AI analysis
     */
    formatStockDataForAnalysis(stockData) {
        return stockData.map(stock => ({
            symbol: stock.symbol,
            price: stock.price,
            changePercent: stock.changePercent,
            volume: stock.volume,
            marketCap: stock.marketCap,
            pe: stock.pe,
            beta: stock.beta,
            fiftyTwoWeekHigh: stock.fiftyTwoWeekHigh,
            fiftyTwoWeekLow: stock.fiftyTwoWeekLow,
            sector: stock.sector,
            industry: stock.industry,
            dividendYield: stock.dividendYield,
            open: stock.open,
            high: stock.high,
            low: stock.low,
            previousClose: stock.previousClose
        }));
    }

    /**
     * Get formatted analysis for display
     * @param {Object} analysisResult - Raw AI analysis result
     * @returns {Object} - Formatted analysis for UI display
     */
    formatAnalysisForDisplay(analysisResult) {
        return {
            summary: analysisResult.summary || 'Analysis completed',
            marketAnalysis: analysisResult.market_analysis || analysisResult.full_analysis || 'Market analysis available',
            technicalAnalysis: analysisResult.technical_analysis || 'Technical analysis completed',
            riskAssessment: analysisResult.risk_assessment || 'Risk assessment completed',
            recommendations: analysisResult.recommendations || 'Recommendations generated',
            stocksAnalyzed: analysisResult.stocks_analyzed || [],
            timestamp: analysisResult.timestamp || new Date().toISOString(),
            aiModel: analysisResult.ai_model || 'Groq Llama3-8B',
            confidenceScore: analysisResult.confidence_score || 0.8,
            requestId: analysisResult.request_id || null,
            analysisType: analysisResult.analysis_type || 'agentic_ai'
        };
    }
}

// Create singleton instance
const aiAnalysisService = new AIAnalysisService();

export default aiAnalysisService; 