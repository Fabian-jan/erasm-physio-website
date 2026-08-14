import { expect, test } from '@playwright/test';

test.describe('composant Champ de formulaire', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/styleguide/');
  });

  test('le label est réellement associé au champ (pas juste visuellement à côté)', async ({
    page,
  }) => {
    // getByLabel ne fonctionne QUE si <label for> pointe vers le bon id — la façon la plus
    // directe de prouver la liaison, pas de la déduire d'attributs lus séparément. Pas de
    // exact:true : l'astérisque décoratif (aria-hidden) du champ requis fait partie du texte
    // du label, seule sa présence dans le nom accessible calculé varie selon le moteur.
    const field = page.getByLabel('Nom complet');
    await expect(field).toBeVisible();
    await field.fill('Anna Virtanen');
    await expect(field).toHaveValue('Anna Virtanen');
  });

  test('la description est liée par aria-describedby et lisible', async ({ page }) => {
    const field = page.getByLabel('Email');
    const describedBy = await field.getAttribute('aria-describedby');
    expect(describedBy, 'le champ Email doit avoir un aria-describedby').not.toBeNull();

    const descriptionText = await page.locator(`#${describedBy}`).textContent();
    expect(descriptionText).toContain('confirmation');
  });

  test('un champ en erreur porte aria-invalid et son message est lié par aria-describedby', async ({
    page,
  }) => {
    const field = page.getByLabel('Téléphone');

    await expect(field).toHaveAttribute('aria-invalid', 'true');

    const describedBy = await field.getAttribute('aria-describedby');
    expect(describedBy, 'le champ en erreur doit avoir un aria-describedby').not.toBeNull();

    const errorEl = page.locator(`#${describedBy}`);
    await expect(errorEl).toHaveAttribute('role', 'alert');
    await expect(errorEl).toContainText('Ce champ est requis.');
  });

  test("l'avertissement santé du champ Message est bien lié par aria-describedby, pas seulement affiché à côté", async ({
    page,
  }) => {
    const field = page.getByLabel('Message');
    const describedBy = await field.getAttribute('aria-describedby');
    expect(describedBy).not.toBeNull();

    const warningText = await page.locator(`#${describedBy}`).textContent();
    expect(warningText).toContain("N'indiquez pas d'informations de santé");
  });
});
