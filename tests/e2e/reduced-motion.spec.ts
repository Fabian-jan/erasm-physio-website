import { expect, test } from '@playwright/test';

// Vérifie la règle globale (src/styles/global.css), pas un composant en particulier : le
// bouton sert d'exemple parce qu'il a déjà une vraie transition (survol), mais le test porte
// sur le mécanisme — n'importe quel élément avec transition/animation doit être couvert.
test.describe('prefers-reduced-motion : règle globale', () => {
  test('une transition existante est quasi instantanée quand prefers-reduced-motion: reduce est actif', async ({
    page,
  }) => {
    await page.goto('/styleguide/');
    const button = page.getByTestId('button-enabled-demo');

    const normalDuration = await button.evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(parseFloat(normalDuration)).toBeGreaterThan(0);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    const reducedDuration = await button.evaluate((el) => getComputedStyle(el).transitionDuration);

    // 0.01ms = 0.00001s : quasi nul, mais pas "0s"/"none" — voir le commentaire dans
    // global.css sur pourquoi on évite de désactiver purement et simplement les transitions.
    expect(parseFloat(reducedDuration)).toBeLessThan(0.001);
  });

  test('la règle est globale : un élément arbitraire sans classe dédiée est aussi couvert', async ({
    page,
  }) => {
    await page.goto('/styleguide/');

    // Élément injecté à la volée avec sa propre transition, jamais listé nulle part dans le
    // CSS du projet — prouve que la règle s'applique à *tout*, pas à une liste de composants
    // connus qu'on aurait pu oublier de tenir à jour.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const duration = await page.evaluate(() => {
      const el = document.createElement('div');
      el.style.transition = 'opacity 500ms ease';
      document.body.appendChild(el);
      const value = getComputedStyle(el).transitionDuration;
      el.remove();
      return value;
    });

    expect(parseFloat(duration)).toBeLessThan(0.001);
  });
});
