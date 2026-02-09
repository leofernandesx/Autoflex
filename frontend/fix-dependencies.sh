#!/bin/bash
# Script para corrigir problemas de dependências do react-scripts

cd "$(dirname "$0")"

echo "Corrigindo dependências do react-scripts..."

# Garantir que @svgr/webpack está no node_modules do react-scripts
echo "Copiando @svgr/webpack para node_modules do react-scripts..."
mkdir -p node_modules/react-scripts/node_modules/@svgr
rm -rf node_modules/react-scripts/node_modules/@svgr/webpack
cp -r node_modules/@svgr/webpack node_modules/react-scripts/node_modules/@svgr/ 2>/dev/null || {
    echo "Aviso: @svgr/webpack não encontrado no nível raiz, tentando instalar..."
    npm install @svgr/webpack@5.5.0 --save-dev --no-audit --no-fund 2>/dev/null
    cp -r node_modules/@svgr/webpack node_modules/react-scripts/node_modules/@svgr/ 2>/dev/null
}

# Garantir que source-map-loader está no node_modules do react-scripts (se necessário)
if [ ! -d "node_modules/react-scripts/node_modules/source-map-loader" ]; then
    echo "Copiando source-map-loader para node_modules do react-scripts..."
    mkdir -p node_modules/react-scripts/node_modules
    cp -r node_modules/source-map-loader node_modules/react-scripts/node_modules/ 2>/dev/null || true
fi

echo "Dependências corrigidas!"
