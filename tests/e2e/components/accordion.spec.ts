import { expect, test } from '@playwright/test';

test.describe('composant Accordéon', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/styleguide/');
  });

  test('les panneaux sont fermés au chargement : aria-expanded="false", panneau hidden', async ({
    page,
  }) => {
    const trigger = page.getByRole('button', { name: 'Quels sont vos horaires ?' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    const panelId = await trigger.getAttribute('aria-controls');
    await expect(page.locator(`#${panelId}`)).toBeHidden();
  });

  test('un clic ouvre le panneau et bascule aria-expanded', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Où se trouve le studio ?' });
    await trigger.click();

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const panelId = await trigger.getAttribute('aria-controls');
    const panel = page.locator(`#${panelId}`);
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('Pori');
  });

  test('Entrée au clavier ouvre le panneau, sans clic souris', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Comment annuler un rendez-vous ?' });
    await trigger.focus();
    await page.keyboard.press('Enter');

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const panelId = await trigger.getAttribute('aria-controls');
    await expect(page.locator(`#${panelId}`)).toBeVisible();
  });

  test('mode exclusif : ouvrir un panneau ferme celui déjà ouvert', async ({ page }) => {
    const hoursButton = page.getByRole('button', { name: 'Quels sont vos horaires ?' });
    const locationButton = page.getByRole('button', { name: 'Où se trouve le studio ?' });

    await hoursButton.click();
    await expect(hoursButton).toHaveAttribute('aria-expanded', 'true');

    await locationButton.click();
    await expect(locationButton).toHaveAttribute('aria-expanded', 'true');
    // Le premier doit s'être refermé — c'est le comportement à prouver, pas juste que le
    // second s'ouvre (ça, un accordéon cassé le ferait aussi).
    await expect(hoursButton).toHaveAttribute('aria-expanded', 'false');

    const hoursPanelId = await hoursButton.getAttribute('aria-controls');
    await expect(page.locator(`#${hoursPanelId}`)).toBeHidden();
  });
});
