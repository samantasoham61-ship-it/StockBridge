# 🚀 Git Deployment Guide

## Push to GitHub Repository

Follow these steps to push your StockSync project to GitHub:

### Step 1: Initialize Git Repository

```bash
cd "c:\Users\Chiranjeevi Pradhan\OneDrive\Desktop\Stock_Sync"
git init
```

### Step 2: Add Remote Repository

```bash
git remote add origin https://github.com/samantasoham61-ship-it/StockBridge.git
```

### Step 3: Add All Files

```bash
git add .
```

### Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: Complete StockSync application with all features"
```

### Step 5: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

---

## If Repository Already Has Content

If the repository already exists and has content, you may need to force push:

```bash
git push -u origin main --force
```

**⚠️ Warning:** Force push will overwrite existing content in the repository.

---

## Alternative: Push to New Branch

If you want to preserve existing content:

```bash
git checkout -b stocksync-app
git push -u origin stocksync-app
```

---

## Verify Push

After pushing, visit:
```
https://github.com/samantasoham61-ship-it/StockBridge
```

You should see all your files uploaded.

---

## Important Notes

### ✅ Files Included in Push:
- All source code (frontend + backend)
- Documentation (README, guides)
- Configuration files
- Package.json files

### ❌ Files Excluded (via .gitignore):
- node_modules/
- .env (sensitive data)
- dist/ build/
- Log files
- IDE settings

### 🔐 Security:
- `.env` file is NOT pushed (contains API keys)
- `.env.example` is pushed (template without secrets)
- Users need to create their own `.env` file

---

## After Pushing

### For Other Developers to Use:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/samantasoham61-ship-it/StockBridge.git
   cd StockBridge
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys
   ```

4. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start the application:**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev

   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

---

## Troubleshooting

### Issue: "fatal: remote origin already exists"
**Solution:**
```bash
git remote remove origin
git remote add origin https://github.com/samantasoham61-ship-it/StockBridge.git
```

### Issue: "Updates were rejected"
**Solution:**
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Issue: Authentication failed
**Solution:**
- Use GitHub Personal Access Token instead of password
- Generate token at: https://github.com/settings/tokens
- Use token as password when prompted

---

## GitHub Repository Setup

### Recommended Repository Settings:

1. **Description:**
   ```
   StockSync - Real-time Stock Management Platform with live WebSocket updates, portfolio tracking, and price alerts
   ```

2. **Topics/Tags:**
   ```
   react, nodejs, mongodb, websocket, stock-market, trading, portfolio, real-time, finnhub-api, mern-stack
   ```

3. **README.md:**
   - Already included in project root
   - Will display automatically on GitHub

4. **License:**
   - Add MIT License or your preferred license

---

## Complete Command Sequence

Copy and paste these commands in order:

```bash
# Navigate to project directory
cd "c:\Users\Chiranjeevi Pradhan\OneDrive\Desktop\Stock_Sync"

# Initialize Git
git init

# Add remote
git remote add origin https://github.com/samantasoham61-ship-it/StockBridge.git

# Stage all files
git add .

# Commit
git commit -m "Initial commit: Complete StockSync application

Features:
- Real-time stock data with Finnhub API
- WebSocket live updates every 5 seconds
- User authentication with JWT
- Portfolio management (buy/sell)
- Watchlist functionality
- Price alerts with notifications
- Transaction history
- Stock comparison tool
- Market news feed
- User profile with avatar upload
- Comprehensive documentation

Tech Stack:
- Frontend: React 19, Vite 8, Tailwind CSS 4
- Backend: Node.js, Express 4, MongoDB, WebSocket
- API: Finnhub.io
- Auth: JWT + bcryptjs"

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Success Indicators

After successful push, you should see:

```
Enumerating objects: XXX, done.
Counting objects: 100% (XXX/XXX), done.
Delta compression using up to X threads
Compressing objects: 100% (XXX/XXX), done.
Writing objects: 100% (XXX/XXX), XXX KiB | XXX MiB/s, done.
Total XXX (delta XXX), reused 0 (delta 0), pack-reused 0
To https://github.com/samantasoham61-ship-it/StockBridge.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## Next Steps After Push

1. ✅ Visit repository on GitHub
2. ✅ Verify all files are present
3. ✅ Check README displays correctly
4. ✅ Add repository description and topics
5. ✅ Share repository link with team
6. ✅ Set up GitHub Actions (optional)
7. ✅ Enable GitHub Pages for docs (optional)

---

**Repository URL:** https://github.com/samantasoham61-ship-it/StockBridge

**Status:** Ready to push! 🚀
