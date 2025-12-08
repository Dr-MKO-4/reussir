#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Test la connexion à l'API du backend et affiche les diagnostics
.DESCRIPTION
  Vérifie que le backend .NET est accessible sur https://localhost:7023/api
#>

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  TEST DE CONNEXION À L'API BACKEND                         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

# Configuration
$ApiUrl = "https://localhost:7023/api"
$BackendPort = 7023
$FrontendPort = 5173
$DatabasePort = 5432

Write-Host "`n📋 Configuration attendue:" -ForegroundColor Yellow
Write-Host "   Backend:   https://localhost:$BackendPort/api" -ForegroundColor Gray
Write-Host "   Frontend:  http://localhost:$FrontendPort" -ForegroundColor Gray
Write-Host "   Database:  localhost:$DatabasePort (PostgreSQL)" -ForegroundColor Gray

# Test 1: Vérifier que les ports sont accessibles
Write-Host "`n🔍 Test 1: Accessibilité des ports" -ForegroundColor Yellow

$Ports = @{
    $BackendPort = "Backend"
    $FrontendPort = "Frontend"
    $DatabasePort = "Database"
}

foreach ($Port in $Ports.GetEnumerator()) {
    $PortNumber = $Port.Key
    $PortName = $Port.Value
    
    try {
        $TcpClient = New-Object System.Net.Sockets.TcpClient
        $TcpClient.Connect("127.0.0.1", $PortNumber)
        Write-Host "   ✅ Port $PortNumber ($PortName) - ACCESSIBLE" -ForegroundColor Green
        $TcpClient.Close()
    } catch {
        Write-Host "   ❌ Port $PortNumber ($PortName) - NON ACCESSIBLE" -ForegroundColor Red
        if ($PortNumber -eq $BackendPort) {
            Write-Host "      → Le backend .NET n'est pas lancé. Exécutez:" -ForegroundColor Magenta
            Write-Host "      → cd M:\win\reussir\backend\dotnet" -ForegroundColor Magenta
            Write-Host "      → dotnet run" -ForegroundColor Magenta
        } elseif ($PortNumber -eq $FrontendPort) {
            Write-Host "      → Le frontend n'est pas lancé. Exécutez:" -ForegroundColor Magenta
            Write-Host "      → cd M:\win\reussir\frontend" -ForegroundColor Magenta
            Write-Host "      → npm run dev" -ForegroundColor Magenta
        } elseif ($PortNumber -eq $DatabasePort) {
            Write-Host "      → PostgreSQL n'est pas lancé. Démarrez le service." -ForegroundColor Magenta
        }
    }
}

# Test 2: Essayer de faire un appel API
Write-Host "`n🔍 Test 2: Appel à l'API du backend" -ForegroundColor Yellow

try {
    # Ignorer les erreurs de certificat SSL en développement
    [System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }
    
    # Essayer d'accéder à /health ou /status
    $HealthUrl = "$ApiUrl/health"
    Write-Host "   Tentative : GET $HealthUrl" -ForegroundColor Gray
    
    $Response = Invoke-WebRequest -Uri $HealthUrl -Method Get -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ API Backend - ACCESSIBLE" -ForegroundColor Green
    Write-Host "   Status Code: $($Response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($Response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 2)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ API Backend - NON ACCESSIBLE" -ForegroundColor Red
    
    # Essayer sans vérification de certificat
    try {
        $HealthUrl = "$ApiUrl/health"
        $Response = Invoke-WebRequest -Uri $HealthUrl -Method Get -UseBasicParsing `
            -SkipCertificateCheck -ErrorAction Stop
        Write-Host "   ✅ API Backend - ACCESSIBLE (certificat auto-signé)" -ForegroundColor Yellow
        Write-Host "   Status Code: $($Response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "   Erreur détaillée:" -ForegroundColor Red
        Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 3: Afficher les variables d'environnement
Write-Host "`n🔍 Test 3: Variables d'environnement (.env.local)" -ForegroundColor Yellow

$EnvPath = "M:\win\reussir\frontend\.env.local"
if (Test-Path $EnvPath) {
    $EnvContent = Get-Content $EnvPath
    Write-Host "   Fichier: $EnvPath" -ForegroundColor Gray
    Write-Host "   Contenu:" -ForegroundColor Gray
    foreach ($Line in $EnvContent) {
        if ($Line -match "^VITE_") {
            Write-Host "   $Line" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "   ❌ Fichier .env.local NON TROUVÉ" -ForegroundColor Red
}

# Test 4: Afficher les processus en cours
Write-Host "`n🔍 Test 4: Processus Node/dotnet en cours" -ForegroundColor Yellow

$Processes = Get-Process | Where-Object { $_.ProcessName -match "node|dotnet" } | Select-Object ProcessName, Id, @{
    Name = "MemoryMB"
    Expression = { [math]::Round($_.WorkingSet / 1MB, 2) }
}

if ($Processes) {
    Write-Host "   Processus trouvés:" -ForegroundColor Green
    $Processes | Format-Table -AutoSize | Out-String | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
} else {
    Write-Host "   ⚠️  Aucun processus Node ou .NET en cours" -ForegroundColor Yellow
    Write-Host "   → Assurez-vous que le backend et le frontend sont lancés" -ForegroundColor Magenta
}

# Résumé
Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  RÉSUMÉ DES ACTIONS                                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n✅ Pour démarrer l'application complète:" -ForegroundColor Green
Write-Host "
1️⃣  Terminal 1 - Lancez le backend:
   cd M:\win\reussir\backend\dotnet
   dotnet run

2️⃣  Terminal 2 - Lancez le frontend:
   cd M:\win\reussir\frontend
   npm run dev

3️⃣  Terminal 3 - Vérifiez la connexion:
   .\test-api-connection.ps1

4️⃣  Ouvrez votre navigateur:
   http://localhost:5173
" -ForegroundColor Gray

Write-Host "💡 En cas de problème:" -ForegroundColor Yellow
Write-Host "   • Certificat SSL: Les certificats auto-signés en dev sont normaux" -ForegroundColor Gray
Write-Host "   • Ports en conflit: Vérifiez que 5173, 7023, 5432 sont libres" -ForegroundColor Gray
Write-Host "   • CORS: Le backend doit autoriser localhost:5173" -ForegroundColor Gray
Write-Host "   • Logs: Vérifiez la console du terminal pour les erreurs" -ForegroundColor Gray
