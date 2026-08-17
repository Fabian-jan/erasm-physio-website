// Test de type, jamais exécuté : lu uniquement par `astro check` (tsconfig.json,
// `include: ["**/*"]`) — vitest ignore ce fichier (vitest.config.ts ne collecte que
// tests/unit/**/*.test.ts). Rien à lancer, rien à assertEquals : la preuve est que ce fichier
// compile ou non.
//
// E3-US5, reformulée le 17/08/2026 : « je veux que l'absence d'une traduction empêche la
// compilation, afin qu'aucune langue ne puisse partir incomplète en production. » Le typage
// Record<Lang, string> de src/lib/prestations.ts fait déjà ça — ce fichier prouve que la garantie
// est réelle aujourd'hui, et cassera si un futur refactor l'affaiblit (ex. Partial<Record<...>>,
// ou Record<Lang, string | undefined>) : la ligne @ts-expect-error cesserait alors de trouver
// l'erreur qu'elle attend, et TypeScript rapporte un « Unused '@ts-expect-error' directive » —
// le test échoue par un autre chemin, mais il échoue.
//
// Sabotage-prouvé le 17/08/2026 : Record<Lang, string> temporairement affaibli en
// Partial<Record<Lang, string>> dans src/lib/prestations.ts, `npm run typecheck` cassé sur les
// quatre lignes ci-dessous (unused @ts-expect-error), puis restauré — voir le commit associé.
import type { Prestation } from '@/lib/prestations';

// @ts-expect-error — slug sans traduction sv : ne doit jamais compiler.
const incompleteSlug: Prestation['slug'] = { fi: 'x', en: 'y' };
const completeSlug: Prestation['slug'] = { fi: 'x', en: 'y', sv: 'z' };

// @ts-expect-error — name sans traduction en : ne doit jamais compiler.
const incompleteName: Prestation['name'] = { fi: 'x', sv: 'z' };
const completeName: Prestation['name'] = { fi: 'x', en: 'y', sv: 'z' };

// @ts-expect-error — description sans traduction fi : ne doit jamais compiler.
const incompleteDescription: Prestation['description'] = { en: 'y', sv: 'z' };
const completeDescription: Prestation['description'] = { fi: 'x', en: 'y', sv: 'z' };

// @ts-expect-error — variants sans traduction sv : ne doit jamais compiler.
const incompleteVariants: Prestation['variants'] = { fi: [], en: [] };
const completeVariants: Prestation['variants'] = { fi: [], en: [], sv: [] };

// Référencées uniquement pour éviter une erreur « déclarée mais jamais utilisée » sans rapport
// avec ce que ce fichier vérifie réellement.
void incompleteSlug;
void completeSlug;
void incompleteName;
void completeName;
void incompleteDescription;
void completeDescription;
void incompleteVariants;
void completeVariants;
