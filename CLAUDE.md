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

| Prestation | Durée / format | Prix | Réservable |
|---|---|---|---|
| 1:1 Physiotherapy Session | 60 min, studio Pori | 55 € | ❌ |
| Injury Rehab Plan | 6 semaines, 4 points | 180 € | ❌ |
| Strength & Conditioning | programmation mensuelle | 90 € | ✅ |
| Online Coaching Call | 45 min, visio | 40 € | ✅ |
| Animal Rehab Session | 60 min, chiens et chevaux, sur site | 60 € | ✅ |

Les prestations non réservables restent **visibles**, désactivées via `aria-disabled="true"`
(jamais `opacity: .5` seul — ça casse le contraste), avec une infobulle accessible expliquant
l'attente de l'autorisation d'exercice Valvira. L'état est piloté par un champ `bookable` en
base, basculable depuis le back-office sans redéploiement.

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

## Méthode de travail

Une US à la fois, dans l'ordre du backlog. Pour chaque US : le code, les tests, puis la
vérification explicite de chaque critère d'acceptation un par un.
Signaler une US mal cadrée plutôt que deviner. Tout contenu manquant est marqué `TODO`,
jamais rempli par un placeholder silencieux.
