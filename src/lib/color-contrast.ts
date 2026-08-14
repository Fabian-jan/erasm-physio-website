// Calcul de ratio de contraste WCAG 2.x (luminance relative sRGB).
// Référence : https://www.w3.org/TR/WCAG21/#dfn-relative-luminance

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): Rgb {
  const normalized = hex.replace('#', '');
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function toLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance({ r, g, b }: Rgb): number {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Ratio de contraste WCAG entre deux couleurs hexadécimales (#RRGGBB), de 1 (identiques)
 * à 21 (noir sur blanc). Symétrique : contrastRatio(a, b) === contrastRatio(b, a).
 */
export function contrastRatio(hexA: string, hexB: string): number {
  const lumA = relativeLuminance(hexToRgb(hexA));
  const lumB = relativeLuminance(hexToRgb(hexB));
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * WCAG 2.2 — critère 1.4.3 (contraste du texte) et 1.4.11 (composants d'interface non
 * textuels) : texte courant 4,5:1 ; texte large (≥ 24px, ou ≥ 18,66px en gras) et composants
 * d'interface (bordures de champs, icônes porteuses de sens, indicateurs d'état) 3:1.
 */
export const MIN_CONTRAST = {
  text: 4.5,
  large: 3,
} as const;

export type ContrastLevel = keyof typeof MIN_CONTRAST;

export interface DesignSystemColorPair {
  name: string;
  foreground: string;
  background: string;
  level: ContrastLevel;
  expected: 'pass' | 'fail';
}

/**
 * Chaque paire de couleurs réellement utilisée dans le design system (CLAUDE.md, section
 * "Design system" et règle absolue #3 sur le cyan). Source de vérité unique, partagée entre
 * le garde-fou automatisé (tests/unit/color-contrast.test.ts) et la page /styleguide.
 * `expected: 'fail'` documente une combinaison interdite, pas un oubli.
 */
export const designSystemColorPairs: DesignSystemColorPair[] = [
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
