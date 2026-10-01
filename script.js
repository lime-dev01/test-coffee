document.addEventListener('DOMContentLoaded', () => {
  // --- Données des Terroirs ---
  const origins = [
    {
      id: 'ethiopie',
      name: 'Éthiopie, Guji',
      region: 'Vallée du Rift • 2 100 m',
      x: 585, y: 220,
      color: '#c9782f',
      variety: 'Hearthroom / Bourbon',
      process: 'Lavé, séchage lits africains',
      roast: 'Blonde / Filtre',
      notes: ['Bergamote', 'Fleur d\'oranger', 'Thé noir'],
      desc: 'Une tasse éclatante d\'une grande finesse botanique, portée par des notes d\'agrumes nobles et une clarté cristalline.',
      price: '16.50 € / 250g'
    },
    {
      id: 'colombie',
      name: 'Colombie, Huila',
      region: 'Cordillère des Andes • 1 850 m',
      x: 290, y: 235,
      color: '#a6532b',
      variety: 'Caturra, Castillo',
      process: 'Fermentation anaérobie 48h',
      roast: 'Médium / Omni',
      notes: ['Cerise noire', 'Sucre panela', 'Cacao brut'],
      desc: 'Un corps généreux réhaussé par une sucrosité naturelle équilibrée et une acidité mûre rappelant la cerise fraîche.',
      price: '15.00 € / 250g'
    },
    {
      id: 'sumatra',
      name: 'Sumatra, Mandheling',
      region: 'Lac Toba • 1 500 m',
      x: 790, y: 235,
      color: '#8a6a4a',
      variety: 'Ateng, Tim Tim',
      process: 'Giling Basah (Décortiqué humide)',
      roast: 'Robe de moine / Espresso',
      notes: ['Cèdre noble', 'Épices douces', 'Chocolat intense'],
      desc: 'Un café de caractère à la liqueur dense et aux arômes boisés profonds, offrant une longueur en bouche remarquable.',
      price: '17.00 € / 250g'
    }
  ];

  const homeBase = { name: 'Marseille (Atelier)', x: 500, y: 130 };

  const markersContainer = document.getElementById('markers');
  const routesGroup = document.getElementById('routes');
  const fiche = document.getElementById('fiche');
  const chipsContainer = document.getElementById('chips');
  const ficheClose = document.getElementById('ficheClose');

  let activeIndex = -1;

  // --- Initialisation de la Carte ---
  function initMap() {
    markersContainer.innerHTML = '';
    routesGroup.innerHTML = '';
    chipsContainer.innerHTML = '';

    const homeEl = document.createElement('div');
    homeEl.className = 'marker home';
    homeEl.style.left = `${(homeBase.x / 1000) * 100}%`;
    homeEl.style.top = `${(homeBase.y / 400) * 100}%`;
    homeEl.innerHTML = `<div class="dot"></div><div class="lab">Marseille<small>Atelier Méridien</small></div>`;
    markersContainer.appendChild(homeEl);

    origins.forEach((item, index) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const cx = (item.x + homeBase.x) / 2;
      const cy = Math.min(item.y, homeBase.y) - 50;
      const d = `M ${item.x} ${item.y} Q ${cx} ${cy} ${homeBase.x} ${homeBase.y}`;
      path.setAttribute('d', d);
      path.setAttribute('class', 'route-path');
      path.setAttribute('id', `route-${index}`);
      path.style.setProperty('--rc', item.color);
      routesGroup.appendChild(path);

      const marker = document.createElement('button');
      marker.className = 'marker';
      marker.style.left = `${(item.x / 1000) * 100}%`;
      marker.style.top = `${(item.y / 400) * 100}%`;
      marker.style.setProperty('--mc', item.color);
      marker.innerHTML = `<div class="dot"></div><div class="lab">${item.name}<small>${item.region}</small></div>`;
      marker.addEventListener('click', () => openOrigin(index));
      markersContainer.appendChild(marker);

      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.textContent = item.name.split(',')[0];
      chip.style.setProperty('--cc', item.color);
      chip.addEventListener('click', () => openOrigin(index));
      chipsContainer.appendChild(chip);
    });
  }

  // --- Sélection & Ouverture de la Fiche ---
  function openOrigin(index) {
    activeIndex = index;
    const data = origins[index];

    document.getElementById('fNum').textContent = `0${index + 1}`;
    document.getElementById('fName').textContent = data.name;
    document.getElementById('fRegion').textContent = data.region;
    document.getElementById('fVar').textContent = data.variety;
    document.getElementById('fProc').textContent = data.process;
    document.getElementById('fRoast').textContent = data.roast;
    document.getElementById('fDesc').textContent = data.desc;
    document.getElementById('fPrice').textContent = data.price;

    const notesBox = document.getElementById('fNotes');
    notesBox.innerHTML = data.notes.map(n => `<span>${n}</span>`).join('');

    fiche.style.setProperty('--oc', data.color);
    fiche.classList.add('open');

    document.querySelectorAll('.route-path').forEach((p, i) => p.classList.toggle('active', i === index));
    document.querySelectorAll('.chip').forEach((c, i) => c.classList.toggle('active', i === index));
    document.querySelectorAll('.marker:not(.home)').forEach((m, i) => m.classList.toggle('active', i === index));
  }

  ficheClose.addEventListener('click', () => {
    fiche.classList.remove('open');
    document.querySelectorAll('.route-path').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.chip, .marker').forEach(c => c.classList.remove('active'));
  });

  document.getElementById('fPrev').addEventListener('click', () => {
    openOrigin((activeIndex - 1 + origins.length) % origins.length);
  });
  document.getElementById('fNext').addEventListener('click', () => {
    openOrigin((activeIndex + 1) % origins.length);
  });
  document.getElementById('fMap').addEventListener('click', () => ficheClose.click());

  // --- Points de progression ---
  const navSections = [
    { id:'hero', color:'#F4EEE2' }, { id:'monde', color:'#F4EEE2' },
    { id:'ethiopie', color:'#c9782f' }, { id:'colombie', color:'#a6532b' }, { id:'sumatra', color:'#8a6a4a' },
    { id:'methodes', color:'#F4EEE2' }, { id:'contact', color:'#F4EEE2' },
  ];
  const progress = document.getElementById('progress');
  navSections.forEach(s => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', s.id);
    b.addEventListener('click', () => document.getElementById(s.id).scrollIntoView({ behavior:'smooth' }));
    progress.appendChild(b);
  });
  const progressBtns = progress.querySelectorAll('button');
  const navIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const idx = navSections.findIndex(s => s.id === en.target.id);
        progressBtns.forEach((b, i) => {
          b.classList.toggle('active', i === idx);
          b.style.setProperty('--pc', navSections[idx].color);
        });
      }
    });
  }, { threshold: .5 });
  navSections.forEach(s => navIO.observe(document.getElementById(s.id)));

  // ===================================================================
  // Liquide : niveau avec inertie (lerp) + vagues qui clapotent au scroll
  // ===================================================================
  const liquidSections = [...document.querySelectorAll('section.origin')].map(el => ({
    el,
    level: el.querySelector('.level'),
    waves: el.querySelectorAll('.wave'),
    cur: 0
  }));

  let lastY = window.scrollY, vel = 0;

  function liquidFrame() {
    const vh = window.innerHeight;

    // vitesse de scroll lissée -> amplitude de clapotis
    vel += ((window.scrollY - lastY) - vel) * 0.15;
    lastY = window.scrollY;
    const slosh = Math.min(Math.abs(vel) / 40, 1);

    liquidSections.forEach(o => {
      const rect = o.el.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        // 0 = vide (section pas encore atteinte), 1 = plein (section bien engagée)
        const target = Math.max(0, Math.min(1, (vh - rect.top) / (vh * 0.85)));
        o.cur += (target - o.cur) * 0.08;               // inertie : le liquide suit avec un léger retard
        o.level.style.transform = `translateY(${(1 - o.cur) * 100}%)`;

        const amp = 1 + slosh * 1.8;                      // les vagues gonflent quand on scrolle vite
        o.waves.forEach((w, i) => {
          w.style.transform = `scaleY(${amp - i * 0.15})`;
        });
      }
    });

    requestAnimationFrame(liquidFrame);
  }
  requestAnimationFrame(liquidFrame);

  // --- Bulles (corrigé : durée réellement aléatoire via custom property) ---
  document.querySelectorAll('.bubbles').forEach(container => {
    for (let i = 0; i < 14; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      const size = Math.random() * 7 + 2;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.animationDelay = `${Math.random() * 8}s`;
      bubble.style.setProperty('--duration', `${Math.random() * 6 + 6}s`);
      bubble.style.setProperty('--dx', `${(Math.random() - 0.5) * 50}px`);
      container.appendChild(bubble);
    }
  });

  initMap();
});
