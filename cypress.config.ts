import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "http://localhost:3000",

    setupNodeEvents(on, config) {
      return config;
    },
  },

  defaultCommandTimeout: 10000,
  pageLoadTimeout: 30000,
  requestTimeout: 15000,
  responseTimeout: 15000,
});