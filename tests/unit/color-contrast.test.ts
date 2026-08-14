import { describe, expect, it } from 'vitest';
import { contrastRatio, designSystemColorPairs, MIN_CONTRAST } from '../../src/lib/color-contrast';
import { readColorTokens } from '../../src/lib/design-tokens';

// Lit les valeurs hex réelles depuis la source de vérité (src/styles/global.css), pas une
// copie codée en dur ici — si un token change de couleur, ce test le voit automatiquement.
const colors = readColorTokens();

describe('contraste WCAG du design system', () => {
  it.each(designSystemColorPairs)(
    '$name : $foreground sur $background',
    ({ foreground, background, level, expected }) => {
      const ratio = contrastRatio(colors[foreground], colors[background]);
      const min = MIN_CONTRAST[level];
      if (expected === 'pass') {
        expect(ratio, `attendu ≥ ${min}:1, obtenu ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
          min,
        );
      } else {
        expect(
          ratio,
          `attendu < ${min}:1 (combinaison interdite), obtenu ${ratio.toFixed(2)}:1`,
        ).toBeLessThan(min);
      }
    },
  );

  it('détecte spécifiquement la régression cyan #09E5DD sur fond clair', () => {
    const ratio = contrastRatio(colors.cyan, colors.surface);
    expect(ratio).toBeLessThan(MIN_CONTRAST.text);
    expect(ratio).toBeLessThan(MIN_CONTRAST.large);
  });

  it('applique le bon seuil selon le niveau : 4,5:1 texte courant vs 3:1 texte large/UI', () => {
    // Paire synthétique choisie pour tomber entre les deux seuils (≈ 3,45:1), indépendante
    // des tokens réels du projet : prouve que le choix du seuil par niveau fonctionne, sans
    // dépendre de l'existence (ou non) d'une vraie paire du design system dans cet intervalle.
    const ratio = contrastRatio('#8A8A8A', '#FFFFFF');
    expect(ratio).toBeGreaterThanOrEqual(MIN_CONTRAST.large);
    expect(ratio).toBeLessThan(MIN_CONTRAST.text);
  });

  it('contrastRatio est correcte sur les cas de référence WCAG (noir/blanc = 21:1, identiques = 1:1)', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
    expect(contrastRatio('#042749', '#042749')).toBeCloseTo(1, 5);
  });
});
