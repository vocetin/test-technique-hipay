const { I, fraudManagementPage } = inject();

Then('the carousel should be visible', () => {
  I.waitForElement(fraudManagementPage.locators.carousel, 10);
  I.seeElement(fraudManagementPage.locators.carousel);
});

Then('the active carousel slide should show {string}', (text) => {
  I.see(text, fraudManagementPage.locators.activeSlide);
});

When('I click the next slide button', () => {
  I.click(fraudManagementPage.locators.nextSlideButton);
  I.wait(0.5);
});

When('I click the previous slide button', () => {
  I.click(fraudManagementPage.locators.prevSlideButton);
  I.wait(0.5);
});

Then('the previous slide button should be enabled', () => {
  I.seeElement(fraudManagementPage.locators.prevSlideButtonEnabled);
});
