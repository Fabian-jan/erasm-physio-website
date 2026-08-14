// @ts-check
import { defineConfig } from 'astro/config';
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
});
