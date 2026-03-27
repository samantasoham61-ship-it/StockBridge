# 🚀 StockSync - Quick Reference Card

## Start Application

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev
```

**Access:** http://localhost:5173

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Stocks
- `GET /api/stocks/market` - Get all stocks
- `GET /api/stocks/:symbol` - Get single stock

### Portfolio
- `GET /api/portfolio` - Get user portfolio
- `POST /api/portfolio/buy` - Buy stock
- `POST /api/portfolio/sell` - Sell stock

### Watchlist
- `GET /api/watchlist` - Get user watchlist
- `POST /api/watchlist/add` - Add to watchlist
- `DELETE /api/watchlist/remove/:symbol` - Remove from watchlist

### Alerts
- `GET /api/alerts` - Get user alerts
- `POST /api/alerts` - Create alert
- `DELETE /api/alerts/:id` - Delete alert

### Transactions
- `GET /api/transactions` - Get user transactions

---

## WebSocket Events

**Server → Client:**
```json
{
  "type": "STOCK_UPDATE",
  "data": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "price": 175.43,
      "change": 2.15,
      "changePercent": 1.24,
      "volume": 45000000,
      "high": 176.50,
      "low": 173.20,
      "open": 174.00,
      "prevClose": 173.28
    }
  ]
}
```

**Frequency:** Every 5 seconds

---

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stock_sync
JWT_SECRET=your_jwt_secret_key_here
FINNHUB_API_KEY=d72j5mhr01qlfd9nev9gd72j5mhr01qlfd9neva0
```

---

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Portfolio
```javascript
{
  userId: ObjectId,
  holdings: [{
    symbol: String,
    name: String,
    quantity: Number,
    avgBuyPrice: Number,
    currentPrice: Number
  }],
  totalInvested: Number
}
```

### Watchlist
```javascript
{
  userId: ObjectId,
  stocks: [{
    symbol: String,
    name: String,
    addedAt: Date
  }]
}
```

### Alert
```javascript
{
  userId: ObjectId,
  symbol: String,
  targetPrice: Number,
  condition: String ('above' | 'below'),
  isActive: Boolean,
  triggered: Boolean,
  createdAt: Date
}
```

### Transaction
```javascript
{
  userId: ObjectId,
  symbol: String,
  type: String ('buy' | 'sell'),
  quantity: Number,
  price: Number,
  total: Number,
  createdAt: Date
}
```

---

## Stock Symbols

| Symbol | Company |
|--------|---------|
| AAPL | Apple Inc. |
| MSFT | Microsoft Corp. |
| GOOGL | Alphabet Inc. |
| AMZN | Amazon.com Inc. |
| TSLA | Tesla Inc. |
| META | Meta Platforms |
| NVDA | NVIDIA Corp. |
| NFLX | Netflix Inc. |
| JPM | JPMorgan Chase |
| V | Visa Inc. |
| WMT | Walmart Inc. |
| DIS | Walt Disney Co. |

---

## Useful Commands

### Backend
```bash
npm install          # Install dependencies
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
```

### Frontend
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### MongoDB
```bash
mongod               # Start MongoDB server
mongo                # Open MongoDB shell
use stock_sync       # Switch to database
db.users.find()      # View all users
db.portfolios.find() # View all portfolios
```

---

## Keyboard Shortcuts (Browser)

- `Ctrl/Cmd + K` - Focus search (if implemented)
- `Ctrl/Cmd + R` - Refresh page
- `F12` - Open DevTools
- `Ctrl/Cmd + Shift + I` - Open DevTools

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change PORT in .env |
| MongoDB connection failed | Start MongoDB: `mongod` |
| WebSocket not connecting | Check backend is running |
| CORS errors | Verify backend CORS config |
| Stocks not loading | Check backend logs for API errors |
| Login fails | Verify MongoDB connection |

---

## File Structure

```
Stock_Sync/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Stock service
│   ├── .env             # Environment variables
│   └── server.js        # Main server file
└── frontend/
    └── src/
        ├── components/  # Reusable UI components
        ├── context/     # React contexts
        ├── pages/       # Page components
        ├── utils/       # Helper functions
        └── App.jsx      # Main app component
```

---

## Testing Credentials

Create your own account via register page!

**Demo Flow:**
1. Register with any email/password
2. Login with credentials
3. Start trading!

---

## Performance Metrics

- **Initial Load:** ~2s
- **API Fetch:** ~12s (12 stocks)
- **WebSocket Update:** Every 5s
- **API Refresh:** Every 1 hour
- **JWT Expiry:** 7 days

---

## Color Palette

```css
Primary Blue:    #4a9eff
Success Green:   #00d4aa
Danger Red:      #ff4757
Warning Yellow:  #ffd700
Purple:          #a855f7
Background:      #0a0e1a
Card:            #0f1629
Border:          rgba(255,255,255,0.1)
```

---

## Currency Conversion

**USD to INR:** 83.5 (hardcoded in `frontend/src/utils/currency.js`)

```javascript
formatINR(100)  // ₹8,350.00
```

---

## Support

📧 Check STARTUP_GUIDE.md for detailed troubleshooting
📚 Visit Help page in app for user guide
🐛 Check browser console for errors
📊 Check backend logs for API issues

---

**Last Updated:** 2024
**Version:** 1.0.0
**Status:** ✅ Production Ready
