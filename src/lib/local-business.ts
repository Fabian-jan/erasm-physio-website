import { prestations, minPrestationPrice, type Lang } from '@/lib/prestations';

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
//
// Fonction plutôt qu'objet statique : `url` et `inLanguage` doivent refléter la page qui embarque
// le JSON-LD, pas être partagés à l'identique entre les trois versions linguistiques — trois
// pages différentes ne peuvent pas déclarer la même URL canonique.
interface LocalBusinessOptions {
  url: string;
  inLanguage: Lang;
}

const CATALOG_NAME: Record<Lang, string> = {
  fi: 'Palvelut',
  en: 'Services',
  sv: 'Tjänster',
};

const PRESTATION_PATH: Record<Lang, (slug: string) => string> = {
  fi: (slug) => `/palvelut/${slug}/`,
  en: (slug) => `/en/services/${slug}/`,
  sv: (slug) => `/sv/tjanster/${slug}/`,
};

export function buildLocalBusiness({ url, inLanguage }: LocalBusinessOptions) {
  const origin = new URL(url).origin;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'ERASM PHYSIO',
    url,
    inLanguage,
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
    // Enzo confirme travailler 7 jours sur 7 (correction du 17/08/2026 — les horaires des
    // anciennes maquettes, lun-ven + samedi sur arrangement + dimanche fermé, sont périmés,
    // ne plus les réintroduire). `opens`/`closes` volontairement omis : les heures exactes ne
    // sont pas encore confirmées avec Enzo, et une valeur inventée serait une donnée structurée
    // fausse publiée pour Google — pire qu'une absence. TODO : ajouter opens/closes dès que les
    // heures réelles sont connues (garder un seul dayOfWeek à 7 valeurs tant qu'elles sont
    // identiques chaque jour ; les séparer en plusieurs OpeningHoursSpecification si Enzo confirme
    // des horaires différents selon le jour).
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'https://schema.org/Monday',
        'https://schema.org/Tuesday',
        'https://schema.org/Wednesday',
        'https://schema.org/Thursday',
        'https://schema.org/Friday',
        'https://schema.org/Saturday',
        'https://schema.org/Sunday',
      ],
    },
    // Catalogue des huit prestations (E4-US2), construit depuis la même source que les pages de
    // tarifs et de prestation individuelle (src/lib/prestations.ts) — jamais recopié à la main,
    // pour qu'il ne puisse pas diverger de l'offre réelle. Prix d'appel (minPrestationPrice) plutôt
    // que chaque variante : le catalogue sert à rendre l'offre découvrable pour un moteur de
    // recherche, pas à dupliquer le tableau de tarifs complet déjà présent en JSON-LD Service sur
    // chaque page de prestation. `availability: OutOfStock` pour Physiotherapy session (non
    // réservable) : c'est la valeur ItemAvailability la plus proche de « l'offre existe mais n'est
    // pas achetable pour l'instant » — aucune des valeurs schema.org standard ne dit littéralement
    // « en attente d'une autorisation d'exercice », mais OutOfStock reste le seul choix qui décrit
    // une offre réelle et non fictive, disponible plus tard. La déclarer plutôt que l'omettre :
    // omise, elle disparaîtrait purement et simplement du catalogue au lieu d'apparaître comme
    // « pas encore disponible », alors que la page elle-même l'affiche déjà ainsi.
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: CATALOG_NAME[inLanguage],
      itemListElement: prestations.map((prestation) => ({
        '@type': 'Offer',
        name: prestation.name[inLanguage],
        url: new URL(PRESTATION_PATH[inLanguage](prestation.slug[inLanguage]), origin).href,
        priceCurrency: 'EUR',
        price: minPrestationPrice(prestation, inLanguage),
        availability: prestation.bookable
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      })),
    },
  };
}
