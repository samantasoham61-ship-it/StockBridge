const express = require('express');
const Watchlist = require('../models/Watchlist');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ userId: req.userId });
    res.json(watchlist || { stocks: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/add', auth, async (req, res) => {
  try {
    const { symbol, name } = req.body;
    let watchlist = await Watchlist.findOne({ userId: req.userId });
    if (!watchlist) watchlist = new Watchlist({ userId: req.userId, stocks: [] });

    if (!watchlist.stocks.find(s => s.symbol === symbol)) {
      watchlist.stocks.push({ symbol, name });
      await watchlist.save();
    }
    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/remove/:symbol', auth, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ userId: req.userId });
    if (watchlist) {
      watchlist.stocks = watchlist.stocks.filter(s => s.symbol !== req.params.symbol);
      await watchlist.save();
    }
    res.json(watchlist || { stocks: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
