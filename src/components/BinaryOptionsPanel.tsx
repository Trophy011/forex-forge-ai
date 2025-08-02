import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface BinarySignal {
  id: string;
  pair: string;
  direction: 'CALL' | 'PUT';
  expiry: number; // minutes
  probability: number;
  confidence: string;
  reason: string;
  entryPrice: number;
  timestamp: number;
}

const BinaryOptionsPanel = () => {
  const [binarySignals, setBinarySignals] = useState<BinarySignal[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState('5');

  const expiryOptions = ['1', '2', '5', '10', '15', '30', '60'];

  useEffect(() => {
    const fetchBinarySignals = async () => {
      try {
        const response = await fetch('https://cvcjqxstkcecbazgrnmg.functions.supabase.co/forex-data/signals');
        const signals = await response.json();
        
        const binarySignals: BinarySignal[] = signals.map((signal: any) => ({
          id: signal.id,
          pair: signal.pair.substring(0, 3) + '/' + signal.pair.substring(3),
          direction: signal.type === 'BUY' ? 'CALL' : 'PUT',
          expiry: signal.binaryExpiry,
          probability: signal.probability,
          confidence: signal.confidence,
          reason: signal.reason,
          entryPrice: signal.entry,
          timestamp: Date.now()
        }));
        
        setBinarySignals(binarySignals);
      } catch (error) {
        console.error('Failed to fetch binary signals:', error);
      }
    };

    fetchBinarySignals();
    const interval = setInterval(fetchBinarySignals, 3000);
    return () => clearInterval(interval);
  }, []);

  const getDirectionColor = (direction: 'CALL' | 'PUT') => {
    return direction === 'CALL' ? 'text-trading-buy' : 'text-trading-sell';
  };

  const getDirectionIcon = (direction: 'CALL' | 'PUT') => {
    return direction === 'CALL' ? 
      <TrendingUp className="h-4 w-4 text-trading-buy" /> : 
      <TrendingDown className="h-4 w-4 text-trading-sell" />;
  };

  const getConfidenceBadge = (confidence: string, probability: number) => {
    const variant = confidence === 'HIGH' ? 'default' : 
                   confidence === 'MEDIUM' ? 'secondary' : 'outline';
    const bgColor = probability > 75 ? 'bg-signal-strong' : 
                    probability > 60 ? 'bg-signal-weak' : 'bg-muted';
    
    return (
      <Badge variant={variant} className={`text-xs ${confidence === 'HIGH' ? bgColor : ''}`}>
        {confidence} ({probability}%)
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5" />
          Binary Options Signals
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Expiry:</span>
          <Select value={selectedExpiry} onValueChange={setSelectedExpiry}>
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {expiryOptions.map(expiry => (
                <SelectItem key={expiry} value={expiry}>{expiry}m</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {binarySignals.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Loading binary signals...</p>
          </div>
        ) : (
          binarySignals.slice(0, 4).map(signal => (
            <div key={signal.id} className="border border-border/50 rounded-lg p-4 space-y-3 bg-card/30">
              {/* Signal Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    {signal.pair}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{signal.expiry}m</span>
                  </div>
                </div>
                {getConfidenceBadge(signal.confidence, signal.probability)}
              </div>

              {/* Direction and Entry */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getDirectionIcon(signal.direction)}
                  <span className={`font-semibold ${getDirectionColor(signal.direction)}`}>
                    {signal.direction}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Entry Price</div>
                  <div className="font-mono font-semibold">{signal.entryPrice.toFixed(4)}</div>
                </div>
              </div>

              {/* Analysis */}
              <div className="text-xs text-muted-foreground bg-background/30 p-2 rounded">
                <strong>Analysis:</strong> {signal.reason}
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Recommended Expiry:</span>
                <span className="font-semibold text-primary">{signal.expiry} minutes</span>
              </div>

              {/* Action Button */}
              <Button 
                size="sm" 
                variant={signal.direction === 'CALL' ? 'buy' : 'sell'}
                className="w-full"
              >
                Execute {signal.direction} Option
              </Button>
            </div>
          ))
        )}
        
        {/* Binary Options Info */}
        <div className="mt-6 p-3 bg-card/20 rounded-lg border border-border/30">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-signal-strong rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">Binary AI Engine</span>
            </div>
            <Badge variant="outline" className="text-xs">
              ACTIVE
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            Analyzing {binarySignals.length} currency pairs for high-probability binary options
          </div>
          <div className="text-xs text-warning mt-1">
            ⚠️ Binary options carry high risk. Trade responsibly.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BinaryOptionsPanel;