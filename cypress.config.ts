import { defineConfig } from "cypress";

export default defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'test-results/result-[hash].xml'
  },
  "retries": {
    "runMode": 3,
  },
  component: {
    setupNodeEvents(on, config) {},
    viewportHeight: 500,
    viewportWidth: 700,
    excludeSpecPattern: ["**/examples/**/*.spec.js"],
    specPattern: "src/**/*.spec.{js,jsx,ts,tsx}",
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },

  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:3000',
    video:process.env.NODE_ENV=='development',
    chromeWebSecurity: false
  },
  pageLoadTimeout:15000,
  requestTimeout: 15000,
  defaultCommandTimeout: 10000,
});
