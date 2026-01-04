/**
 * STATE MANAGER
 * Menyimpan semua state aplikasi di memory
 * State akan hilang saat server restart (volatile)
 */

class StateManager {
  constructor() {
    this.reset();
  }

  // Inisialisasi state awal
  reset() {
    this.state = {
      balance: 1000000,           // Saldo virtual (Rp 1 juta)
      lastPrice: null,            // Harga terakhir yang diinput
      currentPosition: 'HOLD',    // Posisi saat ini (HOLD/BUY/SELL)
      holdings: 0,                // Jumlah aset yang dimiliki
      transactionLogs: [],        // Array log semua transaksi
      totalTransactions: 0,       // Counter transaksi
      profitLoss: 0               // Total untung/rugi
    };
  }

  // Getter untuk mendapatkan state saat ini
  getState() {
    return {
      ...this.state,
      stateInfo: '⚠️ State disimpan di memory, akan reset saat server restart'
    };
  }

  // Update harga terakhir
  updateLastPrice(price) {
    this.state.lastPrice = price;
  }

  // Update posisi
  updatePosition(position) {
    this.state.currentPosition = position;
  }

  // Eksekusi transaksi BUY
  executeBuy(price, quantity = 1) {
    const cost = price * quantity;
    
    if (this.state.balance < cost) {
      throw new Error('Saldo tidak cukup untuk melakukan pembelian');
    }

    this.state.balance -= cost;
    this.state.holdings += quantity;
    this.state.totalTransactions++;

    const log = {
      id: this.state.totalTransactions,
      timestamp: new Date().toISOString(),
      action: 'BUY',
      price: price,
      quantity: quantity,
      cost: cost,
      balanceAfter: this.state.balance,
      holdingsAfter: this.state.holdings
    };

    this.state.transactionLogs.push(log);
    return log;
  }

  // Eksekusi transaksi SELL
  executeSell(price, quantity = 1) {
    if (this.state.holdings < quantity) {
      throw new Error('Tidak ada aset untuk dijual');
    }

    const revenue = price * quantity;
    this.state.balance += revenue;
    this.state.holdings -= quantity;
    this.state.totalTransactions++;

    const log = {
      id: this.state.totalTransactions,
      timestamp: new Date().toISOString(),
      action: 'SELL',
      price: price,
      quantity: quantity,
      revenue: revenue,
      balanceAfter: this.state.balance,
      holdingsAfter: this.state.holdings
    };

    this.state.transactionLogs.push(log);
    return log;
  }

  // Catat aksi HOLD
  logHold(price) {
    const log = {
      id: ++this.state.totalTransactions,
      timestamp: new Date().toISOString(),
      action: 'HOLD',
      price: price,
      reason: 'Harga tidak berubah atau kondisi tidak memenuhi kriteria trading'
    };

    this.state.transactionLogs.push(log);
    return log;
  }

  // Get semua logs
  getLogs() {
    return {
      totalLogs: this.state.transactionLogs.length,
      logs: this.state.transactionLogs
    };
  }

  // Hitung profit/loss
  calculateProfitLoss() {
    const initialBalance = 1000000;
    const currentPortfolioValue = this.state.balance + 
      (this.state.holdings * (this.state.lastPrice || 0));
    
    this.state.profitLoss = currentPortfolioValue - initialBalance;
    
    return {
      initialBalance,
      currentBalance: this.state.balance,
      holdings: this.state.holdings,
      lastPrice: this.state.lastPrice,
      portfolioValue: currentPortfolioValue,
      profitLoss: this.state.profitLoss,
      profitLossPercentage: ((this.state.profitLoss / initialBalance) * 100).toFixed(2) + '%'
    };
  }
}

// Singleton instance
const stateManager = new StateManager();

module.exports = stateManager;