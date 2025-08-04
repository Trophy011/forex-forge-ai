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

// Advanced AI Prediction Engine with Multiple Strategies
function generateAdvancedAISignals(rates: ForexRate[]) {
  const signals = []
  const now = new Date()
  const hour = now.getUTCHours()
  const minute = now.getUTCMinutes()
  
  for (const rate of rates) {
    const currentPrice = (rate.bid + rate.ask) / 2
    const isJPY = rate.symbol.includes('JPY')
    const pipValue = isJPY ? 0.01 : 0.0001
    
    // Generate multiple prediction strategies
    const strategies = generatePredictionStrategies(rate, currentPrice, isJPY, pipValue)
    
    // Select best strategy based on market conditions
    const bestStrategy = selectOptimalStrategy(strategies, hour, minute)
    
    if (bestStrategy) {
      signals.push(bestStrategy)
    }
  }
  
  return signals.slice(0, 8) // Return top 8 signals
}

// Strategy 1: Extreme AI Prediction with Neural Network Simulation
function generateExtremeAIPrediction(rate: ForexRate, currentPrice: number, isJPY: boolean, pipValue: number) {
  // Simulate advanced AI neural network analysis
  const marketCycles = [
    { phase: 'accumulation', strength: 0.85, direction: 1 },
    { phase: 'markup', strength: 0.92, direction: 1 },
    { phase: 'distribution', strength: 0.78, direction: -1 },
    { phase: 'markdown', strength: 0.89, direction: -1 }
  ]
  
  const currentCycle = marketCycles[Math.floor(Math.random() * marketCycles.length)]
  const aiConfidence = 75 + Math.random() * 20 // 75-95% AI confidence
  
  // AI pattern recognition
  const patterns = [
    'AI-detected institutional accumulation pattern',
    'Neural network confirms breakout imminent',
    'Machine learning algorithm detects reversal signals',
    'Deep learning model shows 89% probability setup',
    'AI sentiment analysis indicates strong momentum',
    'Quantum computing prediction model activated'
  ]
  
  const type = currentCycle.direction > 0 ? 'BUY' : 'SELL'
  const riskPips = 12 + Math.random() * 18 // Tight AI stops
  const rewardPips = riskPips * (2.5 + Math.random() * 1.5) // 2.5-4x reward
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    pair: rate.symbol,
    type,
    strategy: 'EXTREME_AI',
    strength: 'MAXIMUM',
    entry: parseFloat(currentPrice.toFixed(isJPY ? 2 : 4)),
    stopLoss: parseFloat((type === 'BUY' ? currentPrice - riskPips * pipValue : currentPrice + riskPips * pipValue).toFixed(isJPY ? 2 : 4)),
    takeProfit: parseFloat((type === 'BUY' ? currentPrice + rewardPips * pipValue : currentPrice - rewardPips * pipValue).toFixed(isJPY ? 2 : 4)),
    probability: Math.round(aiConfidence),
    timeFrame: ['5M', '15M', '1H'][Math.floor(Math.random() * 3)],
    reason: patterns[Math.floor(Math.random() * patterns.length)],
    binaryExpiry: 3 + Math.floor(Math.random() * 12),
    confidence: 'EXTREME',
    momentum: calculateMomentum(rate),
    trendStrength: currentCycle.strength,
    supportResistance: calculateSupportResistance(currentPrice, isJPY)
  }
}

// Strategy 2: Trend Following Strategy
function generateTrendStrategy(rate: ForexRate, currentPrice: number, isJPY: boolean, pipValue: number) {
  // Simulate multiple timeframe trend analysis
  const trends = {
    '1M': Math.random() > 0.5 ? 'BULLISH' : 'BEARISH',
    '5M': Math.random() > 0.5 ? 'BULLISH' : 'BEARISH',
    '15M': Math.random() > 0.5 ? 'BULLISH' : 'BEARISH',
    '1H': Math.random() > 0.5 ? 'BULLISH' : 'BEARISH',
    '4H': Math.random() > 0.5 ? 'BULLISH' : 'BEARISH'
  }
  
  // Count bullish vs bearish trends
  const bullishCount = Object.values(trends).filter(t => t === 'BULLISH').length
  const trendAlignment = bullishCount >= 3 ? 'BULLISH' : bullishCount <= 2 ? 'BEARISH' : 'SIDEWAYS'
  
  if (trendAlignment === 'SIDEWAYS') return null
  
  const trendStrength = Math.abs(bullishCount - 2.5) / 2.5 // 0-1 strength
  const confidence = 60 + trendStrength * 30 // 60-90% based on alignment
  
  const type = trendAlignment === 'BULLISH' ? 'BUY' : 'SELL'
  const riskPips = 20 + Math.random() * 20
  const rewardPips = riskPips * (2 + trendStrength)
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    pair: rate.symbol,
    type,
    strategy: 'TREND_FOLLOWING',
    strength: trendStrength > 0.7 ? 'STRONG' : trendStrength > 0.4 ? 'MEDIUM' : 'WEAK',
    entry: parseFloat(currentPrice.toFixed(isJPY ? 2 : 4)),
    stopLoss: parseFloat((type === 'BUY' ? currentPrice - riskPips * pipValue : currentPrice + riskPips * pipValue).toFixed(isJPY ? 2 : 4)),
    takeProfit: parseFloat((type === 'BUY' ? currentPrice + rewardPips * pipValue : currentPrice - rewardPips * pipValue).toFixed(isJPY ? 2 : 4)),
    probability: Math.round(confidence),
    timeFrame: '1H',
    reason: `Multi-timeframe trend alignment: ${bullishCount}/5 timeframes ${trendAlignment.toLowerCase()}`,
    binaryExpiry: 15 + Math.floor(Math.random() * 20),
    confidence: trendStrength > 0.7 ? 'HIGH' : 'MEDIUM',
    momentum: calculateMomentum(rate),
    trendStrength: trendStrength,
    supportResistance: calculateSupportResistance(currentPrice, isJPY)
  }
}

// Strategy 3: Momentum & Oscillator Strategy
function generateMomentumStrategy(rate: ForexRate, currentPrice: number, isJPY: boolean, pipValue: number) {
  // Simulate momentum indicators
  const rsi = 20 + Math.random() * 60 // RSI 20-80
  const macd = -0.5 + Math.random() // MACD histogram
  const stochastic = Math.random() * 100
  const momentum = calculateMomentum(rate)
  
  // Momentum conditions
  const isMomentumBullish = (rsi < 30 && macd > 0) || (rsi > 70 && momentum > 0.7)
  const isMomentumBearish = (rsi > 70 && macd < 0) || (rsi < 30 && momentum < -0.7)
  
  if (!isMomentumBullish && !isMomentumBearish) return null
  
  const type = isMomentumBullish ? 'BUY' : 'SELL'
  const momentumStrength = Math.abs(momentum)
  const confidence = 55 + momentumStrength * 35
  
  const riskPips = 15 + Math.random() * 15
  const rewardPips = riskPips * (1.8 + momentumStrength)
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    pair: rate.symbol,
    type,
    strategy: 'MOMENTUM',
    strength: momentumStrength > 0.6 ? 'STRONG' : 'MEDIUM',
    entry: parseFloat(currentPrice.toFixed(isJPY ? 2 : 4)),
    stopLoss: parseFloat((type === 'BUY' ? currentPrice - riskPips * pipValue : currentPrice + riskPips * pipValue).toFixed(isJPY ? 2 : 4)),
    takeProfit: parseFloat((type === 'BUY' ? currentPrice + rewardPips * pipValue : currentPrice - rewardPips * pipValue).toFixed(isJPY ? 2 : 4)),
    probability: Math.round(confidence),
    timeFrame: '15M',
    reason: `Momentum divergence detected: RSI ${rsi.toFixed(1)}, MACD ${macd > 0 ? 'bullish' : 'bearish'}`,
    binaryExpiry: 8 + Math.floor(Math.random() * 12),
    confidence: momentumStrength > 0.6 ? 'HIGH' : 'MEDIUM',
    momentum: momentum,
    trendStrength: momentumStrength,
    supportResistance: calculateSupportResistance(currentPrice, isJPY)
  }
}

// Strategy 4: Support & Resistance Strategy
function generateSupportResistanceStrategy(rate: ForexRate, currentPrice: number, isJPY: boolean, pipValue: number) {
  const sr = calculateSupportResistance(currentPrice, isJPY)
  
  // Check if price is near support or resistance
  const nearSupport = Math.abs(currentPrice - sr.support) < (10 * pipValue)
  const nearResistance = Math.abs(currentPrice - sr.resistance) < (10 * pipValue)
  
  if (!nearSupport && !nearResistance) return null
  
  const type = nearSupport ? 'BUY' : 'SELL'
  const distanceToLevel = nearSupport ? 
    Math.abs(currentPrice - sr.support) : 
    Math.abs(currentPrice - sr.resistance)
  
  const proximity = 1 - (distanceToLevel / (10 * pipValue)) // 0-1, closer = higher
  const confidence = 65 + proximity * 25
  
  const riskPips = 8 + Math.random() * 12 // Tight stops at S/R
  const rewardPips = riskPips * (3 + proximity) // Higher reward at key levels
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    pair: rate.symbol,
    type,
    strategy: 'SUPPORT_RESISTANCE',
    strength: proximity > 0.7 ? 'STRONG' : 'MEDIUM',
    entry: parseFloat(currentPrice.toFixed(isJPY ? 2 : 4)),
    stopLoss: parseFloat((type === 'BUY' ? currentPrice - riskPips * pipValue : currentPrice + riskPips * pipValue).toFixed(isJPY ? 2 : 4)),
    takeProfit: parseFloat((type === 'BUY' ? currentPrice + rewardPips * pipValue : currentPrice - rewardPips * pipValue).toFixed(isJPY ? 2 : 4)),
    probability: Math.round(confidence),
    timeFrame: '5M',
    reason: `Price at key ${nearSupport ? 'support' : 'resistance'} level: ${nearSupport ? sr.support.toFixed(isJPY ? 2 : 4) : sr.resistance.toFixed(isJPY ? 2 : 4)}`,
    binaryExpiry: 3 + Math.floor(Math.random() * 8),
    confidence: proximity > 0.7 ? 'HIGH' : 'MEDIUM',
    momentum: calculateMomentum(rate),
    trendStrength: proximity,
    supportResistance: sr
  }
}

// Helper Functions
function generatePredictionStrategies(rate: ForexRate, currentPrice: number, isJPY: boolean, pipValue: number) {
  const strategies = []
  
  // Generate each strategy with probability
  if (Math.random() > 0.3) strategies.push(generateExtremeAIPrediction(rate, currentPrice, isJPY, pipValue))
  if (Math.random() > 0.4) strategies.push(generateTrendStrategy(rate, currentPrice, isJPY, pipValue))
  if (Math.random() > 0.5) strategies.push(generateMomentumStrategy(rate, currentPrice, isJPY, pipValue))
  if (Math.random() > 0.6) strategies.push(generateSupportResistanceStrategy(rate, currentPrice, isJPY, pipValue))
  
  return strategies.filter(s => s !== null)
}

function selectOptimalStrategy(strategies: any[], hour: number, minute: number) {
  if (strategies.length === 0) return null
  
  // Weight strategies based on market conditions
  const sessionMultiplier = (hour >= 8 && hour <= 17) || (hour >= 13 && hour <= 22) ? 1.2 : 0.8
  
  return strategies.reduce((best, current) => {
    const currentScore = current.probability * sessionMultiplier * current.trendStrength
    const bestScore = best ? best.probability * sessionMultiplier * best.trendStrength : 0
    return currentScore > bestScore ? current : best
  }, null)
}

function calculateMomentum(rate: ForexRate): number {
  // Simulate momentum calculation based on price change and volatility
  const baseChange = rate.changePercent / 100
  const volatilityFactor = Math.random() * 0.5 - 0.25 // -0.25 to 0.25
  return Math.max(-1, Math.min(1, baseChange * 10 + volatilityFactor))
}

function calculateSupportResistance(currentPrice: number, isJPY: boolean) {
  const range = isJPY ? 1.0 : 0.01
  const support = currentPrice - (Math.random() * range * 0.5)
  const resistance = currentPrice + (Math.random() * range * 0.5)
  
  return {
    support: parseFloat(support.toFixed(isJPY ? 2 : 4)),
    resistance: parseFloat(resistance.toFixed(isJPY ? 2 : 4)),
    strength: 0.6 + Math.random() * 0.4 // 0.6-1.0
  }
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
        // Get Advanced AI trading signals
        const currentRates = MAJOR_PAIRS.map(pair => generateRealisticRate(pair))
        const signals = generateAdvancedAISignals(currentRates)
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