// Source unique des huit prestations pour les pages individuelles (E2-US2). Les noms et
// variantes durée/prix reprennent exactement ceux déjà utilisés et relus sur les pages Tarifs
// (hinnasto.astro / en/pricing.astro / sv/prislista.astro) — pas de nouvelle traduction du nom
// ou du prix, seule la description longue est nouvelle.
//
// Descriptions EN validées par Enzo le 16/08/2026 (voir docs/contenu-canva.md), reprises ici mot
// pour mot. FI et SV sont des traductions nouvelles de l'assistant IA, PAS encore relues par un
// locuteur natif — statut premier jet machine, distinct du FI déjà relu sur Tarifs/Zone
// d'intervention/404 (voir brief, EPIC 2).

export type Lang = 'fi' | 'en' | 'sv';

export interface Variant {
  duration: string;
  price: string;
}

export interface Prestation {
  id: string;
  bookable: boolean;
  slug: Record<Lang, string>;
  name: Record<Lang, string>;
  variants: Record<Lang, Variant[]>;
  description: Record<Lang, string>;
}

export const prestations: Prestation[] = [
  {
    id: 'physiotherapy-session',
    bookable: false,
    slug: {
      fi: 'fysioterapiakaynti',
      en: 'physiotherapy-session',
      sv: 'fysioterapibesok',
    },
    name: {
      fi: 'Fysioterapiakäynti',
      en: 'Physiotherapy session',
      sv: 'Fysioterapibesök',
    },
    variants: {
      fi: [{ duration: '45–60 min', price: '70 €' }],
      en: [{ duration: '45–60 min', price: '€70' }],
      sv: [{ duration: '45–60 min', price: '70 €' }],
    },
    description: {
      fi: 'Yksilöllinen tapaaminen, joka keskittyy liikkumiseesi ja fyysisiin tavoitteisiisi. Ohjaajana Enzo, fysioterapian toisen vuoden opiskelija SAMK:ssa. Tätä palvelua ei voi vielä varata: fysioterapiakäyntien tarjoaminen edellyttää Suomessa ammatinharjoittamisoikeutta, ja Enzo haluaa kertoa tämän suoraan sen sijaan, että antaisi ymmärtää enemmän kuin voi tarjota.',
      en: "A one-to-one session focused on your movement and physical goals, guided by Enzo, a second-year physiotherapy student at SAMK. This service isn't bookable yet: a Finnish practice licence is required before physiotherapy sessions can be offered, and Enzo would rather be upfront about that than approximate what he can offer.",
      sv: 'Ett individuellt möte fokuserat på din rörelse och dina fysiska mål, lett av Enzo, andraårsstudent i fysioterapi vid SAMK. Den här tjänsten går inte att boka än: en finsk yrkeslegitimation krävs innan fysioterapibesök kan erbjudas, och Enzo vill hellre vara tydlig med det än ge sken av mer än han kan erbjuda.',
    },
  },
  {
    id: 'massage',
    bookable: true,
    slug: { fi: 'hieronta', en: 'massage', sv: 'massage' },
    name: { fi: 'Hieronta', en: 'Massage', sv: 'Massage' },
    variants: {
      fi: [
        { duration: '30 min', price: '30 €' },
        { duration: '45 min', price: '40 €' },
        { duration: '60 min', price: '50 €' },
      ],
      en: [
        { duration: '30 min', price: '€30' },
        { duration: '45 min', price: '€40' },
        { duration: '60 min', price: '€50' },
      ],
      sv: [
        { duration: '30 min', price: '30 €' },
        { duration: '45 min', price: '40 €' },
        { duration: '60 min', price: '50 €' },
      ],
    },
    description: {
      fi: 'Palauttava hieronta, joka vapauttaa harjoittelusta ja arjesta kertynyttä jännitystä ja tukee yleistä hyvinvointia. Saatavilla kolmena kestona — 30, 45 tai 60 minuuttia — sopii sekä yksittäiseen raskaaseen viikkoon että osaksi säännöllistä rutiinia. Ei vaadi valmistautumista, riittää mukavat vaatteet.',
      en: 'A recovery-focused massage to release tension built up from training and daily life, and support general wellbeing. Available in three lengths — 30, 45 or 60 minutes — so it can fit a single hard week or become part of a regular routine. No preparation needed beyond comfortable clothing.',
      sv: 'En återhämtningsinriktad massage som löser upp spänningar från träning och vardag, och stödjer det allmänna välbefinnandet. Finns i tre längder — 30, 45 eller 60 minuter — så den passar både en enskild tung vecka och en del av en regelbunden rutin. Inget att förbereda utöver bekväma kläder.',
    },
  },
  {
    id: 'animal-massage',
    bookable: true,
    slug: { fi: 'elainhieronta', en: 'animal-massage', sv: 'djurmassage' },
    name: { fi: 'Eläinhieronta', en: 'Animal Massage', sv: 'Djurmassage' },
    variants: {
      fi: [{ duration: '—', price: '50 €' }],
      en: [{ duration: '—', price: '€50' }],
      sv: [{ duration: '—', price: '50 €' }],
    },
    description: {
      fi: 'Palauttava hieronta hevosille, yhdistettynä hevosen ja ratsastajan liikkeen analysointiin ja kohdennettuun vahvistamiseen. Enzo kehittää aktiivisesti osaamistaan tällä alueella — sekä omatoimisesti että SAMK:n opintojen kautta — eikä ole vielä sertifioitu eläinten hoidossa; palvelu tarjotaan tältä pohjalta.',
      en: 'Recovery-focused massage for horses, combined with movement analysis of horse and rider and targeted strengthening work. Enzo is actively building his knowledge in this area — on his own and through coursework at SAMK — and is not yet certified in animal care; this service is offered on that basis.',
      sv: 'Återhämtningsinriktad massage för hästar, kombinerad med rörelseanalys av häst och ryttare samt riktad styrketräning. Enzo bygger aktivt sin kunskap inom området — på egen hand och genom kurser vid SAMK — och är inte ännu certifierad inom djuromsorg; tjänsten erbjuds på den grunden.',
    },
  },
  {
    id: 'full-body-mobility',
    bookable: true,
    slug: {
      fi: 'kehon-liikkuvuusohjelma',
      en: 'full-body-mobility',
      sv: 'rorlighetsprogram',
    },
    name: {
      fi: 'Kehon liikkuvuusohjelma',
      en: 'Full-Body Mobility',
      sv: 'Rörlighetsprogram för hela kroppen',
    },
    variants: {
      fi: [{ duration: '4 viikkoa, 7 kertaa/viikko', price: '50 €' }],
      en: [{ duration: '4 weeks, 7 sessions/week', price: '€50' }],
      sv: [{ duration: '4 veckor, 7 pass/vecka', price: '50 €' }],
    },
    description: {
      fi: 'Neljän viikon liikkuvuusohjelma, jossa harjoitus lähes joka päivä. Käydään läpi perusliikemalleja ja rakennetaan niistä eteenpäin. Jokainen sarja kirjataan — kuorma, intensiteetti, palautuminen — jotta edistyminen on seurattavissa eikä arvailtavissa, mukana suulliset, visuaaliset ja tarvittaessa fyysiset ohjeet. Enzo on tavoitettavissa myös käyntien välillä. Ei tarvitse valmistella muuta kuin urheilukassin: varusteet, vesipullo, pyyhe.',
      en: "A four-week mobility program with a session most days of the week, working through fundamental movement patterns and building from there. Each set is noted — load, intensity, how you're recovering — so progress is tracked rather than guessed at, with verbal, visual and hands-on feedback along the way. Enzo stays reachable between sessions. Nothing to prepare beyond a gym bag: kit, water, a towel.",
      sv: 'Ett fyra veckor långt rörlighetsprogram med pass nästan varje dag, där grundläggande rörelsemönster gås igenom och byggs vidare på. Varje set noteras — belastning, intensitet, återhämtning — så att framstegen går att följa istället för att gissas, med muntlig, visuell och vid behov fysisk feedback längs vägen. Enzo går att nå mellan passen. Inget att förbereda utöver en sportväska: kläder, vatten, en handduk.',
    },
  },
  {
    id: 'strength-program',
    bookable: true,
    slug: { fi: 'voimaohjelma', en: 'strength-program', sv: 'styrkeprogram' },
    name: { fi: 'Voimaohjelma', en: 'Strength Program', sv: 'Styrkeprogram' },
    variants: {
      fi: [{ duration: '4 viikkoa, 3 kertaa/viikko, koko keho', price: '40 €' }],
      en: [{ duration: '4 weeks, 3 sessions/week, full body', price: '€40' }],
      sv: [{ duration: '4 veckor, 3 pass/vecka, hela kroppen', price: '40 €' }],
    },
    description: {
      fi: 'Neljän viikon voimaohjelma, kolme kertaa viikossa, koko keho mukana — aloitetaan perusliikemalleista ja rakennetaan kuormaa siitä eteenpäin. Jokainen sarja kirjataan (kuorma, intensiteetti, palautuminen), jotta edistyminen on seurattavissa eikä arvailtavissa, mukana suulliset, visuaaliset ja tarvittaessa fyysiset ohjeet. Enzo on tavoitettavissa myös käyntien välillä. Ei tarvitse valmistella muuta kuin urheilukassin: varusteet, vesipullo, pyyhe.',
      en: 'A four-week strength program, three sessions a week, covering the full body — working through fundamental movement patterns first, then building load from there. Each set is noted (load, intensity, recovery) so progress is tracked rather than guessed at, with verbal, visual and hands-on feedback as needed. Enzo stays reachable between sessions. Nothing to prepare beyond a gym bag: kit, water, a towel.',
      sv: 'Ett fyra veckor långt styrkeprogram, tre pass i veckan, hela kroppen — grundläggande rörelsemönster först, sedan byggs belastningen på därifrån. Varje set noteras (belastning, intensitet, återhämtning) så att framstegen går att följa istället för att gissas, med muntlig, visuell och vid behov fysisk feedback. Enzo går att nå mellan passen. Inget att förbereda utöver en sportväska: kläder, vatten, en handduk.',
    },
  },
  {
    id: 'personalized-program',
    bookable: true,
    slug: {
      fi: 'yksilollinen-ohjelma',
      en: 'personalized-program',
      sv: 'individuellt-program',
    },
    name: {
      fi: 'Yksilöllinen ohjelma',
      en: 'Personalized Program',
      sv: 'Individuellt program',
    },
    variants: {
      fi: [{ duration: '4 viikkoa, 3 kertaa', price: '55 €' }],
      en: [{ duration: '4 weeks, 3 sessions', price: '€55' }],
      sv: [{ duration: '4 veckor, 3 pass', price: '55 €' }],
    },
    description: {
      fi: 'Neljän viikon ohjelma, joka rakennetaan kokonaan sinun ympärillesi. Aloitetaan maksuttomalla puhelulla tai tapaamisella, jossa käydään läpi tavoitteesi ja rajoitteesi — aikataulu, fyysiset rajoitteet, mikä tahansa oleellinen — ja suunnitelma rakennetaan siitä. Neljän viikon aikana jokaisen käynnin työ kirjataan (kuorma, intensiteetti, palautuminen), jotta suunnitelma voi mukautua matkan varrella eikä pysy kiinteänä ensimmäisestä päivästä. Enzo on tavoitettavissa käyntien välillä koko ohjelman ajan.',
      en: "A four-week program built entirely around you. It starts with a free introductory call or meeting to talk through your goals and constraints — schedule, physical limitations, whatever's relevant — and a plan is built from there. Across the four weeks, each session's work is noted (load, intensity, recovery) so your plan can adapt as you go, not stay fixed from day one. Enzo stays reachable between sessions throughout the program.",
      sv: 'Ett fyra veckor långt program byggt helt kring dig. Det börjar med ett kostnadsfritt introduktionssamtal eller möte för att gå igenom dina mål och förutsättningar — schema, fysiska begränsningar, allt som är relevant — och en plan byggs utifrån det. Under de fyra veckorna noteras varje pass (belastning, intensitet, återhämtning) så att planen kan anpassas efter hand, inte stå fast från dag ett. Enzo går att nå mellan passen under hela programmet.',
    },
  },
  {
    id: 'individual-coaching',
    bookable: true,
    slug: {
      fi: 'yksilovalmennus',
      en: 'individual-coaching',
      sv: 'individuell-coaching',
    },
    name: {
      fi: 'Yksilövalmennus',
      en: 'Individual Coaching',
      sv: 'Individuell coaching',
    },
    variants: {
      fi: [
        { duration: '60 min', price: '60 €' },
        { duration: '45 min', price: '50 €' },
      ],
      en: [
        { duration: '60 min', price: '€60' },
        { duration: '45 min', price: '€50' },
      ],
      sv: [
        { duration: '60 min', price: '60 €' },
        { duration: '45 min', price: '50 €' },
      ],
    },
    description: {
      fi: 'Yksittäinen kahdenkeskinen valmennuskäynti, varattavissa tarpeen mukaan — ei neljän viikon sitoumusta. Jokainen käynti alkaa lyhyellä tilannekatsauksella siitä, miltä sinusta tuntuu sinä päivänä, etenee ohjelmoitujen liikkeiden kautta suullisten, visuaalisten ja tarvittaessa fyysisten ohjeiden kera, ja päättyy rauhoittumiseen. Saatavilla 45 tai 60 minuuttia.\n\nSuositeltu tiheys: kaksi tai kolme kertaa viikossa, jos rakennat rutiinia — kerran viikossa voi riittää, jos olet jo kokenut tai et tarvitse tiivistä seurantaa.',
      en: "A single one-to-one coaching session, booked as you need it — no four-week commitment. Each session opens with a quick check-in on how you're feeling that day, works through your programmed movements with verbal, visual and hands-on feedback as needed, and closes with a cool-down. Available in 45 or 60 minutes.\n\nRecommended frequency: two to three times a week if you're building a routine — once a week can be enough if you're already experienced or don't need close follow-up.",
      sv: 'Ett enstaka individuellt coachingpass, bokat efter behov — inget fyraveckorsåtagande. Varje pass inleds med en snabb avstämning om hur du mår just den dagen, går igenom dina programmerade rörelser med muntlig, visuell och vid behov fysisk feedback, och avslutas med nedvarvning. Finns i 45 eller 60 minuter.\n\nRekommenderad frekvens: två till tre gånger i veckan om du bygger en rutin — en gång i veckan kan räcka om du redan är van eller inte behöver tät uppföljning.',
    },
  },
  {
    id: 'group-training',
    bookable: true,
    slug: { fi: 'ryhmatreeni', en: 'group-training', sv: 'grupptraning' },
    name: { fi: 'Ryhmätreeni', en: 'Group training', sv: 'Gruppträning' },
    variants: {
      fi: [{ duration: '60 min, vähintään 3 henkilöä', price: '6 €/henkilö' }],
      en: [{ duration: '60 min, minimum 3 people', price: '€6/person' }],
      sv: [{ duration: '60 min, minst 3 personer', price: '6 €/person' }],
    },
    description: {
      fi: '60 minuutin ryhmäkäynti (vähintään kolme henkilöä), jossa käydään läpi perusliikkeitä yhdessä, samalla huomiolla ohjaukseen kuin kahdenkeskisessä käynnissä — suulliset, visuaaliset ja tarvittaessa fyysiset vihjeet. Suunniteltu helpoksi tavaksi aloittaa ohjattu harjoittelu, myös täysille aloittelijoille. Ei tarvitse valmistella muuta kuin urheilukassin: varusteet, vesipullo, pyyhe.\n\nSuositeltu tiheys: kaksi tai kolme kertaa viikossa — kerran viikossa voi riittää, jos olet jo kokenut tai et tarvitse tiivistä seurantaa.',
      en: "A 60-minute group session (minimum three people), working through fundamental movements together with the same attention to feedback as a one-to-one session — verbal, visual and hands-on cues as needed. Designed to be an accessible way into structured training, including for complete beginners. Nothing to prepare beyond a gym bag: kit, water, a towel.\n\nRecommended frequency: two to three times a week — once a week can be enough if you're already experienced or don't need close follow-up.",
      sv: 'Ett 60-minuters gruppass (minst tre personer), där grundläggande rörelser genomförs tillsammans med samma uppmärksamhet på feedback som ett individuellt pass — muntliga, visuella och vid behov fysiska signaler. Utformat för att vara ett tillgängligt sätt att komma in i strukturerad träning, även för nybörjare. Inget att förbereda utöver en sportväska: kläder, vatten, en handduk.\n\nRekommenderad frekvens: två till tre gånger i veckan — en gång i veckan kan räcka om du redan är van eller inte behöver tät uppföljning.',
    },
  },
];
