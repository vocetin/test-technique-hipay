const { I } = inject();

module.exports = {
  url: '/en/our-solutions/fraud-management/',

  locators: {
    heroHeading: { css: 'h1' },
    heroCTA: { css: 'a[href*="#contact"]' },

    contactSection: { css: '#contact, [class*="FormBlock"], [class*="formBlock"]' },
    hsForm: { css: 'form.hs-form' },

    fieldFirstname: { css: 'input[name="firstname"]' },
    fieldLastname:  { css: 'input[name="lastname"]' },
    fieldEmail:     { css: '.hs-form input[name="email"]' },
    fieldPhone:     { css: 'input[name="phone"]' },
    fieldWebsite:   { css: 'input[name="website"]' },
    fieldRevenue:   { css: 'select[name="annual_revenue__in_euros_"]' },
    fieldBusiness:  { css: 'select[name="business_model"]' },
    fieldMessage:   { css: 'textarea[name="message"]' },
    submitButton:   { css: 'input.submit-button, button.submit-button' },

    carousel:               { css: '.swiper' },
    activeSlide:            { css: '.swiper-slide-active' },
    nextSlideButton:        { css: 'button[aria-label="slider next"]' },
    prevSlideButton:        { css: 'button[aria-label="slider previous"]' },
    prevSlideButtonEnabled: { css: 'button[aria-label="slider previous"]:not([disabled])' },
  },

  open() {
    I.amOnPage(this.url);
    I.waitForElement(this.locators.heroHeading, 15);
  },

  clickDemoCTA() {
    I.click(this.locators.heroCTA);
    I.waitForElement(this.locators.contactSection, 10);
    I.waitForElement(this.locators.hsForm, 15);
  },
};
