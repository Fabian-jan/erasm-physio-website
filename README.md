# ERASM PHYSIO — site web

Site du cabinet de kinésithérapie ERASM PHYSIO (Pori, Finlande). Voir `CLAUDE.md` et
`docs/erasm-physio-brief-et-backlog.md` pour le cadrage complet, les règles absolues et le
backlog Scrum.

## Commandes

| Commande                          | Action                                                                     |
| :-------------------------------- | :------------------------------------------------------------------------- |
| `npm install`                     | Installe les dépendances                                                   |
| `npm run dev`                     | Serveur de dev local (`localhost:4321`)                                    |
| `npm run build`                   | Build de production dans `./dist/`                                         |
| `npm run preview`                 | Prévisualise le build                                                      |
| `npm run lint` / `lint:fix`       | ESLint                                                                     |
| `npm run format` / `format:check` | Prettier                                                                   |
| `npm run typecheck`               | Vérification TypeScript stricte (`astro check`)                            |
| `npm run test:unit`               | Tests unitaires (Vitest)                                                   |
| `npm run test:e2e`                | Build + tests d'accessibilité axe-core (Playwright)                        |
| `npm run lighthouse`              | Build + audit Lighthouse CI (seuils : accessibilité 100, performance ≥ 90) |
| `npm run check`                   | Enchaîne toute la chaîne ci-dessus — c'est exactement ce que la CI exécute |

Avant le premier `npm run test:e2e` ou `npm run check`, installer les navigateurs Playwright
une fois : `npx playwright install --with-deps chromium`.

## Variables d'environnement

Schéma et types dans `src/lib/env.schema.ts` ; valeurs d'exemple dans `.env.example`.

**`SITE_URL`** est requise pour tout build (`npm run build`, `npm run dev` inclus) — sans elle,
`astro.config.mjs` échoue au chargement avec une erreur de validation explicite. Elle doit être
définie **séparément dans chacun des trois environnements du projet**, `.env` n'étant jamais
commité et ne se propageant à aucun des deux autres :

| Environnement       | Où la définir                                                                       |
| :------------------ | :---------------------------------------------------------------------------------- |
| Local               | `cp .env.example .env`, puis renseigner `SITE_URL` (`http://localhost:4321` en dev) |
| CI (GitHub Actions) | `env: SITE_URL` dans `.github/workflows/ci.yml`                                     |
| Vercel              | Project Settings → Environment Variables                                            |

> Cette variable a cassé le build dans les trois environnements, chacun leur tour, avant d'être
> documentée ici — CI (E0-US4), puis Vercel (E0-US3, 14/08/2026). Si un futur environnement
> (staging, etc.) l'oublie à son tour, la corriger ici plutôt que de la re-découvrir en incident.

## Déploiement

Hébergement : Vercel, région Frankfurt (`fra1`) — voir `vercel.json`. Import du repo confirmé et
premier déploiement de production réussi le 14/08/2026 (E0-US3) :
<https://erasm-physio-website.vercel.app>.
