// Données structurées LocalBusiness (schema.org), entreprise de services à domicile sans lieu
// ouvert au public. `address` s'arrête à la localité (pas de rue) : Google expose les données
// structurées dans les résultats de recherche et le Knowledge Graph indépendamment du rendu
// visuel de la page — un JSON-LD contenant une adresse complète peut donc fuiter publiquement
// une adresse jamais affichée à l'écran. C'est la recommandation Google pour les entreprises à
// zone de service sans accueil physique. L'adresse complète d'Enzo (Taiteilijankatu 1, 28100
// Pori) reste hors de ce fichier et de tout ce qui compile en HTML — à saisir uniquement dans un
// futur système de réservation/back-office non public, quand celui-ci existera (EPIC 5/11).
//
// geoMidpoint utilise le centre-ville de Pori (coordonnée publique), pas l'adresse d'Enzo.
export const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'ERASM PHYSIO',
  telephone: '+358417201730',
  email: 'erasmphysio@gmail.com',
  address: {
    '@type': 'PostalAddress',
    postalCode: '28100',
    addressLocality: 'Pori',
    addressCountry: 'FI',
  },
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 61.4851,
      longitude: 21.7972,
    },
    geoRadius: '100000',
  },
};
