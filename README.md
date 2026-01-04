# 🎮 Node.js Trading Bot Simulator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2016.0.0-brightgreen)](https://nodejs.org/)

> **Educational trading simulator untuk belajar backend logic dan business process**  
> ⚠️ **PENTING:** Ini adalah SIMULATOR. Tidak ada koneksi ke market nyata.

Sebuah trading bot simulator sederhana yang dibangun dengan Node.js dan Express.js untuk tujuan **pembelajaran backend development**. Project ini mengajarkan konsep business logic, state management, dan API design tanpa risiko finansial.

## 🎯 Tujuan Project

Project ini dibuat untuk:
- ✅ Memahami business logic dalam sistem trading
- ✅ Belajar state management di backend
- ✅ Praktik API design dengan Express.js
- ✅ Memahami flow request-response
- ✅ Implementasi decision-making logic

**Bukan untuk:**
- ❌ Trading nyata di exchange
- ❌ Koneksi ke market real-time
- ❌ Menghasilkan profit dari crypto/saham

## ✨ Fitur

- 🤖 **Automated Decision Making** - Bot otomatis memutuskan BUY/SELL/HOLD
- 📊 **Transaction Logging** - Semua transaksi tercatat
- 💰 **Virtual Balance** - Saldo virtual untuk simulasi
- 📈 **Profit/Loss Tracking** - Monitor performa trading
- 🔄 **State Management** - In-memory state management
- 🎛️ **RESTful API** - Clean API endpoints

## 🧠 Trading Logic

Bot menggunakan rule sederhana:

```
Jika harga TURUN → BUY (beli murah)
Jika harga NAIK → SELL (jual mahal)  
Jika harga SAMA → HOLD (tunggu)
```

**Contoh Skenario:**
```
Input: 1000 → HOLD (baseline)
Input: 950  → BUY (harga turun)
Input: 1050 → SELL (harga naik, take profit)
Input: 1050 → HOLD (harga tidak berubah)
```

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm atau yarn
- Terminal/PowerShell

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/username/node-trading-bot-simulator.git
cd node-trading-bot-simulator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Server

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

Output:
```
==================================================
🚀 Trading Bot Simulator is running!
📡 Server: http://localhost:3000
⚠️  WARNING: Ini adalah simulator edukatif
❌ TIDAK terhubung ke market nyata
==================================================
```

## 📡 API Endpoints

### 1. Welcome Endpoint
```http
GET /
```
Menampilkan informasi API dan daftar endpoints.

### 2. Input Harga (Main Endpoint)
```http
POST /api/price
Content-Type: application/json

{
  "price": 1000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "action": "BUY",
    "reason": "Harga turun dari 1000 ke 950 → SIGNAL BUY",
    "currentPrice": 950,
    "lastPrice": 1000,
    "priceDifference": -50,
    "transaction": {
      "id": 1,
      "timestamp": "2026-01-04T10:30:00.000Z",
      "action": "BUY",
      "price": 950,
      "cost": 950,
      "balanceAfter": 999050
    },
    "state": {
      "balance": 999050,
      "holdings": 1,
      "position": "BUY"
    }
  }
}
```

### 3. Lihat State Bot
```http
GET /api/state
```

Menampilkan kondisi bot saat ini (balance, holdings, position, performance).

### 4. Lihat Transaction Logs
```http
GET /api/logs
```

Menampilkan semua history transaksi.

### 5. Reset Bot
```http
POST /api/reset
```

Reset bot ke kondisi awal (balance: 1,000,000, holdings: 0).

## 🧪 Testing

### Menggunakan PowerShell (Windows)

```powershell
# Input harga pertama
Invoke-RestMethod -Uri http://localhost:3000/api/price -Method POST -ContentType "application/json" -Body '{"price": 1000}'

# Harga turun -> BUY
Invoke-RestMethod -Uri http://localhost:3000/api/price -Method POST -ContentType "application/json" -Body '{"price": 950}'

# Harga naik -> SELL
Invoke-RestMethod -Uri http://localhost:3000/api/price -Method POST -ContentType "application/json" -Body '{"price": 1050}'

# Lihat state
Invoke-RestMethod -Uri http://localhost:3000/api/state
```

### Menggunakan curl (Linux/Mac)

```bash
# Input harga pertama
curl -X POST http://localhost:3000/api/price \
  -H "Content-Type: application/json" \
  -d '{"price": 1000}'

# Harga turun -> BUY
curl -X POST http://localhost:3000/api/price \
  -H "Content-Type: application/json" \
  -d '{"price": 950}'

# Lihat state
curl http://localhost:3000/api/state
```

### Menggunakan Postman

1. Import collection atau setup manual
2. Method: `POST`
3. URL: `http://localhost:3000/api/price`
4. Body → raw → JSON:
   ```json
   {
     "price": 1000
   }
   ```

## 📁 Struktur Project

```
node-trading-bot-simulator/
├── src/
│   ├── index.js              # Entry point aplikasi
│   ├── routes/
│   │   └── tradingRoutes.js  # API routing
│   ├── services/
│   │   └── tradingService.js # Business logic trading
│   └── state/
│       └── stateManager.js   # State management
├── tests/
│   └── manual-test.http      # Manual testing
├── package.json
├── .gitignore
└── README.md
```

## 🏗️ Arsitektur

```
Request → Routes → Service (Business Logic) → State Manager → Response
```

### Layer Explanation

1. **Routes Layer** (`tradingRoutes.js`)
   - Menerima HTTP request
   - Validasi input
   - Delegasi ke service layer

2. **Service Layer** (`tradingService.js`)
   - Core business logic
   - Decision making (BUY/SELL/HOLD)
   - Orchestration

3. **State Layer** (`stateManager.js`)
   - In-memory data storage
   - Transaction execution
   - State persistence (volatile)

## 💡 Konsep yang Dipelajari

### 1. Business Logic
- Decision tree implementation
- Conditional logic
- State transition

### 2. State Management
- In-memory storage
- Singleton pattern
- State immutability considerations

### 3. API Design
- RESTful principles
- Request/response structure
- Error handling

### 4. Code Organization
- Separation of concerns
- Layer architecture
- Modular design

## ⚠️ Disclaimer

### Ini Adalah Simulator, Bukan Bot Real!

**Perbedaan:**

| Aspek | Simulator Ini | Bot Real |
|-------|---------------|----------|
| Data Source | Manual input JSON | API exchange real-time |
| Koneksi | Tidak ada | WebSocket ke exchange |
| Eksekusi | Simulasi memory | Order real ke market |
| Risiko | Tidak ada | Kehilangan uang nyata |
| Kompleksitas | Sederhana | Sangat kompleks |

### Mengapa Bot Trading Real Berbahaya?

1. **Risiko Finansial Besar**
   - Bisa kehilangan semua modal
   - Market sangat volatile
   - Slippage dan trading fees

2. **Kompleksitas Teknis**
   - Perlu handle WebSocket real-time
   - Rate limiting dari exchange
   - Order management yang kompleks
   - Error recovery & failover

3. **Aspek Keamanan**
   - API key bisa dicuri/disalahgunakan
   - Perlu 2FA dan security best practices
   - Risk management critical

4. **Aspek Legal**
   - Regulasi berbeda per negara
   - Perlu izin trading di beberapa jurisdiksi
   - Tax implications

**Rekomendasi:**
- ✅ Gunakan simulator untuk belajar
- ✅ Pahami konsep risk management
- ✅ Test di paper trading/testnet dulu
- ❌ Jangan langsung deploy bot real dengan uang nyata

## 🔮 Roadmap & Ideas untuk Upgrade

Setelah menguasai version basic ini, coba:

- [ ] Tambah database (SQLite/PostgreSQL)
- [ ] Implementasi strategy lain (MA, RSI)
- [ ] Tambah unit testing (Jest)
- [ ] Tambah validation library (Joi/Zod)
- [ ] Buat dashboard UI sederhana
- [ ] Implementasi rate limiting
- [ ] Tambah authentication
- [ ] Export data ke CSV
- [ ] Visualisasi chart

## 🤝 Contributing

Contributions are welcome! Silakan:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Inspired by algorithmic trading concepts
- Built for educational purposes only
- Thanks to the Node.js and Express.js community

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [REST API Design Guide](https://restfulapi.net/)

---

<div align="center">

**⚠️ EDUCATIONAL PURPOSE ONLY - NOT FOR REAL TRADING ⚠️**

Made with ❤️ for learning backend development

[Report Bug](https://github.com/username/node-trading-bot-simulator/issues) · [Request Feature](https://github.com/username/node-trading-bot-simulator/issues)

</div>