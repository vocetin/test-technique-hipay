const { fraudManagementPage, cookieConsentPage } = inject();

Before(() => {
  try {
    const pw = codeceptjs.container.helpers('Playwright');
    const opts = pw.options;
    const label = opts.browser === 'webkit' ? 'Safari'
      : opts.windowSize === '390x844' ? 'Chrome Mobile'
      : 'Chrome Desktop';
    const allure = codeceptjs.container.plugins('allure');
    if (allure) allure.addParameter('browser', label);
  } catch (_) { /* allure non disponible */ }
});

Given('I am on the HiPay Fraud Management page', () => {
  fraudManagementPage.open();
});

Given('any cookie consent banner is dismissed', async () => {
  await cookieConsentPage.dismissIfPresent();
});

When('I click the {string} CTA', () => {
  fraudManagementPage.clickDemoCTA();
});
