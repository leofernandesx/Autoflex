#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const webpackConfigPath = path.join(__dirname, 'node_modules/react-scripts/config/webpack.config.js');

if (!fs.existsSync(webpackConfigPath)) {
  console.error('webpack.config.js não encontrado!');
  process.exit(1);
}

let content = fs.readFileSync(webpackConfigPath, 'utf8');

// Verificar se já foi aplicado o patch completo
const patchApplied = content.includes("require.resolve('@svgr/webpack', { paths:") && 
                     content.includes("require.resolve('file-loader', { paths:");

if (patchApplied) {
  console.log('Patch já aplicado!');
  process.exit(0);
}

// Aplicar patch para @svgr/webpack e file-loader
const svgrPath = path.join(__dirname, 'node_modules/@svgr/webpack/lib/index.js');
const fileLoaderPath = path.join(__dirname, 'node_modules/file-loader');

let needsPath = false;

if (fs.existsSync(svgrPath)) {
  // Substituir require.resolve('@svgr/webpack') por uma versão que funciona
  content = content.replace(
    /require\.resolve\('@svgr\/webpack'\)/g,
    `require.resolve('@svgr/webpack', { paths: [path.join(__dirname, 'node_modules')] })`
  );
  needsPath = true;
}

if (fs.existsSync(fileLoaderPath)) {
  // Substituir require.resolve('file-loader') por uma versão que funciona
  content = content.replace(
    /require\.resolve\('file-loader'\)/g,
    `require.resolve('file-loader', { paths: [path.join(__dirname, 'node_modules')] })`
  );
  needsPath = true;
}

// Adicionar require('path') no topo se não existir e for necessário
if (needsPath && !content.includes("const path = require('path');")) {
  const lines = content.split('\n');
  const requireIndex = lines.findIndex(line => line.includes("const resolve = require('resolve');"));
  if (requireIndex !== -1) {
    lines.splice(requireIndex + 1, 0, "const path = require('path');");
    content = lines.join('\n');
  }
}

fs.writeFileSync(webpackConfigPath, content);
console.log('✅ Patch aplicado com sucesso!');
