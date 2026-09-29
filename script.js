document.addEventListener('DOMContentLoaded', () => {
  // --- Données des Terroirs ---
  const origins = [
    {
      id: 'ethiopie',
      name: 'Éthiopie, Guji',
      region: 'Vallée du Rift • 2 100 m',
      x: 585,
      y: 220,
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
      x: 290,
      y: 235,
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
      x: 790,
      y: 235,
      variety: 'Ateng, Tim Tim',
      process: 'Giling Basah (Décortiqué humide)',
      roast: 'Robe de moine / Espresso',
      notes: ['Cèdre noble', 'Épices douces', 'Chocolat intense'],
      desc: 'Un café de caractère à la liqueur dense et aux arômes boisés profonds, offrant une longueur en bouche remarquable.',
      price: '17.00 € / 250g'
    }
  ];

  const homeBase = { name: 'Marseille (Atelier)', x: 500, y: 130 };

  // --- Éléments du DOM ---
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

    // Marqueur Marseille (HQ)
    const homeEl = document.createElement('div');
    homeEl.className = 'marker home';
    homeEl.style.left = `${(homeBase.x / 1000) * 100}%`;
    homeEl.style.top = `${(homeBase.y / 400) * 100}%`;
    homeEl.innerHTML = `<div class="dot"></div><div class="lab">Marseille<small>Atelier Méridien</small></div>`;
    markersContainer.appendChild(homeEl);

    // Marqueurs d'origine & Arcs SVG
    origins.forEach((item, index) => {
      // 1. Tracer la route courbe SVG
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const cx = (item.x + homeBase.x) / 2;
      const cy = Math.min(item.y, homeBase.y) - 50; // Courbure vers le haut
      const d = `M ${item.x} ${item.y} Q ${cx} ${cy} ${homeBase.x} ${homeBase.y}`;
      path.setAttribute('d', d);
      path.setAttribute('class', 'route-path');
      path.setAttribute('id', `route-${index}`);
      routesGroup.appendChild(path);

      // 2. Créer le marqueur DOM
      const marker = document.createElement('button');
      marker.className = 'marker';
      marker.style.left = `${(item.x / 1000) * 100}%`;
      marker.style.top = `${(item.y / 400) * 100}%`;
      marker.innerHTML = `<div class="dot"></div><div class="lab">${item.name}<small>${item.region}</small></div>`;
      marker.addEventListener('click', () => openOrigin(index));
      markersContainer.appendChild(marker);

      // 3. Créer le filtre/chip
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.textContent = item.name.split(',')[0];
      chip.addEventListener('click', () => openOrigin(index));
      chipsContainer.appendChild(chip);
    });
  }

  // --- Sélection & Ouverture de la Fiche ---
  function openOrigin(index) {
    activeIndex = index;
    const data = origins[index];

    // Mettre à jour la fiche
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

    fiche.classList.add('open');

    // Mettre à jour les routes SVG et les chips
    document.querySelectorAll('.route-path').forEach((p, i) => {
      p.classList.toggle('active', i === index);
    });

    document.querySelectorAll('.chip').forEach((c, i) => {
      c.classList.toggle('active', i === index);
    });
  }

  // Navigations dans la fiche
  ficheClose.addEventListener('click', () => {
    fiche.classList.remove('open');
    document.querySelectorAll('.route-path').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  });

  document.getElementById('fPrev').addEventListener('click', () => {
    const next = (activeIndex - 1 + origins.length) % origins.length;
    openOrigin(next);
  });

  document.getElementById('fNext').addEventListener('click', () => {
    const next = (activeIndex + 1) % origins.length;
    openOrigin(next);
  });

  document.getElementById('fMap').addEventListener('click', () => {
    ficheClose.click();
  });

  // --- Animation du Niveau de Liquide au Scroll ---
  const originsSections = document.querySelectorAll('section.origin');

  function updateLiquidLevels() {
    const windowHeight = window.innerHeight;

    originsSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const level = section.querySelector('.level');

      // Progression du scroll dans la section
      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        // Translation dynamique du niveau de liquide (de 80% bas à 10% haut)
        const translateY = Math.max(0, Math.min(80, 80 - progress * 90));
        level.style.transform = `translateY(${translateY}%)`;
      }
    });
  }

  window.addEventListener('scroll', updateLiquidLevels);

  // --- Générateur de Bulles Organiques ---
  document.querySelectorAll('.bubbles').forEach(container => {
    for (let i = 0; i < 12; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      const size = Math.random() * 6 + 2; // Bulles entre 2px et 8px
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.animationDelay = `${Math.random() * 6}s`;
      bubble.style.style = `--duration: ${Math.random() * 6 + 6}s`;
      container.appendChild(bubble);
    }
  });

  initMap();
  updateLiquidLevels();
});
