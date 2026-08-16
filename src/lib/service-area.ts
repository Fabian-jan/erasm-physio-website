// Noms de communes identiques dans les trois langues (validés par l'utilisateur le 16/08/2026,
// 18 communes) — jamais traduits, jamais déclinés. Source unique pour éviter toute dérive entre
// les trois pages (même risque que la liste de prestations avant docs/contenu-canva.md).
//
// Groupement par zone : connaissance géographique générale, PAS une source vérifiée (pas d'API
// de distance/carte utilisée). Pomarkku a déjà dû être corrigé une fois (proposé en zone "near",
// en réalité au nord — signalé par l'utilisateur le 16/08/2026). Le reste du classement est du
// même niveau de confiance et mérite la même vérification sur une carte avant d'être considéré
// fiable.
export interface ServiceZone {
  key: 'near' | 'rauma' | 'north' | 'east';
  towns: string[];
}

export const serviceZones: ServiceZone[] = [
  { key: 'near', towns: ['Ulvila', 'Nakkila', 'Harjavalta', 'Kokemäki'] },
  { key: 'rauma', towns: ['Rauma', 'Eurajoki', 'Laitila', 'Uusikaupunki'] },
  { key: 'north', towns: ['Merikarvia', 'Siikainen', 'Pomarkku'] },
  {
    key: 'east',
    towns: ['Kankaanpää', 'Jämijärvi', 'Karvia', 'Eura', 'Säkylä', 'Huittinen', 'Sastamala'],
  },
];
