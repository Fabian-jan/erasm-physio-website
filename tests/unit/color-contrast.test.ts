import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrastRatio, MIN_CONTRAST } from '../../src/lib/color-contrast';

// Lit les valeurs hex réelles depuis la source de vérité (src/styles/global.css), pas une
// copie codée en dur ici — si un token change de couleur, ce test le voit automatiquement.
const css = readFileSync(resolve(__dirname, '../../src/styles/global.css'), 'utf-8');

function readToken(name: string): string {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) {
    throw new Error(`Token --color-${name} introuvable dans src/styles/global.css`);
  }
  return match[1];
}

const colors = {
  navy: readToken('navy'),
  cyan: readToken('cyan'),
  surface: readToken('surface'),
  ink: readToken('ink'),
  muted: readToken('muted'),
  body: readToken('body'),
  white: readToken('white'),
};

type TokenName = keyof typeof colors;

interface Pair {
  name: string;
  foreground: TokenName;
  background: TokenName;
  level: keyof typeof MIN_CONTRAST;
  expected: 'pass' | 'fail';
}

// Chaque paire réellement utilisée dans le design system (CLAUDE.md, section "Design system"
// et règle absolue #3 sur le cyan). `expected: 'fail'` documente une combinaison interdite :
// c'est un garde-fou de régression, pas un oubli — le test échoue si cette paire se met un
// jour à *passer* par erreur (ex. quelqu'un éclaircit le cyan ou assombrit la surface).
const pairs: Pair[] = [
  {
    name: 'Texte blanc sur fond marine (titres, corps de texte sur fond sombre)',
    foreground: 'white',
    background: 'navy',
    level: 'text',
    expected: 'pass',
  },
  {
    name: 'Accent cyan sur fond marine (sur-titres, liens, icônes porteuses de sens)',
    foreground: 'cyan',
    background: 'navy',
    level: 'text',
    expected: 'pass',
  },
  {
    name: 'Libellé marine sur bouton cyan (règle absolue #3)',
    foreground: 'navy',
    background: 'cyan',
    level: 'text',
    expected: 'pass',
  },
  {
    name: 'Texte secondaire (muted) sur fond clair',
    foreground: 'muted',
    background: 'surface',
    level: 'text',
    expected: 'pass',
  },
  {
    name: 'Titres (ink) sur fond clair',
    foreground: 'ink',
    background: 'surface',
    level: 'text',
    expected: 'pass',
  },
  {
    name: 'Texte courant (body) sur fond clair',
    foreground: 'body',
    background: 'surface',
    level: 'text',
    expected: 'pass',
  },
  {
    name: 'INTERDIT — cyan comme texte sur fond clair',
    foreground: 'cyan',
    background: 'surface',
    level: 'text',
    expected: 'fail',
  },
  {
    name: 'INTERDIT — texte blanc sur bouton cyan',
    foreground: 'white',
    background: 'cyan',
    level: 'text',
    expected: 'fail',
  },
];

describe('contraste WCAG du design system', () => {
  it.each(pairs)(
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
