import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Result } from 'axe-core';

// dist/ doit déjà exister : `npm run test:e2e` lance `astro build` avant `playwright test`,
// donc dist/ est présent au moment où ce fichier est chargé (Playwright collecte les tests
// avant de démarrer webServer, qui ne fait que servir dist/ existant).
const DIST_DIR = join(process.cwd(), 'dist');

function collectHtmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    return statSync(fullPath).isDirectory()
      ? collectHtmlFiles(fullPath)
      : entry.endsWith('.html')
        ? [fullPath]
        : [];
  });
}

function toRoute(htmlFile: string): string {
  const relPath = relative(DIST_DIR, htmlFile).split(sep).join('/');
  return '/' + relPath.replace(/index\.html$/, '').replace(/\.html$/, '');
}

const routes = collectHtmlFiles(DIST_DIR).map(toRoute);

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
