/**
 * TRADING ROUTES
 * Mendefinisikan semua endpoint API
 */

const express = require('express');
const router = express.Router();
const tradingService = require('../services/tradingService');

/**
 * POST /price
 * Input harga baru dan dapatkan keputusan trading
 */
router.post('/price', (req, res) => {
  try {
    const { price } = req.body;

    if (!price) {
      return res.status(400).json({
        error: 'Field "price" wajib diisi',
        example: { price: 1000 }
      });
    }

    const result = tradingService.processPrice(price);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /state
 * Mendapatkan status bot saat ini
 */
router.get('/state', (req, res) => {
  try {
    const status = tradingService.getStatus();

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /logs
 * Mendapatkan semua transaction logs
 */
router.get('/logs', (req, res) => {
  try {
    const logs = tradingService.getTransactionLogs();

    res.json({
      success: true,
      data: logs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /reset
 * Reset bot ke kondisi awal
 */
router.post('/reset', (req, res) => {
  try {
    const result = tradingService.resetBot();

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;