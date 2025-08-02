import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, DollarSign, Clock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TradeExecutorProps {
  selectedPair: string;
}

const TradeExecutor: React.FC<TradeExecutorProps> = ({ selectedPair }) => {
  const [tradeType, setTradeType] = useState<'forex' | 'binary'>('forex');
  const [position, setPosition] = useState<'BUY' | 'SELL'>('BUY');
  const [lotSize, setLotSize] = useState('0.1');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [binaryAmount, setBinaryAmount] = useState('100');
  const [binaryExpiry, setBinaryExpiry] = useState('5');
  const [leverage, setLeverage] = useState('50');
  
  const { toast } = useToast();

  const currentPrice = 1.0850;
  const spread = 0.0003;
  
  const calculateMargin = () => {
    const lotValue = parseFloat(lotSize) * 100000;
    const leverageRatio = parseFloat(leverage);
    return (lotValue / leverageRatio).toFixed(2);
  };
  
  const calculatePipValue = () => {
    return (parseFloat(lotSize) * 10).toFixed(2);
  };

  const executeTrade = () => {
    if (tradeType === 'forex') {
      if (!stopLoss || !takeProfit) {
        toast({
          title: "Missing Parameters",
          description: "Please set Stop Loss and Take Profit levels",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Trade Executed",
        description: `${position} ${lotSize} lots of ${selectedPair} at ${currentPrice.toFixed(4)}`,
        variant: "default"
      });
    } else {
      toast({
        title: "Binary Option Placed",
        description: `$${binaryAmount} ${position} on ${selectedPair} for ${binaryExpiry} minutes`,
        variant: "default"
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Trade Executor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={tradeType} onValueChange={(value) => setTradeType(value as 'forex' | 'binary')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="forex">Forex</TabsTrigger>
            <TabsTrigger value="binary">Binary Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forex" className="space-y-4 mt-4">
            {/* Position Type */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={position === 'BUY' ? 'buy' : 'outline'}
                onClick={() => setPosition('BUY')}
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                BUY
              </Button>
              <Button
                variant={position === 'SELL' ? 'sell' : 'outline'}
                onClick={() => setPosition('SELL')}
                className="flex items-center gap-2"
              >
                <TrendingDown className="h-4 w-4" />
                SELL
              </Button>
            </div>

            {/* Current Price Display */}
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current Price</span>
                <div className="text-right">
                  <div className="font-mono text-lg font-bold">
                    {position === 'BUY' 
                      ? (currentPrice + spread).toFixed(4)
                      : (currentPrice - spread).toFixed(4)
                    }
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Spread: {(spread * 10000).toFixed(1)} pips
                  </div>
                </div>
              </div>
            </div>

            {/* Lot Size */}
            <div className="space-y-2">
              <Label htmlFor="lotSize">Lot Size</Label>
              <Select value={lotSize} onValueChange={setLotSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.01">0.01 (Micro)</SelectItem>
                  <SelectItem value="0.1">0.1 (Mini)</SelectItem>
                  <SelectItem value="1">1.0 (Standard)</SelectItem>
                  <SelectItem value="5">5.0</SelectItem>
                  <SelectItem value="10">10.0</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Leverage */}
            <div className="space-y-2">
              <Label htmlFor="leverage">Leverage</Label>
              <Select value={leverage} onValueChange={setLeverage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">1:10</SelectItem>
                  <SelectItem value="30">1:30</SelectItem>
                  <SelectItem value="50">1:50</SelectItem>
                  <SelectItem value="100">1:100</SelectItem>
                  <SelectItem value="200">1:200</SelectItem>
                  <SelectItem value="500">1:500</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stop Loss */}
            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop Loss</Label>
              <Input
                id="stopLoss"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="1.0800"
                className="font-mono"
              />
            </div>

            {/* Take Profit */}
            <div className="space-y-2">
              <Label htmlFor="takeProfit">Take Profit</Label>
              <Input
                id="takeProfit"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                placeholder="1.0900"
                className="font-mono"
              />
            </div>

            {/* Trade Summary */}
            <div className="p-3 bg-card/30 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Margin Required:</span>
                <span className="font-mono">${calculateMargin()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pip Value:</span>
                <span className="font-mono">${calculatePipValue()}/pip</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Risk:</span>
                <span className="font-mono text-loss">
                  {stopLoss ? `$${(Math.abs(currentPrice - parseFloat(stopLoss)) * 10000 * parseFloat(calculatePipValue())).toFixed(2)}` : '-'}
                </span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="binary" className="space-y-4 mt-4">
            {/* Position Type */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={position === 'BUY' ? 'buy' : 'outline'}
                onClick={() => setPosition('BUY')}
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                CALL
              </Button>
              <Button
                variant={position === 'SELL' ? 'sell' : 'outline'}
                onClick={() => setPosition('SELL')}
                className="flex items-center gap-2"
              >
                <TrendingDown className="h-4 w-4" />
                PUT
              </Button>
            </div>

            {/* Investment Amount */}
            <div className="space-y-2">
              <Label htmlFor="binaryAmount">Investment Amount ($)</Label>
              <Select value={binaryAmount} onValueChange={setBinaryAmount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">$50</SelectItem>
                  <SelectItem value="100">$100</SelectItem>
                  <SelectItem value="250">$250</SelectItem>
                  <SelectItem value="500">$500</SelectItem>
                  <SelectItem value="1000">$1000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Expiry Time */}
            <div className="space-y-2">
              <Label htmlFor="binaryExpiry">Expiry Time</Label>
              <Select value={binaryExpiry} onValueChange={setBinaryExpiry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Minute</SelectItem>
                  <SelectItem value="5">5 Minutes</SelectItem>
                  <SelectItem value="15">15 Minutes</SelectItem>
                  <SelectItem value="30">30 Minutes</SelectItem>
                  <SelectItem value="60">1 Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Current Price Display */}
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Strike Price</span>
                <div className="text-right">
                  <div className="font-mono text-lg font-bold">
                    {currentPrice.toFixed(4)}
                  </div>
                </div>
              </div>
            </div>

            {/* Payout Information */}
            <div className="p-3 bg-card/30 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Investment:</span>
                <span className="font-mono">${binaryAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Potential Payout:</span>
                <span className="font-mono text-profit">${(parseFloat(binaryAmount) * 1.85).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profit:</span>
                <span className="font-mono text-profit">${(parseFloat(binaryAmount) * 0.85).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Return Rate:</span>
                <span className="font-mono text-accent">85%</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Execute Button */}
        <Button 
          onClick={executeTrade}
          className="w-full mt-6" 
          variant={position === 'BUY' ? 'buy' : 'sell'}
          size="lg"
        >
          <Shield className="h-4 w-4 mr-2" />
          Execute {tradeType === 'binary' ? 'Binary Option' : 'Forex Trade'}
        </Button>

        {/* Account Info */}
        <div className="mt-4 p-3 bg-background/30 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Balance</div>
              <div className="font-semibold text-primary">$50,000.00</div>
            </div>
            <div>
              <div className="text-muted-foreground">Free Margin</div>
              <div className="font-semibold">$48,250.00</div>
            </div>
            <div>
              <div className="text-muted-foreground">Equity</div>
              <div className="font-semibold text-profit">$51,847.50</div>
            </div>
            <div>
              <div className="text-muted-foreground">Margin Level</div>
              <div className="font-semibold">2,963%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradeExecutor;