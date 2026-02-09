#!/bin/bash

# Script para verificar se o remote está configurado para GitHub

echo "🔍 Verificando configuração do Git remote..."
echo ""

REMOTE_URL=$(git remote get-url origin 2>/dev/null)

if [ -z "$REMOTE_URL" ]; then
    echo "❌ Nenhum remote 'origin' configurado!"
    echo ""
    echo "Para adicionar o remote do GitHub, execute:"
    echo "  git remote add origin https://github.com/SEU-USUARIO/Autoflex.git"
    exit 1
fi

echo "📍 Remote atual: $REMOTE_URL"
echo ""

# Verificar se é GitHub
if [[ "$REMOTE_URL" == *"github.com"* ]] || [[ "$REMOTE_URL" == *"github"* ]]; then
    echo "✅ Remote configurado para GitHub!"
    exit 0
fi

# Verificar se é Bit (Bitbucket)
if [[ "$REMOTE_URL" == *"bitbucket"* ]] || [[ "$REMOTE_URL" == *"bit"* ]]; then
    echo "⚠️  ATENÇÃO: Remote configurado para Bit/Bitbucket!"
    echo ""
    echo "Para usar GitHub, remova o remote atual e adicione o do GitHub:"
    echo "  git remote remove origin"
    echo "  git remote add origin https://github.com/SEU-USUARIO/Autoflex.git"
    exit 1
fi

echo "⚠️  Remote não reconhecido. Verifique manualmente."
exit 1
