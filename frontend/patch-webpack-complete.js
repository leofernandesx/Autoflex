#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const webpackConfigPath = path.join(__dirname, 'node_modules/react-scripts/config/webpack.config.js');

if (!fs.existsSync(webpackConfigPath)) {
  console.error('webpack.config.js não encontrado!');
  process.exit(1);
}

let content = fs.readFileSync(webpackConfigPath, 'utf8');

// Lista de módulos que precisam de patch (baseado nos erros encontrados)
const modulesToPatch = [
  '@svgr/webpack',
  'file-loader',
  'babel-loader',
  'source-map-loader',
  'css-loader',
  'postcss-loader',
  'style-loader',
  'resolve-url-loader'
];

// Verificar se o patch já foi aplicado (verificar múltiplos módulos)
const hasPatch = content.includes("require.resolve('babel-loader', { paths:") &&
                 content.includes("require.resolve('babel-preset-react-app/dependencies', { paths:");

if (hasPatch) {
  console.log('Patch completo já aplicado!');
  process.exit(0);
}

// Garantir que path está disponível
if (!content.includes("const path = require('path');")) {
  const lines = content.split('\n');
  const fsIndex = lines.findIndex(line => line.includes("const fs = require('fs');"));
  if (fsIndex !== -1) {
    lines.splice(fsIndex + 1, 0, "const path = require('path');");
    content = lines.join('\n');
  }
}

// Função helper para aplicar patch em require.resolve (suporta múltiplas linhas)
function patchRequireResolve(moduleName) {
  // Escapar caracteres especiais para regex
  const escaped = moduleName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Padrão que funciona com múltiplas linhas usando [\s\S] (qualquer caractere incluindo newlines)
  const multilinePattern = new RegExp(
    `require\\.resolve\\s*\\(\\s*['"]${escaped}['"]\\s*\\)(?!\\s*,\\s*\\{)`,
    'g'
  );
  
  const replacement = `require.resolve('${moduleName}', { paths: [path.join(__dirname, 'node_modules')] })`;
  
  // Verificar se já foi aplicado
  if (content.includes(`require.resolve('${moduleName}', { paths:`)) {
    return false;
  }
  
  // Aplicar substituição
  if (content.match(multilinePattern)) {
    content = content.replace(multilinePattern, replacement);
    console.log(`✅ Patch aplicado para: ${moduleName}`);
    return true;
  }
  return false;
}

// Aplicar patch em todos os require.resolve problemáticos
modulesToPatch.forEach(moduleName => {
  patchRequireResolve(moduleName);
});

// Corrigir módulos com subcaminhos
const subpathModules = [
  'babel-preset-react-app',
  'babel-preset-react-app/dependencies',
  'babel-preset-react-app/webpack-overrides',
  'react-refresh/runtime',
  'react-refresh/babel',
  'react/jsx-runtime'
];

subpathModules.forEach(moduleName => {
  patchRequireResolve(moduleName);
});

// Também corrigir require.resolve para preprocessors (sass-loader, less-loader, etc.)
const preprocessorRegex = /loader:\s*require\.resolve\(preProcessor\)/g;
content = content.replace(preprocessorRegex, (match) => {
  return match.replace('require.resolve(preProcessor)', 
    "require.resolve(preProcessor, { paths: [path.join(__dirname, 'node_modules')] })");
});

fs.writeFileSync(webpackConfigPath, content);
console.log('✅ Patch completo aplicado com sucesso!');
