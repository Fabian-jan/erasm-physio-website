module.exports = {
  ci: {
    collect: {
      settings: {
        // --no-sandbox : requis pour lancer Chrome en CI (runner Linux exécuté en root).
        chromeFlags: ['--no-sandbox'],
      },
      staticDistDir: './dist',
      // TODO(EPIC 2) : ajouter ici le chemin de chaque nouvelle page vitrine au fur et à
      // mesure de sa création, pour que Lighthouse CI la couvre aussi.
      url: [
        'http://localhost/index.html',
        'http://localhost/styleguide/index.html',
        'http://localhost/hinnasto/index.html',
        'http://localhost/en/pricing/index.html',
        'http://localhost/sv/prislista/index.html',
        'http://localhost/404.html',
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
