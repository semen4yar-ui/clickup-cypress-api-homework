const { defineConfig } = require("cypress");
require("dotenv").config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env.baseUrl = process.env.BASE_URL;
      config.env.token = process.env.CLICKUP_TOKEN;
      config.env.teamId = process.env.TEAM_ID;

      return config;
    },
  },
});
