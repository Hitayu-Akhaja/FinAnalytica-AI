import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const NestedPieChart = ({ holdings }) => {
  // Process data to create single pie chart structure
  const chartData = useMemo(() => {
    if (!holdings || holdings.length === 0) return [];

    // Group holdings by sector and create shades for each stock
    const sectorGroups = holdings.reduce((acc, holding) => {
      const sector = holding.sector || 'Unknown';
      if (!acc[sector]) {
        acc[sector] = {
          stocks: []
        };
      }
      acc[sector].stocks.push({
        name: holding.symbol,
        value: holding.value || 0,
        sector: sector,
        fullName: holding.name || holding.symbol,
        displayName: holding.name || holding.symbol
      });
      return acc;
    }, {});

    // Convert to flat array for single pie chart
    const stocks = Object.values(sectorGroups).flatMap(sector => sector.stocks);

    return stocks;
  }, [holdings]);

  // Color schemes for sectors
  const sectorColors = {
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
    'Utilities': '#14B8A6',
    'Unknown': '#6B7280'
  };

  // Generate stock colors based on sector with different shades
  const getStockColor = (sector, index) => {
    const baseColor = sectorColors[sector] || '#6B7280';
    
    // Create different shades for the same sector
    const shadeFactors = [1.0, 0.8, 0.6, 0.4, 0.2, 1.2, 1.4, 1.6, 0.9, 0.7];
    const factor = shadeFactors[index % shadeFactors.length];
    
    return adjustBrightness(baseColor, factor);
  };

  // Helper function to adjust color brightness
  const adjustBrightness = (hex, factor) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
    const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
    const newB = Math.min(255, Math.max(0, Math.round(b * factor)));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const totalValue = chartData.reduce((sum, stock) => sum + stock.value, 0);
      const percentage = ((data.value / totalValue) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 text-lg">{data.displayName || data.name}</p>
          <p className="text-gray-600 font-medium">{formatCurrency(data.value)}</p>
          <p className="text-blue-600 font-semibold">{percentage}% of portfolio</p>
          <p className="text-sm text-gray-500">Sector: {data.sector}</p>
        </div>
      );
    }
    return null;
  };

  // Custom label for stocks
  const StockLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.03) return null; // Don't show labels for small segments
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="10"
        fontWeight="500"
      >
        {`${name} ${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  if (!holdings || holdings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p>No holdings data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        {/* Single pie chart - All stocks */}
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label={<StockLabel />}
          labelLine={false}
        >
          {chartData.map((entry, index) => {
            // Find the sector group to get the shade index
            const sectorStocks = chartData.filter(stock => stock.sector === entry.sector);
            const stockIndex = sectorStocks.findIndex(stock => stock.name === entry.name);
            
            return (
              <Cell 
                key={`stock-${index}`} 
                fill={getStockColor(entry.sector, stockIndex)} 
              />
            );
          })}
        </Pie>
        
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default NestedPieChart;
