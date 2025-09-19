#!/bin/bash

# Script de Auto Commit
# Uso: ./auto-commit.sh "mensagem do commit"

# Verificar se foi fornecida uma mensagem de commit
if [ $# -eq 0 ]; then
    echo "❌ Erro: Forneça uma mensagem de commit"
    echo "Uso: ./auto-commit.sh \"mensagem do commit\""
    exit 1
fi

COMMIT_MESSAGE="$1"

echo "🚀 Iniciando Auto Commit..."
echo "📝 Mensagem: $COMMIT_MESSAGE"

# Verificar se estamos em um repositório git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Erro: Não é um repositório Git"
    exit 1
fi

# Verificar se há mudanças para commitar
if [ -z "$(git status --porcelain)" ]; then
    echo "ℹ️  Nenhuma mudança detectada. Nada para commitar."
    exit 0
fi

echo "📊 Status do repositório:"
git status --short

echo ""
echo "➕ Adicionando arquivos..."

# Adicionar todos os arquivos modificados
git add -A

if [ $? -ne 0 ]; then
    echo "❌ Erro ao adicionar arquivos"
    exit 1
fi

echo "✅ Arquivos adicionados com sucesso"

echo ""
echo "💾 Fazendo commit..."

# Fazer commit com a mensagem fornecida
git commit -m "$COMMIT_MESSAGE"

if [ $? -ne 0 ]; then
    echo "❌ Erro ao fazer commit"
    exit 1
fi

echo "✅ Commit realizado com sucesso"

echo ""
echo "📤 Fazendo push..."

# Fazer push para o repositório remoto
git push origin master

if [ $? -ne 0 ]; then
    echo "❌ Erro ao fazer push"
    echo "💡 Tente fazer push manualmente: git push origin master"
    exit 1
fi

echo "✅ Push realizado com sucesso"

echo ""
echo "🎉 Auto Commit concluído com sucesso!"
echo "📋 Resumo:"
echo "   - Arquivos adicionados: ✅"
echo "   - Commit: ✅"
echo "   - Push: ✅"
echo "   - Mensagem: \"$COMMIT_MESSAGE\""

# Mostrar último commit
echo ""
echo "📝 Último commit:"
git log --oneline -1
