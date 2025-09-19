# Script de Auto Commit para Windows PowerShell
# Uso: .\auto-commit.ps1 "mensagem do commit"

param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage
)

Write-Host "🚀 Iniciando Auto Commit..." -ForegroundColor Green
Write-Host "📝 Mensagem: $CommitMessage" -ForegroundColor Cyan

# Verificar se estamos em um repositório git
try {
    $gitStatus = git status --porcelain 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro: Não é um repositório Git" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erro: Git não encontrado" -ForegroundColor Red
    exit 1
}

# Verificar se há mudanças para commitar
if (-not $gitStatus) {
    Write-Host "ℹ️  Nenhuma mudança detectada. Nada para commitar." -ForegroundColor Yellow
    exit 0
}

Write-Host "📊 Status do repositório:" -ForegroundColor Blue
git status --short

Write-Host ""
Write-Host "➕ Adicionando arquivos..." -ForegroundColor Blue

# Adicionar todos os arquivos modificados
try {
    git add -A
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao adicionar arquivos" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Arquivos adicionados com sucesso" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao adicionar arquivos" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "💾 Fazendo commit..." -ForegroundColor Blue

# Fazer commit com a mensagem fornecida
try {
    git commit -m $CommitMessage
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao fazer commit" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Commit realizado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao fazer commit" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📤 Fazendo push..." -ForegroundColor Blue

# Fazer push para o repositório remoto
try {
    git push origin master
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao fazer push" -ForegroundColor Red
        Write-Host "💡 Tente fazer push manualmente: git push origin master" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Push realizado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao fazer push" -ForegroundColor Red
    Write-Host "💡 Tente fazer push manualmente: git push origin master" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🎉 Auto Commit concluído com sucesso!" -ForegroundColor Green
Write-Host "📋 Resumo:" -ForegroundColor Cyan
Write-Host "   - Arquivos adicionados: ✅" -ForegroundColor Green
Write-Host "   - Commit: ✅" -ForegroundColor Green
Write-Host "   - Push: ✅" -ForegroundColor Green
Write-Host "   - Mensagem: `"$CommitMessage`"" -ForegroundColor Cyan

# Mostrar último commit
Write-Host ""
Write-Host "📝 Último commit:" -ForegroundColor Blue
git log --oneline -1
