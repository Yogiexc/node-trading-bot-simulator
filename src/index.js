/**
 * MAIN APPLICATION
 * Entry point aplikasi Express.js
 */

const express = require('express');
const tradingRoutes = require('./routes/tradingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', tradingRoutes);

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🎮 Trading Bot Simulator - Educational Purpose Only',
    warning: '⚠️ Ini adalah SIMULATOR. Tidak ada koneksi ke market nyata.',
    endpoints: {
      'POST /api/price': 'Input harga dan dapatkan keputusan trading',
      'GET /api/state': 'Lihat status bot saat ini',
      'GET /api/logs': 'Lihat semua transaction logs',
      'POST /api/reset': 'Reset bot ke kondisi awal'
    },
    example: {
      method: 'POST',
      url: '/api/price',
      body: { price: 1000 }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint tidak ditemukan',
    availableEndpoints: [
      'GET /',
      'POST /api/price',
      'GET /api/state',
      'GET /api/logs',
      'POST /api/reset'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Trading Bot Simulator is running!');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log('⚠️  WARNING: Ini adalah simulator edukatif');
  console.log('❌ TIDAK terhubung ke market nyata');
  console.log('='.repeat(50));
});