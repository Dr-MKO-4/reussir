#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Lance automatiquement le backend et le frontend
.DESCRIPTION
  Ouvre deux terminaux PowerShell, l'un pour le backend et l'autre pour le frontend
#>

Write-Host "🚀 Démarrage de l'application Réussir..." -ForegroundColor Cyan
Write-Host "   Backend: https://localhost:7023/api" -ForegroundColor Gray
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Gray

# Lancer le backend dans une nouvelle fenêtre PowerShell
Write-Host "`n📦 Lancement du backend..." -ForegroundColor Yellow
$BackendScript = @'
cd 'M:\win\reussir\backend\dotnet'
Write-Host "🔧 Backend - Building et launching..." -ForegroundColor Cyan
dotnet run
Read-Host "Appuyez sur Entrée pour fermer"
'@

Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", $BackendScript

# Attendre que le backend se lance
Start-Sleep -Seconds 3

# Lancer le frontend dans une nouvelle fenêtre PowerShell
Write-Host "🎨 Lancement du frontend..." -ForegroundColor Yellow
$FrontendScript = @'
cd 'M:\win\reussir\frontend'
Write-Host "⚡ Frontend - Installing dependencies et launching..." -ForegroundColor Cyan
npm run dev
Read-Host "Appuyez sur Entrée pour fermer"
'@

Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", $FrontendScript

# Attendre que les services se lancent
Start-Sleep -Seconds 5

Write-Host "`n✅ Services en cours de démarrage..." -ForegroundColor Green
Write-Host "   Attendez 10-15 secondes que les services soient prêts" -ForegroundColor Gray
Write-Host "   Puis ouvrez votre navigateur: http://localhost:5173" -ForegroundColor Cyan

# Ouvrir automatiquement le navigateur
Start-Sleep -Seconds 10
Write-Host "`n🌐 Ouverture du navigateur..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"
