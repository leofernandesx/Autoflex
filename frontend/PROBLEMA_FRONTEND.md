# 🔍 Problema Identificado no Frontend

## Erro Encontrado

```
Cannot find module '@svgr/webpack'
Require stack:
- /home/leonardofernandes/Área de trabalho/Autoflex/frontend/node_modules/react-scripts/config/webpack.config.js
- /home/leonardofernandes/Área de trabalho/Autoflex/frontend/node_modules/react-scripts/scripts/start.js
```

## Causa Raiz

Este é um problema conhecido de compatibilidade entre **Node.js 22** e **react-scripts 5.0.1**. O npm está fazendo "dedupe" das dependências, colocando o `@svgr/webpack` no nível raiz do `node_modules` em vez de dentro de `node_modules/react-scripts/node_modules/`, mas o `require.resolve()` dentro do webpack.config.js do react-scripts está procurando no contexto local do react-scripts.

## Soluções Tentadas

1. ✅ **Desabilitar source maps** - Resolvido o problema do `source-map-loader`
2. ✅ **Instalar @svgr/webpack** - Módulo instalado corretamente
3. ✅ **Copiar módulo para node_modules do react-scripts** - Módulo copiado, mas erro persiste
4. ✅ **Criar script de correção automática** - Script criado, mas problema de resolução persiste

## Soluções Recomendadas

### Opção 1: Usar Node.js 18 ou 20 (RECOMENDADO)

O problema está relacionado à compatibilidade com Node.js 22. A solução mais simples é usar uma versão mais antiga do Node.js:

```bash
# Usando nvm (Node Version Manager)
nvm install 20
nvm use 20

# Ou usando nvm com Node.js 18
nvm install 18
nvm use 18

# Depois, reinstalar dependências
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Opção 2: Atualizar react-scripts (se disponível)

```bash
cd frontend
npm install react-scripts@latest
npm start
```

### Opção 3: Usar CRACO para sobrescrever configuração do webpack

Instalar CRACO e criar configuração customizada:

```bash
cd frontend
npm install @craco/craco --save-dev
```

Criar `craco.config.js`:
```javascript
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Encontrar a regra do SVG e modificar
      const svgRule = webpackConfig.module.rules.find(
        rule => rule.test && rule.test.toString().includes('svg')
      );
      if (svgRule) {
        svgRule.use = [
          {
            loader: require.resolve('@svgr/webpack'),
            options: {
              prettier: false,
              svgo: false,
              svgoConfig: {
                plugins: [{ removeViewBox: false }],
              },
              titleProp: true,
              ref: true,
            },
          },
        ];
      }
      return webpackConfig;
    },
  },
};
```

Atualizar `package.json`:
```json
{
  "scripts": {
    "start": "GENERATE_SOURCEMAP=false craco start",
    "build": "GENERATE_SOURCEMAP=false craco build",
    "test": "craco test"
  }
}
```

### Opção 4: Ejetar do react-scripts (NÃO RECOMENDADO)

```bash
cd frontend
npm run eject
# Isso criará uma cópia permanente da configuração do webpack
# Você poderá então modificar diretamente o webpack.config.js
```

## Status Atual

- ✅ Dependências instaladas
- ✅ Source maps desabilitados (`GENERATE_SOURCEMAP=false`)
- ✅ Script de correção criado (`fix-all-requires.js`)
- ✅ Módulos faltantes instalados: `@svgr/webpack`, `@rollup/pluginutils`, `@surma/rollup-plugin-off-main-thread`, `es-errors`, `es-set-tostringtag`, `@babel/preset-env`
- ✅ Script atualizado para corrigir `workbox-build/bundle.js`
- ⚠️ Problema de compatibilidade com Node.js 22 persiste - múltiplos módulos requerem correção manual

## Correções Aplicadas

1. ✅ Instalados módulos faltantes: `@svgr/webpack`, `@rollup/pluginutils`, `@surma/rollup-plugin-off-main-thread`, `es-errors`, `es-set-tostringtag`, `@babel/preset-env`
2. ✅ Script `fix-all-requires.js` atualizado para corrigir `workbox-build/bundle.js`
3. ✅ Webpack config corrigido para usar `require.resolve` com paths

## Próximos Passos

1. **Recomendação principal**: Usar Node.js 18 ou 20 (mais estável com react-scripts 5.0.1)
2. Se precisar usar Node.js 22:
   - Continue instalando módulos faltantes conforme aparecem
   - Ou considere atualizar para uma versão mais recente do react-scripts
   - Ou use CRACO com configuração customizada
3. O script `fix-all-requires.js` está configurado para executar automaticamente antes de `npm start` e `npm build`

## Arquivos Modificados

- `package.json` - Adicionado `GENERATE_SOURCEMAP=false` e scripts `prestart`/`prebuild`
- `.env` - Adicionado `GENERATE_SOURCEMAP=false`
- `fix-dependencies.sh` - Script para corrigir dependências automaticamente
