import type { APIRoute } from 'astro';

// Endpoint plutôt que fichier statique dans public/ : l'URL du sitemap doit refléter le vrai
// SITE_URL de l'environnement (localhost en local/CI, domaine réel en production), pas une
// valeur figée — même piège que le JSON-LD (tests/e2e/json-ld.spec.ts). Pré-rendu en fichier
// statique au build (output "static" du projet), donc aucun coût à l'exécution.
//
// Pas de Disallow sur /styleguide ou /404 : ces pages portent déjà <meta name="robots"
// content="noindex, nofollow">, qui suffit à empêcher leur indexation. Un Disallow ici
// empêcherait Google de même crawler la page pour y lire cette balise — les deux mécanismes ne
// se cumulent pas, ils s'excluent (recommandation Google).
export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL('sitemap-index.xml', site).href;
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
