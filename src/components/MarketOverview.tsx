import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Globe } from 'lucide-react';

interface CurrencyPair {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface MarketOverviewProps {
  marketData: CurrencyPair[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ marketData }) => {
  const formatPrice = (price: number) => {
    return price.toFixed(4);
  };

  const formatChange = (change: number) => {
    return (change >= 0 ? '+' : '') + change.toFixed(4);
  };

  const formatPercent = (percent: number) => {
    return (percent >= 0 ? '+' : '') + percent.toFixed(2) + '%';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Market Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {marketData.map((pair) => (
            <div
              key={pair.symbol}
              className="p-4 bg-card/30 border border-border/50 rounded-lg hover:bg-card/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{pair.symbol}</span>
                {pair.changePercent >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-profit" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-loss" />
                )}
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-mono font-bold">
                  {formatPrice(pair.price)}
                </div>
                
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono ${
                      pair.change >= 0 ? 'text-profit' : 'text-loss'
                    }`}
                  >
                    {formatChange(pair.change)}
                  </span>
                  
                  <Badge
                    variant={pair.changePercent >= 0 ? 'default' : 'destructive'}
                    className={`text-xs ${
                      pair.changePercent >= 0 
                        ? 'bg-profit/20 text-profit border-profit/30' 
                        : 'bg-loss/20 text-loss border-loss/30'
                    }`}
                  >
                    {formatPercent(pair.changePercent)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Market Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-background/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Market Sentiment</div>
            <div className="text-lg font-bold text-profit">Bullish</div>
            <div className="text-xs text-muted-foreground">67% pairs rising</div>
          </div>
          
          <div className="text-center p-4 bg-background/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Daily Volume</div>
            <div className="text-lg font-bold text-primary">$6.2T</div>
            <div className="text-xs text-muted-foreground">+12% vs yesterday</div>
          </div>
          
          <div className="text-center p-4 bg-background/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Volatility Index</div>
            <div className="text-lg font-bold text-warning">Medium</div>
            <div className="text-xs text-muted-foreground">VIX: 18.5</div>
          </div>
        </div>
        
        {/* Economic Events */}
        <div className="mt-6">
          <h4 className="font-semibold mb-3 text-sm">Upcoming Economic Events</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
              <div>
                <div className="font-medium text-sm">USD Non-Farm Payrolls</div>
                <div className="text-xs text-muted-foreground">15:30 GMT</div>
              </div>
              <Badge variant="destructive" className="text-xs">
                High Impact
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
              <div>
                <div className="font-medium text-sm">EUR ECB Interest Rate</div>
                <div className="text-xs text-muted-foreground">Tomorrow 12:45 GMT</div>
              </div>
              <Badge variant="default" className="text-xs bg-warning/20 text-warning border-warning/30">
                Medium Impact
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketOverview;