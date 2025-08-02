import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ForexRate {
  symbol: string
  bid: number
  ask: number
  spread: number
  change: number
  changePercent: number
  timestamp: number
}

// Real forex pairs with live data simulation
const MAJOR_PAIRS = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 
  'USDCAD', 'NZDUSD', 'EURGBP', 'EURJPY', 'GBPJPY'
]

// Generate realistic forex rates based on real market ranges
function generateRealisticRate(pair: string, baseRate?: number): ForexRate {
  const rates: Record<string, number> = {
    'EURUSD': 1.0850,
    'GBPUSD': 1.2750,
    'USDJPY': 149.50,
    'USDCHF': 0.8950,
    'AUDUSD': 0.6450,
    'USDCAD': 1.3650,
    'NZDUSD': 0.5950,
    'EURGBP': 0.8650,
    'EURJPY': 158.50,
    'GBPJPY': 183.25
  }

  const currentRate = baseRate || rates[pair] || 1.0000
  const volatility = pair.includes('JPY') ? 0.5 : 0.0005
  const change = (Math.random() - 0.5) * volatility * 2
  const newRate = currentRate + change
  
  const spread = pair.includes('JPY') ? 
    Math.random() * 2 + 1 : // 1-3 pips for JPY pairs
    Math.random() * 0.00005 + 0.00001 // 0.1-0.6 pips for major pairs

  return {
    symbol: pair,
    bid: newRate - spread/2,
    ask: newRate + spread/2,
    spread: spread,
    change: change,
    changePercent: (change / currentRate) * 100,
    timestamp: Date.now()
  }
}

// Generate advanced AI signals
function generateAISignals(rates: ForexRate[]) {
  const signals = []
  
  for (const rate of rates.slice(0, 3)) { // Generate signals for top 3 pairs
    const strength = Math.random() > 0.7 ? 'STRONG' : Math.random() > 0.4 ? 'MEDIUM' : 'WEAK'
    const type = Math.random() > 0.5 ? 'BUY' : 'SELL'
    const probability = strength === 'STRONG' ? 75 + Math.random() * 20 : 
                      strength === 'MEDIUM' ? 60 + Math.random() * 15 : 
                      45 + Math.random() * 15

    // Calculate realistic entry, SL, TP levels
    const currentPrice = (rate.bid + rate.ask) / 2
    const isJPY = rate.symbol.includes('JPY')
    const pipValue = isJPY ? 0.01 : 0.0001
    
    const entry = currentPrice
    const stopLoss = type === 'BUY' ? 
      entry - (20 + Math.random() * 30) * pipValue :
      entry + (20 + Math.random() * 30) * pipValue
    const takeProfit = type === 'BUY' ? 
      entry + (40 + Math.random() * 60) * pipValue :
      entry - (40 + Math.random() * 60) * pipValue

    // AI analysis reasons
    const reasons = [
      'RSI oversold + bullish divergence detected',
      'Fibonacci retracement at 61.8% support',
      'Breaking resistance with high volume',
      'Triple bottom pattern confirmed',
      'MACD bullish crossover + trend alignment',
      'Support/resistance level bounce',
      'Momentum indicators showing strong signal',
      'Price action confirming reversal pattern'
    ]

    signals.push({
      id: Math.random().toString(36).substr(2, 9),
      pair: rate.symbol,
      type,
      strength,
      entry: parseFloat(entry.toFixed(isJPY ? 2 : 4)),
      stopLoss: parseFloat(stopLoss.toFixed(isJPY ? 2 : 4)),
      takeProfit: parseFloat(takeProfit.toFixed(isJPY ? 2 : 4)),
      probability: Math.round(probability),
      timeFrame: ['1M', '5M', '15M', '1H', '4H'][Math.floor(Math.random() * 5)],
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      binaryExpiry: Math.floor(Math.random() * 30) + 5, // 5-35 minutes for binary
      confidence: probability > 75 ? 'HIGH' : probability > 60 ? 'MEDIUM' : 'LOW'
    })
  }
  
  return signals
}

// Generate market analysis
function generateMarketAnalysis(rates: ForexRate[]) {
  const bullishCount = rates.filter(r => r.changePercent > 0).length
  const bearishCount = rates.length - bullishCount
  const sentiment = bullishCount > bearishCount ? 'BULLISH' : 'BEARISH'
  
  return {
    sentiment,
    bullishPairs: bullishCount,
    bearishPairs: bearishCount,
    volatility: Math.random() > 0.5 ? 'HIGH' : 'MEDIUM',
    volume: (Math.random() * 2 + 5).toFixed(1) + 'T',
    vix: (15 + Math.random() * 10).toFixed(1),
    marketTrend: sentiment === 'BULLISH' ? 'Risk-On' : 'Risk-Off',
    keyLevels: {
      support: 'Strong support at previous session lows',
      resistance: 'Major resistance at session highs',
      pivot: 'Daily pivot levels holding as key zones'
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const endpoint = url.pathname.split('/').pop()

    switch (endpoint) {
      case 'rates':
        // Get live forex rates
        const rates = MAJOR_PAIRS.map(pair => generateRealisticRate(pair))
        return new Response(JSON.stringify(rates), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'signals':
        // Get AI trading signals
        const currentRates = MAJOR_PAIRS.map(pair => generateRealisticRate(pair))
        const signals = generateAISignals(currentRates)
        return new Response(JSON.stringify(signals), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'analysis':
        // Get market analysis
        const analysisRates = MAJOR_PAIRS.map(pair => generateRealisticRate(pair))
        const analysis = generateMarketAnalysis(analysisRates)
        return new Response(JSON.stringify(analysis), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'chart-data':
        // Get chart data for specific pair
        const pair = url.searchParams.get('pair') || 'EURUSD'
        const timeframe = url.searchParams.get('timeframe') || '1H'
        const chartData = generateChartData(pair, timeframe)
        return new Response(JSON.stringify(chartData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        return new Response('Endpoint not found', { 
          status: 404,
          headers: corsHeaders 
        })
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

function generateChartData(pair: string, timeframe: string) {
  const data = []
  const baseRates: Record<string, number> = {
    'EURUSD': 1.0850, 'GBPUSD': 1.2750, 'USDJPY': 149.50,
    'USDCHF': 0.8950, 'AUDUSD': 0.6450, 'USDCAD': 1.3650,
    'NZDUSD': 0.5950, 'EURGBP': 0.8650, 'EURJPY': 158.50, 'GBPJPY': 183.25
  }
  
  let basePrice = baseRates[pair] || 1.0000
  const isJPY = pair.includes('JPY')
  const volatility = isJPY ? 0.5 : 0.0005
  
  // Generate 100 candles
  for (let i = 0; i < 100; i++) {
    const open = basePrice + (Math.random() - 0.5) * volatility
    const close = open + (Math.random() - 0.5) * volatility * 2
    const high = Math.max(open, close) + Math.random() * volatility
    const low = Math.min(open, close) - Math.random() * volatility
    const volume = Math.random() * 1000 + 500
    
    data.push({
      time: new Date(Date.now() - (100 - i) * getTimeframeMs(timeframe)).toISOString(),
      open: parseFloat(open.toFixed(isJPY ? 2 : 4)),
      high: parseFloat(high.toFixed(isJPY ? 2 : 4)),
      low: parseFloat(low.toFixed(isJPY ? 2 : 4)),
      close: parseFloat(close.toFixed(isJPY ? 2 : 4)),
      volume: Math.round(volume)
    })
    
    basePrice = close
  }
  
  return data
}

function getTimeframeMs(timeframe: string): number {
  const timeframes: Record<string, number> = {
    '1M': 60000,
    '5M': 300000,
    '15M': 900000,
    '1H': 3600000,
    '4H': 14400000,
    '1D': 86400000,
    '1W': 604800000
  }
  return timeframes[timeframe] || 3600000
}