const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://serverest.dev',
    specPattern: 'cypress/e2e/**/*.feature',
    video: true,
    videoCompression: false,
    viewportWidth: 1366,
    viewportHeight: 768,
    screenshotOnRunFailure: true,

    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      on('task', {
        salvarResultadoApi(resultado) {
          const pastaResultados = path.join(__dirname, 'cypress', 'results');

          if (!fs.existsSync(pastaResultados)) {
            fs.mkdirSync(pastaResultados, { recursive: true });
          }

          const nomeArquivo = `${resultado.id}.json`;
          const caminhoArquivo = path.join(pastaResultados, nomeArquivo);

          fs.writeFileSync(caminhoArquivo, JSON.stringify(resultado, null, 2), 'utf8');

          return null;
        },
      });

      return config;
    },
  },
});