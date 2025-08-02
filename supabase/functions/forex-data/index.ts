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

// Generate hyper-realistic forex rates with live market simulation
function generateRealisticRate(pair: string, baseRate?: number): ForexRate {
  const now = new Date()
  const hour = now.getUTCHours()
  const minute = now.getUTCMinutes()
  const second = now.getUTCSeconds()
  
  // Base rates updated to current market levels
  const rates: Record<string, number> = {
    'EURUSD': 1.0847,
    'GBPUSD': 1.2749,
    'USDJPY': 149.23,
    'USDCHF': 0.8948,
    'AUDUSD': 0.6449,
    'USDCAD': 1.3648,
    'NZDUSD': 0.5946,
    'EURGBP': 0.8648,
    'EURJPY': 157.92,
    'GBPJPY': 182.35
  }

  const currentRate = baseRate || rates[pair] || 1.0000
  
  // Market session volatility (London: 8-17, NY: 13-22, Tokyo: 0-9 UTC)
  let sessionMultiplier = 1.0
  if ((hour >= 8 && hour <= 17) || (hour >= 13 && hour <= 22)) {
    sessionMultiplier = 1.8 // High volatility during overlap
  } else if (hour >= 0 && hour <= 9) {
    sessionMultiplier = 1.2 // Asian session
  } else {
    sessionMultiplier = 0.6 // Low liquidity periods
  }
  
  // Micro-movement simulation for tick-by-tick realism
  const tickSize = pair.includes('JPY') ? 0.001 : 0.00001
  const maxTicks = Math.floor(sessionMultiplier * 15)
  const ticks = Math.floor(Math.random() * maxTicks) - Math.floor(maxTicks / 2)
  
  // Add time-based price drift
  const timeDrift = Math.sin((hour * 60 + minute) / 120) * 0.0005
  const microMovement = Math.sin(second * 10 + Date.now() / 1000) * 0.0001
  
  const newRate = currentRate + (ticks * tickSize) + timeDrift + microMovement
  
  // Ultra-tight spreads like institutional trading
  const spreadMap: Record<string, number> = {
    'EURUSD': 0.00003,
    'GBPUSD': 0.00004,
    'USDJPY': 0.3,
    'USDCHF': 0.00005,
    'AUDUSD': 0.00006,
    'USDCAD': 0.00005,
    'NZDUSD': 0.00008,
    'EURGBP': 0.00006,
    'EURJPY': 0.8,
    'GBPJPY': 1.2
  }
  
  const spread = spreadMap[pair] || 0.00005
  const change = (ticks * tickSize) + timeDrift
  
  return {
    symbol: pair,
    bid: newRate - spread / 2,
    ask: newRate + spread / 2,
    spread: spread,
    change: change,
    changePercent: (change / currentRate) * 100,
    timestamp: Date.now()
  }
}

// Generate professional AI trading signals with expert analysis
function generateAISignals(rates: ForexRate[]) {
  const signals = []
  const now = new Date()
  const hour = now.getUTCHours()
  
  for (const rate of rates.slice(0, 5)) { // Generate signals for top 5 pairs
    if (Math.random() > 0.4) { // 60% chance of signal for more activity
      
      // Market sentiment analysis
      const isLondonSession = hour >= 8 && hour <= 17
      const isNYSession = hour >= 13 && hour <= 22
      const isOverlap = isLondonSession && isNYSession
      
      // Signal quality based on market session
      let baseQuality = 50
      if (isOverlap) baseQuality = 75 // Best signals during overlap
      else if (isLondonSession || isNYSession) baseQuality = 65
      
      const volatilityFactor = Math.random() * 30
      const probability = Math.min(95, Math.max(45, baseQuality + volatilityFactor))
      
      const type = Math.random() > 0.5 ? 'BUY' : 'SELL'
      let strength: string
      let confidence: string
      
      if (probability >= 80) {
        strength = 'STRONG'
        confidence = 'HIGH'
      } else if (probability >= 65) {
        strength = 'MEDIUM'
        confidence = 'MEDIUM'
      } else {
        strength = 'WEAK'
        confidence = 'LOW'
      }
      
      // Calculate realistic entry, SL, TP levels
      const currentPrice = (rate.bid + rate.ask) / 2
      const isJPY = rate.symbol.includes('JPY')
      const pipValue = isJPY ? 0.01 : 0.0001
      
      // Professional risk management (1:2 or 1:3 risk/reward)
      const riskPips = 15 + Math.random() * 25 // 15-40 pips risk
      const rewardMultiplier = 2 + Math.random() // 2-3x reward
      const rewardPips = riskPips * rewardMultiplier
      
      const entry = currentPrice
      const stopLoss = type === 'BUY' ? 
        entry - riskPips * pipValue :
        entry + riskPips * pipValue
      const takeProfit = type === 'BUY' ? 
        entry + rewardPips * pipValue :
        entry - rewardPips * pipValue

      // Professional timeframes based on signal strength
      const timeFrames = strength === 'STRONG' ? ['1H', '4H'] : 
                        strength === 'MEDIUM' ? ['15M', '1H'] : ['1M', '5M']

      // Professional AI analysis reasons
      const reasons = [
        'Institutional order flow detected + RSI confirmation',
        'Multi-timeframe trend alignment with volume surge',
        'Key support/resistance level with price action confirmation',
        'MACD histogram bullish crossover + momentum divergence',
        'Fibonacci confluence zone with institutional interest',
        'Smart money reversal pattern + volume profile analysis',
        'Break and retest of major structure level',
        'Market maker liquidity grab with retail trap completion'
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
        timeFrame: timeFrames[Math.floor(Math.random() * timeFrames.length)],
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        binaryExpiry: strength === 'STRONG' ? 10 + Math.floor(Math.random() * 25) : 
                     strength === 'MEDIUM' ? 5 + Math.floor(Math.random() * 15) : 1 + Math.floor(Math.random() * 10),
        confidence
      })
    }
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

// Generate ultra-realistic chart data like TradingView
function generateChartData(pair: string, timeframe: string) {
  const data = []
  const baseRates: Record<string, number> = {
    'EURUSD': 1.0847, 'GBPUSD': 1.2749, 'USDJPY': 149.23,
    'USDCHF': 0.8948, 'AUDUSD': 0.6449, 'USDCAD': 1.3648,
    'NZDUSD': 0.5946, 'EURGBP': 0.8648, 'EURJPY': 157.92, 'GBPJPY': 182.35
  }
  
  let currentPrice = baseRates[pair] || 1.0000
  let trend = Math.random() > 0.5 ? 1 : -1 // Overall trend direction
  let trendStrength = 0.3 + Math.random() * 0.4 // 0.3-0.7
  const isJPY = pair.includes('JPY')
  
  // Generate 100 candles
  for (let i = 0; i < 100; i++) {
    const timeMs = Date.now() - (100 - i) * getTimeframeMs(timeframe)
    const sessionHour = new Date(timeMs).getUTCHours()
    
    // Trend continuation vs reversal probability
    if (Math.random() < 0.05) { // 5% chance of trend change
      trend *= -1
      trendStrength = 0.2 + Math.random() * 0.5
    }
    
    // Market structure: support/resistance levels
    const supportResistance = Math.floor(currentPrice * 10000) / 10000
    const nearLevel = Math.abs(currentPrice - supportResistance) < 0.0005
    
    // Session-based volatility
    let sessionVolatility = 1.0
    if ((sessionHour >= 8 && sessionHour <= 17) || (sessionHour >= 13 && sessionHour <= 22)) {
      sessionVolatility = 1.5 // Active sessions
    } else if (sessionHour >= 22 || sessionHour <= 6) {
      sessionVolatility = 0.4 // Quiet Asian late/early European
    }
    
    // Generate OHLC with realistic price action
    const open = currentPrice
    
    // Base movement with trend bias
    const baseMove = isJPY ? 0.02 : 0.0002
    const trendMove = trend * trendStrength * baseMove * sessionVolatility
    const randomMove = (Math.random() - 0.5) * baseMove * 2 * sessionVolatility
    const totalMove = trendMove + randomMove
    
    // Support/resistance reaction
    let finalMove = totalMove
    if (nearLevel && Math.random() < 0.7) {
      finalMove *= -0.5 // 70% chance of bounce at key levels
    }
    
    const close = open + finalMove
    
    // Realistic wick generation
    const bodySize = Math.abs(close - open)
    const upperWickMax = bodySize * (0.5 + Math.random() * 1.5)
    const lowerWickMax = bodySize * (0.5 + Math.random() * 1.5)
    
    const high = Math.max(open, close) + (Math.random() * upperWickMax)
    const low = Math.min(open, close) - (Math.random() * lowerWickMax)
    
    // Volume based on volatility and session
    const baseVolume = 500
    const volatilityVolume = bodySize * 100000 // Higher volume on bigger moves
    const sessionVolumeMultiplier = sessionVolatility
    const volume = Math.floor(baseVolume + volatilityVolume * sessionVolumeMultiplier + Math.random() * 1000)
    
    data.push({
      time: new Date(timeMs).toISOString(),
      open: parseFloat(open.toFixed(isJPY ? 2 : 4)),
      high: parseFloat(high.toFixed(isJPY ? 2 : 4)),
      low: parseFloat(low.toFixed(isJPY ? 2 : 4)),
      close: parseFloat(close.toFixed(isJPY ? 2 : 4)),
      volume: Math.round(volume)
    })
    
    currentPrice = close
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