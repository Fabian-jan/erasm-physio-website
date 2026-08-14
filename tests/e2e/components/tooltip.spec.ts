import { expect, test } from '@playwright/test';

test.describe('composant Infobulle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/styleguide/');
  });

  test('le déclencheur est un vrai bouton dont le contenu est fermé au chargement', async ({
    page,
  }) => {
    const trigger = page.getByRole('button', { name: 'Pourquoi ?' });
    await expect(trigger).toBeVisible();

    const panelId = await trigger.getAttribute('aria-describedby');
    expect(panelId).toBeTruthy();
    await expect(page.locator(`#${panelId}`)).toBeHidden();
  });

  test("le contenu est lié au déclencheur par aria-describedby et s'ouvre au clic", async ({
    page,
  }) => {
    const trigger = page.getByRole('button', { name: 'Pourquoi ?' });
    const panelId = await trigger.getAttribute('aria-describedby');
    const panel = page.locator(`#${panelId}`);

    await trigger.click();
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute('role', 'tooltip');
    await expect(panel).toContainText('kinésithérapie');
  });

  test('Échap referme l’infobulle et rend le focus au déclencheur', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Pourquoi ?' });
    const panelId = await trigger.getAttribute('aria-describedby');
    const panel = page.locator(`#${panelId}`);

    await trigger.click();
    await expect(panel).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('un clic en dehors referme l’infobulle ouverte', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Pourquoi ?' });
    const panelId = await trigger.getAttribute('aria-describedby');
    const panel = page.locator(`#${panelId}`);

    await trigger.click();
    await expect(panel).toBeVisible();

    await page.locator('h1').click();
    await expect(panel).toBeHidden();
  });

  test("aucun attribut title n'est utilisé comme substitut de l'infobulle", async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Pourquoi ?' });
    await expect(trigger).not.toHaveAttribute('title');
  });
});
