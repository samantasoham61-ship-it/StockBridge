const axios = require('axios');

/**
 * Stock Service - Provides real-time stock data
 * 
 * Data Flow:
 * 1. Seed data is initialized immediately on server start (realistic base prices)
 * 2. Prices simulate live movement every 5 seconds via WebSocket
 * 3. Finnhub API attempts to fetch real data (optional, falls back to seed)
 * 4. If API fails/rate-limited, seed data continues to be used with simulated movement
 * 
 * This ensures the app always works even without a valid API key!
 */

const MAJOR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'META', name: 'Meta Platforms' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'JPM', name: 'JPMorgan Chase' },
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'WMT', name: 'Walmart Inc.' },
  { symbol: 'DIS', name: 'Walt Disney Co.' }
];

// Cache: stores last real API data per symbol
const realCache = {};
// Live simulation cache (updated every 5s)
const liveCache = {};

// Seed data - approximate realistic prices (will be replaced by real API data)
const SEED_PRICES = {
  AAPL: 175, MSFT: 380, GOOGL: 140, AMZN: 155,
  TSLA: 245, META: 485, NVDA: 875, NFLX: 485,
  JPM: 185, V: 265, WMT: 165, DIS: 95
};

// Initialize seed data on startup
const initializeSeedData = () => {
  console.log('🌱 Initializing seed data for all stocks...');
  
  MAJOR_STOCKS.forEach(({ symbol }) => {
    const basePrice = SEED_PRICES[symbol] || 100;
    
    // Create realistic variation in initial prices
    const priceVariation = (Math.random() - 0.5) * basePrice * 0.03; // ±3% variation
    const price = parseFloat((basePrice + priceVariation).toFixed(2));
    
    // Generate realistic daily change
    const changePercent = (Math.random() - 0.5) * 4; // ±2% daily change
    const change = parseFloat((price * changePercent / 100).toFixed(2));
    const prevClose = parseFloat((price - change).toFixed(2));
    
    // Generate realistic OHLC data
    const open = parseFloat((prevClose + (Math.random() - 0.5) * price * 0.01).toFixed(2));
    const high = parseFloat((Math.max(price, open, prevClose) + Math.random() * price * 0.02).toFixed(2));
    const low = parseFloat((Math.min(price, open, prevClose) - Math.random() * price * 0.02).toFixed(2));
    
    // Generate realistic volume (10M - 100M shares)
    const volume = Math.floor(Math.random() * 90000000) + 10000000;
    
    liveCache[symbol] = {
      price,
      change,
      changePercent: parseFloat(changePercent.toFixed(2)),
      open,
      high,
      low,
      prevClose,
      volume,
      timestamp: new Date().toISOString()
    };
    
    console.log(`  ${symbol}: $${price} (${change >= 0 ? '+' : ''}${change}, ${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`);
  });
  
  console.log('✅ Seed data initialized for all stocks');
};

// Initialize seed data immediately
initializeSeedData();

const API_KEY = process.env.FINNHUB_API_KEY;
const FINNHUB_BASE = 'https://finnhub.io/api/v1';

// Fetch real quote from Finnhub
const fetchRealQuote = async (symbol) => {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.warn('⚠️ Finnhub API key not configured. Using seed data.');
    return null;
  }
  
  try {
    // Fetch current quote
    const quoteRes = await axios.get(`${FINNHUB_BASE}/quote`, {
      params: { symbol, token: API_KEY },
      timeout: 10000
    });
    
    const quote = quoteRes.data;
    
    // Check if data is valid
    if (!quote || quote.c === 0 || quote.c === null) {
      console.warn(`⚠️ No data returned for ${symbol}`);
      return null;
    }

    const price = parseFloat(quote.c); // Current price
    const prevClose = parseFloat(quote.pc); // Previous close
    const high = parseFloat(quote.h); // High
    const low = parseFloat(quote.l); // Low
    const open = parseFloat(quote.o); // Open
    const change = parseFloat((price - prevClose).toFixed(2));
    const changePercent = parseFloat(((change / prevClose) * 100).toFixed(2));
    
    // Estimate volume (Finnhub doesn't provide volume in quote endpoint)
    const volume = Math.floor(Math.random() * 50000000) + 20000000;

    console.log(`✅ Real data fetched: ${symbol} @ $${price}`);
    return { price, open, high, low, prevClose, change, changePercent, volume };
  } catch (err) {
    if (err.response?.status === 429) {
      console.warn(`⚠️ Finnhub rate limit reached`);
    } else {
      console.error(`❌ Finnhub error for ${symbol}:`, err.message);
    }
    return null;
  }
};

// Simulate small realistic price movement from last known price
const simulatePrice = (symbol) => {
  const base = liveCache[symbol] || realCache[symbol];
  if (!base) return null;

  const lastPrice = base.price;
  // Smaller, more realistic price movements (±0.15%)
  const drift = (Math.random() - 0.5) * lastPrice * 0.003;
  const newPrice = parseFloat(Math.max(lastPrice + drift, lastPrice * 0.5).toFixed(2));
  const change = parseFloat((newPrice - base.prevClose).toFixed(2));
  const changePercent = parseFloat(((change / base.prevClose) * 100).toFixed(2));

  const updated = {
    ...base,
    price: newPrice,
    change,
    changePercent,
    high: Math.max(base.high || newPrice, newPrice),
    low: Math.min(base.low || newPrice, newPrice),
    timestamp: new Date().toISOString()
  };

  liveCache[symbol] = updated;
  return updated;
};

// Fetch all stocks from Finnhub with 1s delay between each (rate limit: 60 req/min)
const fetchAllRealData = async () => {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.log('⚠️ Finnhub API key not configured. Using seed data only.');
    return;
  }
  
  console.log('🔄 Fetching real stock data from Finnhub...');
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < MAJOR_STOCKS.length; i++) {
    const { symbol } = MAJOR_STOCKS[i];
    console.log(`Fetching ${symbol}... (${i + 1}/${MAJOR_STOCKS.length})`);
    const data = await fetchRealQuote(symbol);
    
    if (data) {
      realCache[symbol] = data;
      liveCache[symbol] = { ...data, timestamp: new Date().toISOString() };
      console.log(`✅ ${symbol}: $${data.price} (${data.change >= 0 ? '+' : ''}${data.change})`);
      successCount++;
    } else {
      console.log(`⚠️ ${symbol}: Using seed data`);
      failCount++;
    }
    
    // 1s gap between requests (Finnhub allows 60 req/min)
    if (i < MAJOR_STOCKS.length - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  console.log(`✅ Fetch complete: ${successCount} succeeded, ${failCount} using seed data`);
};

// Start fetching real data on boot (will replace seed data), then refresh every 1 hour
// Seed data will be used until real data is available
setTimeout(() => fetchAllRealData(), 3000); // Start after 3 seconds
setInterval(fetchAllRealData, 60 * 60 * 1000); // Every 1 hour

const getStockData = async (symbol) => {
  // Try simulation first (uses cached data)
  const simulated = simulatePrice(symbol);
  if (simulated) return { symbol, ...simulated };

  // If no cache exists, try fetching real data
  const data = await fetchRealQuote(symbol);
  if (data) {
    realCache[symbol] = data;
    liveCache[symbol] = { ...data, timestamp: new Date().toISOString() };
    return { symbol, ...data };
  }

  // Should not reach here due to seed data initialization
  console.warn(`No data available for ${symbol}`);
  return null;
};

const getAllMajorStocks = async () => {
  const results = await Promise.all(
    MAJOR_STOCKS.map(async ({ symbol, name }) => {
      const data = await getStockData(symbol);
      if (!data) {
        console.error(`Failed to get data for ${symbol}`);
        return null;
      }
      return { ...data, name };
    })
  );
  return results.filter(stock => stock !== null);
};

module.exports = { getStockData, getAllMajorStocks, MAJOR_STOCKS };
