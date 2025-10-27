# Kill process running on port 3000
Write-Host "Checking for processes on port 3000..." -ForegroundColor Cyan

$connection = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

if ($connection) {
    $processId = $connection.OwningProcess
    Write-Host "Found process with PID: $processId" -ForegroundColor Yellow
    
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Write-Host "Successfully killed process on port 3000" -ForegroundColor Green
} else {
    Write-Host "Port 3000 is already free" -ForegroundColor Green
}

exit 0

