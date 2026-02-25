const { I, fraudManagementPage } = inject();

Then('the contact form section should be visible on the page', () => {
  I.seeElement(fraudManagementPage.locators.contactSection);
});

Then('the contact form should be loaded and ready', () => {
  I.waitForElement(fraudManagementPage.locators.hsForm, 15);
  I.seeElement(fraudManagementPage.locators.hsForm);
});

When('I fill the contact form with valid demo data', () => {
  I.waitForElement(fraudManagementPage.locators.fieldFirstname, 10);
  I.scrollTo(fraudManagementPage.locators.fieldFirstname);
  I.waitForEnabled(fraudManagementPage.locators.fieldFirstname, 5);
  I.fillField(fraudManagementPage.locators.fieldFirstname, 'Jean');
  I.fillField(fraudManagementPage.locators.fieldLastname,  'Dupont');
  I.fillField(fraudManagementPage.locators.fieldEmail,     'jean.dupont@example.com');
  I.fillField(fraudManagementPage.locators.fieldPhone,     '+33600000000');
  I.fillField(fraudManagementPage.locators.fieldWebsite,   'https://example.com');
  I.selectOption(fraudManagementPage.locators.fieldRevenue,  'Less than 500 000€');
  I.selectOption(fraudManagementPage.locators.fieldBusiness, 'Online');
  I.fillField(fraudManagementPage.locators.fieldMessage,   'Je souhaite une démo de la solution anti-fraude HiPay.');
});

Then('the form fields should contain the entered values', () => {
  I.seeElement(fraudManagementPage.locators.fieldFirstname);
  I.seeElement(fraudManagementPage.locators.fieldLastname);
  I.seeElement(fraudManagementPage.locators.fieldEmail);
  I.seeElement(fraudManagementPage.locators.fieldPhone);
  I.seeElement(fraudManagementPage.locators.fieldWebsite);
  I.seeElement(fraudManagementPage.locators.fieldMessage);
});

Then('the submit button should be visible but not submitted', () => {
  I.seeElement(fraudManagementPage.locators.submitButton);
});
