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
- **Horaires** *(❌ périmé, correction du 17/08/2026 — voir « Informations du cabinet », CLAUDE.md)* :
  ~~lun–ven 08:00–18:00 · samedi sur arrangement · dimanche fermé~~ Enzo confirme travailler
  7 jours sur 7 ; heures exactes non encore confirmées, `TODO`.
- **Prestations** *(❌ périmé — voir remplacement daté du 14/08/2026 juste en dessous)* :
  ~~1:1 Physiotherapy 60 min 55 € · Injury Rehab Plan 6 semaines 180 € · Strength & Conditioning
  mensuel 90 € · Online Coaching Call 45 min 40 € · Animal Rehab Session 60 min 60 €~~
- **Filtres** : All / People / Animals / Online — ⚠️ à revérifier avec Enzo : le contenu Canva
  ne confirme pas ces catégories, et sa navigation (Home · About · Services · Contact) diffère
  de la barre d'onglets du design system (Home · Book · About). Point à trancher avant l'EPIC 2.
- **Règle d'annulation** : gratuite jusqu'à 24 h avant — cohérent avec E5-US9
- **Week-ends** *(❌ périmé, même correction du 17/08/2026)* : ~~ouverts sur arrangement pour les
  visites animales~~ sans objet — le cabinet est ouvert 7 jours sur 7 pour toutes les prestations,
  pas seulement les visites animales le week-end.

### Prestations — remplacement du 14/08/2026

La liste ci-dessus provenait des maquettes d'application et était périmée : ni les intitulés ni
les prix ne correspondaient à l'offre réelle. Remplacée par le contenu réel d'Enzo, arbitrages
intégrés — source complète : @docs/contenu-canva.md.

**Séances individuelles**

| Prestation | Durée | Prix | Réservable |
|---|---|---|---|
| Physiotherapy session | 45–60 min | 70 € | ❌ `bookable: false` — attente autorisation Valvira |
| Massage | 30 min | 30 € | ✅ |
| Massage | 45 min | 40 € | ✅ |
| Massage | 60 min | 50 € | ✅ |
| Animal Massage | — | 50 € | ✅ |

Déplacement : 0,40 €/km, supplément — pas une prestation autonome.

**Programmes et coaching**

| Prestation | Format | Prix | Réservable |
|---|---|---|---|
| Full-Body Mobility | 4 semaines, 7 séances/semaine | 50 € | ✅ |
| Strength Program | 4 semaines, 3 séances/semaine, full body | 40 € | ✅ |
| Personalized Program | 4 semaines, 3 séances | 55 € | ✅ |
| Individual Coaching | 60 min | 60 € | ✅ |
| Individual Coaching | 45 min | 50 € | ✅ |
| Group training | 60 min, minimum 3 personnes | 6 €/personne | ✅ |

**Taping supprimé de l'offre** (décision du 14/08/2026) : ne doit apparaître nulle part sur le
site. Le prix de la Physiotherapy session (70 €) est renseigné en base dès maintenant : le jour
où l'autorisation Valvira tombe, basculer `bookable` à `true` doit suffire à ouvrir la
réservation, sans redéploiement ni modification de code.

**Registre de rédaction**, tant que l'autorisation n'est pas obtenue : coaching, entraînement,
bien-être. Mots interdits : *assessment*, *rehabilitation*, *injury*, *treatment*, *recovery
protocol*, *patient*. On dit *client*, jamais *patient*. Détail : @docs/contenu-canva.md.

⚠️ **Point à vérifier avec Enzo avant publication** (signalé dans le contenu source) : le massage
animal est le registre le plus sûr, mais toute formulation glissant vers *animal physiotherapy*
ou *animal rehab* mérite vérification — en Finlande, le traitement des animaux malades relève de
la législation vétérinaire, distincte de Valvira, jamais explorée dans ce document (§2 ne traite
que du régime humain).

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

Répartition retenue, mise à jour le 14/08/2026 sur le contenu réel (@docs/contenu-canva.md) —
la version d'origine référençait des prestations qui n'existent plus dans l'offre :

| Prestation | État v1 | Motif |
|---|---|---|
| Physiotherapy session | 🔒 non réservable | Acte de kinésithérapie, profession réglementée |
| Massage (30/45/60 min) | ✅ réservable | Massage bien-être, hors kinésithérapie clinique |
| Animal Massage | ✅ réservable | Hors Valvira, hors Soteri, hors Kanta — ⚠️ vocabulaire à surveiller, voir note ci-dessus |
| Programmes et coaching (Full-Body Mobility, Strength Program, Personalized Program, Individual Coaching, Group training) | ✅ réservable | Coaching sportif, non réglementé |

Le message de l'infobulle, à traduire dans les 3 langues :

> *Cette prestation n'est pas encore réservable. Je termine mes études de kinésithérapie et
> l'autorisation d'exercice finlandaise est requise avant de proposer des séances de
> kinésithérapie. Le massage, les programmes de coaching et le massage animal restent
> disponibles.*

⚠️ Ce message remplace la version du 13/08/2026, qui référençait « le coaching de force, le
coaching en ligne et la rééducation animale » — des intitulés qui n'existent plus dans l'offre.
Le composant Infobulle du styleguide (E1-US4e) utilise encore l'ancien texte : à mettre à jour
avant l'intégration réelle dans les fiches de prestation (E5-US10/US11), pas avant — ce n'est
pas un correctif de code isolé, il doit suivre l'arbitrage définitif du contenu par Enzo.

Ce choix n'est pas qu'une contrainte : afficher les prestations à venir en expliquant pourquoi
construit la crédibilité et prépare la demande pour le jour où la licence tombe.

### 4. Humains et animaux, deux régimes juridiques

La rééducation animale (chevaux — Enzo confirme le 16/08/2026 ne travailler qu'avec des chevaux ;
la mention « chiens » venait des anciennes maquettes et n'a jamais correspondu à l'offre réelle,
retirée) ne relève ni de Valvira, ni de Soteri, ni de Kanta :
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
| E1-US4a | En tant que développeur, je veux un composant Bouton accessible (états, aria-disabled) | 5 |
| E1-US4b | En tant que développeur, je veux un composant Champ de formulaire accessible (label, description, erreur annoncée) | 5 |
| E1-US4c | En tant que développeur, je veux un composant Accordéon accessible | 3 |
| E1-US4d | En tant que développeur, je veux un composant Sélecteur de langue accessible | 3 |
| E1-US4e | En tant que développeur, je veux un composant Infobulle accessible (déclencheur bouton, aria-describedby, fermeture Échap) | 5 |
| E1-US4f | En tant que développeur, je veux un composant Modale accessible (piège de focus, restitution du focus, inert sur l'arrière-plan) | 8 |
| E1-US5 | En tant que visiteur sensible au mouvement, je veux que les animations respectent `prefers-reduced-motion` | 2 |

**Critères d'acceptation E1-US4a à E1-US4f** — pour chaque composant : navigable au clavier, rôles
et états ARIA corrects, testé avec un lecteur d'écran, zéro violation axe, démonstration dans
/styleguide, note d'usage écrite, et au moins un test e2e prouvant le comportement
d'accessibilité par sabotage (le test doit échouer si on retire l'attribut ARIA).

> Ré-estimation du 14/08/2026. Ces six composants formaient une seule US estimée à 8 points. Le
> Bouton seul en a consommé 5 au niveau de rigueur exigé. Total réel : 29 points, soit un facteur
> 3,6. L'estimation globale de 290 points pour la v1 est probablement optimiste du même ordre sur
> les US de composants et de parcours. À recalibrer après le sprint 2.

---

### EPIC 2 — Pages vitrine

| # | User Story | Pts |
|---|---|---|
| E2-US1 | En tant que visiteur, je veux une page d'accueil qui présente le cabinet et mène au RDV afin de comprendre l'offre en moins de 10 secondes | 5 |
| E2-US2 | En tant que visiteur, je veux une page par prestation afin de savoir si mon problème est traité | 8 |
| E2-US3 | En tant que visiteur, je veux une page « à propos » avec parcours et diplômes afin d'avoir confiance | 3 |
| E2-US4 | En tant que visiteur, je veux une page tarifs claire afin de savoir combien je vais payer | 3 |
| E2-US5 | En tant que visiteur, je veux une page zone d'intervention (rayon d'action, tarif kilométrique, villes couvertes) afin de savoir si Enzo peut se déplacer chez moi | 3 |
| E2-US6 | En tant que visiteur, je veux une page 404 utile afin de retrouver mon chemin | 1 |

**Critères d'acceptation E2-US2** — chaque page : `h1` unique, description du problème traité,
déroulé de séance, durée, tarif, CTA de réservation, JSON-LD `Service` (**corrigé le 16/08/2026** :
le brief demandait `MedicalProcedure`, mais appliquer un type schema.org médical à un programme de
coaching ou une séance de massage contredirait directement la règle « registre coaching uniquement,
aucune promesse de santé » — voir le commit `9083d07`).

> ✅ **E2-US2 livrée le 16/08/2026.** 24 pages (8 prestations × FI/EN/SV), routes dynamiques
> (`src/pages/palvelut/[slug].astro` et équivalents EN/SV), données dans
> `src/lib/prestations.ts`. Descriptions EN validées mot pour mot par Enzo ; FI/SV premier jet
> machine (même statut que E2-US4/US5/US6 avant relecture). CTA = mailto préqualifié, pas de
> vrai moteur de réservation (EPIC 5 non commencé).

> ✅ **E2-US1 livrée le 16/08/2026.** Page d'accueil en FI/EN/SV (`src/pages/index.astro`,
> `en/index.astro`, `sv/index.astro`) : accroche et différenciateurs directement issus de
> l'interview d'Enzo (`docs/contenu-canva.md`), JSON-LD `LocalBusiness` réutilisé. EN = texte
> source d'Enzo (bio du Canva, corrigée du mot interdit *rehabilitation* trouvé le 16/08/2026 —
> voir commit `a5de315`). FI/SV = traduction nouvelle, premier jet machine. Photo d'Enzo pas
> encore intégrée (à venir, emplacement prévu en commentaire dans le code) — ne bloque pas la
> publication du reste.

> ✅ **E2-US3 livrée le 16/08/2026.** Page à propos en FI/EN/SV (`src/pages/minusta.astro`,
> `en/about.astro`, `sv/om-mig.astro`) : parcours et méthode directement issus de l'interview
> d'Enzo (`docs/contenu-canva.md`). Vocabulaire volontairement aligné sur celui déjà utilisé pour
> l'accueil et les prestations animales : « connaissance du mouvement et des soins animaliers »,
> jamais « kinésithérapie animale » (l'interview d'Enzo employait ce terme, mais la note du
> 16/08/2026 sur les prestations animales met explicitement en garde contre tout vocabulaire
> glissant vers la kinésithérapie/physiothérapie animale — régime vétérinaire distinct, non
> traité par ce projet). BPJEPS Haltérophilie / Musculation conservé tel quel dans les trois
> langues : c'est un diplôme français nommé, pas un intitulé à traduire. Même statut FI/SV
> premier jet machine que le reste du contenu neuf de ce sprint. Photo d'Enzo : même traitement
> que E2-US1, emplacement prévu, ne bloque pas.

**Critères d'acceptation E2-US4**, formalisés le 16/08/2026 sur l'implémentation déjà livrée —
la page liste les onze lignes de tarifs (huit prestations distinctes, certaines déclinées en
plusieurs durées) groupées par catégorie (séances individuelles / programmes et coaching), avec
durée/format et prix pour chacune ; la Physiotherapy session reste visible mais non réservable,
avec l'infobulle accessible expliquant l'attente de l'autorisation Valvira ; meta description
renseignée et propre à la page (jamais un texte générique dupliqué d'une autre page).

**Critères d'acceptation E2-US6**, formalisés le 16/08/2026 sur l'implémentation déjà livrée —
répond avec un vrai statut HTTP 404 sur toute route non reconnue, vérifié en production par
requête directe (pas seulement en local) ; contenu utile dans les trois langues sur une seule
page (Astro ne route pas nativement par langue sans middleware, périmètre non couvert par ce
projet) ; un seul `h1` (FI, langue par défaut), les deux autres langues en `h2` ; lien de retour
vers l'accueil dans chaque langue ; balisée `noindex`.

**Critères d'acceptation E2-US5** — la page annonce le rayon d'intervention (100 km autour de
Pori), les modalités (domicile, écurie, distanciel) et le tarif kilométrique (0,40 €/km, identique
quel que soit le type de visite) ; elle cite explicitement les villes significatives de la zone en
texte visible (c'est ce texte, pas le rayon en JSON-LD, qui fait remonter le site sur les
recherches locales de ces villes) ; l'adresse personnelle d'Enzo (domicile privé, pas un lieu
recevant du public) n'apparaît **jamais** dans le texte visible de la page ; JSON-LD
`LocalBusiness` avec `areaServed` en `GeoCircle` (centre Pori, rayon 100 000 m).

> ⚠️ **E2-US4 et E2-US6 — statut du contenu, 16/08/2026.** Construites et poussées en FI/EN/SV,
> mais le contenu FI et SV est un **premier jet machine** (traduit par l'assistant IA depuis le
> contenu source anglais, à la demande explicite de l'utilisateur qui a écarté pour ces deux
> pages la règle « traduction humaine uniquement », normalement absolue en internationalisation).
> L'EN reprend directement `docs/contenu-canva.md`, contenu réel d'Enzo — fiable. Le FI et le SV
> n'ont **pas** été relus par un locuteur natif. Ni l'une ni l'autre US ne peut être marquée Done
> au sens de la DoD (§9, « Contenu présent en FI, EN et SV ») tant que cette relecture n'a pas eu
> lieu. Ne pas perdre ce statut de vue au fil des sprints suivants.

> ⚠️ **E2-US5 — repivotée en « zone d'intervention », 16/08/2026.** La page « accès » supposait un
> lieu recevant du public (carte, stationnement, transports, accessibilité PMR) ; l'adresse
> d'Enzo est en réalité un domicile privé. Repivotée en page « zone d'intervention » : rayon
> d'action (100 km autour de Pori), modalités (domicile, écurie, distanciel), tarif kilométrique.
> Les trois anciens TODO (stationnement, transports, PMR) sont retirés — sans objet pour ce type
> de prestataire, pas oubliés. L'adresse complète d'Enzo (Taiteilijankatu 1, 28100 Pori) est
> enregistrée dans `src/lib/local-business.ts` en commentaire pour un futur système de
> réservation, mais **volontairement absente** du JSON-LD lui-même — voir la note dans ce fichier :
> les données structurées sont lisibles par Google indépendamment du rendu visuel de la page,
> donc une adresse complète en JSON-LD peut fuiter publiquement une adresse jamais affichée à
> l'écran. Le JSON-LD ne porte que la localité (Pori, 28100, FI) et un `areaServed` en
> `GeoCircle`.
>
> **Liste des 18 communes validée par l'utilisateur le 16/08/2026** (ordre de validation :
> Ulvila, Nakkila, Harjavalta, Kokemäki, Eurajoki, Rauma, Merikarvia, Pomarkku, Siikainen,
> Kankaanpää, Jämijärvi, Karvia, Eura, Säkylä, Huittinen, Sastamala, Laitila, Uusikaupunki),
> intégrée en deux temps : une phrase d'en-tête lisible citant trois villes reconnaissables
> (Rauma, Kankaanpää, Huittinen), puis un bloc « Communes desservies » groupé par zone
> géographique (`src/lib/service-area.ts`, source unique pour les trois langues — pas d'énumération
> brute de 18 noms, refusée explicitement comme bourrage de mots-clés). Noms de communes
> **identiques et non déclinés** dans les trois langues — seuls les libellés de zone sont
> traduits. Quatre communes initialement proposées ont été écartées car fusionnées avec une autre
> depuis : Noormarkku (Pori, 2010), Luvia (Eurajoki, 2017), Honkajoki (Kankaanpää, 2021), Vammala
> → Sastamala (2009, renommage). Turku exclue (≈ 140 km, hors rayon). Carte reportée à l'EPIC 4,
> avec le reste du SEO local, à la création du Google Business Profile.

> ✅ **Relecture FI levée, 16/08/2026.** Le contenu FI de E2-US4, E2-US5 et E2-US6 a été relu par
> une locutrice native (la femme d'Enzo) — ce n'est plus un premier jet machine. Le critère DoD
> « Contenu présent en FI, EN et SV » est désormais rempli pour le FI et l'EN sur ces trois US.
> **Le SV reste non relu** : toujours un premier jet machine, toujours bloquant pour la DoD tant
> qu'une relecture native suédophone n'a pas eu lieu.

> ✅ **E2-US1 à E2-US6 — Done, 17/08/2026.** Deux blocages restants levés : le FI de E2-US1
> (accueil), E2-US2 (prestations) et E2-US3 (à propos) a lui aussi été relu par une locutrice
> native — jusqu'ici seule la relecture FI de E2-US4/US5/US6 avait été enregistrée ci-dessus, ces
> trois-là n'avaient jamais eu de relecture FI confirmée par écrit. Le SV a été relu sur les six
> US. Plus aucune page de l'EPIC 2 ne porte de contenu FI ou SV premier jet machine. DoD « page
> publiée » vérifiée critère par critère sur le commit `3be7965` :
> - Contenu présent en FI, EN et SV, et relu nativement dans les trois langues sur les six US — ✅
> - Balises SEO et données structurées en place (JSON-LD, hreflang réciproques E3-US3, sitemap
>   E4-US3) — ✅
> - Lighthouse SEO 100 : confirmé sur les 18 URLs des six gabarits dans le run CI `32011180757`
>   (accessibilité 100, performance 98–100, SEO 100 sur chaque page publiée échantillonnée ;
>   `/styleguide`, hors DoD car interne et `noindex`, reste à 54 comme attendu) — ✅
> - Page ajoutée à `.lighthouserc.cjs` : les six gabarits y figurent, E2-US2 échantillonnée depuis
>   le 16/08/2026 (§9 bis) — ✅
> - Vérifiée sur appareil mobile réel lors de la passe de fin de sprint : effectuée, rien de
>   bloquant relevé — ✅
> - Critères hérités des livraisons du 16/08/2026 (zéro violation axe-core, parcours clavier,
>   aucune donnée de santé, CI verte, déploiement production vérifié) : non retestés isolément
>   ici, déjà couverts à la livraison de chaque US.

---

### EPIC 3 — Internationalisation FI / EN / SV

| # | User Story | Pts |
|---|---|---|
| E3-US1 | En tant que développeur, je veux le routing i18n avec préfixe de langue afin que chaque langue ait ses URL | 5 |
| E3-US2 | En tant que visiteur, je veux un sélecteur de langue accessible qui me maintient sur la même page afin de ne pas être renvoyé à l'accueil | 3 |
| E3-US3 | En tant que moteur de recherche, je veux des balises `hreflang` réciproques et un `x-default` afin d'indexer la bonne version | 3 |
| E3-US4 | En tant que visiteur finnophone, je veux un contenu rédigé en finnois natif afin de ne pas lire une traduction approximative | 8 |
| E3-US5 | ~~En tant que développeur, je veux un fallback explicite si une traduction manque afin de ne jamais afficher une clé brute~~ En tant que développeur, je veux que l'absence d'une traduction empêche la compilation, afin qu'aucune langue ne puisse partir incomplète en production | 2 |

> ✅ **E3-US3 livrée, 17/08/2026.** hreflang réciproques (`src/components/HreflangLinks.astro`,
> posé sur les 15 pages trilingues, réutilisant tel quel le tableau `languages` déjà consommé par
> `<LanguageSwitcher>` — une seule source pour le sélecteur visible et les balises invisibles) +
> `x-default` vers la version FI. Chaque page s'auto-référence et chaque page ciblée renvoie
> réellement vers la source (réciprocité stricte, pas seulement déclarative) — vérifié par
> sabotage : `tests/e2e/hreflang-sitemap.spec.ts` cassé volontairement (hreflang retiré d'une
> page) puis restauré, le test échouant bien avec un message précis dans l'intervalle. Livrée avec
> E4-US3 ci-dessous dans le même geste. Déclenchée par la vérification en production du
> 16/08/2026 : ni sitemap ni hreflang n'existaient (0 balise sur les pages testées,
> `/sitemap.xml` et `/robots.txt` en 404) — le trou identifié à la clôture du sprint 2.
>
> **Re-vérifié par sabotage, 17/08/2026.** Deux nouveaux cas, distincts du premier : hreflang
> retiré de `/minusta/` (les cinq autres pages continuaient de pointer vers elle → réciprocité
> rompue détectée, message précis) ; puis `/minusta/` exclue du filtre sitemap sans toucher ses
> hreflang (page absente du sitemap détectée, message précis). Les deux échecs sont indépendants
> l'un de l'autre — le test ne confond pas les deux défaillances. Restauré, suite complète (108
> tests) revérifiée verte après coup.

> ✅ **E3-US1 et E3-US2 — déjà Done, formalisé ici le 17/08/2026.** Routing i18n à préfixe de
> langue (E3-US1) livré dès les premières pages trilingues (sprint 2, URL `/en/`, `/sv/`, slugs
> traduits par page — jamais un simple préfixe sur un chemin identique, voir la note sous E3-US3
> sur pourquoi le mode i18n natif de `@astrojs/sitemap` a été écarté pour cette même raison).
> Sélecteur de langue accessible (E3-US2, composant `LanguageSwitcher.astro`, livré et testé en
> E1-US4d) posé sur les 15 pages de contenu réel, chaque lien pointant vers l'équivalent exact de
> la page courante — jamais un renvoi générique vers l'accueil. Absent de `/404` par choix
> délibéré (page unique empilant les trois langues, documenté dans `404.astro` — pas une US mal
> couverte) et de `/styleguide` (page interne, y figure seulement en démonstration du composant).
>
> ⚠️ **E3-US4 — probablement satisfaite de fait, à confirmer explicitement.** « Contenu rédigé en
> finnois natif » : avec la relecture FI confirmée aujourd'hui sur les six US de l'EPIC 2 (voir
> note EPIC 2 ci-dessus), la totalité du contenu FI publié à ce jour est native, plus aucun premier
> jet machine. Non marquée Done ici car l'US porte sur « un contenu » au sens large, pas
> spécifiquement sur l'EPIC 2 — à reconfirmer quand du contenu FI supplémentaire sera ajouté
> (EPIC 5 et suivants), mais rien ne bloque aujourd'hui.
>
> ✅ **E3-US5 — reformulée puis Done, 17/08/2026.** Le libellé d'origine supposait un système de
> traduction par clé (`t('accueil.titre')` avec dictionnaire par langue), où une clé manquante
> peut fuiter brute à l'écran. Ce n'est pas l'architecture du projet : chaque page FI/EN/SV est un
> fichier `.astro` distinct, entièrement rédigé dans sa langue (pas de lookup) — signalé plutôt
> que deviné, puis reformulé par l'utilisateur sur la garantie qui existe réellement : le typage
> `Record<'fi' | 'en' | 'sv', string>` de `Prestation` (`src/lib/prestations.ts` — seul fichier de
> données partagées à porter ce typage ; correction d'une note précédente qui l'attribuait à tort
> aussi à `service-area.ts` et `local-business.ts`, qui n'ont pas de champ multilingue). La
> garantie existait déjà mais rien ne la protégeait d'un refactor qui l'aurait relâchée — ajout de
> `tests/types/prestation-i18n-completeness.ts`, un fichier jamais exécuté, lu uniquement par
> `astro check` (`tsconfig.json`, `include: ["**/*"]`), qui tente d'assigner un objet à langue
> manquante à chacun des quatre champs (`slug`, `name`, `description`, `variants`) sous
> `@ts-expect-error`. Sabotage-prouvé en deux temps : (1) les `@ts-expect-error` retirés du fichier
> de test → `astro check` relève bien les quatre erreurs de type attendues, preuve que le fichier
> est réellement inspecté ; (2) `Record<Lang, string>` affaibli en `Partial<Record<Lang, string>>`
> dans `Prestation` → les quatre `@ts-expect-error` deviennent inutilisés, `astro check` échoue
> avec `ts(2578)` sur chacun (et, en prime, casse aussi les pages de prestation réelles qui
> lisaient ces champs sans vérifier `undefined` — preuve que le typage est réellement structurant,
> pas décoratif). Les deux fois restauré, `npm run typecheck` revérifié à 0 erreur.

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

> ✅ **E4-US3 livrée, 17/08/2026** — voir la note complète sous E3-US3. `sitemap.xml` via
> l'intégration officielle `@astrojs/sitemap` (mode i18n natif de l'intégration écarté : il
> suppose une structure de chemin identique entre langues, alors que nos slugs sont traduits —
> `/palvelut/hieronta/` vs `/en/services/massage/` — pas seulement préfixés). `robots.txt` en
> endpoint dynamique (`src/pages/robots.txt.ts`, pré-rendu statique au build) plutôt qu'un fichier
> figé dans `public/`, pour refléter le vrai `SITE_URL` de chaque environnement — même piège que
> le JSON-LD (CLAUDE.md, « Pièges connus »). Les pages `noindex` (styleguide, 404) sont exclues du
> sitemap et ne portent pas de `Disallow` : les deux mécanismes ne se cumulent pas (recommandation
> Google) — un `Disallow` empêcherait Google de crawler la page pour y lire sa balise `noindex`.
>
> **Vérifié en production, 17/08/2026** (pas seulement en CI) : `/robots.txt` → 200, pointe vers
> `/sitemap-index.xml`. Le fichier réellement servi est `sitemap-index.xml` + `sitemap-0.xml`
> (comportement par défaut de `@astrojs/sitemap`, jamais un fichier nommé littéralement
> `sitemap.xml`) — **`/sitemap.xml` répond 404** sur ce projet ; ce n'est pas une régression, mais
> ça vaut d'être su avant de le chercher sous ce nom dans Search Console ou un audit externe.
> **Chemin à déclarer dans Search Console (E9-US2) : `/sitemap-index.xml`, jamais `/sitemap.xml`.**
> `sitemap-0.xml` contient bien 36 URLs — 4 gabarits mono-page (accueil, à propos, tarifs, zone
> d'intervention) × 3 langues + 8 pages de prestation × 3 langues, soit exactement les pages
> publiées, aucune page `noindex`. **36, pas 39** : à corriger si ce chiffre était attendu ailleurs.
> hreflang réciproques + `x-default` vérifiés en production sur un
> exemplaire de chaque gabarit (accueil, à propos, tarifs, zone d'intervention, prestation) dans
> les trois langues : auto-référence et retour réel de chaque cible confirmés, jamais une URL
> localhost qui fuite.

> ✅ **E4-US1 — audité le 17/08/2026, déjà satisfaite.** `title` et `description` extraits des 36
> pages publiées buildées : présents partout, aucun vide, aucun doublon **au sein d'une même
> langue** (les trois accueils FI/EN/SV partagent légitimement le même `title` — même page, trois
> URL, exactement ce que `hreflang` sert à déclarer ; pareil pour « Massage » en EN et SV, mot
> identique dans les deux langues, pages distinctes). `/404` et `/styleguide` ont volontairement
> `description` absente, jamais un texte générique dupliqué — comportement documenté dans
> `BaseLayout.astro`, conforme à la règle du projet. Rien à construire.
>
> ⚠️→✅ **E4-US2 — complétée le 17/08/2026.** Suite de l'audit ci-dessus : au moment de l'audit,
> les horaires visibles sur le site (lun–ven 08:00–18:00, samedi sur arrangement, dimanche fermé)
> se sont révélés eux-mêmes périmés — Enzo travaille en réalité 7 jours sur 7, hérité sans
> vérification des maquettes d'origine. Corrigé partout (texte visible des trois accueils,
> `CLAUDE.md`, brief, `docs/contenu-canva.md`) avant d'écrire la moindre donnée structurée : publier
> `openingHoursSpecification` sur la base d'horaires déjà faux aurait aggravé le problème plutôt
> que de le régler.
>
> `openingHoursSpecification` déclaré avec `dayOfWeek` sur les sept jours, mais **`opens`/`closes`
> volontairement omis** : les heures exactes ne sont pas encore confirmées avec Enzo, et une valeur
> inventée serait une donnée structurée fausse publiée pour Google — pire qu'une absence. `TODO`
> posé dans le code (`src/lib/local-business.ts`) pour les ajouter dès confirmation ; à séparer en
> plusieurs `OpeningHoursSpecification` si les horaires s'avèrent différents selon le jour, un seul
> pour l'instant puisque rien n'indique le contraire.
>
> `hasOfferCatalog` ajouté, construit depuis `src/lib/prestations.ts` (jamais recopié à la main) :
> huit `Offer`, un par prestation, prix d'appel = variante la moins chère (`minPrestationPrice()`,
> nouvelle fonction, aussi utilisée pour dé-dupliquer le nettoyage de prix `€`/`/henkilö`/`/person`
> déjà présent sur les trois pages de prestation individuelle). Physiotherapy session déclarée
> plutôt qu'omise, comme demandé : `availability: OutOfStock`, la valeur `ItemAvailability`
> standard la plus proche de « offre réelle, pas encore achetable » — aucune valeur schema.org ne
> dit littéralement « en attente d'une autorisation d'exercice », et l'omettre l'aurait fait
> disparaître du catalogue au lieu d'apparaître comme non disponible, alors que la page elle-même
> l'affiche déjà ainsi (bouton désactivé + infobulle, E5-US10/US11). Vérifié dans `dist/` après
> build : les huit offres, prix, disponibilité et URL (préfixées par langue) sont correctes en
> FI/EN/SV, `hasOfferCatalog.name` traduit (Palvelut/Services/Tjänster). Suite complète (108 tests)
> revérifiée verte.
>
> ✅ **E4-US4 — audité le 17/08/2026 sur les métriques réelles, pas seulement le score catégorie.**
> `.lighthouserc.cjs` n'asserte que `categories:performance >= 0.9` et `categories:accessibility
> = 1`, jamais les métriques Core Web Vitals elles-mêmes — un score catégorie à 90 n'est pas la
> même preuve qu'un seuil LCP/CLS respecté. Vérifié directement dans les rapports Lighthouse bruts
> du run CI `32016400403` (17 URLs × 3 passages, artefact `lighthouse-report`) : **LCP max
> 1,37 s** (< 2,5 s sur les 17 URLs, aucune exception), **CLS max 0,074** (< 0,1 partout,
> `/hinnasto/` la plus proche du seuil), **Total Blocking Time à 0 ms partout** (aucune tâche
> longue bloquant le fil principal). **INP non mesurable en Lighthouse (CI/lab)** : c'est une
> métrique de terrain (interaction réelle d'un vrai utilisateur, mesurée via CrUX/Search Console),
> pas un audit de laboratoire sans interaction — Lighthouse n'en rapporte aucune valeur numérique,
> seulement des pistes de diagnostic (`interaction-to-next-paint-insight`). TBT à 0 ms partout est
> un indicateur fort par proxy (le site charge très peu de JS client), mais ce n'est pas une
> confirmation formelle du seuil INP < 200 ms tant que le site n'a pas de trafic réel remonté par
> Search Console (E9-US2). Pas de gate CI à ajouter pour LCP/CLS individuellement : le score
> `performance >= 0.9` déjà asserté les couvre indirectement avec une marge confortable au vu des
> chiffres ci-dessus, et un double gate serait redondant à ce niveau de marge.
>
> ✅ **E4-US7 livrée, 17/08/2026.** Fil d'Ariane accessible : `src/components/Breadcrumb.astro`
> (`nav aria-label` traduit par langue, `ol`/`li`, dernier élément non cliquable et porteur de
> `aria-current="page"` — jamais un lien vers soi-même) posé sur les 12 pages qui ont un parent
> réel dans la hiérarchie du site (tarifs, à propos, zone d'intervention, et les 8×3 pages de
> prestation, avec un troisième niveau Accueil → Tarifs → Prestation pour ces dernières). Absent
> des trois accueils (racine, rien au-dessus) et de `/404`/`/styleguide` (noindex). JSON-LD
> `BreadcrumbList` (`src/lib/breadcrumbs.ts`) construit à partir des mêmes `items` que le rendu
> visuel — même discipline anti-divergence que `HreflangLinks`. Suite complète (108 tests,
> axe-core inclus sur les 36 pages) revérifiée verte après l'ajout ; aucune violation d'accessibilité
> introduite, ordre de tabulation inchangé. Libellés (« Etusivu » / « Home » / « Startsida »,
> intitulés d'aria-label) nouveaux, premier jet non encore relu par un locuteur natif — même statut
> que le contenu neuf de l'EPIC 2 avant relecture, à suivre.

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

> ℹ️ **E9-US2 — sitemap à déclarer, noté d'avance le 17/08/2026.** Quand cette US démarre :
> soumettre `/sitemap-index.xml` dans Search Console, pas `/sitemap.xml` (qui répond 404 sur ce
> projet — voir la note sous E4-US3). Le vérifier avant de perdre du temps à chercher pourquoi
> `/sitemap.xml` n'est pas accepté.

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

**Done — US d'infrastructure** (EPIC 0, EPIC 1, moteur, back-office : rien d'indexable produit) :

- [ ] Critères d'acceptation tous validés, un par un
- [ ] Zéro violation axe-core sur les pages de démonstration concernées
- [ ] Parcours clavier testé
- [ ] Lighthouse accessibilité 100 et performance >= 90 sur /styleguide et les pages existantes
- [ ] Aucune donnée de santé introduite dans le système
- [ ] Revue de code faite, code commité et poussé, CI verte sur le commit livré
- [ ] Déploiement de production réussi sur le commit livré, vérifié sur Vercel

**Done — US de page publiée** (EPIC 2, 4, 10 : tout ce qui produit du contenu visible) :

- [ ] Tous les critères ci-dessus, plus :
- [ ] Contenu présent en FI, EN et SV
- [ ] Balises SEO et données structurées en place
- [ ] Lighthouse SEO 100
- [ ] Page ajoutée à la liste d'URLs de .lighthouserc.cjs
- [ ] Vérifiée sur un appareil mobile réel lors de la passe de fin de sprint

> Correctif du 14/08/2026. La DoD initiale mélangeait les deux. Appliquée littéralement, aucune
> US d'infrastructure ne pouvait être Done, puisqu'elle ne produit ni contenu traduit ni balise
> SEO. « Testé sur mobile réel » signifie désormais : une passe manuelle sur un téléphone
> physique en fin de sprint, sur toutes les pages produites. L'émulation Playwright ne compte
> pas.

> Correctif du 14/08/2026 (2). « Déployé en preview » présupposait un flux par branches et PR
> qui n'a jamais existé : tous les commits livrés jusqu'ici sont allés directement sur `main`,
> jamais via une branche ou une PR. Le critère est remplacé par ce qui est réellement vérifiable
> dans ce flux : le déploiement de production du commit livré, constaté sur le dashboard Vercel.
> Voir §9 bis pour la bascule prévue vers un flux par branches et preview.

---

## 9 bis. Décisions différées

**Passage à l'échantillonnage Lighthouse.** Aujourd'hui (sprint 1), `.lighthouserc.cjs` audite
100 % des pages existantes à chaque commit (2 URLs). Ce n'est pas un problème tant que le site
reste petit, mais ça ne passera pas à l'échelle : au-delà d'une vingtaine de pages en trois
langues (~60 URLs), un audit exhaustif à chaque commit deviendra trop lent pour rester un gate
CI viable.

Décision, à appliquer quand ce seuil est atteint (pas avant) : passer d'un audit exhaustif à un
échantillon représentatif par gabarit de page — une page d'accueil, une page de prestation par
langue, une page ville, `/styleguide` — plutôt que chaque URL réelle. Noté ici pour ne pas le
découvrir en urgence le jour où la CI devient trop lente ; rien à faire tant qu'on est sous le
seuil.

> ✅ **Appliquée, 16/08/2026.** Seuil franchi d'un coup avec E2-US2 : 24 nouvelles pages de
> prestation individuelles (8 prestations × 3 langues, même gabarit piloté par
> `src/lib/prestations.ts`). `.lighthouserc.cjs` échantillonne désormais une seule page de
> prestation par langue (Physiotherapy session — gabarit le plus distinct, bouton désactivé +
> infobulle) au lieu des 24. L'accessibilité de chacune des 24 pages reste vérifiée
> intégralement par axe-core, qui découvre automatiquement toutes les pages buildées — seul
> l'échantillon Lighthouse est réduit.

**Passage à un flux par branches avec PR et preview.** Aujourd'hui (sprint 1), tous les commits
vont directement sur `main` : pas de branche, pas de PR, pas de preview Vercel générée avant mise
en production. Ce n'est pas un problème tant que le risque d'une régression est faible et
rapidement réversible — c'est le cas pour le socle technique et le design system.

Décision, à appliquer au sprint 4 (pas avant) : basculer vers un flux par branches avec PR et
review avant fusion sur `main`, chaque PR générant une preview Vercel vérifiable avant mise en
production. Déclencheur : le démarrage du moteur de réservation (EPIC 5), à partir duquel une
régression a de vraies conséquences (créneau perdu, double réservation, RDV cassé) plutôt qu'un
défaut visuel sur une page vitrine. Noté ici pour ne pas improviser ce changement de flux sous
pression une fois le moteur en cours de développement ; rien à faire tant qu'on est avant le
sprint 4.

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

> ⚠️ **Suivi en points abandonné, 17/08/2026.** Le bilan du sprint 2 n'a produit aucune vélocité
> comparable aux 190 puis 290 points estimés : le développement assisté par IA ne suit pas un
> rythme calibré sur du temps humain, un chiffre de points/sprint n'aurait rien mesuré. Les points
> déjà posés sur chaque US restent affichés dans les tableaux ci-dessus pour leur valeur de
> **découpage relatif** (une US à 8 points reste plus grosse qu'une US à 2 points), mais plus
> personne ne les additionne pour estimer une durée ou une vélocité. Le backlog garde son rôle :
> ordonner le travail et découper le périmètre, pas le chronométrer.

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
