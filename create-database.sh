#!/bin/bash
# Script para criar o banco de dados Autoflex

echo "🔧 Criando banco de dados 'autoflex'..."

# Tentar criar o banco de dados
psql -U postgres -h localhost -c "SELECT 1 FROM pg_database WHERE datname='autoflex';" 2>/dev/null | grep -q "1 row"

if [ $? -eq 0 ]; then
    echo "✅ Banco 'autoflex' já existe!"
else
    psql -U postgres -h localhost -c "CREATE DATABASE autoflex;" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Banco 'autoflex' criado com sucesso!"
    else
        echo "⚠️  Erro ao criar banco. Tente executar manualmente:"
        echo "   sudo -u postgres psql -c \"CREATE DATABASE autoflex;\""
        echo "   ou"
        echo "   psql -U postgres -c \"CREATE DATABASE autoflex;\""
    fi
fi
