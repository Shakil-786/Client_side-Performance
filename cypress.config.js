// const { defineConfig } = require("cypress");

import { defineConfig } from "cypress";
async function setupNodeEvents(on, config){
  return config
}
export default defineConfig({
  e2e: {
    setupNodeEvents, 
      specPattern:"cypress/integration/security.js",
    
  },
});
