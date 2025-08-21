import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';

const StockChart = ({ 
  data, 
  width = 800, 
  height = 400, 
  colors = ['#3B82F6', '#10B981', '#F59E0B'],
  symbols = [],
  selectedPeriod = '1y',
  onPeriodChange,
  periods = [],
  loading = false
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return;

    // Prepare data for Plotly
    const traces = data.map((dataset, index) => {
      if (!dataset.data || dataset.data.length === 0) return null;

      // Convert dates to proper format
      const dates = dataset.data.map(point => {
        if (typeof point.date === 'string') {
          if (point.date.includes(' ')) {
            // Intraday data with time
            return point.date;
          } else {
            // Daily data
            return point.date + 'T00:00:00';
          }
        }
        return point.date;
      });

      const prices = dataset.data.map(point => point.price);
      const volumes = dataset.data.map(point => point.volume || 0);

      return {
        x: dates,
        y: prices,
        type: 'scatter',
        mode: 'lines',
        name: dataset.symbol,
        line: {
          color: colors[index % colors.length],
          width: 2
        },
        fill: 'tonexty',
        fillcolor: colors[index % colors.length] + '20',
        hovertemplate: 
          `<b>${dataset.symbol}</b><br>` +
          `Date: %{x}<br>` +
          `Price: $%{y:.2f}<br>` +
          `<extra></extra>`,
        showlegend: true
      };
    }).filter(Boolean);

    if (traces.length === 0) return;

    // Layout configuration
    const layout = {
      autosize: true,
      margin: {
        l: 60,
        r: 30,
        t: 40,
        b: 60
      },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: {
        color: '#ffffff'
      },
      xaxis: {
        title: '',
        gridcolor: 'rgba(255,255,255,0.1)',
        zeroline: false,
        showgrid: true,
        tickformat: selectedPeriod === '1d' || selectedPeriod === '5d' ? '%H:%M' : '%b %d, %Y',
        tickangle: 0,
        tickmode: 'auto',
        nticks: 8
      },
      yaxis: {
        title: 'Price ($)',
        gridcolor: 'rgba(255,255,255,0.1)',
        zeroline: false,
        showgrid: true,
        tickprefix: '$',
        tickformat: '.2f'
      },
      hovermode: 'x unified',
      hoverlabel: {
        bgcolor: 'rgba(0,0,0,0.9)',
        bordercolor: 'rgba(255,255,255,0.2)',
        font: {
          color: '#ffffff'
        }
      },
      legend: {
        x: 0,
        y: 1,
        bgcolor: 'rgba(0,0,0,0.5)',
        bordercolor: 'rgba(255,255,255,0.2)',
        borderwidth: 1,
        font: {
          color: '#ffffff'
        }
      },
      modebar: {
        bgcolor: 'rgba(0,0,0,0.5)',
        color: '#ffffff',
        activecolor: '#3B82F6',
        orientation: 'h'
      }
    };

    // Configuration for better performance
    const config = {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
      displaylogo: false,
      toImageButtonOptions: {
        format: 'png',
        filename: 'stock_chart',
        scale: 2
      }
    };

    // Create the plot
    Plotly.newPlot(chartRef.current, traces, layout, config);

    // Add resize handler
    const handleResize = () => {
      if (chartRef.current) {
        Plotly.relayout(chartRef.current, { autosize: true });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        Plotly.purge(chartRef.current);
      }
    };
  }, [data, colors, selectedPeriod]);

  if (!data || data.length === 0) {
    return (
      <div className="h-96 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📈</div>
          <p className="text-gray-400">No chart data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded-lg border border-white/10 p-4 h-full">
      {/* Period Selection */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Price Chart</h3>
        <div className="flex space-x-1">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => onPeriodChange && onPeriodChange(period)}
              disabled={loading}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedPeriod === period.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {period.label}
              {period.value === 'max' && (
                <span className="ml-1 text-xs opacity-75">(5Y)</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
          <div className="text-white">Loading...</div>
        </div>
      )}

      {/* Plotly Chart */}
      <div 
        ref={chartRef} 
        className="w-full h-full"
        style={{ height: 'calc(100% - 60px)', width: '100%' }}
      />
    </div>
  );
};

export default StockChart; 