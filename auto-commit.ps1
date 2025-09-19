# Script de Auto Commit para Windows PowerShell
# Uso: .\auto-commit-fixed.ps1 "mensagem do commit"

param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage
)

Write-Host "Iniciando Auto Commit..." -ForegroundColor Green
Write-Host "Mensagem: $CommitMessage" -ForegroundColor Cyan

# Verificar se estamos em um repositório git
try {
    $gitStatus = git status --porcelain 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erro: Nao e um repositorio Git" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Erro: Git nao encontrado" -ForegroundColor Red
    exit 1
}

# Verificar se há mudanças para commitar
if (-not $gitStatus) {
    Write-Host "Nenhuma mudanca detectada. Nada para commitar." -ForegroundColor Yellow
    exit 0
}

Write-Host "Status do repositorio:" -ForegroundColor Blue
git status --short

Write-Host ""
Write-Host "Adicionando arquivos..." -ForegroundColor Blue

# Adicionar todos os arquivos modificados
try {
    git add -A
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erro ao adicionar arquivos" -ForegroundColor Red
        exit 1
    }
    Write-Host "Arquivos adicionados com sucesso" -ForegroundColor Green
} catch {
    Write-Host "Erro ao adicionar arquivos" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Fazendo commit..." -ForegroundColor Blue

# Fazer commit com a mensagem fornecida
try {
    git commit -m $CommitMessage
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erro ao fazer commit" -ForegroundColor Red
        exit 1
    }
    Write-Host "Commit realizado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "Erro ao fazer commit" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Fazendo push..." -ForegroundColor Blue

# Fazer push para o repositório remoto
try {
    git push origin master
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erro ao fazer push" -ForegroundColor Red
        Write-Host "Tente fazer push manualmente: git push origin master" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "Push realizado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "Erro ao fazer push" -ForegroundColor Red
    Write-Host "Tente fazer push manualmente: git push origin master" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Auto Commit concluido com sucesso!" -ForegroundColor Green
Write-Host "Resumo:" -ForegroundColor Cyan
Write-Host "   - Arquivos adicionados: OK" -ForegroundColor Green
Write-Host "   - Commit: OK" -ForegroundColor Green
Write-Host "   - Push: OK" -ForegroundColor Green
Write-Host "   - Mensagem: `"$CommitMessage`"" -ForegroundColor Cyan

# Mostrar último commit
Write-Host ""
Write-Host "Ultimo commit:" -ForegroundColor Blue
git log --oneline -1
