module.exports = {
  ci: {
    collect: {
      settings: {
        // --no-sandbox : requis pour lancer Chrome en CI (runner Linux exécuté en root).
        chromeFlags: ['--no-sandbox'],
      },
      staticDistDir: './dist',
      // Échantillonnage par gabarit depuis le 16/08/2026 (E2-US2, brief §9 bis) : seuil des ~20
      // pages en 3 langues franchi d'un coup avec les 24 pages de prestation individuelles
      // (8 prestations × 3 langues, même template piloté par src/lib/prestations.ts). Auditer
      // les 24 serait redondant — Lighthouse note un gabarit, pas un contenu — et ferait plus
      // que tripler la durée de ce job. Un seul échantillon par langue, choisi sur le gabarit le
      // plus distinct (Physiotherapy session : bouton désactivé + infobulle, contrairement aux
      // sept autres pages réservables). L'accessibilité de chacune des 24 pages reste vérifiée
      // intégralement par axe-core (tests/e2e/accessibility.spec.ts, découverte automatique de
      // toutes les pages buildées) — ce n'est que l'échantillon Lighthouse qui est réduit.
      url: [
        'http://localhost/index.html',
        'http://localhost/en/index.html',
        'http://localhost/sv/index.html',
        'http://localhost/styleguide/index.html',
        'http://localhost/hinnasto/index.html',
        'http://localhost/en/pricing/index.html',
        'http://localhost/sv/prislista/index.html',
        'http://localhost/404.html',
        'http://localhost/toiminta-alue/index.html',
        'http://localhost/en/service-area/index.html',
        'http://localhost/sv/verksamhetsomrade/index.html',
        'http://localhost/palvelut/fysioterapiakaynti/index.html',
        'http://localhost/en/services/physiotherapy-session/index.html',
        'http://localhost/sv/tjanster/fysioterapibesok/index.html',
        'http://localhost/minusta/index.html',
        'http://localhost/en/about/index.html',
        'http://localhost/sv/om-mig/index.html',
      ],
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:performance': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      // Pas de "temporary-public-storage" : ce mode enverrait le rapport (donc un aperçu
      // du contenu du site) vers un hébergement public tiers hors garantie UE — contraire
      // à la règle "données et hébergement dans l'UE" du projet. On garde le rapport en
      // artefact CI local à la place.
      target: 'filesystem',
      outputDir: './.lighthouseci',
    },
  },
};
