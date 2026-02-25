const { I, fraudManagementPage } = inject();

Then('the carousel should be visible', () => {
  I.waitForElement(fraudManagementPage.locators.carousel, 10);
  I.seeElement(fraudManagementPage.locators.carousel);
});

Then('the active carousel slide should show {string}', (text) => {
  I.waitForText(text, 5, fraudManagementPage.locators.activeSlide);
});

When('I click the next slide button', () => {
  I.click(fraudManagementPage.locators.nextSlideButton);
});

When('I click the previous slide button', () => {
  I.click(fraudManagementPage.locators.prevSlideButton);
});

Then('the previous slide button should be enabled', () => {
  I.seeElement(fraudManagementPage.locators.prevSlideButtonEnabled);
});
