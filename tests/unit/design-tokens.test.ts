import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Source de vérité : CLAUDE.md, section "Design system". Ce test échoue si
// src/styles/global.css dérive silencieusement de ces valeurs documentées.
const EXPECTED_COLORS = {
  navy: '#042749',
  cyan: '#09e5dd',
  surface: '#f4f6f8',
  ink: '#0f2033',
  muted: '#5a6b7b',
  body: '#3c4e60',
};

const EXPECTED_HEADING_FONT = 'Montserrat';
const EXPECTED_BODY_FONT = 'Nunito Sans';

const css = readFileSync(resolve(__dirname, '../../src/styles/global.css'), 'utf-8').toLowerCase();

describe('tokens du design system (CLAUDE.md)', () => {
  it.each(Object.entries(EXPECTED_COLORS))('déclare la couleur %s à %s', (name, hex) => {
    expect(css).toContain(`--color-${name}: ${hex}`);
  });

  it('utilise Montserrat pour les titres', () => {
    expect(css).toContain(`--font-heading: ${EXPECTED_HEADING_FONT.toLowerCase()}`);
  });

  it('utilise Nunito Sans pour le texte courant', () => {
    expect(css).toContain(`--font-sans: '${EXPECTED_BODY_FONT.toLowerCase()}'`);
  });
});
