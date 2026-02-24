const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

// Run headless in CI environments
setHeadlessWhen(process.env.CI);
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  // Gherkin BDD configuration
  gherkin: {
    features: './features/**/*.feature',
    steps: [
      './step_definitions/common_steps.js',
      './step_definitions/cta_form_steps.js',
      './step_definitions/carousel_steps.js',
    ],
  },

  // Dependency injection of page objects into steps via inject()
  include: {
    fraudManagementPage: './pages/FraudManagementPage.js',
    cookieConsentPage: './pages/CookieConsentPage.js',
  },

  helpers: {
    Playwright: {
      url: 'https://hipay.com',
      browser: 'chromium',
      show: false,
      windowSize: '1440x900',
      waitForNavigation: 'networkidle',
      timeout: 30000,
      fullPageScreenshots: true,
    },
  },

  plugins: {
    // Retry flaky steps (external site subject to network latency)
    retryFailedStep: {
      enabled: true,
      retries: 2,
    },

    // Allure reporting
    allure: {
      enabled: true,
      require: 'allure-codeceptjs',
      outputDir: './allure-results',
    },

    // Screenshot on failure for easier debugging
    screenshotOnFail: {
      enabled: true,
      fullPageScreenshots: true,
    },

    // Pause on failure during local debug sessions only
    pauseOnFail: {
      enabled: !process.env.CI,
    },
  },

  name: 'hipay-fraud-management-e2e',
  output: './output',
};
