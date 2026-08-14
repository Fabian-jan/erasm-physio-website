import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Result } from 'axe-core';
import { collectPageRoutes } from './helpers/routes';

const routes = collectPageRoutes();

test.describe('accessibilité (axe-core, WCAG 2.2 AA)', () => {
  for (const route of routes) {
    test(`aucune violation serious/critical sur ${route || '/'}`, async ({ page }) => {
      await page.goto(route);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
        .analyze();

      const seriousOrCritical = results.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical',
      );

      expect(seriousOrCritical, describeViolations(seriousOrCritical)).toEqual([]);
    });
  }
});

function describeViolations(violations: Result[]) {
  if (violations.length === 0) return '';
  return violations
    .map(
      (v) =>
        `[${v.impact}] ${v.id} — ${v.help}\n  éléments : ${v.nodes.map((n) => JSON.stringify(n.target)).join(', ')}`,
    )
    .join('\n');
}
