# .gas_env を反映して clasp push する
# 使い方: .\push.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "[push] Node.js が必要です"
}

if (-not (Get-Command clasp -ErrorAction SilentlyContinue)) {
    Write-Host "[push] ERROR: clasp が見つかりません"
    Write-Host "  npm install -g @google/clasp"
    Write-Host "  clasp login   # 初回のみ必須"
    exit 1
}

node sync-env.js

Write-Host "[push] clasp push を実行します..."
Write-Host "[push] ※ 未ログインの場合は先に clasp login を実行してください"
clasp push --force

Write-Host "[push] 完了"
