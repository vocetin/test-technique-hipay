const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

setHeadlessWhen(process.env.CI);
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  gherkin: {
    features: './features/**/*.feature',
    steps: [
      './step_definitions/common_steps.js',
      './step_definitions/cta_form_steps.js',
      './step_definitions/carousel_steps.js',
      './step_definitions/accessibility_steps.js',
    ],
  },

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
      waitForNavigation: 'domcontentloaded',
      timeout: 30000,
      fullPageScreenshots: true,
    },
  },

  // Cross-browser profiles used by `run-multiple`
  multiple: {
    chrome: {
      plugins: {
        allure: { outputDir: './allure-results/chrome' },
      },
    },
    mobile: {
      Playwright: {
        windowSize: '390x844',
      },
      plugins: {
        allure: { outputDir: './allure-results/mobile' },
      },
    },
    safari: {
      Playwright: {
        browser: 'webkit',
      },
      plugins: {
        allure: { outputDir: './allure-results/safari' },
      },
    },
  },

  plugins: {
    retryFailedStep: {
      enabled: true,
      retries: 2,
    },

    allure: {
      enabled: true,
      require: 'allure-codeceptjs',
      outputDir: './allure-results',
    },

    screenshotOnFail: {
      enabled: true,
      fullPageScreenshots: true,
    },

    pauseOnFail: {
      enabled: !process.env.CI,
    },
  },

  name: 'hipay-fraud-management-e2e',
  output: './output',
};
