document.addEventListener('DOMContentLoaded', () => {
  const origins = [
    {
      id: 'ethiopie',
      name: 'Éthiopie, Guji',
      region: 'Vallée du Rift • 2 100 m',
      x: 585,
      y: 220,
      variety: 'Heirloom / Bourbon',
      process: 'Lavé, lits africains',
      roast: 'Blonde / Filtre',
      notes: ['Bergamote', 'Fleur d\'oranger', 'Thé noir'],
      desc: 'Une tasse d\'une grande finesse botanique, portée par des notes d\'agrumes nobles et une clarté cristalline.',
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
      desc: 'Corps généreux avec une sucrosité naturelle équilibrée et une acidité douce rappelant la cerise mûre.',
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
      notes: ['Cèdre noble', 'Épices douces', 'Chocolat noir'],
      desc: 'Liqueur dense aux arômes boisés profonds, offrant une longueur en bouche remarquable.',
      price: '17.00 € / 250g'
    }
  ];

  const homeBase = { x: 500, y: 130 };

  const markersContainer = document.getElementById('markers');
  const routesGroup = document.getElementById('routes');
  const fiche = document.getElementById('fiche');
  const chipsContainer = document.getElementById('chips');
  const ficheClose = document.getElementById('ficheClose');

  let activeIndex = -1;

  function initMap() {
    markersContainer.innerHTML = '';
    routesGroup.innerHTML = '';
    chipsContainer.innerHTML = '';

    // Marqueur Marseille
    const homeEl = document.createElement('div');
    homeEl.className = 'marker home';
    homeEl.style.left = `${(homeBase.x / 1000) * 100}%`;
    homeEl.style.top = `${(homeBase.y / 400) * 100}%`;
    homeEl.innerHTML = `<div class="dot"></div><div class="lab">Marseille<small>Atelier Méridien</small></div>`;
    markersContainer.appendChild(homeEl);

    // Marqueurs terroirs
    origins.forEach((item, index) => {
      // Trace de route SVG
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const cx = (item.x + homeBase.x) / 2;
      const cy = Math.min(item.y, homeBase.y) - 45;
      path.setAttribute('d', `M ${item.x} ${item.y} Q ${cx} ${cy} ${homeBase.x} ${homeBase.y}`);
      path.setAttribute('class', 'route-path');
      path.setAttribute('id', `route-${index}`);
      routesGroup.appendChild(path);

      // Marqueur
      const marker = document.createElement('button');
      marker.className = 'marker';
      marker.style.left = `${(item.x / 1000) * 100}%`;
      marker.style.top = `${(item.y / 400) * 100}%`;
      marker.innerHTML = `<div class="dot"></div><div class="lab">${item.name}<small>${item.region}</small></div>`;
      marker.addEventListener('click', () => openOrigin(index));
      markersContainer.appendChild(marker);

      // Chip / Bouton filtre
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.textContent = item.name.split(',')[0];
      chip.addEventListener('click', () => openOrigin(index));
      chipsContainer.appendChild(chip);
    });
  }

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

    fiche.classList.add('open');
    document.body.classList.add('drawer-open'); // Cache le menu haut automatiquement

    document.querySelectorAll('.route-path').forEach((p, i) => {
      p.classList.toggle('active', i === index);
    });

    document.querySelectorAll('.chip').forEach((c, i) => {
      c.classList.toggle('active', i === index);
    });
  }

  function closeOrigin() {
    fiche.classList.remove('open');
    document.body.classList.remove('drawer-open'); // Réaffiche le menu haut
    document.querySelectorAll('.route-path').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  }

  ficheClose.addEventListener('click', closeOrigin);

  document.getElementById('fPrev').addEventListener('click', () => {
    openOrigin((activeIndex - 1 + origins.length) % origins.length);
  });

  document.getElementById('fNext').addEventListener('click', () => {
    openOrigin((activeIndex + 1) % origins.length);
  });

  // Animation liquide au scroll
  const originSections = document.querySelectorAll('section.origin');
  function updateLiquids() {
    const h = window.innerHeight;
    originSections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const level = sec.querySelector('.level');
      if (rect.top < h && rect.bottom > 0) {
        const progress = (h - rect.top) / (h + rect.height);
        const translateY = Math.max(0, Math.min(75, 75 - progress * 85));
        level.style.transform = `translateY(${translateY}%)`;
      }
    });
  }

  window.addEventListener('scroll', updateLiquids);

  // Génération de bulles
  document.querySelectorAll('.bubbles').forEach(container => {
    for (let i = 0; i < 10; i++) {
      const b = document.createElement('div');
      b.className = 'bubble';
      const size = Math.random() * 5 + 2;
      b.style.width = `${size}px`;
      b.style.height = `${size}px`;
      b.style.left = `${Math.random() * 100}%`;
      b.style.animationDelay = `${Math.random() * 6}s`;
      b.style.setProperty('--duration', `${Math.random() * 5 + 5}s`);
      container.appendChild(b);
    }
  });

  initMap();
  updateLiquids();
});
