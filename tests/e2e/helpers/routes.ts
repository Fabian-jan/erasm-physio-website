import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

// dist/ doit déjà exister : `npm run test:e2e` lance `astro build` avant `playwright test`,
// donc dist/ est présent au moment où ce fichier est chargé (Playwright collecte les tests
// avant de démarrer webServer, qui ne fait que servir dist/ existant).
const DIST_DIR = join(process.cwd(), 'dist');

function collectHtmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    return statSync(fullPath).isDirectory()
      ? collectHtmlFiles(fullPath)
      : entry.endsWith('.html')
        ? [fullPath]
        : [];
  });
}

function toRoute(htmlFile: string): string {
  const relPath = relative(DIST_DIR, htmlFile).split(sep).join('/');
  return '/' + relPath.replace(/index\.html$/, '').replace(/\.html$/, '');
}

/** Toutes les routes réellement buildées dans dist/, dérivées des fichiers .html générés. */
export function collectPageRoutes(): string[] {
  return collectHtmlFiles(DIST_DIR).map(toRoute);
}
