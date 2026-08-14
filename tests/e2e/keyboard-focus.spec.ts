import { expect, test } from '@playwright/test';
import { collectPageRoutes } from './helpers/routes';

// Éléments réellement atteignables au clavier via Tab. tabindex="-1" est explicitement exclu :
// il rend un élément ciblable par programme (ex. la cible d'un lien d'évitement) sans l'ajouter
// à l'ordre de tabulation normal — voir <main tabindex="-1"> dans BaseLayout.astro.
const FOCUSABLE_SELECTOR = [
  'a[href]:visible',
  'button:not([disabled]):visible',
  'input:not([disabled]):not([type="hidden"]):visible',
  'select:not([disabled]):visible',
  'textarea:not([disabled]):visible',
  '[tabindex]:not([tabindex="-1"]):visible',
].join(', ');

for (const route of collectPageRoutes()) {
  test(`parcours clavier complet sur ${route || '/'} : ordre logique et focus visible`, async ({
    page,
  }) => {
    await page.goto(route);

    const focusable = page.locator(FOCUSABLE_SELECTOR);
    const count = await focusable.count();
    expect(
      count,
      "la page doit exposer au moins un élément focusable (le lien d'évitement)",
    ).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await page.keyboard.press('Tab');

      // L'ordre de tabulation doit suivre l'ordre du DOM : le i-ème Tab doit activer
      // exactement le i-ème élément focusable trouvé dans le document.
      const expectedHandle = await focusable.nth(i).elementHandle();
      const isExpectedElementFocused = await page.evaluate(
        (el) => el === document.activeElement,
        expectedHandle,
      );
      expect(
        isExpectedElementFocused,
        `Tab #${i + 1} : l'élément focusé ne correspond pas au ${i + 1}-ème élément focusable du DOM — ordre de tabulation illogique`,
      ).toBe(true);

      const outline = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const style = getComputedStyle(el);
        return { style: style.outlineStyle, width: style.outlineWidth };
      });

      expect(
        outline,
        `Tab #${i + 1} : aucun élément actif détecté après la pression`,
      ).not.toBeNull();
      expect(
        outline?.style,
        `Tab #${i + 1} : indicateur de focus invisible (outline-style: none)`,
      ).not.toBe('none');
      expect(
        parseFloat(outline?.width ?? '0'),
        `Tab #${i + 1} : indicateur de focus invisible (outline-width: 0)`,
      ).toBeGreaterThan(0);
    }
  });
}
