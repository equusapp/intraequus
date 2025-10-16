# Script simple para subir EQUUS Accounting a GitHub
# Ejecutar este script después de instalar Git

Write-Host "🐴 EQUUS Accounting - Deploy to GitHub" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Verificar si Git está instalado
Write-Host "🔍 Verificando Git..." -ForegroundColor Yellow
$gitInstalled = $false
try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-Host "✅ Git está instalado: $gitVersion" -ForegroundColor Green
        $gitInstalled = $true
    }
}
catch {
    Write-Host "❌ Git no está instalado" -ForegroundColor Red
}

if (-not $gitInstalled) {
    Write-Host "Por favor instala Git desde: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Después de instalar Git, ejecuta este script nuevamente." -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar si ya existe un repositorio Git
if (Test-Path ".git") {
    Write-Host "✅ Repositorio Git ya existe" -ForegroundColor Green
} else {
    Write-Host "📁 Inicializando repositorio Git..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repositorio Git inicializado" -ForegroundColor Green
}

# Configurar Git si es necesario
Write-Host "🔧 Verificando configuración de Git..." -ForegroundColor Yellow

$userName = ""
$userEmail = ""

try {
    $userName = git config --global user.name 2>$null
    $userEmail = git config --global user.email 2>$null
}
catch {
    # Si hay error, las variables quedan vacías
}

if ([string]::IsNullOrEmpty($userName)) {
    $name = Read-Host "Introduce tu nombre para Git"
    git config --global user.name "$name"
    Write-Host "✅ Nombre configurado: $name" -ForegroundColor Green
}

if ([string]::IsNullOrEmpty($userEmail)) {
    $email = Read-Host "Introduce tu email para Git"
    git config --global user.email "$email"
    Write-Host "✅ Email configurado: $email" -ForegroundColor Green
}

# Verificar archivos importantes
Write-Host "🔍 Verificando archivos del proyecto..." -ForegroundColor Yellow

$importantFiles = @("package.json", "README.md", ".gitignore", ".env.example")

foreach ($file in $importantFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file existe" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $file no encontrado" -ForegroundColor Yellow
    }
}

# Verificar que .env.local no se suba
if (Test-Path ".env.local") {
    Write-Host "✅ .env.local existe (será ignorado por .gitignore)" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.local no encontrado - créalo antes de ejecutar la app" -ForegroundColor Yellow
}

# Añadir archivos al staging
Write-Host "📦 Añadiendo archivos al repositorio..." -ForegroundColor Yellow
git add .

# Mostrar estado
Write-Host "📋 Estado del repositorio:" -ForegroundColor Yellow
git status --short

# Crear commit inicial
Write-Host "💾 Creando commit inicial..." -ForegroundColor Yellow

$commitMessage = "🚀 Initial commit: EQUUS Accounting System

✨ Features:
• Complete accounting system for equestrian centers
• Next.js 14 + TypeScript + Supabase
• Invoice management (issued/received)
• Bank reconciliation
• Expense tracking
• Asset management
• Contact management
• Real-time dashboard
• Modern UI with TailwindCSS + shadcn/ui

🔧 Tech Stack:
• Next.js 14 (App Router)
• TypeScript
• Supabase (Database + Auth)
• TailwindCSS + shadcn/ui
• Lucide React Icons

🎯 Ready for production deployment"

git commit -m $commitMessage

Write-Host "✅ Commit inicial creado" -ForegroundColor Green

# Instrucciones para GitHub
Write-Host ""
Write-Host "🌐 Próximos pasos para subir a GitHub:" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "1. Ve a https://github.com/new" -ForegroundColor White
Write-Host "2. Nombre del repositorio: equus-accounting" -ForegroundColor White
Write-Host "3. Descripción: Sistema contable completo para centros ecuestres" -ForegroundColor White
Write-Host "4. Selecciona 'Private' o 'Public' según prefieras" -ForegroundColor White
Write-Host "5. NO marques 'Add a README file' (ya tenemos uno)" -ForegroundColor White
Write-Host "6. Haz clic en 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "7. Después de crear el repositorio, ejecuta estos comandos:" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/TU_USUARIO/equus-accounting.git" -ForegroundColor White
Write-Host "   git branch -M main" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""

# Crear archivo con comandos
$gitCommands = @"
# Comandos para conectar con GitHub
# Reemplaza TU_USUARIO por tu nombre de usuario de GitHub

git remote add origin https://github.com/TU_USUARIO/equus-accounting.git
git branch -M main
git push -u origin main
"@

$gitCommands | Out-File -FilePath "github-commands.txt" -Encoding UTF8
Write-Host "📄 Comandos guardados en 'github-commands.txt'" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 ¡Proyecto listo para GitHub!" -ForegroundColor Green
Write-Host "Reemplaza 'TU_USUARIO' por tu nombre de usuario de GitHub" -ForegroundColor Yellow

Read-Host "Presiona Enter para continuar"
