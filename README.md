# StockSync — Real-time Stock Management Platform

A full-stack MERN + Tailwind CSS stock management app with live price updates via WebSocket.

## Features
- **Live Market Data** — 12 major stocks (AAPL, MSFT, GOOGL, AMZN, TSLA, META, NVDA, NFLX, JPM, V, WMT, DIS) updated every 5 seconds via WebSocket
- **Live Ticker** — scrolling price ticker at the top of every page
- **Portfolio Management** — buy/sell stocks, track P&L, allocation pie chart
- **Watchlist** — star any stock to track it; buy directly from watchlist
- **Price Alerts** — set above/below price alerts with live progress bar; triggers toast notification
- **Price Flash** — green/red flash animation when prices change
- **Auth** — JWT-based register/login

## Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017
- Finnhub API key (free tier: https://finnhub.io)

## Setup

### 1. Backend
```bash
cd backend
npm install
# Edit .env if needed (default: mongodb://localhost:27017/stock_sync)
# Add your Finnhub API key: FINNHUB_API_KEY=your_key_here
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 — register an account and start trading!

## Project Structure
```
Stock_Sync/
├── backend/
│   ├── models/         # User, Portfolio, Watchlist, Alert
│   ├── routes/         # auth, stocks, portfolio, watchlist, alerts
│   ├── middleware/     # JWT auth
│   ├── utils/          # stockService (price simulation + caching)
│   └── server.js       # Express + WebSocket server
└── frontend/
    └── src/
        ├── components/ # Navbar, StockCard, StockTicker, TradeModal
        ├── context/    # AuthContext, StockContext (WebSocket)
        └── pages/      # Dashboard, Market, Portfolio, Watchlist, Alerts
```
