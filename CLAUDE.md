# ERASM PHYSIO — mémoire projet

Site web du cabinet ERASM PHYSIO (Enzo Janczewski), Pori, Finlande.
Objectif : être trouvé en recherche locale organique et convertir en réservation.

Brief complet et backlog : @docs/erasm-physio-brief-et-backlog.md

## Règles absolues

1. **Aucune donnée de santé** n'entre dans ce système. Pas de note clinique, pas de diagnostic,
   pas de description de blessure, pas de champ libre pouvant en accueillir une. Si une
   fonctionnalité demandée en implique une, s'arrêter et le signaler plutôt que l'implémenter.
2. **Accessibilité WCAG 2.2 AA.** axe-core tourne en CI, une violation fait échouer le build.
   Ce n'est pas une étape de polissage : c'est un critère de Definition of Done.
3. **Le cyan `#09E5DD` ne porte jamais de texte sur fond clair** — contraste 1,6:1. Il ne vit
   que sur fond marine (9,6:1). Un bouton cyan porte un libellé marine, jamais blanc.
4. **Rendu serveur ou statique.** Aucun contenu indexable ne doit dépendre du JavaScript client.
5. **Flux humains et flux animaux séparés dès le modèle de données** — régimes juridiques et
   durées de conservation distincts.
6. **Données et hébergement dans l'UE.**
7. **Registre de rédaction coaching / entraînement / bien-être, tant que l'autorisation Valvira
   n'est pas obtenue.** Mots interdits sur tout le site : *assessment*, *rehabilitation*,
   *injury*, *treatment*, *recovery protocol*, *patient*. On dit *client*, jamais *patient*.
   Contenu source et détail : @docs/contenu-canva.md.

## Stack

Astro (îlots React) · TypeScript strict · Tailwind · PostgreSQL UE · Vitest + Playwright +
axe-core · GitHub Actions · déploiement région nordique ou `fra1`.

## Design system

```
navy    #042749   (dégradé #062F52 → #03203D)   fonds sombres, texte sur clair
cyan    #09E5DD                                  accent, sur marine uniquement
surface #F4F6F8                                  fond des pages claires
ink     #0F2033                                  titres sur fond clair
muted   #5A6B7B                                  texte secondaire
body    #3C4E60                                  texte courant
```

- Titres : Montserrat 600/700/800, `letter-spacing: -.02em`
- Texte : Nunito Sans 400/600/700
- Sur-titres : majuscules, 11–13 px, `letter-spacing: .18em`
- Mobile-first. Maquettes de référence : 402 × 874. Zones tactiles ≥ 44 px sur mobile.
- Navigation : barre d'onglets fixe en bas sur mobile (Home · Book · About), navigation
  horizontale à partir de `md`.

## Internationalisation

FI par défaut, puis EN et SV. URL localisées (`/palvelut/`, `/services/`, `/tjanster/`),
`hreflang` réciproque + `x-default`. Jamais de traduction automatique sur les pages de
prestation. Ne jamais afficher une clé de traduction brute : fallback explicite.

## Prestations

Source : @docs/contenu-canva.md — contenu réel d'Enzo, arbitrages du 14/08/2026. Remplace
intégralement l'ancienne liste issue des maquettes d'application, périmée (ni les intitulés ni
les prix ne correspondaient encore à l'offre réelle).

| Prestation | Durée / format | Prix | Réservable |
|---|---|---|---|
| Physiotherapy session | 45–60 min | 70 € | ❌ `bookable: false` — attente autorisation Valvira |
| Massage | 30 min | 30 € | ✅ |
| Massage | 45 min | 40 € | ✅ |
| Massage | 60 min | 50 € | ✅ |
| Animal Massage | — | 50 € | ✅ |
| Full-Body Mobility | 4 semaines, 7 séances/semaine | 50 € | ✅ |
| Strength Program | 4 semaines, 3 séances/semaine, full body | 40 € | ✅ |
| Personalized Program | 4 semaines, 3 séances | 55 € | ✅ |
| Individual Coaching | 60 min | 60 € | ✅ |
| Individual Coaching | 45 min | 50 € | ✅ |
| Group training | 60 min, minimum 3 personnes | 6 €/personne | ✅ |

Déplacement : 0,40 €/km, supplément — pas une prestation autonome, ne pas la lister comme telle.
**Taping supprimé de l'offre** (décision du 14/08/2026) : ne doit apparaître nulle part sur le
site.

Les prestations non réservables restent **visibles**, désactivées via `aria-disabled="true"`
(jamais `opacity: .5` seul — ça casse le contraste), avec une infobulle accessible expliquant
l'attente de l'autorisation d'exercice Valvira. L'état est piloté par un champ `bookable` en
base, basculable depuis le back-office sans redéploiement. Le prix de la Physiotherapy session
(70 €) est renseigné en base dès maintenant : le jour où l'autorisation tombe, basculer
`bookable` à `true` doit suffire à ouvrir la réservation, sans redéploiement ni modification de
code.

## Parcours de réservation

Service → jour → heure → coordonnées. Quatre étapes, pas une de plus.
Pas de champ de description de blessure (supprimé le 13/08/2026).
Fuseau `Europe/Helsinki` géré explicitement, changements d'heure compris.
Annulation gratuite jusqu'à 24 h avant.
Un créneau ne peut jamais être réservé deux fois : contrainte d'unicité en base + transaction,
avec un test de concurrence automatisé.

## Informations du cabinet

Pori 28100, Finlande · visites à domicile et en écurie · distanciel
+358 41 720 1730 · erasmphysio@gmail.com · @erasmphysio
Lun–ven 08:00–18:00 · samedi sur arrangement · dimanche fermé
Baseline : *Healing Beyond Limits*

## Pièges connus

Découverts en conditions réelles. Ne pas les redécouvrir.

- Tokens d'espacement Tailwind v4. Définir --spacing-<nom> fait basculer max-w-<nom>, w-*,
  gap-* depuis --container-<nom>. N'importe quel nom de l'échelle réservée (3xs … 7xl) est
  concerné. Tous les tokens d'espacement du projet sont préfixés ds- (ds-2xs … ds-3xl).
  tests/unit/token-collisions.test.ts lit la liste réservée directement dans
  node_modules/tailwindcss/theme.css et échoue en cas de collision — ne pas la recopier à la main.
- Une CI verte ne prouve rien sur du code non poussé. La validation d'environnement d'E0-US4 a
  fonctionné en local pendant tout un sprint puis cassé la CI au premier passage réel, faute de
  SITE_URL côté CI. Une US n'est Done qu'après une CI verte sur le commit livré.
- Les tests verts ne suffisent pas sur du visuel. Le bug de collision d'espacement n'a été
  détecté que par une capture d'écran de /styleguide, tous les tests passant. Regarder la page,
  pas seulement le rapport.
- Lighthouse en local échoue sous Windows (bug chrome-launcher). Contourné, non résolu :
  l'audit ne fait foi que via la CI Linux.

## Méthode de travail

Une US à la fois, dans l'ordre du backlog. Pour chaque US : le code, les tests, puis la
vérification explicite de chaque critère d'acceptation un par un.
Signaler une US mal cadrée plutôt que deviner. Tout contenu manquant est marqué `TODO`,
jamais rempli par un placeholder silencieux.
