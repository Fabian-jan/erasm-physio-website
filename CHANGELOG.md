# Changelog

Ce fichier retrace les évolutions notables du projet. Format libre, pas de génération automatique.

## Note sur l'historique Git

Les commits `d9d400f` à `fb72f77` (E0-US4, E1-US2, E1-US3, E1-US1, E1-US4a, E1-US5) constituent
un **historique reconstitué a posteriori le 14/08/2026**, et non un journal tenu en temps réel.
Le travail correspondant avait été développé localement sans commit intermédiaire pendant tout
un sprint ; il a été redécoupé et committé rétroactivement, US par US, pour produire un historique
lisible — mais les dates de commit ne reflètent pas les dates réelles de développement, et l'ordre
des commits a été reconstruit à partir des fichiers finaux plutôt qu'enregistré au fil de l'eau.

Voir CLAUDE.md, section « Pièges connus » : une US n'est considérée Done qu'une fois réellement
poussée et vérifiée verte en CI — c'est cet écart qui a motivé la reconstruction.

## 2026-08-14

- Rattrapage : E0-US4, E1-US1, E1-US2, E1-US3, E1-US4a (Bouton), E1-US5 commités et poussés.
- Correctif : tokens d'espacement Tailwind préfixés `ds-` pour éliminer toute collision avec
  l'échelle native (`--container-*`), garde-fou automatisé ajouté
  (`tests/unit/token-collisions.test.ts`).
- CI : `/styleguide` ajoutée à l'audit Lighthouse ; `SITE_URL` configurée côté CI (absente
  jusqu'ici, premier échec réel du gate d'environnement introduit en E0-US4).
- Definition of Done scindée en deux versions (infrastructure / page publiée) dans le brief,
  section 9 — la version unique ne pouvait littéralement jamais être satisfaite par une US
  d'infrastructure.
- E1-US4 redécoupée en six US (E1-US4a à E1-US4f), une par composant, après ré-estimation :
  le Bouton seul (E1-US4a) a consommé 5 points sur les 8 initialement prévus pour l'ensemble.
