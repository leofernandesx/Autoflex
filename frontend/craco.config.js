const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Encontrar a regra do SVG loader
      const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf);
      if (oneOfRule && oneOfRule.oneOf) {
        const svgRuleIndex = oneOfRule.oneOf.findIndex(
          rule => rule.test && rule.test.toString().includes('svg')
        );
        
        if (svgRuleIndex !== -1) {
          const svgRule = oneOfRule.oneOf[svgRuleIndex];
          
          // Garantir que @svgr/webpack está disponível
          let svgrLoaderPath;
          try {
            // Tentar resolver do node_modules raiz
            svgrLoaderPath = require.resolve('@svgr/webpack', {
              paths: [path.resolve(__dirname, 'node_modules')]
            });
          } catch (e) {
            // Se não encontrar, tentar do node_modules do react-scripts
            try {
              svgrLoaderPath = require.resolve('@svgr/webpack', {
                paths: [path.resolve(__dirname, 'node_modules/react-scripts/node_modules')]
              });
            } catch (e2) {
              // Última tentativa: caminho absoluto
              svgrLoaderPath = path.resolve(__dirname, 'node_modules/@svgr/webpack/lib/index.js');
            }
          }
          
          // Atualizar o loader para usar o caminho resolvido
          if (svgRule.use && Array.isArray(svgRule.use)) {
            const svgrLoader = svgRule.use.find(
              loader => loader && loader.loader && loader.loader.includes('@svgr/webpack')
            );
            if (svgrLoader) {
              svgrLoader.loader = svgrLoaderPath;
            } else if (svgRule.use[0]) {
              // Se não encontrar, atualizar o primeiro loader
              svgRule.use[0] = {
                loader: svgrLoaderPath,
                options: {
                  prettier: false,
                  svgo: false,
                  svgoConfig: {
                    plugins: [{ removeViewBox: false }],
                  },
                  titleProp: true,
                  ref: true,
                },
              };
            }
          }
        }
      }
      
      return webpackConfig;
    },
  },
};
