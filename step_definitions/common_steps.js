const { fraudManagementPage, cookieConsentPage } = inject();

Given('I am on the HiPay Fraud Management page', () => {
  fraudManagementPage.open();
});

Given('any cookie consent banner is dismissed', async () => {
  await cookieConsentPage.dismissIfPresent();
});

When('I click the {string} CTA', () => {
  fraudManagementPage.clickDemoCTA();
});
