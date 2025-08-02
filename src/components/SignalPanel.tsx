import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, Target } from 'lucide-react';

interface Signal {
  id: number;
  pair: string;
  type: 'BUY' | 'SELL';
  strength: 'STRONG' | 'MEDIUM' | 'WEAK';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  probability: number;
  timeFrame: string;
  reason: string;
}

interface SignalPanelProps {
  signals: Signal[];
}

const SignalPanel: React.FC<SignalPanelProps> = ({ signals }) => {
  const getSignalColor = (strength: string) => {
    switch (strength) {
      case 'STRONG': return 'signal-strong';
      case 'MEDIUM': return 'signal-weak';
      case 'WEAK': return 'muted';
      default: return 'muted';
    }
  };

  const getTypeIcon = (type: 'BUY' | 'SELL') => {
    return type === 'BUY' ? 
      <TrendingUp className="h-4 w-4 text-trading-buy" /> : 
      <TrendingDown className="h-4 w-4 text-trading-sell" />;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5" />
          Live Signals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {signals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No active signals</p>
            <p className="text-sm">Waiting for market conditions...</p>
          </div>
        ) : (
          signals.map(signal => (
            <div key={signal.id} className="border border-border/50 rounded-lg p-4 space-y-3 bg-card/30">
              {/* Signal Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    {signal.pair}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {signal.timeFrame}
                  </Badge>
                </div>
                <Badge 
                  variant={signal.strength === 'STRONG' ? 'default' : 'secondary'}
                  className={`text-xs ${signal.strength === 'STRONG' ? 'bg-signal-strong' : ''}`}
                >
                  {signal.strength}
                </Badge>
              </div>

              {/* Signal Type and Probability */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(signal.type)}
                  <span className={`font-semibold ${signal.type === 'BUY' ? 'text-trading-buy' : 'text-trading-sell'}`}>
                    {signal.type}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Probability</div>
                  <div className="font-semibold text-primary">{signal.probability}%</div>
                </div>
              </div>

              {/* Price Levels */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-background/50 rounded">
                  <div className="text-muted-foreground">Entry</div>
                  <div className="font-mono font-semibold">{signal.entry.toFixed(4)}</div>
                </div>
                <div className="text-center p-2 bg-background/50 rounded">
                  <div className="text-muted-foreground">S/L</div>
                  <div className="font-mono font-semibold text-loss">{signal.stopLoss.toFixed(4)}</div>
                </div>
                <div className="text-center p-2 bg-background/50 rounded">
                  <div className="text-muted-foreground">T/P</div>
                  <div className="font-mono font-semibold text-profit">{signal.takeProfit.toFixed(4)}</div>
                </div>
              </div>

              {/* Reason */}
              <div className="text-xs text-muted-foreground bg-background/30 p-2 rounded">
                <strong>Analysis:</strong> {signal.reason}
              </div>

              {/* Risk/Reward */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Risk/Reward:</span>
                <span className="font-semibold text-primary">
                  1:{(Math.abs(signal.takeProfit - signal.entry) / Math.abs(signal.entry - signal.stopLoss)).toFixed(1)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant={signal.type === 'BUY' ? 'buy' : 'sell'}
                  className="flex-1"
                >
                  Execute {signal.type}
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Copy Signal
                </Button>
              </div>
            </div>
          ))
        )}
        
        {/* Signal Generator Status */}
        <div className="mt-6 p-3 bg-card/20 rounded-lg border border-border/30">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-signal-strong rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">AI Signal Generator</span>
            </div>
            <Badge variant="outline" className="text-xs">
              ACTIVE
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Scanning 28 currency pairs • Next signal in ~3min
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignalPanel;