# Script PowerShell para atualizar GitHub automaticamente
# Uso: .\scripts\atualizar-github.ps1 [mensagem do commit]

param(
    [string]$mensagem = ""
)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🚀 ATUALIZADOR AUTOMÁTICO DO GITHUB" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# Verificar se há mudanças
$status = git status --porcelain
if (-not $status) {
    Write-Host "✅ Nenhuma mudança para commitar!" -ForegroundColor Green
    exit 0
}

# Mostrar mudanças
Write-Host "`n📋 Mudanças detectadas:" -ForegroundColor Yellow
git status --short

# Obter mensagem do commit
if (-not $mensagem) {
    $timestamp = Get-Date -Format "dd/MM/yyyy HH:mm:ss"
    $mensagem = "Update: $timestamp"
}

Write-Host "`n📝 Mensagem do commit: $mensagem" -ForegroundColor Cyan

# Confirmar
$confirmar = Read-Host "`nDeseja continuar? (S/N)"
if ($confirmar -ne "S" -and $confirmar -ne "s") {
    Write-Host "Operação cancelada." -ForegroundColor Yellow
    exit 0
}

# Adicionar todas as mudanças
Write-Host "`n🔄 Adicionando todas as mudanças..." -ForegroundColor Yellow
try {
    git add -A
    Write-Host "✅ Mudanças adicionadas!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao adicionar mudanças: $_" -ForegroundColor Red
    exit 1
}

# Fazer commit
Write-Host "`n🔄 Fazendo commit..." -ForegroundColor Yellow
try {
    git commit -m $mensagem
    Write-Host "✅ Commit realizado!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao fazer commit: $_" -ForegroundColor Red
    exit 1
}

# Fazer push
Write-Host "`n🔄 Enviando para o GitHub..." -ForegroundColor Yellow
try {
    git push origin main
    Write-Host "✅ Push realizado!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao fazer push: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "✅ REPOSITÓRIO ATUALIZADO COM SUCESSO!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "📝 Commit: $mensagem" -ForegroundColor Cyan
Write-Host "🌐 GitHub: https://github.com/stenin15/controle-de-mesas" -ForegroundColor Cyan

