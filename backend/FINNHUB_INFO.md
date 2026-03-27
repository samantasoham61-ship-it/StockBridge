# Finnhub API Configuration

## Current Setup
Your app now uses **Finnhub.io** for real-time stock data!

**API Key:** `d72j5mhr01qlfd9nev9gd72j5mhr01qlfd9neva0`

## Why Finnhub?

✅ **Better Rate Limits** - 60 requests/minute (vs Alpha Vantage's 5/min)  
✅ **More Reliable** - Better uptime and response times  
✅ **Real-time Data** - Current market prices  
✅ **Free Tier** - Perfect for development  

## How It Works

### Data Flow
1. **Seed data** loads instantly on server start
2. **After 3 seconds** - Fetches real data from Finnhub for all 12 stocks
3. **Every 5 seconds** - WebSocket broadcasts simulated price updates
4. **Every 1 hour** - Refreshes real data from Finnhub

### API Endpoints Used
- `GET /quote` - Real-time stock quotes (price, open, high, low, change)

## Rate Limits

**Free Tier:**
- 60 API calls/minute
- 30 API calls/second

**Our Usage:**
- Initial fetch: 12 stocks = 12 calls (~12 seconds)
- Hourly refresh: 12 calls
- Well within limits! ✅

## What You'll See

**On Server Start:**
```
🌱 Initializing seed data for all stocks...
  AAPL: $176.23 (+2.15, +1.23%)
  MSFT: $382.45 (-1.87, -0.49%)
  ...
✅ Seed data initialized for all stocks

🔄 Fetching real stock data from Finnhub...
Fetching AAPL... (1/12)
✅ AAPL: $175.43 (+2.15)
Fetching MSFT... (2/12)
✅ MSFT: $380.12 (-1.23)
...
✅ Fetch complete: 12 succeeded, 0 using seed data
```

## Troubleshooting

If you see errors:
1. Check API key is correct in `.env`
2. Verify internet connection
3. Check Finnhub status: https://finnhub.io/status

**Note:** App works perfectly even if API fails - seed data provides realistic fallback!
