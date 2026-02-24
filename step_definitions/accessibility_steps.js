const { I } = inject();
const { injectAxe, configureAxe, checkA11y } = require('axe-playwright');

const BASE_OPTIONS = {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
  includedImpacts: ['critical', 'serious'],
};

Then('the page should have no critical accessibility violations', async () => {
  await I.usePlaywrightTo('run axe audit on full page', async ({ page }) => {
    await injectAxe(page);
    // image-alt / svg-img-alt are content issues on this third-party site
    // and are excluded from the structural audit.
    await configureAxe(page, {
      rules: [
        { id: 'image-alt',   enabled: false },
        { id: 'svg-img-alt', enabled: false },
      ],
    });
    await checkA11y(page, null, BASE_OPTIONS);
  });
});

Then('the contact form fields should have accessible labels', async () => {
  await I.usePlaywrightTo('run axe audit on contact form', async ({ page }) => {
    await injectAxe(page);
    await checkA11y(page, 'form.hs-form', BASE_OPTIONS);
  });
});

Then('the carousel navigation buttons should be keyboard accessible', async () => {
  await I.usePlaywrightTo('check carousel button keyboard focus', async ({ page }) => {
    // Multiple carousels on the page — focus the first "slider next" button.
    await page.locator('button[aria-label="slider next"]').first().focus();
    const focused = await page.evaluate(
      () => document.activeElement?.getAttribute('aria-label'),
    );
    if (focused !== 'slider next') {
      throw new Error('carousel "slider next" button is not keyboard focusable');
    }
  });
});
