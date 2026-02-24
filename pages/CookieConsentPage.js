const { I } = inject();

module.exports = {
  locators: {
    banner: {
      css: '#cookiebanner, #onetrust-banner-sdk, [id*="cookie-banner"], [class*="cookie-banner"], [class*="cookie-consent"], [class*="CookieBanner"]',
    },
    acceptBtn: {
      css: '#onetrust-accept-btn-handler, [class*="accept-cookie"], [class*="cookie-accept"], button[id*="accept"], button[class*="accept"]',
    },
  },

  async dismissIfPresent() {
    const bannerCount = await I.grabNumberOfVisibleElements(this.locators.banner);
    if (bannerCount > 0) {
      try {
        I.click(this.locators.acceptBtn);
        I.waitForInvisible(this.locators.banner, 5);
      } catch (_err) {
        // banner present but not interactable — proceed anyway
      }
    }
  },
};
