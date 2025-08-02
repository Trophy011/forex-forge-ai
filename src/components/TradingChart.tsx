import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradingChartProps {
  pair: string;
}

const TradingChart: React.FC<TradingChartProps> = ({ pair }) => {
  const [timeFrame, setTimeFrame] = useState('1H');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(1.0850);

  const timeFrames = ['1M', '5M', '15M', '1H', '4H', '1D', '1W'];

  useEffect(() => {
    // Generate realistic candlestick data
    const generateChartData = () => {
      const data: ChartData[] = [];
      let basePrice = 1.0800;
      
      for (let i = 0; i < 100; i++) {
        const open = basePrice + (Math.random() - 0.5) * 0.01;
        const close = open + (Math.random() - 0.5) * 0.02;
        const high = Math.max(open, close) + Math.random() * 0.01;
        const low = Math.min(open, close) - Math.random() * 0.01;
        const volume = Math.random() * 1000 + 500;
        
        data.push({
          time: new Date(Date.now() - (100 - i) * 3600000).toISOString(),
          open,
          high,
          low,
          close,
          volume
        });
        
        basePrice = close;
      }
      
      setChartData(data);
      setCurrentPrice(data[data.length - 1]?.close || 1.0850);
    };

    generateChartData();
    const interval = setInterval(generateChartData, 5000);
    return () => clearInterval(interval);
  }, [pair, timeFrame]);

  const renderCandlestickChart = () => {
    const maxPrice = Math.max(...chartData.map(d => d.high));
    const minPrice = Math.min(...chartData.map(d => d.low));
    const priceRange = maxPrice - minPrice;
    
    return (
      <div className="relative w-full h-96 bg-gradient-to-b from-background to-card border border-chart-grid rounded-lg overflow-hidden">
        {/* Grid Lines */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full border-t border-chart-grid/30"
              style={{ top: `${(i * 100) / 10}%` }}
            />
          ))}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-full border-l border-chart-grid/20"
              style={{ left: `${(i * 100) / 20}%` }}
            />
          ))}
        </div>
        
        {/* Candlesticks */}
        <div className="absolute inset-4 flex items-end justify-between">
          {chartData.slice(-50).map((candle, index) => {
            const isGreen = candle.close > candle.open;
            const bodyHeight = Math.abs(candle.close - candle.open) / priceRange * 100;
            const wickTop = (maxPrice - candle.high) / priceRange * 100;
            const wickBottom = (candle.low - minPrice) / priceRange * 100;
            const bodyTop = (maxPrice - Math.max(candle.open, candle.close)) / priceRange * 100;
            
            return (
              <div key={index} className="relative w-1.5 h-full flex flex-col justify-end">
                {/* Wick */}
                <div
                  className={`w-0.5 mx-auto ${isGreen ? 'bg-profit' : 'bg-loss'}`}
                  style={{
                    height: `${100 - wickTop - wickBottom}%`,
                    marginBottom: `${wickBottom}%`
                  }}
                />
                {/* Body */}
                <div
                  className={`w-full ${isGreen ? 'bg-profit' : 'bg-loss'} absolute`}
                  style={{
                    height: `${bodyHeight}%`,
                    bottom: `${(candle.low - minPrice) / priceRange * 100}%`
                  }}
                />
              </div>
            );
          })}
        </div>
        
        {/* Price Labels */}
        <div className="absolute right-2 top-0 h-full flex flex-col justify-between py-4">
          {[...Array(6)].map((_, i) => {
            const price = maxPrice - (i * priceRange) / 5;
            return (
              <span key={i} className="text-xs text-chart-text font-mono">
                {price.toFixed(4)}
              </span>
            );
          })}
        </div>
        
        {/* Current Price Line */}
        <div
          className="absolute left-0 right-0 border-t-2 border-primary/80 z-10"
          style={{
            top: `${((maxPrice - currentPrice) / priceRange) * 100}%`
          }}
        >
          <span className="absolute right-2 -top-3 bg-primary text-primary-foreground px-2 py-1 text-xs font-mono rounded">
            {currentPrice.toFixed(4)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Time Frame Selector */}
      <div className="flex justify-between items-center px-4">
        <div className="flex gap-1">
          {timeFrames.map(tf => (
            <Button
              key={tf}
              variant={timeFrame === tf ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeFrame(tf)}
              className="text-xs"
            >
              {tf}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Volume:</span>
          <span className="text-accent font-mono">1.2M</span>
        </div>
      </div>
      
      {/* Chart */}
      {renderCandlestickChart()}
      
      {/* Technical Indicators */}
      <div className="px-4 py-2 bg-card/50 rounded-lg">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">RSI (14):</span>
            <span className="ml-2 text-warning font-semibold">68.5</span>
          </div>
          <div>
            <span className="text-muted-foreground">MACD:</span>
            <span className="ml-2 text-profit font-semibold">+0.0012</span>
          </div>
          <div>
            <span className="text-muted-foreground">BB Upper:</span>
            <span className="ml-2 font-mono">1.0875</span>
          </div>
          <div>
            <span className="text-muted-foreground">Support:</span>
            <span className="ml-2 font-mono text-chart-text">1.0820</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;