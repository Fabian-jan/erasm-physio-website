// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { parseEnv } from './src/lib/env.schema.ts';

// astro.config.mjs s'exécute en Node pur, avant que Vite ne traite import.meta.env : on charge
// donc .env explicitement ici pour valider dès le tout premier démarrage (dev comme build).
const env = parseEnv(loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), ''));

// https://astro.build/config
export default defineConfig({
  site: env.SITE_URL,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      // Pages noindex (styleguide interne, 404) exclues : un sitemap ne doit lister que ce
      // qu'on veut voir indexé. Pas de mode i18n natif de l'intégration : nos slugs diffèrent
      // par langue (/palvelut/hieronta/ vs /en/services/massage/), pas seulement le préfixe —
      // ce mode suppose une structure de chemin identique entre langues, ce qui n'est pas notre
      // cas (voir décision du 16/08/2026 sur le routing). Les hreflang réciproques sont portées
      // par page via HreflangLinks.astro, pas par le sitemap.
      filter: (page) => {
        const path = new URL(page).pathname;
        return !path.startsWith('/styleguide') && path !== '/404' && path !== '/404/';
      },
    }),
  ],
});
