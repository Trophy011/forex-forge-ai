import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Target, BarChart3 } from 'lucide-react';
import TradingChart from './TradingChart';
import SignalPanel from './SignalPanel';
import MarketOverview from './MarketOverview';
import TradeExecutor from './TradeExecutor';

interface CurrencyPair {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const TradingDashboard = () => {
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const [activeSignals, setActiveSignals] = useState<any[]>([]);
  const [marketData, setMarketData] = useState<CurrencyPair[]>([]);
  const [isLive, setIsLive] = useState(true);

  const currencyPairs = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 
    'USD/CAD', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY'
  ];

  useEffect(() => {
    // Simulate real-time market data updates
    const updateMarketData = () => {
      const pairs: CurrencyPair[] = currencyPairs.map(pair => {
        const basePrice = Math.random() * 2 + 0.5;
        const change = (Math.random() - 0.5) * 0.01;
        return {
          symbol: pair,
          name: pair.replace('/', ' / '),
          price: basePrice,
          change: change,
          changePercent: (change / basePrice) * 100
        };
      });
      setMarketData(pairs);
    };

    updateMarketData();
    const interval = setInterval(updateMarketData, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Generate trading signals
    const generateSignals = () => {
      const signals = [
        {
          id: 1,
          pair: selectedPair,
          type: 'BUY',
          strength: 'STRONG',
          entry: 1.0850,
          stopLoss: 1.0800,
          takeProfit: 1.0950,
          probability: 85,
          timeFrame: '1H',
          reason: 'Bullish RSI divergence + Support level break'
        },
        {
          id: 2,
          pair: 'GBP/USD',
          type: 'SELL',
          strength: 'MEDIUM',
          entry: 1.2750,
          stopLoss: 1.2800,
          takeProfit: 1.2650,
          probability: 72,
          timeFrame: '4H',
          reason: 'Resistance rejection + Bearish pattern'
        }
      ];
      setActiveSignals(signals);
    };

    generateSignals();
    const signalInterval = setInterval(generateSignals, 10000);
    return () => clearInterval(signalInterval);
  }, [selectedPair]);

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ForexAI Pro
            </h1>
          </div>
          <Badge variant={isLive ? "default" : "secondary"} className="animate-pulse">
            {isLive ? "LIVE" : "DEMO"}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedPair} onValueChange={setSelectedPair}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencyPairs.map(pair => (
                <SelectItem key={pair} value={pair}>{pair}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant={isLive ? "secondary" : "default"}
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? "Switch to Demo" : "Go Live"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {selectedPair} Chart
                </CardTitle>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-mono text-lg text-primary">1.0850</span>
                  <TrendingUp className="h-4 w-4 text-profit" />
                  <span className="text-profit">+0.0023 (+0.21%)</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <TradingChart pair={selectedPair} />
            </CardContent>
          </Card>

          {/* Market Overview */}
          <MarketOverview marketData={marketData} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Signals */}
          <SignalPanel signals={activeSignals} />
          
          {/* Trade Executor */}
          <TradeExecutor selectedPair={selectedPair} />
          
          {/* Performance Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Today's Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Profit</span>
                <span className="text-profit font-mono">+$2,847.50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Win Rate</span>
                <span className="text-foreground font-semibold">78.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Trades</span>
                <span className="text-foreground">47 / 60</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Risk/Reward</span>
                <span className="text-primary font-semibold">1:2.4</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TradingDashboard;