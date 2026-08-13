# ERASM PHYSIO — site web

Site du cabinet de kinésithérapie ERASM PHYSIO (Pori, Finlande). Voir `CLAUDE.md` et
`docs/erasm-physio-brief-et-backlog.md` pour le cadrage complet, les règles absolues et le
backlog Scrum.

## Commandes

| Commande | Action |
| :-- | :-- |
| `npm install` | Installe les dépendances |
| `npm run dev` | Serveur de dev local (`localhost:4321`) |
| `npm run build` | Build de production dans `./dist/` |
| `npm run preview` | Prévisualise le build |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` / `format:check` | Prettier |
| `npm run typecheck` | Vérification TypeScript stricte (`astro check`) |
| `npm run test:unit` | Tests unitaires (Vitest) |
| `npm run test:e2e` | Build + tests d'accessibilité axe-core (Playwright) |
| `npm run lighthouse` | Build + audit Lighthouse CI (seuils : accessibilité 100, performance ≥ 90) |
| `npm run check` | Enchaîne toute la chaîne ci-dessus — c'est exactement ce que la CI exécute |

Avant le premier `npm run test:e2e` ou `npm run check`, installer les navigateurs Playwright
une fois : `npx playwright install --with-deps chromium`.

## Déploiement

Hébergement : Vercel, région Frankfurt (`fra1`) — voir `vercel.json`. Détail des étapes dans
la conversation de mise en place (E0-US3) ; à résumer ici une fois le compte Vercel connecté.
