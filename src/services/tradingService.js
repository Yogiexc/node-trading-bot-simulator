/**
 * TRADING SERVICE
 * Berisi business logic untuk menentukan aksi trading
 * Ini adalah CORE dari simulator
 */

const stateManager = require('../state/stateManager');

class TradingService {
  
  /**
   * MAIN LOGIC: Menentukan aksi berdasarkan harga
   * 
   * RULE TRADING:
   * 1. Jika harga turun → BUY (beli murah)
   * 2. Jika harga naik → SELL (jual mahal)
   * 3. Jika harga sama → HOLD (tunggu)
   * 
   * @param {number} currentPrice - Harga yang diinput user
   * @returns {object} - Hasil keputusan trading
   */
  processPrice(currentPrice) {
    // Validasi input
    if (typeof currentPrice !== 'number' || currentPrice <= 0) {
      throw new Error('Harga harus berupa angka positif');
    }

    const lastPrice = stateManager.state.lastPrice;
    
    // Jika ini input pertama, set sebagai baseline
    if (lastPrice === null) {
      stateManager.updateLastPrice(currentPrice);
      stateManager.updatePosition('HOLD');
      
      return {
        action: 'HOLD',
        reason: 'Harga pertama dijadikan baseline',
        currentPrice: currentPrice,
        lastPrice: null,
        state: stateManager.getState()
      };
    }

    // DECISION LOGIC
    let action;
    let transactionLog = null;
    let reason;

    if (currentPrice < lastPrice) {
      // HARGA TURUN → BUY
      action = 'BUY';
      reason = `Harga turun dari ${lastPrice} ke ${currentPrice} → SIGNAL BUY`;
      
      try {
        transactionLog = stateManager.executeBuy(currentPrice, 1);
      } catch (error) {
        action = 'HOLD';
        reason = `BUY signal, tapi ${error.message}`;
      }
      
    } else if (currentPrice > lastPrice) {
      // HARGA NAIK → SELL
      action = 'SELL';
      reason = `Harga naik dari ${lastPrice} ke ${currentPrice} → SIGNAL SELL`;
      
      try {
        transactionLog = stateManager.executeSell(currentPrice, 1);
      } catch (error) {
        action = 'HOLD';
        reason = `SELL signal, tapi ${error.message}`;
      }
      
    } else {
      // HARGA SAMA → HOLD
      action = 'HOLD';
      reason = `Harga tetap di ${currentPrice} → HOLD`;
      transactionLog = stateManager.logHold(currentPrice);
    }

    // Update state
    stateManager.updateLastPrice(currentPrice);
    stateManager.updatePosition(action);

    // Return response
    return {
      action: action,
      reason: reason,
      currentPrice: currentPrice,
      lastPrice: lastPrice,
      priceDifference: currentPrice - lastPrice,
      transaction: transactionLog,
      state: {
        balance: stateManager.state.balance,
        holdings: stateManager.state.holdings,
        position: stateManager.state.currentPosition
      }
    };
  }

  /**
   * Get status bot lengkap
   */
  getStatus() {
    return {
      ...stateManager.getState(),
      performance: stateManager.calculateProfitLoss()
    };
  }

  /**
   * Get semua transaction logs
   */
  getTransactionLogs() {
    return stateManager.getLogs();
  }

  /**
   * Reset bot ke kondisi awal
   */
  resetBot() {
    stateManager.reset();
    return {
      message: 'Bot berhasil direset ke kondisi awal',
      state: stateManager.getState()
    };
  }
}

module.exports = new TradingService();