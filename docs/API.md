# API Documentation

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. Get API Information
**Endpoint:** `GET /`

**Description:** Mendapatkan informasi tentang API dan daftar endpoint yang tersedia.

**Response:**
```json
{
  "message": "🎮 Trading Bot Simulator - Educational Purpose Only",
  "warning": "⚠️ Ini adalah SIMULATOR. Tidak ada koneksi ke market nyata.",
  "endpoints": {
    "POST /api/price": "Input harga dan dapatkan keputusan trading",
    "GET /api/state": "Lihat status bot saat ini",
    "GET /api/logs": "Lihat semua transaction logs",
    "POST /api/reset": "Reset bot ke kondisi awal"
  }
}
```

---

### 2. Submit Price
**Endpoint:** `POST /api/price`

**Description:** Input harga baru dan dapatkan keputusan trading dari bot.

**Request Body:**
```json
{
  "price": 1000
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| price | number | Yes | Harga aset (harus positif) |

**Response Success (200):**
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
      "quantity": 1,
      "cost": 950,
      "balanceAfter": 999050,
      "holdingsAfter": 1
    },
    "state": {
      "balance": 999050,
      "holdings": 1,
      "position": "BUY"
    }
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "Field \"price\" wajib diisi"
}
```

**Trading Logic:**
- Jika `currentPrice < lastPrice` → **BUY** signal
- Jika `currentPrice > lastPrice` → **SELL** signal
- Jika `currentPrice == lastPrice` → **HOLD** signal

---

### 3. Get Bot State
**Endpoint:** `GET /api/state`

**Description:** Mendapatkan status bot saat ini termasuk balance, holdings, dan performance.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "balance": 1000100,
    "lastPrice": 1050,
    "currentPosition": "SELL",
    "holdings": 0,
    "transactionLogs": [...],
    "totalTransactions": 3,
    "profitLoss": 100,
    "performance": {
      "initialBalance": 1000000,
      "currentBalance": 1000100,
      "holdings": 0,
      "lastPrice": 1050,
      "portfolioValue": 1000100,
      "profitLoss": 100,
      "profitLossPercentage": "0.01%"
    }
  }
}
```

---

### 4. Get Transaction Logs
**Endpoint:** `GET /api/logs`

**Description:** Mendapatkan semua riwayat transaksi.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalLogs": 2,
    "logs": [
      {
        "id": 1,
        "timestamp": "2026-01-04T10:30:00.000Z",
        "action": "BUY",
        "price": 950,
        "quantity": 1,
        "cost": 950,
        "balanceAfter": 999050,
        "holdingsAfter": 1
      },
      {
        "id": 2,
        "timestamp": "2026-01-04T10:35:00.000Z",
        "action": "SELL",
        "price": 1050,
        "quantity": 1,
        "revenue": 1050,
        "balanceAfter": 1000100,
        "holdingsAfter": 0
      }
    ]
  }
}
```

---

### 5. Reset Bot
**Endpoint:** `POST /api/reset`

**Description:** Reset bot ke kondisi awal (balance: 1,000,000, holdings: 0).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Bot berhasil direset ke kondisi awal",
    "state": {
      "balance": 1000000,
      "lastPrice": null,
      "currentPosition": "HOLD",
      "holdings": 0,
      "transactionLogs": [],
      "totalTransactions": 0,
      "profitLoss": 0
    }
  }
}
```

---

## Error Responses

### 400 Bad Request
Terjadi ketika input tidak valid.
```json
{
  "success": false,
  "error": "Harga harus berupa angka positif"
}
```

### 404 Not Found
Terjadi ketika endpoint tidak ditemukan.
```json
{
  "error": "Endpoint tidak ditemukan",
  "availableEndpoints": [
    "GET /",
    "POST /api/price",
    "GET /api/state",
    "GET /api/logs",
    "POST /api/reset"
  ]
}
```

### 500 Internal Server Error
Terjadi ketika ada kesalahan server.
```json
{
  "error": "Internal server error",
  "message": "Error message here"
}
```

---

## Testing Examples

### Using PowerShell (Windows)
```powershell
# Submit price
Invoke-RestMethod -Uri http://localhost:3000/api/price `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"price": 1000}'

# Get state
Invoke-RestMethod -Uri http://localhost:3000/api/state
```

### Using curl (Linux/Mac)
```bash
# Submit price
curl -X POST http://localhost:3000/api/price \
  -H "Content-Type: application/json" \
  -d '{"price": 1000}'

# Get state
curl http://localhost:3000/api/state
```

### Using JavaScript (fetch)
```javascript
// Submit price
const response = await fetch('http://localhost:3000/api/price', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ price: 1000 })
});

const data = await response.json();
console.log(data);
```