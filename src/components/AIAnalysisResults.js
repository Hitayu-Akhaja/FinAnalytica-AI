import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, TrendingUp, TrendingDown, Minus, FileText, BarChart3, Headphones, Megaphone } from './ui/icons';
import { API_CONFIG } from '../config/api';

const AIAnalysisResults = ({ portfolioData, onAnalysisComplete }) => {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (portfolioData && portfolioData.holdings && portfolioData.holdings.length > 0) {
      performAnalysis();
    }
  }, [portfolioData]);

  const performAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/api/portfolio/news-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ portfolio_data: portfolioData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const results = await response.json();
      setAnalysisResults(results);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(results);
      }
    } catch (err) {
      console.error('Error performing AI analysis:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toUpperCase()) {
      case 'BULLISH':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'BEARISH':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'NEUTRAL':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toUpperCase()) {
      case 'BULLISH':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'BEARISH':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'NEUTRAL':
        return <Minus className="w-4 h-4 text-white" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          AI Analysis in Progress...
        </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-300">
              Analyzing news, sentiment, and generating headlines for your portfolio...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-primary-400">AI Analysis Error</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to perform AI analysis: {error}
            </AlertDescription>
          </Alert>
          <Button onClick={performAnalysis} className="mt-4">
            Retry Analysis
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!analysisResults) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-primary-400">AI Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">
            No analysis results available. Add stocks to your portfolio to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-primary-400">
              <BarChart3 className="w-5 h-5" />
              AI Analysis Results
            </CardTitle>
            <p className="text-sm text-gray-300">
              Last updated: {formatTimestamp(analysisResults.analysis_timestamp)}
            </p>
          </div>
          <Button 
            onClick={performAnalysis} 
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            size="sm"
          >
            Refresh Analysis
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="headlines" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="headlines" className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              Headlines
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              News Analysis
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Sentiment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="space-y-4">
            {analysisResults.news_analysis?.stocks?.map((stock, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-primary-400">{stock.symbol}</CardTitle>
                    <Badge variant={stock.sentiment === 'positive' ? 'default' : 'secondary'}>
                      {stock.sentiment}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2 text-white">News Summary</h4>
                                         <p className="text-sm text-gray-300">{stock.news_summary}</p>
                  </div>
                  
                  {stock.key_events && stock.key_events.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-white">Key Events</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {stock.key_events.map((event, idx) => (
                          <li key={idx} className="text-gray-300">{event}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {stock.risk_factors && stock.risk_factors.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-white">Risk Factors</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {stock.risk_factors.map((risk, idx) => (
                          <li key={idx} className="text-red-400">{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-white">Recommendation</h4>
                                         <p className="text-sm text-gray-300">{stock.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-4">
            {analysisResults.sentiment_analysis?.sentiments?.map((sentiment, index) => (
              <Card key={index} className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-primary-400">{sentiment.symbol}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(sentiment.sentiment)}
                      <Badge className={getSentimentColor(sentiment.sentiment)}>
                        {sentiment.sentiment}
                      </Badge>
                      <Badge variant="outline">
                        {sentiment.confidence} Confidence
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2 text-white">Reasoning</h4>
                                         <p className="text-sm text-gray-300">{sentiment.reasoning}</p>
                  </div>
                  
                  {sentiment.key_factors && sentiment.key_factors.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-white">Key Factors</h4>
                      <div className="flex flex-wrap gap-2">
                        {sentiment.key_factors.map((factor, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-white">Price Impact</h4>
                                         <p className="text-sm text-gray-300">{sentiment.price_impact}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="headlines" className="space-y-4">
            {analysisResults.headline_analysis?.headlines?.map((headline, index) => (
              <Card key={index} className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-primary-400">{headline.symbol}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-gray-300">Breaking News</h4>
                      <p className="text-lg font-medium text-red-400">{headline.headlines.breaking}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-gray-300">Analytical Insight</h4>
                      <p className="text-lg font-medium text-blue-400">{headline.headlines.analytical}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-gray-300">Market Story</h4>
                      <p className="text-lg font-medium text-green-400">{headline.headlines.storytelling}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-white">Summary</h4>
                                         <p className="text-sm text-gray-300">{headline.summary}</p>
                  </div>
                  
                  {headline.keywords && headline.keywords.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-white">Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {headline.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIAnalysisResults;
