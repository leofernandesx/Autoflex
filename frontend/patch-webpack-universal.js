#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const webpackConfigPath = path.join(__dirname, 'node_modules/react-scripts/config/webpack.config.js');

if (!fs.existsSync(webpackConfigPath)) {
  console.error('webpack.config.js não encontrado!');
  process.exit(1);
}

let content = fs.readFileSync(webpackConfigPath, 'utf8');

// Verificar se já foi aplicado o patch universal (mas ainda aplicar se necessário)
const alreadyPatched = content.includes('// PATCHED BY patch-webpack-universal');

// Garantir que path está disponível
if (!content.includes("const path = require('path');")) {
  const lines = content.split('\n');
  const fsIndex = lines.findIndex(line => line.includes("const fs = require('fs');"));
  if (fsIndex !== -1) {
    lines.splice(fsIndex + 1, 0, "const path = require('path');");
    content = lines.join('\n');
  }
}

// Substituir TODOS os require.resolve('module') que não têm paths
// Padrão: require.resolve('qualquer-coisa') mas não require.resolve('qualquer-coisa', { paths: ... })
const requireResolvePattern = /require\.resolve\s*\(\s*['"]([^'"]+)['"]\s*\)(?!\s*,\s*\{)/g;

let replacementCount = 0;
content = content.replace(requireResolvePattern, (match, moduleName) => {
  // Pular se já tem paths
  if (match.includes('{ paths:')) {
    return match;
  }
  
  replacementCount++;
  return `require.resolve('${moduleName}', { paths: [path.join(__dirname, 'node_modules')] })`;
});

// Também corrigir require.resolve(preProcessor) que aparece em condições
content = content.replace(
  /require\.resolve\s*\(\s*preProcessor\s*\)/g,
  `require.resolve(preProcessor, { paths: [path.join(__dirname, 'node_modules')] })`
);

// Adicionar comentário de marcação apenas se não existir
if (!alreadyPatched) {
  content = '// PATCHED BY patch-webpack-universal\n' + content;
}

fs.writeFileSync(webpackConfigPath, content);
console.log(`✅ Patch universal aplicado! ${replacementCount} require.resolve corrigidos.`);
