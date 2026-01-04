# Trading Bot Simulator - Testing Script
# File: test.ps1

Write-Host "=== Trading Bot Simulator - Automated Testing ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"

# Function to display response
function Show-Response {
    param($title, $response)
    Write-Host "--- $title ---" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 10
    Write-Host ""
}

# Check if server is running
try {
    Write-Host "Checking if server is running..." -ForegroundColor Green
    $health = Invoke-RestMethod -Uri $baseUrl -Method GET
    Show-Response "Server Status" $health
} catch {
    Write-Host "ERROR: Server tidak berjalan! Jalankan 'npm start' terlebih dahulu." -ForegroundColor Red
    exit 1
}

# Test 1: Reset Bot
Write-Host "Test 1: Reset Bot to Initial State" -ForegroundColor Magenta
$reset = Invoke-RestMethod -Uri "$baseUrl/api/reset" -Method POST
Show-Response "Reset Result" $reset

# Test 2: Input Baseline Price
Write-Host "Test 2: Set Baseline Price (1000)" -ForegroundColor Magenta
$body1 = @{ price = 1000 } | ConvertTo-Json
$result1 = Invoke-RestMethod -Uri "$baseUrl/api/price" -Method POST -ContentType "application/json" -Body $body1
Show-Response "Baseline Result" $result1

# Test 3: Price Down - BUY Signal
Write-Host "Test 3: Price Down to 950 - Expected: BUY" -ForegroundColor Magenta
$body2 = @{ price = 950 } | ConvertTo-Json
$result2 = Invoke-RestMethod -Uri "$baseUrl/api/price" -Method POST -ContentType "application/json" -Body $body2
Show-Response "BUY Signal" $result2

# Test 4: Price Down Again - BUY Signal
Write-Host "Test 4: Price Down to 900 - Expected: BUY" -ForegroundColor Magenta
$body3 = @{ price = 900 } | ConvertTo-Json
$result3 = Invoke-RestMethod -Uri "$baseUrl/api/price" -Method POST -ContentType "application/json" -Body $body3
Show-Response "BUY Signal 2" $result3

# Test 5: Price Up - SELL Signal
Write-Host "Test 5: Price Up to 1000 - Expected: SELL" -ForegroundColor Magenta
$body4 = @{ price = 1000 } | ConvertTo-Json
$result4 = Invoke-RestMethod -Uri "$baseUrl/api/price" -Method POST -ContentType "application/json" -Body $body4
Show-Response "SELL Signal" $result4

# Test 6: Price Up Again - SELL Signal
Write-Host "Test 6: Price Up to 1100 - Expected: SELL" -ForegroundColor Magenta
$body5 = @{ price = 1100 } | ConvertTo-Json
$result5 = Invoke-RestMethod -Uri "$baseUrl/api/price" -Method POST -ContentType "application/json" -Body $body5
Show-Response "SELL Signal 2" $result5

# Test 7: Same Price - HOLD Signal
Write-Host "Test 7: Same Price 1100 - Expected: HOLD" -ForegroundColor Magenta
$body6 = @{ price = 1100 } | ConvertTo-Json
$result6 = Invoke-RestMethod -Uri "$baseUrl/api/price" -Method POST -ContentType "application/json" -Body $body6
Show-Response "HOLD Signal" $result6

# Get Final State
Write-Host "Getting Final State..." -ForegroundColor Green
$state = Invoke-RestMethod -Uri "$baseUrl/api/state" -Method GET
Show-Response "Final State" $state

# Get Transaction Logs
Write-Host "Getting Transaction Logs..." -ForegroundColor Green
$logs = Invoke-RestMethod -Uri "$baseUrl/api/logs" -Method GET
Show-Response "Transaction Logs" $logs

Write-Host "=== Testing Complete! ===" -ForegroundColor Green
Write-Host "Total Transactions: $($logs.data.totalLogs)" -ForegroundColor Cyan
Write-Host "Final Balance: $($state.data.balance)" -ForegroundColor Cyan
Write-Host "Profit/Loss: $($state.data.performance.profitLoss)" -ForegroundColor Cyan