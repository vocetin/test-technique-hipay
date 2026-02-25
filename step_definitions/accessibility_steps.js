const { I } = inject();
const { injectAxe, checkA11y } = require('axe-playwright');

const KNOWN_VIOLATIONS = ['image-alt', 'svg-img-alt'];

Then('the page should have no critical accessibility violations', async () => {
  await I.usePlaywrightTo('run axe audit', async ({ page }) => {
    await injectAxe(page);
    await checkA11y(page, null, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
      includedImpacts: ['critical', 'serious'],
      violationCallback: (violations) => {
        violations.forEach(v => {
          if (KNOWN_VIOLATIONS.includes(v.id)) {
            console.warn(`⚠️  [KNOWN] ${v.id} (${v.impact}): ${v.description} — ${v.nodes.length} node(s)`);
          }
        });
        const blocking = violations.filter(v => !KNOWN_VIOLATIONS.includes(v.id));
        if (blocking.length) {
          throw new Error(
            `${blocking.length} unexpected accessibility violation(s):\n` +
            blocking.map(v => `  - [${v.impact}] ${v.id}: ${v.description}`).join('\n')
          );
        }
      },
    }, true);
  });
});
