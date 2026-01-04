# Trading Scenarios - Example Use Cases

Dokumen ini berisi contoh skenario trading untuk memahami cara kerja bot simulator.

## Scenario 1: Simple Buy and Sell

**Tujuan:** Beli murah, jual mahal, ambil profit sederhana.

### Steps:
```powershell
# 1. Reset bot
POST /api/reset

# 2. Set baseline
POST /api/price → {"price": 1000}
# Result: HOLD (baseline)

# 3. Harga turun → BUY
POST /api/price → {"price": 950}
# Result: BUY 1 unit @ 950
# Balance: 999,050
# Holdings: 1

# 4. Harga naik → SELL
POST /api/price → {"price": 1050}
# Result: SELL 1 unit @ 1050
# Balance: 1,000,100
# Holdings: 0
# Profit: +100 (0.01%)
```

**Result:** Profit Rp 100 dari satu cycle.

---

## Scenario 2: Dollar Cost Averaging (DCA)

**Tujuan:** Beli bertahap saat harga turun, jual saat naik.

### Steps:
```powershell
# 1. Baseline
POST /api/price → {"price": 1000}

# 2. Harga turun pertama
POST /api/price → {"price": 950}
# BUY 1 @ 950

# 3. Harga turun lagi
POST /api/price → {"price": 900}
# BUY 1 @ 900

# 4. Harga turun lagi
POST /api/price → {"price": 850}
# BUY 1 @ 850

# Total: 3 units dengan average price = (950+900+850)/3 = 900

# 5. Harga naik → SELL semua
POST /api/price → {"price": 1000}
# SELL 1 @ 1000
POST /api/price → {"price": 950}
# HOLD (harga turun, tidak jual)
POST /api/price → {"price": 1050}
# SELL 1 @ 1050
POST /api/price → {"price": 1100}
# SELL 1 @ 1100
```

**Strategy:** Beli saat dip, tunggu rebound.

---

## Scenario 3: Volatile Market

**Tujuan:** Trading di market yang naik-turun cepat.

### Steps:
```powershell
POST /api/price → {"price": 1000}  # Baseline
POST /api/price → {"price": 950}   # BUY
POST /api/price → {"price": 1000}  # SELL (+50)
POST /api/price → {"price": 950}   # BUY
POST /api/price → {"price": 1050}  # SELL (+100)
POST /api/price → {"price": 1000}  # BUY
POST /api/price → {"price": 1100}  # SELL (+100)
```

**Total Profit:** +250

**Strategy:** Scalping - ambil profit kecil berulang kali.

---

## Scenario 4: Holding Strategy

**Tujuan:** Test behavior saat harga tidak berubah.

### Steps:
```powershell
POST /api/price → {"price": 1000}  # Baseline
POST /api/price → {"price": 1000}  # HOLD
POST /api/price → {"price": 1000}  # HOLD
POST /api/price → {"price": 1000}  # HOLD
```

**Result:** Tidak ada transaksi, balance tetap.

---

## Scenario 5: Losing Trade

**Tujuan:** Simulasi kerugian (buy high, sell low - strategy yang salah).

### Steps:
```powershell
# Catatan: Bot tidak akan melakukan ini karena logic-nya
# mencegah buy high sell low.
# Ini hanya untuk pemahaman konsep.

# Manual override (jika bot dimodifikasi):
# 1. Buy @ 1000
# 2. Price turun ke 900
# 3. Forced sell @ 900
# Loss: -100
```

**Lesson:** Bot simulator ini dirancang untuk mencegah kerugian dengan logic BUY LOW, SELL HIGH.

---

## Scenario 6: Out of Balance

**Tujuan:** Test apa yang terjadi saat saldo tidak cukup.

### Steps:
```powershell
# Baseline balance: 1,000,000

POST /api/price → {"price": 100000}  # Baseline
POST /api/price → {"price": 90000}   # BUY 1 @ 90,000
POST /api/price → {"price": 80000}   # BUY 1 @ 80,000
POST /api/price → {"price": 70000}   # BUY 1 @ 70,000
# ... continue sampai balance habis

POST /api/price → {"price": 60000}   
# ERROR: "Saldo tidak cukup untuk melakukan pembelian"
# Bot akan HOLD instead
```

**Result:** Bot protect dari over-leveraging.

---

## Scenario 7: No Holdings to Sell

**Tujuan:** Test apa yang terjadi saat tidak ada aset untuk dijual.

### Steps:
```powershell
POST /api/price → {"price": 1000}  # Baseline
POST /api/price → {"price": 1100}  # SELL signal
# ERROR: "Tidak ada aset untuk dijual"
# Bot akan HOLD instead
```

**Result:** Bot protect dari short selling.

---

## Performance Metrics

Setiap skenario bisa di-monitor dengan:
```powershell
# Check state
GET /api/state

# Check logs
GET /api/logs
```

**Key Metrics:**
- `profitLoss`: Total untung/rugi
- `profitLossPercentage`: Persentase return
- `totalTransactions`: Jumlah transaksi
- `balance`: Saldo cash
- `holdings`: Jumlah aset

---

## Tips untuk Experiment

1. **Start Small**: Mulai dengan harga sederhana (1000, 950, 1050)
2. **Track Everything**: Selalu check `/api/logs` setelah beberapa transaksi
3. **Test Edge Cases**: Coba saldo habis, harga ekstrem, dll
4. **Reset Often**: Gunakan `/api/reset` untuk mulai fresh
5. **Document Results**: Catat profit/loss dari setiap strategy

---

## Next Steps

Setelah memahami scenarios ini, coba:
- [ ] Modifikasi trading rules di `tradingService.js`
- [ ] Tambahkan indicator baru (MA, RSI)
- [ ] Implementasi risk management (stop loss, take profit)
- [ ] Tambahkan multiple asset support
- [ ] Buat backtesting framework

Happy Trading! 📈