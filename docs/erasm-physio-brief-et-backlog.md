# ERASM PHYSIO — Brief projet, prompt de développement & backlog Scrum

> Document de référence. Sections 1 à 6 = le cadrage. Section 7 = le prompt à me redonner
> pour lancer le développement. Sections 8 à 11 = le backlog Scrum à importer dans Trello.

---

## 1. Contexte

| | |
|---|---|
| **Projet** | Site web de l'activité de kinésithérapie ERASM PHYSIO |
| **Nature** | Lancement d'une activité professionnelle réelle en Finlande |
| **Objectif business** | Acquisition de patients : être trouvé en recherche locale, convertir en prise de RDV |
| **Langues** | Finnois (principal), Anglais, Suédois |
| **Design** | Maquettes réalisées sur Claude Design (`ERASM PHYSIO App-print.dc.html`) |
| **Priorité forte** | Accessibilité maximale, au service du référencement naturel |

**Fonctionnalités v1 retenues :** prise de rendez-vous en ligne · formulaire de contact · espace patient.

---

## 2. Contraintes légales finlandaises — à lire avant d'écrire une ligne de code

Ces contraintes ne sont pas des détails de conformité à traiter en fin de projet : elles
déterminent l'architecture.

### 2.1 Exercer

- Le métier de kinésithérapeute (*fysioterapeutti*) est une profession réglementée en Finlande :
  autorisation d'exercice délivrée par Valvira obligatoire.
- Depuis la loi de contrôle sanitaire et social (741/2023), tout prestataire privé — y compris
  un indépendant en *toiminimi* — doit être **enregistré au registre Soteri avant de démarrer**.
- Source : <https://lvv.fi/sosiaali-ja-terveydenhuolto/palveluntuottajarekisteri-soteri>

### 2.2 Données patient — le point bloquant

- Loi sur les données clients **703/2023**, en vigueur depuis le 01/01/2024 : un prestataire
  qui utilise un système électronique de données patient **doit se raccorder aux services Kanta**.
- Un système de traitement de données patient doit figurer au registre **Astor** ; seuls les
  systèmes **certifiés A2 ou A3** peuvent être connectés à Kanta. La certification implique un
  test conjoint avec Kela (*yhteistestaus*) + un audit de sécurité par un organisme agréé.
- Développer soi-même un **dossier patient clinique** = devenir *tietojärjestelmäpalvelun tuottaja*
  en classe A2/A3, avec certification et audit. **Hors de portée.**
- En revanche, un système **strictement administratif** (agenda, coordonnées, factures, sans
  aucune donnée de soin) relève a priori de la **classe B** : ni test conjoint avec Kela, ni audit
  de sécurité externe, mais il doit remplir les *exigences essentielles* correspondant à son usage.
  C'est le périmètre retenu pour la v1.
- ⚠️ **Zone grise à lever** : l'obligation de raccordement à Kanta est déclenchée par l'usage d'un
  « système de traitement de données clients ». Un pur agenda en fait-il partie ? À confirmer par
  écrit auprès de l'AVI de la région avant la mise en ligne. C'est un point administratif, pas
  technique — mais il est bloquant pour l'ouverture aux vrais patients.
- Sources : <https://lvv.fi/sosiaali-ja-terveydenhuolto/tietojarjestelmat> ·
  <https://thl.fi/aiheet/tiedonhallinta-sosiaali-ja-terveysalalla/tiedonhallinnan-ohjaus/olennaiset-vaatimukset-ja-sertifiointi>

### 2.3 Décision d'architecture qui en découle

| Besoin | Solution v1 | À ne pas faire |
|---|---|---|
| Prise de RDV | **Moteur interne** (décision du 13/08/2026) : créneaux, réservation, annulation, déplacement, gérés dans notre base | Y adosser le moindre champ clinique |
| Gestion des RDV | **Back-office admin interne** : agenda, annulation, déplacement, création de RDV, fiches patient administratives | Y stocker notes de séance, diagnostics, antécédents |
| Espace patient | Compte : ses RDV, annulation/déplacement, factures, documents administratifs, préférences | Stocker notes de séance, diagnostics, antécédents |
| Formulaire de contact | Champs strictement administratifs, mention explicite « ne décrivez pas votre état de santé ici » | Champ libre « décrivez vos symptômes » |

> **RGPD** : tout ce qui touche à la santé relève de l'art. 9 (catégorie particulière).
> La règle de conception du projet est : **aucune donnée de santé ne transite ni ne se stocke
> dans notre système.** Cette phrase est un critère d'acceptation transverse.

---

## 3. Périmètre

### v1 — mise en ligne

- Pages vitrine : accueil, prestations (une page par prestation), à propos, tarifs, contact, accès
- Trilingue FI / EN / SV avec URL localisées
- Prise de RDV via prestataire certifié
- Formulaire de contact (données administratives uniquement)
- Espace patient light (auth, historique de RDV, factures, documents)
- SEO technique + SEO local complet
- Accessibilité WCAG 2.2 niveau AA
- Pages légales : mentions, politique de confidentialité, cookies, déclaration d'accessibilité

### v2 — après mise en ligne

- Blog / FAQ éditoriale (`fysioterapia [ville]`, pathologies, exercices)
- Avis patients
- Newsletter
- Programmes d'exercices envoyés au patient (⚠️ revérifier le statut réglementaire avant)

### Hors périmètre, définitivement

- Dossier patient clinique, comptes rendus de séance, téléconsultation, paiement de soins en ligne

---

## 4. Stack technique recommandée

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | **Astro** (îlots React) ou **Next.js App Router** en SSG/ISR | HTML servi complet = SEO sain. Un SPA React classique part avec un handicap d'indexation |
| Langage | TypeScript strict | |
| Styles | Tailwind + tokens issus des maquettes Claude Design | |
| i18n | `astro-i18n` / `next-intl`, routing par préfixe de langue | |
| Contenu | Markdown/MDX versionné, ou Sanity/Payload si édition autonome souhaitée | |
| Espace patient | Auth via Supabase / Auth.js, PostgreSQL hébergé **dans l'UE** | Localisation des données = exigence, pas confort |
| Formulaire | Route API serveur + anti-spam (honeypot + rate limiting) | Pas de service tiers hors UE |
| Hébergement | Vercel région `fra1`/`arn1`, ou hébergeur nordique (UpCloud, Hetzner) | Latence Finlande + résidence des données |
| Tests | Vitest + Playwright + **axe-core en CI** | L'accessibilité doit casser le build, pas figurer dans une checklist |
| CI/CD | GitHub Actions : lint, types, tests, axe, Lighthouse CI |

---

## 5. Exigences accessibilité & SEO

L'accessibilité est ici un levier SEO direct : structure sémantique, hiérarchie de titres,
alternatives textuelles et libellés explicites sont lus autant par les lecteurs d'écran que par
les robots.

### Accessibilité — cible WCAG 2.2 AA

- HTML sémantique : `header`, `nav`, `main`, `article`, `footer`. Un seul `h1` par page,
  hiérarchie de titres sans saut de niveau
- Contraste ≥ 4,5:1 (texte courant), ≥ 3:1 (texte large et composants d'interface)
- Navigation clavier complète, `:focus-visible` toujours perceptible, lien d'évitement
- Zones cliquables ≥ 24×24 px (WCAG 2.2, critère 2.5.8)
- Formulaires : `label` associé à chaque champ, erreurs annoncées via `aria-live`, message
  décrivant la correction attendue
- `prefers-reduced-motion` respecté
- Images décoratives en `alt=""`, images informatives décrites
- Vérification : axe-core en CI + passe manuelle clavier + NVDA/VoiceOver

### SEO technique

- Un `title` et une `meta description` uniques par page et par langue
- `hreflang` réciproque FI/EN/SV + `x-default`
- URL localisées : `/palvelut/`, `/services/`, `/tjanster/`
- Données structurées JSON-LD : `Physiotherapy`, `MedicalBusiness`, `LocalBusiness`,
  `BreadcrumbList`, `FAQPage`
- `sitemap.xml` multilingue, `robots.txt`, canoniques absolues
- Core Web Vitals : LCP < 2,5 s, INP < 200 ms, CLS < 0,1
- Images en AVIF/WebP, `width`/`height` déclarés, `loading="lazy"` hors du premier écran

### SEO local

- Google Business Profile complété (NAP, horaires, photos, prestations)
- Cohérence stricte du NAP (nom, adresse, téléphone) entre le site et les annuaires
- Page dédiée par ville / zone d'intervention
- Inscription sur les annuaires santé finlandais

---

## 6. Internationalisation

- **Finnois = langue par défaut.** Ce n'est pas une traduction du français : c'est la langue source.
- Ne pas détecter la langue par géolocalisation. Détection via `Accept-Language` au premier
  passage, choix mémorisé, sélecteur toujours visible.
- Contenu traduit par un humain, pas par machine, sur les pages de prestation : le vocabulaire
  clinique finnois se prête mal à la traduction automatique.
- Terminologie de référence : *fysioterapia*, *hieronta*, *kuntoutus*, *ajanvaraus*, *hinnasto*.

---

## 6 bis. Design system extrait des maquettes (livrées le 13/08/2026)

### Ce que contient l'archive

9 écrans **d'application mobile iOS, 402 × 874** : accueil, programmes, parcours de réservation
en 4 étapes, confirmation, à propos, contact. Barre d'onglets : Home · Book · About.
Aucun écran d'espace patient, aucun écran d'administration — les EPICs 7 et 11 sont à concevoir.

### Tokens

| Token | Valeur | Usage |
|---|---|---|
| `navy` | `#042749` (dégradé `#062F52` → `#03203D`) | Fonds sombres, texte principal sur clair |
| `cyan` | `#09E5DD` | Accent, signature de marque |
| `surface` | `#F4F6F8` | Fond des pages claires |
| `ink` | `#0F2033` | Titres sur fond clair |
| `muted` | `#5A6B7B` | Texte secondaire |
| `body` | `#3C4E60` | Texte courant sur fond clair |
| Titres | Montserrat 600 / 700 / 800, `letter-spacing: -.02em` | |
| Texte | Nunito Sans 400 / 600 / 700 | |
| Suréclat | `letter-spacing: .18em`, majuscules, 11–13 px | Sur-titres de section |

### ⚠️ Contrastes calculés

| Combinaison | Ratio | Verdict |
|---|---|---|
| Blanc sur `navy` | 15,1:1 | ✅ |
| `cyan` sur `navy` | 9,6:1 | ✅ |
| `muted` sur `surface` | 5,0:1 | ✅ AA |
| **`cyan` sur blanc / `surface`** | **1,6:1** | ❌ inutilisable pour du texte |
| **Blanc sur `cyan`** | **1,6:1** | ❌ un bouton cyan ne peut pas avoir de libellé blanc |

**Règle à graver dans le design system :** le cyan ne vit que sur fond marine. Sur fond clair,
il ne sert qu'à des surfaces décoratives non porteuses d'information. Un bouton cyan porte un
libellé marine (9,6:1), jamais blanc. C'est le seul écart bloquant que j'ai trouvé dans la palette.

### Contenu réel récupéré des maquettes

- **Praticien** : Enzo Janczewski — *Physiotherapy Student · Strength & Conditioning Coach*
- **Baseline** : Healing Beyond Limits
- **Lieu** : studio de Pori (28100), visites à domicile et en écurie, distanciel
- **Contact** : +358 41 720 1730 · erasmphysio@gmail.com · @erasmphysio
- **Horaires** : lun–ven 08:00–18:00 · samedi sur arrangement · dimanche fermé
- **5 prestations** : 1:1 Physiotherapy 60 min 55 € · Injury Rehab Plan 6 semaines 180 € ·
  Strength & Conditioning mensuel 90 € · Online Coaching Call 45 min 40 € ·
  Animal Rehab Session 60 min 60 €
- **Filtres** : All / People / Animals / Online
- **Règle d'annulation** : gratuite jusqu'à 24 h avant — cohérent avec E5-US9
- **Week-ends** : ouverts sur arrangement pour les visites animales

---

## 6 ter. Décisions actées le 13/08/2026

### 1. Site web responsive, mobile-first — ✅ tranché

Les maquettes iOS deviennent la **référence du breakpoint mobile**, pas une cible native.
On construit un site web mobile-first : les 9 écrans sont la base, les breakpoints tablette et
desktop sont dérivés. Le tout est indexable, et installable en PWA sur l'écran d'accueil.

Conséquences concrètes :

- Les écrans sont conçus à 402 px de large → breakpoint de base `< 640px`, puis `md` et `lg`
- La barre d'onglets (Home · Book · About) devient une navigation fixe en bas sur mobile,
  et une navigation horizontale classique à partir de `md`
- Zones tactiles ≥ 44 px sur mobile (au-delà du minimum WCAG de 24 px)
- Pas de `dvh` sans repli : les barres d'adresse mobiles cassent `100vh`

### 2. Champ « Tell me about your injury » — ✅ supprimé

L'étape 3 ne conserve que le choix du créneau. Aucune description de blessure, aucune puce
`Knee` / `Shoulder` / `Post-surgery`. L'information est recueillie en séance, à l'oral.
Le parcours passe de 4 à 4 étapes inchangées, simplement allégées : service → jour → heure →
coordonnées.

**Bénéfice collatéral :** sans ce champ, plus aucune donnée de santé ne transite par le site.
Le système reste strictement administratif, ce qui maintient le périmètre en classe B et
simplifie durablement la conformité.

### 3. Prestations de kinésithérapie — ✅ affichées, non réservables

Tant que l'autorisation Valvira n'est pas obtenue, les prestations de kinésithérapie destinées
aux humains sont **visibles mais désactivées**, avec une explication accessible.

Répartition retenue (à corriger si elle ne correspond pas à la réalité) :

| Prestation | État v1 | Motif |
|---|---|---|
| 1:1 Physiotherapy Session | 🔒 non réservable | Acte de kinésithérapie, profession réglementée |
| Injury Rehab Plan | 🔒 non réservable | Rééducation, même régime |
| Online Coaching Call | ✅ réservable | Coaching pur, sans acte de rééducation — confirmé le 13/08/2026 |
| Strength & Conditioning | ✅ réservable | Coaching sportif, non réglementé |
| Animal Rehab Session | ✅ réservable | Chiens et chevaux : hors Valvira, hors Soteri, hors Kanta |

Le message de l'infobulle, à traduire dans les 3 langues :

> *Cette prestation n'est pas encore réservable. Je termine mes études de kinésithérapie et
> l'autorisation d'exercice finlandaise est requise avant de proposer des séances de
> kinésithérapie. Le coaching de force, le coaching en ligne et la rééducation animale restent
> disponibles.*

⚠️ La fiche « Online Coaching Call » doit être reformulée en conséquence : la maquette parle
d'*assessment* et d'*exercise plan*, vocabulaire de rééducation. Il faut la réécrire en
vocabulaire de coaching (objectifs, programmation, technique) pour que le contenu corresponde
au statut réservable. C'est une correction de contenu, pas de code — mais elle est bloquante.

Ce choix n'est pas qu'une contrainte : afficher les prestations à venir en expliquant pourquoi
construit la crédibilité et prépare la demande pour le jour où la licence tombe.

### 4. Humains et animaux, deux régimes juridiques

La rééducation animale (chiens, chevaux) ne relève ni de Valvira, ni de Soteri, ni de Kanta :
ce n'est pas un soin de santé au sens de la loi finlandaise. Toute la §2 ne s'applique qu'aux
clients humains. Conséquence d'architecture : **séparer les deux flux de réservation dès le
modèle de données**, avec des règles de conservation distinctes. C'est plus simple à faire au
sprint 4 qu'au sprint 12.



Copie le bloc ci-dessous, complète les crochets, joins les maquettes.

```markdown
# Mission

Tu es développeur full-stack senior. Tu construis le site de ERASM PHYSIO, cabinet de
kinésithérapie en Finlande. Objectif : générer des prises de rendez-vous via la recherche
locale organique.

## Contraintes non négociables

1. **Site web responsive, mobile-first.** Les maquettes iOS 402×874 sont la référence du
   breakpoint mobile, pas une cible native. Rendu serveur ou statique, contenu indexable
   sans JavaScript client.
2. **Aucune donnée de santé** ne transite ni ne se stocke. Le champ de description de blessure
   du design a été supprimé. Le parcours de réservation est : service → jour → heure →
   coordonnées.
3. Les prestations de kinésithérapie humaine sont **visibles mais non réservables**, avec une
   infobulle accessible expliquant l'attente de l'autorisation d'exercice. État piloté par un
   champ `bookable` en base.
4. Accessibilité WCAG 2.2 AA vérifiée en CI (axe-core). Une violation fait échouer le build.
   Le cyan `#09E5DD` ne porte jamais de texte sur fond clair (1,6:1).
5. Trilingue FI (défaut) / EN / SV, URL localisées, hreflang réciproque.
6. Flux humains et flux animaux séparés dès le modèle de données.
7. Données et hébergement dans l'Union européenne.

## Design system

- `navy #042749` · `cyan #09E5DD` · `surface #F4F6F8` · `ink #0F2033` · `muted #5A6B7B` ·
  `body #3C4E60`
- Titres Montserrat 600/700/800, `letter-spacing: -.02em` · Texte Nunito Sans 400/600/700
- Sur-titres : majuscules, 11–13 px, `letter-spacing: .18em`
- Cyan uniquement sur fond marine. Bouton cyan = libellé marine.

## Stack

[Astro | Next.js] + TypeScript strict + Tailwind + [CMS] + [auth] + PostgreSQL UE.
Déploiement sur [hébergeur], CI GitHub Actions.

## Design

Maquettes jointes : [fichier]. Respecte les tokens (couleurs, typo, espacements, radius).
Signale-moi tout écart de contraste sous 4,5:1 plutôt que de le reproduire.

## Ce que j'attends de toi

- Tu travailles US par US, dans l'ordre du backlog.
- Pour chaque US : le code complet, les tests, et la vérification explicite des critères
  d'acceptation, un par un.
- Tu me dis quand une US est mal cadrée plutôt que de deviner.
- Tu ne livres pas de placeholder silencieux : tout contenu à fournir est signalé en TODO.

## Contexte métier

Prestations : [liste]. Zone d'intervention : [villes]. Cible : [profils patients].
Différenciation : [ce qui te distingue].
```

---

## 8. Backlog Scrum — EPICs & User Stories

Format Trello proposé :

- **Listes** : `Backlog` · `Sprint en cours` · `En cours` · `En revue` · `Terminé`
- **Étiquettes** : une couleur par EPIC + `Bloquant` + `Légal`
- **Chaque carte** = 1 US, titre `[E#-US#] En tant que… je veux…`, critères d'acceptation
  en checklist, points en champ personnalisé.

---

### EPIC 0 — Fondations techniques

| # | User Story | Pts |
|---|---|---|
| E0-US1 | En tant que développeur, je veux un projet initialisé (framework, TS strict, Tailwind, ESLint, Prettier) afin de démarrer sur une base saine | 3 |
| E0-US2 | En tant que développeur, je veux une CI GitHub Actions (lint, types, tests, axe-core, Lighthouse CI) afin qu'aucune régression qualité ne passe | 5 |
| E0-US3 | En tant que développeur, je veux un déploiement automatique avec preview par branche afin de valider visuellement chaque US | 3 |
| E0-US4 | En tant que développeur, je veux les variables d'environnement et les secrets gérés proprement afin de ne rien exposer | 2 |

**Critères d'acceptation E0-US2** — la CI échoue si : une erreur TS, une violation axe, un score
Lighthouse accessibilité < 100, ou une performance < 90.

---

### EPIC 1 — Design system & accessibilité

| # | User Story | Pts |
|---|---|---|
| E1-US1 | En tant que développeur, je veux les tokens des maquettes traduits en config Tailwind afin d'assurer la cohérence visuelle | 3 |
| E1-US2 | En tant que visiteur malvoyant, je veux des contrastes conformes AA afin de lire tout le contenu | 3 |
| E1-US3 | En tant que visiteur au clavier, je veux un lien d'évitement et un focus toujours visible afin de naviguer sans souris | 3 |
| E1-US4 | En tant que développeur, je veux une bibliothèque de composants accessibles (bouton, champ, modale, accordéon, sélecteur de langue) afin de ne pas réinventer l'ARIA à chaque page | 8 |
| E1-US5 | En tant que visiteur sensible au mouvement, je veux que les animations respectent `prefers-reduced-motion` | 2 |

**Critères d'acceptation E1-US4** — chaque composant : navigable au clavier, rôles et états ARIA
corrects, testé avec un lecteur d'écran, zéro violation axe, documenté.

---

### EPIC 2 — Pages vitrine

| # | User Story | Pts |
|---|---|---|
| E2-US1 | En tant que visiteur, je veux une page d'accueil qui présente le cabinet et mène au RDV afin de comprendre l'offre en moins de 10 secondes | 5 |
| E2-US2 | En tant que visiteur, je veux une page par prestation afin de savoir si mon problème est traité | 8 |
| E2-US3 | En tant que visiteur, je veux une page « à propos » avec parcours et diplômes afin d'avoir confiance | 3 |
| E2-US4 | En tant que visiteur, je veux une page tarifs claire afin de savoir combien je vais payer | 3 |
| E2-US5 | En tant que visiteur, je veux une page accès (carte, transports, stationnement, accessibilité PMR du cabinet) afin de venir sans stress | 3 |
| E2-US6 | En tant que visiteur, je veux une page 404 utile afin de retrouver mon chemin | 1 |

**Critères d'acceptation E2-US2** — chaque page : `h1` unique, description du problème traité,
déroulé de séance, durée, tarif, CTA de réservation, JSON-LD `MedicalProcedure`.

---

### EPIC 3 — Internationalisation FI / EN / SV

| # | User Story | Pts |
|---|---|---|
| E3-US1 | En tant que développeur, je veux le routing i18n avec préfixe de langue afin que chaque langue ait ses URL | 5 |
| E3-US2 | En tant que visiteur, je veux un sélecteur de langue accessible qui me maintient sur la même page afin de ne pas être renvoyé à l'accueil | 3 |
| E3-US3 | En tant que moteur de recherche, je veux des balises `hreflang` réciproques et un `x-default` afin d'indexer la bonne version | 3 |
| E3-US4 | En tant que visiteur finnophone, je veux un contenu rédigé en finnois natif afin de ne pas lire une traduction approximative | 8 |
| E3-US5 | En tant que développeur, je veux un fallback explicite si une traduction manque afin de ne jamais afficher une clé brute | 2 |

---

### EPIC 4 — SEO technique & local

| # | User Story | Pts |
|---|---|---|
| E4-US1 | En tant que moteur de recherche, je veux `title` et `meta description` uniques par page et par langue | 3 |
| E4-US2 | En tant que moteur de recherche, je veux un JSON-LD `Physiotherapy` / `LocalBusiness` complet (NAP, horaires, zone, prestations) | 5 |
| E4-US3 | En tant que moteur de recherche, je veux un `sitemap.xml` multilingue et un `robots.txt` corrects | 3 |
| E4-US4 | En tant que visiteur mobile, je veux des Core Web Vitals dans le vert afin d'une navigation fluide | 5 |
| E4-US5 | En tant que patient local, je veux une page par ville desservie afin de trouver le cabinet en recherche géolocalisée | 5 |
| E4-US6 | En tant que gérant, je veux un Google Business Profile aligné sur le site afin de renforcer le SEO local | 2 |
| E4-US7 | En tant que visiteur, je veux un fil d'Ariane balisé afin de me repérer | 2 |

---

### EPIC 5 — Moteur de rendez-vous (interne)

| # | User Story | Pts |
|---|---|---|
| E5-US1 | En tant que développeur, je veux un modèle de données RDV (prestation, durée, créneau, statut, patient) afin de poser des fondations saines | 5 |
| E5-US2 | En tant que développeur, je veux un moteur de génération de créneaux à partir des horaires, congés et durées de prestation afin d'afficher des disponibilités justes | 8 |
| E5-US3 | En tant que patient, je veux choisir une prestation, une date et un créneau afin de réserver sans téléphoner | 8 |
| E5-US4 | En tant que patient, je veux réserver en tant qu'invité ou depuis mon compte afin de ne pas être forcé à m'inscrire | 5 |
| E5-US5 | En tant que patient utilisant un lecteur d'écran, je veux un parcours de réservation entièrement accessible afin de réserver en autonomie | 5 |
| E5-US6 | En tant que patient, je veux une confirmation immédiate puis un rappel 24 h avant afin de ne pas oublier | 5 |
| E5-US7 | En tant que patient, je veux annuler ou déplacer mon RDV dans les règles de préavis afin de gérer mon imprévu | 5 |
| E5-US8 | En tant que gérant, je veux qu'un créneau ne puisse jamais être réservé deux fois afin d'éviter les conflits | 5 |
| E5-US9 | En tant que gérant, je veux une politique de préavis et de no-show paramétrable afin de protéger mon planning | 3 |
| E5-US10 | En tant que visiteur, je veux voir les prestations pas encore disponibles clairement signalées comme non réservables afin de comprendre l'offre complète sans me heurter à un mur | 5 |
| E5-US11 | En tant que visiteur, je veux savoir pourquoi une prestation n'est pas réservable via une infobulle accessible afin de comprendre sans avoir à demander | 3 |

**Critères d'acceptation E5-US10** — la carte de prestation reste lisible (contraste conservé
≥ 4,5:1 malgré l'état désactivé — un simple `opacity: .5` casse le contraste et est refusé) ;
le bouton porte `aria-disabled="true"` plutôt que `disabled` seul, afin de rester atteignable
au clavier et annonçable ; l'état est piloté par un champ `bookable` en base, basculable depuis
le back-office sans redéploiement.

**Critères d'acceptation E5-US11** — le déclencheur est un vrai bouton, activable au clavier
et au tap, pas un `title` HTML ni un survol seul ; le contenu est lié par `aria-describedby` ;
fermeture à `Échap` ; texte disponible en FI, EN et SV.

**Critères d'acceptation E5-US3** — parcours en 4 étapes : service → jour → heure → coordonnées.
**Aucun champ de description de blessure, aucune puce de zone corporelle** (décision du
13/08/2026) ; la prestation n'est décrite que par son intitulé commercial ; les créneaux affichés
sont réellement libres au moment du rendu ; fonctionne dans les 3 langues ; fuseau
`Europe/Helsinki` géré explicitement, changements d'heure compris ; les prestations marquées
non réservables n'apparaissent pas à l'étape 1.

**Critères d'acceptation E5-US5** — chaque étape annoncée aux technologies d'assistance,
calendrier navigable au clavier avec libellés de dates complets, erreurs en `aria-live`,
alternative non-calendrier (liste de créneaux) disponible.

**Critères d'acceptation E5-US8** — contrainte d'unicité en base + transaction/verrou ;
test de concurrence automatisé simulant deux réservations simultanées sur le même créneau.

---

### EPIC 6 — Contact & RGPD

| # | User Story | Pts |
|---|---|---|
| E6-US1 | En tant que visiteur, je veux un formulaire de contact accessible afin de poser une question | 5 |
| E6-US2 | En tant que gérant, je veux une protection anti-spam sans CAPTCHA visuel afin de ne pas exclure d'utilisateurs | 3 |
| E6-US3 | En tant que visiteur, je veux savoir ce qu'il advient de mes données avant d'envoyer afin de consentir en connaissance de cause | 2 |
| E6-US4 | En tant que gérant, je veux recevoir les messages par email avec archivage UE afin de ne rien perdre | 3 |

**Critères d'acceptation E6-US1** — champs administratifs uniquement ; mention visible
« n'indiquez pas d'informations de santé dans ce formulaire » ; erreurs annoncées en `aria-live` ;
messages d'erreur expliquant la correction ; envoi confirmé sans rechargement mais annoncé
aux technologies d'assistance.

---

### EPIC 7 — Espace patient (périmètre administratif)

> ⚠️ EPIC sous contrainte légale. Aucune donnée clinique. Voir §2.2.

| # | User Story | Pts |
|---|---|---|
| E7-US1 | En tant que patient, je veux créer un compte et me connecter de façon sécurisée afin d'accéder à mon espace | 8 |
| E7-US2 | En tant que patient, je veux consulter l'historique de mes rendez-vous afin de m'organiser | 5 |
| E7-US3 | En tant que patient, je veux télécharger mes factures afin de me faire rembourser | 5 |
| E7-US4 | En tant que patient, je veux modifier mes coordonnées et supprimer mon compte afin d'exercer mes droits RGPD | 5 |
| E7-US5 | En tant que patient, je veux annuler ou déplacer un RDV depuis mon espace afin de ne pas avoir à téléphoner | 3 |
| E7-US6 | En tant que gérant, je veux un registre de traitement et une politique de rétention documentés afin d'être conforme | 3 |

**Critères d'acceptation E7-US1** — mots de passe hashés (argon2id), sessions sécurisées, 2FA
proposée, verrouillage après tentatives, base hébergée dans l'UE, aucun champ de santé au schéma.

---

### EPIC 8 — Conformité & pages légales

| # | User Story | Pts |
|---|---|---|
| E8-US1 | En tant que visiteur, je veux une politique de confidentialité claire dans ma langue | 3 |
| E8-US2 | En tant que visiteur, je veux un bandeau cookies avec refus aussi accessible que l'acceptation | 3 |
| E8-US3 | En tant que visiteur, je veux une déclaration d'accessibilité afin de connaître le niveau de conformité et de signaler un problème | 2 |
| E8-US4 | En tant que gérant, je veux afficher mes informations de prestataire (Y-tunnus, enregistrement Soteri, autorisation Valvira) afin d'être en règle et crédible | 2 |

---

### EPIC 9 — Mesure & mise en production

| # | User Story | Pts |
|---|---|---|
| E9-US1 | En tant que gérant, je veux des statistiques respectueuses de la vie privée (Plausible / Matomo UE) afin de piloter sans bandeau invasif | 3 |
| E9-US2 | En tant que gérant, je veux Search Console configurée sur les 3 langues afin de suivre l'indexation | 2 |
| E9-US3 | En tant que gérant, je veux un suivi des conversions RDV afin de savoir ce qui fonctionne | 3 |
| E9-US4 | En tant que gérant, je veux le domaine, le HTTPS, les redirections et les emails configurés afin d'une mise en ligne propre | 5 |
| E9-US5 | En tant que gérant, je veux sauvegardes et supervision afin de dormir tranquille | 3 |

---

### EPIC 11 — Back-office admin

> ⚠️ Le point d'entrée le plus sensible de l'application. Un compte compromis expose l'ensemble
> des patients. Sécurité et traçabilité ne sont pas optionnelles ici.

| # | User Story | Pts |
|---|---|---|
| E11-US1 | En tant qu'admin, je veux me connecter via un espace séparé et sécurisé afin d'accéder à la gestion du cabinet | 8 |
| E11-US2 | En tant qu'admin, je veux un agenda jour / semaine de tous mes RDV afin de voir ma charge d'un coup d'œil | 8 |
| E11-US3 | En tant qu'admin, je veux annuler un RDV avec motif et notification du patient afin de gérer un imprévu | 5 |
| E11-US4 | En tant qu'admin, je veux déplacer un RDV vers un autre créneau afin de réorganiser ma journée | 5 |
| E11-US5 | En tant qu'admin, je veux créer un RDV pour un patient qui a appelé afin que mon agenda reflète la réalité | 5 |
| E11-US6 | En tant qu'admin, je veux consulter et modifier la fiche administrative d'un patient (coordonnées, historique de RDV) afin de le contacter et suivre sa venue | 8 |
| E11-US7 | En tant qu'admin, je veux paramétrer horaires d'ouverture, congés et créneaux bloqués afin que les disponibilités affichées soient exactes | 8 |
| E11-US8 | En tant qu'admin, je veux gérer mes prestations, durées et tarifs afin de faire évoluer mon offre sans développeur | 5 |
| E11-US9 | En tant qu'admin, je veux lire et archiver les messages du formulaire de contact afin de ne rien laisser sans réponse | 3 |
| E11-US10 | En tant qu'admin, je veux un journal d'audit horodaté de tous les accès et actions sur les données patient afin de répondre à mes obligations de traçabilité | 5 |
| E11-US11 | En tant qu'admin, je veux exporter ou supprimer les données d'un patient sur demande afin d'honorer ses droits RGPD | 5 |
| E11-US12 | En tant qu'admin, je veux un tableau de bord du jour (RDV, nouveaux messages, annulations) afin de démarrer ma journée informé | 5 |

**Critères d'acceptation E11-US1** — URL d'administration non indexée (`noindex` + `robots.txt`),
2FA obligatoire, sessions courtes avec expiration, verrouillage après tentatives échouées,
séparation stricte des rôles patient / admin vérifiée côté serveur sur chaque route.

**Critères d'acceptation E11-US6** — le schéma de la fiche patient ne comporte aucun champ libre
susceptible d'accueillir une note clinique. Si un champ « commentaire » est jugé indispensable,
il est explicitement libellé « informations administratives uniquement » et son usage est audité.

**Critères d'acceptation E11-US10** — chaque consultation de fiche patient est journalisée
(qui, quoi, quand) ; le journal est consultable et non modifiable depuis l'interface.

---

### EPIC 10 — Contenu éditorial (v2)

| # | User Story | Pts |
|---|---|---|
| E10-US1 | En tant que visiteur, je veux des articles sur mes symptômes afin de trouver le cabinet via une recherche d'information | 8 |
| E10-US2 | En tant que visiteur, je veux une FAQ balisée `FAQPage` afin d'obtenir mes réponses vite | 3 |
| E10-US3 | En tant que visiteur, je veux lire des avis de patients afin d'être rassuré | 5 |

---

## 9. Definition of Ready / Definition of Done

**Ready** — une US entre en sprint si : la valeur utilisateur est explicite, les critères
d'acceptation sont écrits et testables, les dépendances sont levées, le contenu et les visuels
nécessaires sont disponibles, l'estimation est posée.

**Done** — une US est terminée si :

- [ ] Critères d'acceptation tous validés, un par un
- [ ] Zéro violation axe-core, parcours testé au clavier
- [ ] Contenu présent dans les 3 langues
- [ ] Balises SEO et données structurées en place
- [ ] Lighthouse : accessibilité 100, performance ≥ 90, SEO 100
- [ ] Aucune donnée de santé introduite dans le système
- [ ] Testé sur mobile réel
- [ ] Revue de code faite, CI verte, déployé en preview

---

## 10. Découpage en sprints (2 semaines)

| Sprint | Contenu | Objectif |
|---|---|---|
| 1 | EPIC 0 + EPIC 1 | Socle technique et design system accessibles |
| 2 | EPIC 2 (accueil, prestations) + EPIC 3 (routing i18n) | Le site vitrine existe en FI |
| 3 | Fin EPIC 2 + EPIC 3 + EPIC 4 | Trilingue et optimisé SEO |
| 4 | EPIC 5 (US1 à US5) + EPIC 6 | Le patient peut réserver et écrire |
| 5 | Fin EPIC 5 + EPIC 11 (US1 à US5) | L'agenda tourne, l'admin gère ses RDV |
| 6 | Fin EPIC 11 | Back-office complet |
| 7 | EPIC 7 | Espace patient |
| 8 | EPIC 8 + EPIC 9 | Conformité, mesure, mise en ligne |

Total v1 ≈ 290 points sur 8 sprints (≈ 4 mois). Vélocité à recalibrer après le sprint 1.

> Le passage au moteur de RDV interne + back-office a ajouté ~100 points par rapport au scénario
> « intégration d'un prestataire certifié ». C'est le prix de la maîtrise complète du produit.
> Si le délai de mise en ligne devient prioritaire, la v1 peut sortir à la fin du sprint 4 avec
> une réservation par formulaire et confirmation manuelle, les EPICs 5 et 11 suivant en v1.1.

---

## 11. Ce qu'il me manque pour aller plus loin

1. **Les maquettes** — le lien Claude Design renvoie vers une page de connexion. Téléverse
   le fichier HTML ou des captures.
2. **Écriture Trello** — le compte `jczki` peut lire le tableau mais pas y créer de cartes.
   Rejoindre le tableau en tant que membre.
3. **Confirmation AVI** — un système d'agenda purement administratif déclenche-t-il l'obligation
   Kanta ? Réponse écrite à obtenir avant l'ouverture aux patients.
4. **Périmètre réel des prestations** (intitulés, durées, tarifs) et **villes couvertes**.
5. **Statut administratif** — enregistrement Soteri fait ou en cours ? Conditionne E8-US4
   et la date de mise en ligne.
6. **Qui rédige le finnois et le suédois ?**
7. **Facturation** — les factures de E7-US3 sont-elles générées par l'application ou importées
   depuis un logiciel de compta existant ?
