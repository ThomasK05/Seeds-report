# Seeds Report - dev server starter
# Loads .env.local manually and runs npm run dev.
# Workaround for Next.js not auto-loading .env.local on Windows.

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

if (Test-Path "C:\Program Files\nodejs") {
  $env:PATH = "C:\Program Files\nodejs;" + $env:PATH
}

$envFile = Join-Path $projectRoot ".env.local"
if (Test-Path $envFile) {
  Write-Host "Loading .env.local ..." -ForegroundColor Cyan
  Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
      $idx = $line.IndexOf("=")
      $name = $line.Substring(0, $idx).Trim()
      $value = $line.Substring($idx + 1).Trim().Trim('"').Trim("'")
      Set-Item -Path "env:$name" -Value $value
      $preview = if ($value.Length -gt 12) { $value.Substring(0, 12) + "..." } else { $value }
      Write-Host "  $name = $preview" -ForegroundColor DarkGray
    }
  }
} else {
  Write-Host "WARNING: .env.local not found - server will run in demo mode." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting Next.js dev server..." -ForegroundColor Green
npm run dev