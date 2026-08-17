// Périmètre tranché le 17/08/2026 : trois villes seulement (Rauma, Kankaanpää, Huittinen) sur
// les 18 communes validées (service-area.ts), pas une page par commune. Dix-huit pages quasi
// identiques auraient été du contenu fin aux yeux de Google — on mesure l'effet sur ces trois,
// déjà mises en avant sur la page zone d'intervention, avant d'étendre (voir brief, E4-US5).
//
// Noms de commune identiques et non déclinés dans les trois langues, même règle que
// service-area.ts. Distances routières approximatives depuis Pori (vérifiées le 17/08/2026,
// arrondies — pas une promesse au kilomètre près).
export interface CityPage {
  id: string;
  name: string;
  slug: string;
  distanceFromPoriKm: number;
  zone: 'near' | 'rauma' | 'north' | 'east';
}

export const cityPages: CityPage[] = [
  { id: 'rauma', name: 'Rauma', slug: 'rauma', distanceFromPoriKm: 50, zone: 'rauma' },
  {
    id: 'kankaanpaa',
    name: 'Kankaanpää',
    slug: 'kankaanpaa',
    distanceFromPoriKm: 55,
    zone: 'east',
  },
  { id: 'huittinen', name: 'Huittinen', slug: 'huittinen', distanceFromPoriKm: 65, zone: 'east' },
];
