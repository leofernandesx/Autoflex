#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const webpackConfigPath = path.join(__dirname, 'node_modules/react-scripts/config/webpack.config.js');

if (!fs.existsSync(webpackConfigPath)) {
  console.error('webpack.config.js não encontrado!');
  process.exit(1);
}

let content = fs.readFileSync(webpackConfigPath, 'utf8');

// Garantir que path está disponível
if (!content.includes("const path = require('path');")) {
  const lines = content.split('\n');
  const fsIndex = lines.findIndex(line => line.includes("const fs = require('fs');"));
  if (fsIndex !== -1) {
    lines.splice(fsIndex + 1, 0, "const path = require('path');");
    content = lines.join('\n');
  }
}

// Lista de módulos problemáticos conhecidos
const problematicModules = [
  'babel-preset-react-app/dependencies',
  'babel-preset-react-app/webpack-overrides',
  'sass-loader',
  'less-loader',
  'stylus-loader'
];

let fixed = 0;

// Aplicar correção para cada módulo problemático
problematicModules.forEach(moduleName => {
  // Verificar se já está corrigido
  if (content.includes(`require.resolve('${moduleName}', { paths:`)) {
    return; // Já corrigido
  }
  
  // Escapar para regex
  const escaped = moduleName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Padrão: require.resolve('module') sem paths - mais permissivo
  const patterns = [
    new RegExp(`require\\.resolve\\s*\\(\\s*['"]${escaped}['"]\\s*\\)(?!\\s*,\\s*\\{)`, 'g'),
    new RegExp(`require\\.resolve\\s*\\(\\s*['"]${escaped}['"]\\s*\\)`, 'g') // Fallback
  ];
  
  patterns.forEach(pattern => {
    if (content.match(pattern) && !content.includes(`require.resolve('${moduleName}', { paths:`)) {
      content = content.replace(pattern, 
        `require.resolve('${moduleName}', { paths: [path.join(__dirname, 'node_modules')] })`
      );
      fixed++;
      console.log(`✅ Corrigido: ${moduleName}`);
    }
  });
});

// Aplicar correção universal para TODOS os outros require.resolve sem paths
const universalPattern = /require\.resolve\s*\(\s*['"]([^'"]+)['"]\s*\)(?!\s*,\s*\{)/g;
let universalFixed = 0;

content = content.replace(universalPattern, (match, moduleName) => {
  // Pular se já tem paths
  if (match.includes('{ paths:')) {
    return match;
  }
  
  // Pular módulos já corrigidos acima
  if (problematicModules.includes(moduleName)) {
    return match;
  }
  
  universalFixed++;
  return `require.resolve('${moduleName}', { paths: [path.join(__dirname, 'node_modules')] })`;
});

// Corrigir require.resolve(preProcessor)
content = content.replace(
  /require\.resolve\s*\(\s*preProcessor\s*\)/g,
  `require.resolve(preProcessor, { paths: [path.join(__dirname, 'node_modules')] })`
);

fs.writeFileSync(webpackConfigPath, content);
console.log(`✅ Total corrigido: ${fixed} específicos + ${universalFixed} universais = ${fixed + universalFixed} módulos`);

// Corrigir workbox-build/bundle.js
const workboxBundlePath = path.join(__dirname, 'node_modules/workbox-build/build/lib/bundle.js');
if (fs.existsSync(workboxBundlePath)) {
  let workboxContent = fs.readFileSync(workboxBundlePath, 'utf8');
  let workboxFixed = 0;
  
  // Corrigir require('@surma/rollup-plugin-off-main-thread')
  if (workboxContent.includes("require('@surma/rollup-plugin-off-main-thread')") || 
      workboxContent.includes('require("@surma/rollup-plugin-off-main-thread")')) {
    // Usar require.resolve com paths para encontrar o módulo
    workboxContent = workboxContent.replace(
      /require\(['"]@surma\/rollup-plugin-off-main-thread['"]\)/g,
      `require(require.resolve('@surma/rollup-plugin-off-main-thread', { paths: [path.join(__dirname, '../../..')] }))`
    );
    
    // Garantir que path está disponível
    if (!workboxContent.includes("const path = require('path');")) {
      const lines = workboxContent.split('\n');
      const firstRequireIndex = lines.findIndex(line => line.includes("require("));
      if (firstRequireIndex !== -1) {
        lines.splice(firstRequireIndex, 0, "const path = require('path');");
        workboxContent = lines.join('\n');
      }
    }
    
    workboxFixed++;
    fs.writeFileSync(workboxBundlePath, workboxContent);
    console.log(`✅ Corrigido workbox-build/bundle.js: @surma/rollup-plugin-off-main-thread`);
  }
}
