# Script para atualizar GitHub automaticamente após mudanças
# Este script será executado automaticamente após cada alteração

$ErrorActionPreference = "Continue"

Write-Host "`n" -NoNewline
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "🔄 VERIFICANDO MUDANÇAS E ATUALIZANDO GITHUB" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# Verificar se há mudanças
$status = git status --porcelain
if (-not $status) {
    Write-Host "✅ Nenhuma mudança para commitar!" -ForegroundColor Green
    exit 0
}

# Contar arquivos modificados
$modified = (git status --porcelain | Measure-Object).Count
Write-Host "📋 Encontradas $modified mudança(s)!" -ForegroundColor Yellow

# Criar mensagem de commit com timestamp
$timestamp = Get-Date -Format "dd/MM/yyyy HH:mm:ss"
$commitMessage = "Update: $timestamp"

Write-Host "📝 Mensagem do commit: $commitMessage" -ForegroundColor Cyan
Write-Host "`n🔄 Processando atualização automática..." -ForegroundColor Yellow

try {
    # Adicionar todas as mudanças
    Write-Host "   → Adicionando mudanças..." -ForegroundColor Gray
    git add -A | Out-Null
    
    # Fazer commit
    Write-Host "   → Fazendo commit..." -ForegroundColor Gray
    git commit -m $commitMessage | Out-Null
    
    # Fazer push
    Write-Host "   → Enviando para GitHub..." -ForegroundColor Gray
    git push origin main | Out-Null
    
    Write-Host "`n" -NoNewline
    Write-Host "=" * 60 -ForegroundColor Green
    Write-Host "✅ ATUALIZAÇÃO AUTOMÁTICA CONCLUÍDA!" -ForegroundColor Green
    Write-Host "=" * 60 -ForegroundColor Green
    Write-Host "📝 Commit: $commitMessage" -ForegroundColor Cyan
    Write-Host "🌐 GitHub atualizado com sucesso!" -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ Erro na atualização automática:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "`n💡 Você pode executar manualmente: .\scripts\atualizar-github.ps1" -ForegroundColor Yellow
}

