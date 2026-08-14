// Imprime les scores Lighthouse exacts dans les logs du job CI — un job vert ne dit pas si on
// est à 98 ou à 91. Lit les rapports LHR bruts (.lighthouseci/lhr-*.json) plutôt que le
// manifest.json de @lhci/cli : le format categories.<nom>.score est le schéma stable et
// documenté de Lighthouse lui-même, contrairement au manifest, propre à l'outillage lhci.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = '.lighthouseci';
const CATEGORIES = ['accessibility', 'performance', 'best-practices', 'seo'];

let files;
try {
  files = readdirSync(DIR).filter((name) => name.startsWith('lhr-') && name.endsWith('.json'));
} catch (error) {
  console.error(`Impossible de lire ${DIR}/ : ${error.message}`);
  process.exit(1);
}

if (files.length === 0) {
  console.error(`Aucun rapport lhr-*.json trouvé dans ${DIR}/.`);
  process.exit(1);
}

console.log(`Scores Lighthouse — ${files.length} run(s) trouvé(s) :\n`);

for (const file of files.sort()) {
  const report = JSON.parse(readFileSync(join(DIR, file), 'utf-8'));
  const scores = CATEGORIES.map((category) => {
    const score = report.categories?.[category]?.score;
    const label = category.padEnd(15, ' ');
    return score == null ? `${label}: n/a` : `${label}: ${Math.round(score * 100)}`;
  }).join('  |  ');

  console.log(`${report.finalUrl ?? file}`);
  console.log(`  ${scores}\n`);
}
