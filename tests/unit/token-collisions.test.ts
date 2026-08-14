import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readThemeTokens } from '../../src/lib/design-tokens';

// Tailwind v4 partage --spacing-* entre p-*, m-*, w-*, h-*, gap-*, max-w-*, min-w-*, inset-*,
// top-*, size-*, etc. Vérifié empiriquement (build réel + inspection du CSS généré) : dès
// qu'un --spacing-<nom> personnalisé est défini, max-w-<nom> et les autres utilitaires de
// dimensionnement basculent dessus au lieu de leur source par défaut (--container-<nom> pour
// max-w-*). C'est exactement le bug qui a redéfini max-w-3xl de 768px à 64px en E1-US1 —
// silencieusement, sans qu'aucun test ne le détecte avant une inspection visuelle manuelle.
//
// D'autres namespaces (--radius-*, --tracking-*, --shadow-*) ne servent qu'à UNE seule
// famille d'utilitaires chacun : les redéfinir avec un nom réservé de Tailwind (ex.
// --radius-lg) est un choix de design assumé (on veut que rounded-lg change de valeur), pas
// un risque de collision croisée. Seul --spacing-* est vérifié ici.
//
// La liste des noms réservés est lue depuis le paquet tailwindcss installé (--container-*
// dans theme.css), pas recopiée à la main : si Tailwind ajoute un palier dans une future
// version, ce test le voit automatiquement plutôt que de dormir avec une liste obsolète.
function readReservedContainerNames(): string[] {
  const themeCssPath = resolve(process.cwd(), 'node_modules/tailwindcss/theme.css');
  const css = readFileSync(themeCssPath, 'utf-8');
  return [...css.matchAll(/--container-([a-z0-9]+):/g)].map((match) => match[1]);
}

describe('aucun token --spacing-* personnalisé ne collisionne avec Tailwind', () => {
  it("l'échelle de dimensionnement nommée réservée par Tailwind contient bien les paliers attendus", () => {
    // Garde-fou sur le garde-fou : si cette liste est vide ou anormalement courte, c'est que
    // la lecture du fichier a échoué silencieusement plutôt que de vraiment protéger contre
    // une collision.
    const reserved = readReservedContainerNames();
    expect(reserved.length).toBeGreaterThanOrEqual(13);
    expect(reserved).toContain('3xl');
    expect(reserved).toContain('sm');
  });

  it('aucun nom de --spacing-* du projet ne figure dans la liste réservée de Tailwind', () => {
    const reserved = readReservedContainerNames();
    const customSpacingTokens = readThemeTokens('spacing');

    expect(
      customSpacingTokens.length,
      "aucun token --spacing-* trouvé — si l'échelle a été retirée, ce test devrait aussi être retiré plutôt que de passer silencieusement sur un tableau vide",
    ).toBeGreaterThan(0);

    for (const token of customSpacingTokens) {
      expect(
        reserved,
        `--spacing-${token.name} collisionne avec l'échelle native de Tailwind (--container-${token.name} existe) — ce nom redéfinirait silencieusement max-w-${token.name}, w-${token.name}, etc. Choisir un nom hors de cette liste.`,
      ).not.toContain(token.name);
    }
  });

  it('démonstration : un nom réservé (ex. "lg") collisionnerait bien si on l\'utilisait', () => {
    // Ne teste pas notre CSS réel — prouve que le mécanisme de détection lui-même fonctionne,
    // indépendamment de ce qui est actuellement dans global.css.
    const reserved = readReservedContainerNames();
    expect(reserved).toContain('lg');
    expect(reserved).not.toContain('ds-lg');
  });
});
