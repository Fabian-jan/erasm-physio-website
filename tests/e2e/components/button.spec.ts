import { expect, test } from '@playwright/test';

test.describe('composant Bouton', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/styleguide/');
  });

  test("un bouton désactivé porte aria-disabled, pas l'attribut disabled, et reste focusable", async ({
    page,
  }) => {
    const disabledButton = page.getByTestId('button-disabled-demo');

    await expect(disabledButton).toHaveAttribute('aria-disabled', 'true');
    await expect(disabledButton).not.toHaveAttribute('disabled', '');

    await disabledButton.focus();
    await expect(disabledButton).toBeFocused();
  });

  test('le clic souris est bloqué sur un bouton désactivé, autorisé sur un bouton actif', async ({
    page,
  }) => {
    const counter = page.locator('#button-demo-count');
    await expect(counter).toHaveText('0');

    // { force: true } : Playwright refuse déjà un clic normal ici ("element is not enabled"),
    // preuve qu'aria-disabled="true" est bien reconnu comme désactivé par de l'outillage tiers.
    // force contourne cette protection pour vérifier que notre propre script d'interception
    // bloque aussi le clic indépendamment — défense en profondeur, pas une simple redondance.
    await page.getByTestId('button-disabled-demo').click({ force: true });
    await expect(counter).toHaveText('0');

    await page.getByTestId('button-enabled-demo').click();
    await expect(counter).toHaveText('1');
  });

  test('Entrée et Espace sont bloquées au clavier sur un bouton désactivé', async ({ page }) => {
    const counter = page.locator('#button-demo-count');
    const disabledButton = page.getByTestId('button-disabled-demo');

    await disabledButton.focus();
    await page.keyboard.press('Enter');
    await expect(counter).toHaveText('0');

    await page.keyboard.press('Space');
    await expect(counter).toHaveText('0');
  });
});
