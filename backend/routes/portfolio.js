const express = require('express');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const { getStockData } = require('../utils/stockService');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.userId });
    if (!portfolio) return res.json({ holdings: [], totalInvested: 0 });

    const updatedHoldings = await Promise.all(
      portfolio.holdings.map(async (h) => {
        const stock = await getStockData(h.symbol);
        return { ...h.toObject(), currentPrice: stock.price, change: stock.change, changePercent: stock.changePercent };
      })
    );
    res.json({ ...portfolio.toObject(), holdings: updatedHoldings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/buy', auth, async (req, res) => {
  try {
    const { symbol, name, quantity, price } = req.body;
    let portfolio = await Portfolio.findOne({ userId: req.userId });
    if (!portfolio) portfolio = new Portfolio({ userId: req.userId, holdings: [] });

    const existing = portfolio.holdings.find(h => h.symbol === symbol);
    if (existing) {
      const totalQty = existing.quantity + quantity;
      existing.avgBuyPrice = ((existing.avgBuyPrice * existing.quantity) + (price * quantity)) / totalQty;
      existing.quantity = totalQty;
    } else {
      portfolio.holdings.push({ symbol, name, quantity, avgBuyPrice: price });
    }

    portfolio.totalInvested += price * quantity;
    await portfolio.save();
    await Transaction.create({ userId: req.userId, symbol, name, type: 'buy', quantity, price, total: quantity * price });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/sell', auth, async (req, res) => {
  try {
    const { symbol, quantity, price } = req.body;
    const portfolio = await Portfolio.findOne({ userId: req.userId });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const holding = portfolio.holdings.find(h => h.symbol === symbol);
    if (!holding || holding.quantity < quantity)
      return res.status(400).json({ message: 'Insufficient shares' });

    holding.quantity -= quantity;
    portfolio.totalInvested -= holding.avgBuyPrice * quantity;
    if (holding.quantity === 0) portfolio.holdings = portfolio.holdings.filter(h => h.symbol !== symbol);

    await portfolio.save();
    await Transaction.create({ userId: req.userId, symbol, name: holding.name, type: 'sell', quantity, price, total: quantity * price });
    res.json({ portfolio, profit: (price - holding.avgBuyPrice) * quantity });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
