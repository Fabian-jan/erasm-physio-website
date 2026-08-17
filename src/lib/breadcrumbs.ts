// JSON-LD BreadcrumbList (E4-US7). Séparé de Breadcrumb.astro pour être réutilisable sans forcer
// le rendu visuel — même logique que buildLocalBusiness (src/lib/local-business.ts) : construire
// les données structurées à partir des mêmes items que ce que l'utilisateur voit à l'écran, pour
// qu'elles ne puissent jamais diverger du fil d'Ariane réellement affiché.
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
