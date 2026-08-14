import { expect, test } from '@playwright/test';

test.describe('composant Sélecteur de langue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/styleguide/');
  });

  test('exactement un lien porte aria-current="page" : le finnois, langue par défaut', async ({
    page,
  }) => {
    const nav = page.getByRole('navigation', { name: 'Choix de la langue' });
    const current = nav.locator('[aria-current="page"]');

    await expect(current).toHaveCount(1);
    await expect(current).toHaveText('Suomi');
  });

  test('English et Svenska ne portent pas aria-current', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Choix de la langue' });

    await expect(nav.getByRole('link', { name: 'English' })).not.toHaveAttribute('aria-current');
    await expect(nav.getByRole('link', { name: 'Svenska' })).not.toHaveAttribute('aria-current');
  });

  test('chaque lien porte hreflang et lang correspondant à sa propre langue', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Choix de la langue' });

    await expect(nav.getByRole('link', { name: 'Svenska' })).toHaveAttribute('hreflang', 'sv');
    await expect(nav.getByRole('link', { name: 'Svenska' })).toHaveAttribute('lang', 'sv');
    await expect(nav.getByRole('link', { name: 'English' })).toHaveAttribute('hreflang', 'en');
  });

  test('ce sont de vrais liens, atteignables au clavier (pas des boutons JS)', async ({ page }) => {
    const link = page.getByRole('link', { name: 'English' });
    await expect(link).toHaveAttribute('href', /.+/);
    await link.focus();
    await expect(link).toBeFocused();
  });
});
