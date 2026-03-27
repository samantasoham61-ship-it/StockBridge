const express = require('express');
const cron = require('node-cron');
const { getStockData, getAllMajorStocks } = require('../utils/stockService');
const router = express.Router();

router.get('/market', async (req, res) => {
  try {
    const stocks = await getAllMajorStocks();
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:symbol', async (req, res) => {
  try {
    const data = await getStockData(req.params.symbol.toUpperCase());
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Broadcast real-time updates every 5 seconds
cron.schedule('*/5 * * * * *', async () => {
  try {
    const stocks = await getAllMajorStocks();
    if (global.broadcastStockUpdate) {
      global.broadcastStockUpdate({ type: 'STOCK_UPDATE', data: stocks });
    }
  } catch (err) {
    console.error('Cron error:', err.message);
  }
});

module.exports = router;
