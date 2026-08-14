import { expect, test } from '@playwright/test';

test.describe('composant Modale', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/styleguide/');
  });

  test('la modale est fermée au chargement et rattachée à body à l’ouverture', async ({ page }) => {
    const dialog = page.getByRole('dialog', { name: 'Annuler le rendez-vous ?' });
    await expect(dialog).toBeHidden();

    await page.getByRole('button', { name: 'Voir un exemple' }).click();
    await expect(dialog).toBeVisible();

    const parentTag = await dialog.evaluate((el) => el.parentElement?.parentElement?.tagName);
    expect(parentTag).toBe('BODY');
  });

  test('à l’ouverture, le reste du document devient inert', async ({ page }) => {
    const main = page.locator('#main-content');
    await expect(main).not.toHaveAttribute('inert', '');

    await page.getByRole('button', { name: 'Voir un exemple' }).click();
    await expect(main).toHaveAttribute('inert', '');

    await page.keyboard.press('Escape');
    await expect(main).not.toHaveAttribute('inert', '');
  });

  test('le piège de focus empêche de sortir de la modale au clavier (Tab et Maj+Tab)', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Voir un exemple' }).click();
    const dialog = page.getByRole('dialog', { name: 'Annuler le rendez-vous ?' });
    await expect(dialog).toBeFocused();

    const closeButton = dialog.getByRole('button', { name: 'Fermer la fenêtre' });
    const confirmButton = dialog.getByRole('button', { name: "Confirmer l'annulation" });
    const backButton = dialog.getByRole('button', { name: 'Retour' });

    // Maj+Tab depuis le conteneur (premier arrêt logique) doit boucler sur le dernier élément.
    await page.keyboard.press('Shift+Tab');
    await expect(backButton).toBeFocused();

    // Tab depuis le dernier élément doit boucler sur le premier, pas sortir vers la page.
    await page.keyboard.press('Tab');
    await expect(closeButton).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(confirmButton).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(backButton).toBeFocused();
  });

  test('Échap ferme la modale et restitue le focus au déclencheur', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Voir un exemple' });
    await trigger.click();

    const dialog = page.getByRole('dialog', { name: 'Annuler le rendez-vous ?' });
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('le bouton de fermeture referme la modale et restitue le focus', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Voir un exemple' });
    await trigger.click();

    const dialog = page.getByRole('dialog', { name: 'Annuler le rendez-vous ?' });
    await dialog.getByRole('button', { name: 'Fermer la fenêtre' }).click();

    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('un clic sur le fond referme la modale, un clic dans le panneau ne la referme pas', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Voir un exemple' }).click();
    const dialog = page.getByRole('dialog', { name: 'Annuler le rendez-vous ?' });

    await dialog.getByRole('heading', { name: 'Annuler le rendez-vous ?' }).click();
    await expect(dialog).toBeVisible();

    // Clic aux coordonnées du fond (coin, hors du panneau centré).
    await page.mouse.click(5, 5);
    await expect(dialog).toBeHidden();
  });
});
