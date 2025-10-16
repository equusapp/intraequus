# Script para subir EQUUS Accounting a GitHub
# Ejecutar este script después de instalar Git

Write-Host "🐴 EQUUS Accounting - Deploy to GitHub" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Verificar si Git está instalado
try {
    $null = git --version 2>$null
    Write-Host "✅ Git está instalado" -ForegroundColor Green
}
catch {
    Write-Host "❌ Git no está instalado. Por favor instala Git desde: https://git-scm.com/download/win" -ForegroundColor Red
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

# Configurar Git (si no está configurado)
$userName = git config --global user.name
$userEmail = git config --global user.email

if (-not $userName) {
    $name = Read-Host "Introduce tu nombre para Git"
    git config --global user.name "$name"
}

if (-not $userEmail) {
    $email = Read-Host "Introduce tu email para Git"
    git config --global user.email "$email"
}

# Verificar archivos importantes
Write-Host "🔍 Verificando archivos del proyecto..." -ForegroundColor Yellow

$importantFiles = @(
    "package.json",
    "README.md",
    ".gitignore",
    ".env.example"
)

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
    Write-Host "⚠️  .env.local no encontrado - asegúrate de crearlo antes de ejecutar la app" -ForegroundColor Yellow
}

# Añadir archivos al staging
Write-Host "📦 Añadiendo archivos al repositorio..." -ForegroundColor Yellow
git add .

# Mostrar estado
Write-Host "📋 Estado del repositorio:" -ForegroundColor Yellow
git status

# Crear commit inicial
Write-Host "💾 Creando commit inicial..." -ForegroundColor Yellow
git commit -m @"
🚀 Initial commit: EQUUS Accounting System

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

🎯 Ready for production deployment
"@

Write-Host "✅ Commit inicial creado" -ForegroundColor Green

# Instrucciones para crear repositorio en GitHub
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
Write-Host "7. Copia la URL del repositorio y ejecuta:" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/TU_USUARIO/equus-accounting.git" -ForegroundColor White
Write-Host "   git branch -M main" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""

# Crear archivo con comandos para copiar
$gitCommands = @"
# Comandos para conectar con GitHub (copia estos comandos después de crear el repo)
git remote add origin https://github.com/TU_USUARIO/equus-accounting.git
git branch -M main
git push -u origin main
"@

$gitCommands | Out-File -FilePath "github-commands.txt" -Encoding UTF8
Write-Host "📄 Comandos guardados en 'github-commands.txt'" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 ¡Proyecto listo para GitHub!" -ForegroundColor Green
Write-Host "Reemplaza 'TU_USUARIO' por tu nombre de usuario de GitHub" -ForegroundColor Yellow
