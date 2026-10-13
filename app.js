/* =====================================================================
   Atef & Nada — logique de l'invitation
   Portage fidèle du comportement du projet Lovable original :
   - écran d'entrée avec porte coulissante
   - bascule FR / AR (tunisien)
   - compte à rebours vers le 24/12/2026 18:00
   - révélation au scroll (IntersectionObserver)
   - parallaxe + nav collante
   - carillon WebAudio optionnel
   ===================================================================== */
(() => {
  'use strict';

  /* ------------------------------------------------------------------
     1. DICTIONNAIRE — reprise exacte des libellés de l'original.
        SEULE MODIFICATION : `hallTitle` (le titre affiché sur la photo
        de la salle), remplacé par « Soirée du HENNA & dîner ».
     ------------------------------------------------------------------ */
  const I18N = {
    fr: {
      nav: ['Compte à rebours', 'Histoire', 'Programme', 'Lieu'],
      countEyebrow: 'CHAQUE INSTANT NOUS RAPPROCHE',
      countTitle: 'Le grand jour approche',
      units: ['JOURS', 'HEURES', 'MINUTES', 'SECONDES'],
      storyTitle: 'Notre histoire',
      story: "Tout a commencé par un simple sourire, un moment partagé, puis une belle histoire qui n’a cessé de grandir. Aujourd’hui, nous sommes heureux de vous annoncer le début d’un nouveau chapitre de notre vie et de le célébrer entourés des personnes qui nous sont les plus chères.",
      inviteEyebrow: 'DE TOUT NOTRE CŒUR',
      inviteTitle: 'Vous êtes invités à notre mariage',
      inviteText: "C’est avec beaucoup d’amour et de bonheur que nous vous invitons à célébrer notre mariage. Votre présence rendra cette journée encore plus belle et inoubliable. Nous avons hâte de partager ces précieux instants avec vous.",
      labels: { date: 'LA DATE', time: 'L’HEURE', place: 'LE LIEU' },
      inviteDate: 'Jeudi 24 décembre 2026',
      inviteTime: '18h00',
      invitePlace: 'Palais de la Municipalité, Monastir',
      progEyebrow: 'DES INSTANTS À PARTAGER',
      progTitle: 'Les rendez-vous du bonheur',
      ev1: {
        date: 'MARDI 22 DÉCEMBRE · 18H00',
        title: 'Soirée du Henné & Dîner',
        desc: 'Chants, zgharit et dîner chez la famille de la mariée.',
        place: 'Champs-Elysées',
        placeSmall: 'قاعة أفراح · Route de Sousse · Kairouan'
      },
      ev2: {
        date: 'JEUDI 24 DÉCEMBRE · 18H00',
        title: 'Le grand jour',
        desc: 'Entourés de vous, nous nous dirons oui pour la vie.',
        place: 'Palais de la Municipalité',
        placeSmall: 'Monastir · Tunisie'
      },
      /* ── SEULE MODIFICATION : ancien « LA SALLE DE NOTRE BONHEUR » ── */
      hallEyebrow: 'LA SALLE DE NOTRE BONHEUR',
      hallTitle: 'Soirée du HENNA & dîner',
      hallName: 'Champs-Elysées',
      hallAddress: 'قاعة أفراح · Route de Sousse – Kairouan, Tunisie',
      hallEvent: 'Soirée du Henné · Mardi 22 décembre 2026 · 18h00',
      hallRoute: 'Voir l’itinéraire',
      placeEyebrow: 'LÀ OÙ NOS CŒURS SE REJOIGNENT',
      placeTitle: 'Le lieu',
      giftLine: 'Votre présence est notre plus beau cadeau',
      altEv1: 'حنة العروسة والعشاء',
      altEv2: 'الزفاف',
      heroEyebrow: 'AVEC LA BÉNÉDICTION DE DIEU',
      heroLead: ['Nous avons le plaisir de vous inviter à célébrer notre mariage',
                 'dans une ambiance pleine d’amour et de joie.'],
      dateDay: 'JEUDI',
      dateMonth: ['DÉCEMBRE', '2026'],
      scrollCue: 'LE DÉBUT DE NOTRE ÉTERNITÉ',
      storyEyebrow: 'DEUX ÂMES, UNE HISTOIRE',
      footerLine: '24 DÉCEMBRE 2026 · AVEC TOUT NOTRE AMOUR',
      entEyebrow: 'UNE NOUVELLE HISTOIRE COMMENCE',
      entSub: 'Et vous en faites partie.',
      entGreet: 'Vous êtes invités',
      entOpen: 'Ouvrir l’invitation',
      entPlace: 'MONASTIR, TUNISIE',
      entDate: '24 DÉCEMBRE 2026'
    },
    ar: {
      nav: ['العدّ', 'حكايتنا', 'البرنامج', 'البلاصة'],
      countEyebrow: 'كل لحظة قرّبنا فيها لبعضنا',
      countTitle: 'النهار الكبير قرّب',
      units: ['أيام', 'سوايع', 'دقايق', 'ثواني'],
      storyTitle: 'حكايتنا',
      story: 'حكايتنا بدات بابتسامة، وكبرت بالمحبة، واليوم حبّينا نفرحوا بيكم وتكونوا معانا في أجمل نهار في حياتنا.',
      inviteEyebrow: 'من القلب',
      inviteTitle: 'عرسنا ما يحلى كان بيكم',
      inviteText: 'بالفرحة والقلب الواسع، ندعوكم باش تكونوا معانا في فرحة عرسنا. وجودكم يزيد فرحتنا ويخلّي هذا النهار ذكرى ما تتنساش، ونحبّو نعيشو هاذي اللحظة الغالية معاكم.',
      labels: { date: 'النهار', time: 'الوقت', place: 'البلاصة' },
      inviteDate: 'الخميس 24 ديسمبر 2026',
      inviteTime: '18:00',
      invitePlace: 'دار البلدية، المنستير',
      progEyebrow: 'لحظات باش نعيشوها مع بعضنا',
      progTitle: 'مواعيد الفرحة',
      ev1: {
        date: 'الثلثاء 22 ديسمبر · 18:00',
        title: 'حنة العروسة والعشاء',
        desc: 'غناء، زغاريت وعشاء في دار العروسة.',
        place: 'Champs-Elysées',
        placeSmall: 'قاعة أفراح · طريق سوسة · القيروان'
      },
      ev2: {
        date: 'الخميس 24 ديسمبر · 18:00',
        title: 'النهار الكبير',
        desc: 'وسط حبّائنا، نقولوا لبعضنا نعم للعمر الكامل.',
        place: 'دار البلدية',
        placeSmall: 'المنستير · تونس'
      },
      hallEyebrow: 'قاعة الفرحة',
      hallTitle: 'سهرة الحنّة والعشاء',
      hallName: 'Champs-Elysées',
      hallAddress: 'قاعة أفراح · طريق سوسة – القيروان، تونس',
      hallEvent: 'حنة العروسة · الثلثاء 22 ديسمبر 2026 · 18:00',
      hallRoute: 'تشوف الطريق',
      placeEyebrow: 'وين يتقابلوا قلوبنا',
      placeTitle: 'البلاصة',
      giftLine: 'وجودكم هو أحلى هدية',
      altEv1: 'Soirée du Henné & Dîner',
      altEv2: 'Le grand jour',
      heroEyebrow: 'ببركة الله ومحبّته',
      heroLead: ['نحبّوكم تكونوا معانا', 'في أحلى نهار في عمرنا'],
      dateDay: 'الخميس',
      dateMonth: ['ديسمبر', '2026'],
      scrollCue: 'بداية عمرنا مع بعضنا',
      storyEyebrow: 'روحين في روح وحدة',
      footerLine: '24 ديسمبر 2026 · بمحبتنا الكلّ',
      entEyebrow: 'حكاية جديدة بدات',
      entSub: 'وانتوا جزء منها.',
      entGreet: 'مدعوّين لفرحتنا',
      entOpen: 'إفتحوا الدعوة',
      entPlace: 'المنستير، تونس',
      entDate: '24 ديسمبر 2026'
    }
  };

  /* Cible du compte à rebours : 24/12/2026 à 18h00 (+01:00) */
  const TARGET = Date.parse('2026-12-24T18:00:00+01:00');
  const HALL_IMG = 'assets/champs-elysees.jpg';
  const DOORS_IMG = 'assets/wedding-doors.jpg';
  const MAPS_HALL = 'https://www.google.com/maps/search/?api=1&query=35.6756693%2C10.1268857';
  const MAPS_PALACE = 'https://www.google.com/maps/search/?api=1&query=Palais+de+la+Municipalite+Monastir+Tunisie';
  const WAZE_PALACE = 'https://waze.com/ul?q=Palais%20de%20la%20Municipalite%20Monastir&navigate=yes';
  const MAP_EMBED = 'https://www.google.com/maps?q=Palais+de+la+Municipalite+Monastir+Tunisie&output=embed';

  /* ------------------------------------------------------------------
     2. ICÔNES (lucide, identiques à l'original)
     ------------------------------------------------------------------ */
  const svg = (size, sw, body) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

  /* lucide "flower-2", tracé identique à celui de l'original */
  const FLOWER = '<path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1"></path><circle cx="12" cy="8" r="2"></circle><path d="M12 10v12"></path><path d="M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z"></path><path d="M12 22c-4.2 0-7-1.667-7-5 4.2 0-7 1.667-7 5Z"></path>';
  const iFlower2 = (s = 22, sw = 1) => svg(s, sw, FLOWER);
  const iHeart = (s = 30, sw = 1.2) => svg(s, sw, '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>');
  const iGem = (s = 25, sw = 1) => svg(s, sw, '<path d="M10.5 3 8 9l4 13 4-13-2.5-6"></path><path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"></path><path d="M2 9h20"></path>');
  const iMapPin = (s = 24, sw = 2) => svg(s, sw, '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle>');
  const iArrowUpRight = (s = 24, sw = 2) => svg(s, sw, '<path d="M7 7h10v10"></path><path d="M7 17 17 7"></path>');
  const iArrowUpRight15 = () => svg(15, 2, '<path d="M7 7h10v10"></path><path d="M7 17 17 7"></path>');
  const iArrowDown = (s = 18, sw = 1) => svg(s, sw, '<path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path>');
  const iNavigation = (s = 24, sw = 2) => svg(s, sw, '<polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>');
  const iVolumeX = () => svg(24, 2, '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 0 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path><line x1="22" x2="16" y1="9" y2="15"></line><line x1="16" x2="22" y1="9" y2="15"></line>');
  const iVolume2 = () => svg(24, 2, '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 0 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>');

  /* ------------------------------------------------------------------
     3. ÉTAT
     ------------------------------------------------------------------ */
  let lang = 'fr';
  let opened = false;
  let opening = false;
  let music = false;
  let revealObserver = null;
  let scrollRaf = 0;

  const app = document.getElementById('app');

  /* attribut lang/dir conditionnel, comme dans l'original */
  const ld = (isAr) => (isAr ? ' lang="ar" dir="rtl"' : '');
  /* sur le titre de la photo de la salle, l'original force toujours lang + dir */
  const ldHall = (isAr) => (isAr ? ' lang="ar" dir="rtl"' : ' lang="fr" dir="ltr"');

  function divider() {
    return `<div class="floral-divider" aria-hidden="true"><span></span>${iFlower2(22, 1)}<span></span></div>`;
  }

  function coupleNames() {
    return `<div class="couple-names">Atef <em>&amp;</em> Nada</div>`;
  }

  function langSwitch(scope) {
    const f = lang === 'fr' ? 'btn-invitation' : 'btn-outline';
    const a = lang === 'ar' ? 'btn-invitation' : 'btn-outline';
    return `<div class="lang-switch" role="group" aria-label="Langue">
      <button class="btn ${f}" data-lang="fr" aria-pressed="${lang === 'fr'}">Français</button>
      <button class="btn ${a}" data-lang="ar" aria-pressed="${lang === 'ar'}"><span lang="ar">تونسي</span></button>
    </div>`;
  }

  /* ------------------------------------------------------------------
     4. ÉCRAN D'ENTRÉE
     ------------------------------------------------------------------ */
  function renderEntrance() {
    const d = I18N[lang];
    const isAr = lang === 'ar';
    return `<section class="entrance${opening ? ' opening' : ''}" aria-label="Invitation de mariage">
      <div class="door-half door-left">
        <img src="${DOORS_IMG}" alt="Porte fleurie de roses et de feuillage" width="1536" height="1024">
      </div>
      <div class="door-half door-right" aria-hidden="true">
        <img src="${DOORS_IMG}" alt="" width="1536" height="1024">
      </div>
      <div class="entrance-wash"></div>
      <div class="entrance-glow" aria-hidden="true"></div>

      <div class="entrance-lang">${langSwitch()}</div>

      <div class="entrance-top">
        <p class="arabic bismillah" lang="ar" dir="rtl">بسم الله الرحمن الرحيم</p>
        <p class="eyebrow"${ld(isAr)}>${d.entEyebrow}</p>
        <h1>${coupleNames()}</h1>
        <p class="entrance-subtitle"${ld(isAr)}>${d.entSub}</p>
      </div>

      <div class="entrance-bottom">
        <p class="guest-greet"${ld(isAr)}>${d.entGreet}</p>
        <button class="btn btn-seal" data-open aria-label="${isAr ? 'إفتحوا الدعوة' : 'Ouvrir l’invitation'}"${opening ? ' disabled' : ''}>${iHeart(23, 1.2)}</button>
        <button class="btn btn-invitation" data-open${opening ? ' disabled' : ''}><span${ld(isAr)}>${d.entOpen}</span> ${iArrowUpRight15()}</button>
        <div class="entrance-date">
          <span>${d.entDate}</span><i></i><span${ld(isAr)}>${d.entPlace}</span>
        </div>
      </div>

      <div class="edge-note">AVEC AMOUR, POUR TOUJOURS</div>
    </section>`;
  }

  /* ------------------------------------------------------------------
     5. CONTENU
     ------------------------------------------------------------------ */
  function renderHall(d) {
    const isAr = lang === 'ar';
    return `<section id="salle" class="hall-section">
      <figure class="hall-photo">
        <img src="${HALL_IMG}" alt="La salle Champs-Elysées illuminée de rose" width="1920" height="1080" fetchpriority="high">
        <figcaption class="hall-photo-caption">
          <p class="eyebrow"${ldHall(isAr)}>${d.hallEyebrow}</p>
          <h2 class="hall-photo-title"${ldHall(isAr)}>${d.hallTitle}</h2>
        </figcaption>
      </figure>
      <h3>${d.hallName}</h3>
      <p class="hall-address"${ld(isAr)}>${d.hallAddress}</p>
      <p class="hall-event"${ld(isAr)}>${d.hallEvent}</p>
      <div class="map-buttons">
        <a class="btn btn-invitation" target="_blank" rel="noopener noreferrer" href="${MAPS_HALL}">${iMapPin()}${d.hallRoute}${iArrowUpRight()}</a>
      </div>
    </section>`;
  }

  function renderHero(d) {
    const isAr = lang === 'ar';
    return `<section class="invitation-hero">
      <img class="hero-floral" width="1536" height="1024" alt="" aria-hidden="true" src="${DOORS_IMG}">
      <div class="hero-orbs" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="hero-content">
        <p class="arabic verse" lang="ar" dir="rtl">وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا</p>
        <p class="arabic hero-official-invitation" lang="ar" dir="rtl">يتشرف السيد علي الفندري والسيد بشير بن مصباح بدعوتكم لحضور حفل زفاف وعقد قران <span>عاطف &amp; ندى</span> ومشاركتنا فرحتنا.</p>
        ${divider()}
        <p class="eyebrow"${ld(isAr)}>${d.heroEyebrow}</p>
        <p class="arabic" lang="ar" dir="rtl">ندعوكم بكل حب وفرح لحضور مراسم زفاف</p>
        <h1>${coupleNames()}</h1>
        <p class="hero-lead">${d.heroLead[0]}<br>${d.heroLead[1]}</p>
        <p class="arabic hero-arabic" lang="ar" dir="rtl">يتشرّفون بدعوتكم لمشاركتهم فرحتهم</p>
        <div class="wedding-date" dir="ltr">
          <span${ld(isAr)}>${d.dateDay}</span>
          <strong>24</strong>
          <span${ld(isAr)}>${d.dateMonth[0]}<br>${d.dateMonth[1]}</span>
        </div>
        <a href="#countdown" class="scroll-cue" aria-label="Découvrir l’invitation"><span${ld(isAr)}>${d.scrollCue}</span>${iArrowDown(18, 1)}</a>
      </div>
    </section>`;
  }

  function renderCountdown(d) {
    const isAr = lang === 'ar';
    return `<section id="countdown" class="count-section reveal">
      <p class="eyebrow"${ld(isAr)}>${d.countEyebrow}</p>
      <h2>${d.countTitle}</h2>
      <div class="countdown">
        <div><strong id="cd-d">00</strong><span>${d.units[0]}</span></div>
        <div><strong id="cd-h">00</strong><span>${d.units[1]}</span></div>
        <div><strong id="cd-m">00</strong><span>${d.units[2]}</span></div>
        <div><strong id="cd-s">00</strong><span>${d.units[3]}</span></div>
      </div>
      ${divider()}
    </section>`;
  }

  function renderStory(d) {
    const isAr = lang === 'ar';
    return `<section id="histoire" class="story-section reveal">
      ${iFlower2(36, 1)}
      <p class="eyebrow"${ld(isAr)}>${d.storyEyebrow}</p>
      <h2>${d.storyTitle}</h2>
      ${langSwitch()}
      <p class="story-copy">${d.story}</p>
    </section>`;
  }

  function renderInvite(d) {
    const isAr = lang === 'ar';
    return `<section id="invitation" class="invite-section reveal">
      ${iFlower2(36, 1)}
      <p class="eyebrow"${ld(isAr)}>${d.inviteEyebrow}</p>
      <h2>${d.inviteTitle}</h2>
      <p class="invite-copy">${d.inviteText}</p>
      <div class="invite-card">
        <div class="couple-names invite-names">Atef <em>&amp;</em> Nada</div>
        <div class="invite-details">
          <div><span>${d.labels.date}</span><strong>${d.inviteDate}</strong></div>
          <div><span>${d.labels.time}</span><strong>${d.inviteTime}</strong></div>
          <div><span>${d.labels.place}</span><strong>${d.invitePlace}</strong></div>
        </div>
      </div>
    </section>`;
  }

  function renderProgram(d) {
    const isAr = lang === 'ar';
    return `<section id="programme" class="program-section">
      <div class="section-heading reveal">
        <p class="eyebrow"${ld(isAr)}>${d.progEyebrow}</p>
        <h2>${d.progTitle}</h2>
        <p class="arabic" lang="ar">برنامج الزفاف</p>
      </div>
      <div class="events">
        <article class="event reveal">
          <div class="event-number">01 ${iFlower2(25, 1)}</div>
          <p class="eyebrow"${ld(isAr)}>${d.ev1.date}</p>
          <h3>${d.ev1.title}</h3>
          <p class="arabic" lang="ar" dir="rtl">${d.altEv1}</p>
          <p>${d.ev1.desc}</p>
          <div class="event-place">${iMapPin(16, 2)}<span>${d.ev1.place}<br><small>${d.ev1.placeSmall}</small></span></div>
        </article>
        <article class="event reveal">
          <div class="event-number">02 ${iGem(25, 1)}</div>
          <p class="eyebrow"${ld(isAr)}>${d.ev2.date}</p>
          <h3>${d.ev2.title}</h3>
          <p class="arabic" lang="ar" dir="rtl">${d.altEv2}</p>
          <p>${d.ev2.desc}</p>
          <div class="event-place">${iMapPin(16, 2)}<span>${d.ev2.place}<br><small>${d.ev2.placeSmall}</small></span></div>
        </article>
      </div>
    </section>`;
  }

  function renderPlace(d) {
    const isAr = lang === 'ar';
    return `<section id="lieu" class="place-section reveal">
      <p class="eyebrow"${ld(isAr)}>${d.placeEyebrow}</p>
      <h2>${d.placeTitle}</h2>
      <h3>Palais de la Municipalité</h3>
      <p>Monastir · Tunisie</p>
      <div class="map-wrap">
        <iframe title="Carte du Palais de la Municipalité à Monastir" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${MAP_EMBED}"></iframe>
      </div>
      <div class="map-buttons">
        <a class="btn btn-invitation" target="_blank" rel="noopener noreferrer" href="${MAPS_PALACE}">${iMapPin()}Google Maps${iArrowUpRight()}</a>
        <a class="btn btn-outline" target="_blank" rel="noopener noreferrer" href="${WAZE_PALACE}">${iNavigation()}Waze${iArrowUpRight()}</a>
      </div>
    </section>`;
  }

  function renderGift(d) {
    const isAr = lang === 'ar';
    return `<section class="gift-section reveal">
      ${iHeart(30, 1)}
      <h2>${d.giftLine}</h2>
      <p class="arabic" lang="ar" dir="rtl">حضوركم هو أجمل هدية</p>
    </section>`;
  }

  function renderFooter(d) {
    const isAr = lang === 'ar';
    return `<footer class="wedding-footer">
      ${divider()}
      <p class="arabic" lang="ar">مبروك علينا وعليكم</p>
      ${coupleNames()}
      <p class="eyebrow"${ld(isAr)}>${d.footerLine}</p>
    </footer>`;
  }

  function renderWeddingDuas() {
    return `<section class="wedding-duas" aria-labelledby="wedding-duas-title">
      <p class="arabic wedding-duas-bismillah" lang="ar" dir="rtl">بسم الله الرحمن الرحيم</p>
      <h2 class="arabic" id="wedding-duas-title" lang="ar" dir="rtl">أدعية للعروسين</h2>
      <div class="wedding-dua-block arabic" lang="ar" dir="rtl">بارك الله لك، وبارك عليك، وجمع بينكما في خير</div>
      <div class="wedding-dua-block arabic" lang="ar" dir="rtl">رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا</div>
    </section>`;
  }

  function renderNav(d) {
    const isAr = lang === 'ar';
    const ids = ['#countdown', '#histoire', '#programme', '#lieu'];
    return `<header class="invitation-nav">
      <span>A <em>&amp;</em> N</span>
      <nav class="nav-links" aria-label="Sections">
        ${ids.map((id, i) => `<a href="${id}"${ld(isAr)}>${d.nav[i]}</a>`).join('')}
      </nav>
      ${langSwitch()}
      <span>24.12.2026</span>
      <button class="btn btn-ghost btn-icon" data-music aria-label="${music ? 'Couper la musique' : 'Activer la musique'}" title="${music ? 'Couper la musique' : 'Activer la musique'}">${music ? iVolume2() : iVolumeX()}</button>
    </header>`;
  }

  /* ------------------------------------------------------------------
     6. RENDU
     ------------------------------------------------------------------ */
  function render() {
    const d = I18N[lang];
    app.className = `wedding-app${opened ? ' is-open' : ''}`;
    app.innerHTML = opened
      ? renderNav(d) + '<main>' +
          renderHero(d) + renderCountdown(d) + renderStory(d) +
          renderInvite(d) + renderProgram(d) + renderHall(d) + renderPlace(d) +
          renderGift(d) + renderFooter(d) + renderWeddingDuas() +
        '</main>' + PETALS
      : renderEntrance();

    document.documentElement.lang = lang;
    if (revealObserver) { revealObserver.disconnect(); revealObserver = null; }
    if (opened) {
      setupReveal();
      updateCountdown();
    }
  }

  const PETALS = '<div class="petals" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>';

  /* ------------------------------------------------------------------
     7. OUVERTURE
     ------------------------------------------------------------------ */
  function openInvitation() {
    if (opened || opening) return;
    opening = true;
    app.innerHTML = renderEntrance();
    setTimeout(() => {
      opened = true;
      opening = false;
      render();
      window.scrollTo(0, 0);
    }, 1400);
  }

  /* ------------------------------------------------------------------
     8. RÉVÉLATION AU SCROLL
     ------------------------------------------------------------------ */
  function setupReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------
     9. COMPTE À REBOURS
     ------------------------------------------------------------------ */
  function updateCountdown() {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = String(v).padStart(2, '0'); };
    let diff = Math.max(0, TARGET - Date.now());
    const d = Math.floor(diff / 86400000); diff -= d * 86400000;
    const h = Math.floor(diff / 3600000);  diff -= h * 3600000;
    const m = Math.floor(diff / 60000);    diff -= m * 60000;
    const s = Math.floor(diff / 1000);
    set('cd-d', d); set('cd-h', h); set('cd-m', m); set('cd-s', s);
  }

  /* ------------------------------------------------------------------
     10. PARALLAXE + NAV COLLANTE
     ------------------------------------------------------------------ */
  function onScroll() {
    cancelAnimationFrame(scrollRaf);
    scrollRaf = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--scroll', String(window.scrollY));
      const nav = document.querySelector('.invitation-nav');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ------------------------------------------------------------------
     11. MUSIQUE — « إدخلي عمري » (Hussain Al Jassmi)
     ------------------------------------------------------------------ */
  const bgm = new Audio('assets/edkhely-omri.mp3');
  bgm.loop = true;
  bgm.preload = 'none';
  bgm.volume = 0.6;

  /* jeton de tentative : un play() rejété plus ancien ne doit pas
     annuler un état valide obtenu par une tentative plus récente */
  let playToken = 0;

  function startMusic() {
    const token = ++playToken;
    let p;
    try { p = bgm.play(); } catch (e) { p = null; }
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        if (token !== playToken) return;   /* tentative périmée */
        music = false;
        const y = window.scrollY;
        render();
        window.scrollTo(0, y);
      });
    }
  }
  function stopMusic() { playToken++; bgm.pause(); }

  /* ------------------------------------------------------------------
     12. ÉVÉNEMENTS
     ------------------------------------------------------------------ */
  app.addEventListener('click', e => {
    const langBtn = e.target.closest('[data-lang]');
    if (langBtn) {
      const next = langBtn.getAttribute('data-lang');
      if (next === lang) return;
      lang = next;
      const y = window.scrollY;
      render();
      window.scrollTo(0, y);
      return;
    }
    if (e.target.closest('[data-open]')) { openInvitation(); return; }
    const m = e.target.closest('[data-music]');
    if (m) {
      music = !music;
      const y = window.scrollY;
      if (music) startMusic(); else stopMusic();
      render();
      window.scrollTo(0, y);
    }
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  setInterval(updateCountdown, 1000);

  render();
})();