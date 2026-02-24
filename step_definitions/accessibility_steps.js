const { I } = inject();
const { injectAxe, configureAxe, checkA11y } = require('axe-playwright');

Then('the page should have no critical accessibility violations', async () => {
  await I.usePlaywrightTo('run axe audit', async ({ page }) => {
    await injectAxe(page);
    await configureAxe(page, {
      rules: [
        { id: 'image-alt',   enabled: false },
        { id: 'svg-img-alt', enabled: false },
      ],
    });
    await checkA11y(page, null, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
      includedImpacts: ['critical', 'serious'],
    });
  });
});
