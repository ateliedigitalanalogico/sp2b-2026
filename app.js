const POINTS = [
  {
    id: 1,
    name: 'Teatro — interno',
    sub: 'Palco · Auditório Ibirapuera',
    tags: ['LED', 'Luz'],
    coords: [-23.585379684310013, -46.65675261414168],
  },
  {
    id: 2,
    name: 'Teatro — externo',
    sub: 'Fachada · Auditório Ibirapuera',
    tags: ['Projeção', 'LED', 'Luz'],
    coords: [-23.585244399054528, -46.656866145494476],
  },
  {
    id: 3,
    name: 'Foyer',
    sub: 'Circulação · Auditório Ibirapuera',
    tags: ['Projeção', 'Luz'],
    coords: [-23.58563360497309, -46.65643008013398],
  },
  {
    id: 4,
    name: 'Entrada do evento',
    sub: 'Portal sul · Parque Ibirapuera',
    tags: ['Cubo LED'],
    coords: [-23.58600796823524, -46.656188855052896],
  },
  {
    id: 5,
    name: 'Hotel Unique',
    sub: 'Av. Brigadeiro Luís Antônio, 4700',
    tags: ['Projeção mapeada', 'Som', 'Luz', 'Laser'],
    coords: [-23.58156969878062, -46.666792843783355],
  },
];

/* ── Marcador ─────────────────────────────────────────────────────── */
function makeIcon(num, isActive) {
  const bg       = isActive ? '#FFD600' : '#111111';
  const numColor = isActive ? '#000000' : 'rgba(255,214,0,.7)';
  const shadow   = isActive ? '0 2px 14px rgba(255,214,0,.35)' : '0 2px 6px rgba(0,0,0,.5)';

  const html = `<div style="
    width:60px;
    height:40px;
    background:${bg};
    border-radius:6px;
    box-shadow:${shadow};
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    padding:3px 6px;
    gap:2px;
    transition:background .2s,box-shadow .2s;
  ">
    <span style="
      font-family:'DM Mono',monospace;
      font-size:8px;
      letter-spacing:.12em;
      color:${numColor};
      line-height:1;
    ">${String(num).padStart(2, '0')}</span>
    <img src="https://sp2b.com.br/images/logo-sp2b.png"
         style="width:32px;height:22px;object-fit:contain;display:block;"
         alt="SP2B">
  </div>`;

  return L.divIcon({
    className: '',
    html,
    iconSize:    [60, 40],
    iconAnchor:  [30, 40],
    popupAnchor: [0, -44],
  });
}

/* ── Popup HTML ───────────────────────────────────────────────────── */
function makePopup(pt) {
  const tags = pt.tags.map(t => `<span class="popup-tag">${t}</span>`).join('');
  return `<div class="popup-inner">
    <div class="popup-num">${String(pt.id).padStart(2, '0')}</div>
    <div class="popup-name">${pt.name}</div>
    <div class="popup-sub">${pt.sub}</div>
    <div class="popup-tags">${tags}</div>
  </div>`;
}

/* ── Mapa ─────────────────────────────────────────────────────────── */
const map = L.map('map', {
  center: [-23.5845, -46.6600],
  zoom: 15,
  zoomControl: false,
});

L.control.zoom({ position: 'bottomright' }).addTo(map);

L.tileLayer('https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  attribution: '&copy; Google',
  subdomains: '0123',
  maxZoom: 21,
}).addTo(map);

/* ── Pins + sidebar ───────────────────────────────────────────────── */
const listEl    = document.getElementById('pointList');
const markers   = [];
const listItems = [];
let   activeIdx = -1;

function setActive(idx) {
  activeIdx = idx;
  listItems.forEach((el, i) => el.classList.toggle('active', i === idx));
  markers.forEach((m, i)    => m.setIcon(makeIcon(POINTS[i].id, i === idx)));
}

function clearActive() {
  activeIdx = -1;
  listItems.forEach(el   => el.classList.remove('active'));
  markers.forEach((m, i) => m.setIcon(makeIcon(POINTS[i].id, false)));
}

POINTS.forEach((pt, i) => {
  const marker = L.marker(pt.coords, { icon: makeIcon(pt.id, false) }).addTo(map);

  marker.bindPopup(makePopup(pt), { maxWidth: 240, minWidth: 200, closeButton: true });

  // clique direto no pin — abre popup e destaca
  marker.on('click', () => setActive(i));

  // fechar popup limpa o highlight somente se este pin estava ativo
  marker.on('popupclose', () => { if (activeIdx === i) clearActive(); });

  markers.push(marker);

  const item = document.createElement('div');
  item.className = 'point-item';
  item.innerHTML = `
    <span class="point-num">${String(pt.id).padStart(2, '0')}</span>
    <div class="point-body">
      <div class="point-name">${pt.name}</div>
      <div class="point-sub">${pt.sub}</div>
      <div class="point-tags">${pt.tags.map(t => `<span class="point-tag">${t}</span>`).join('')}</div>
    </div>`;

  item.addEventListener('click', () => {
    setActive(i);
    // flyTo centraliza o pin com animação suave
    map.flyTo(pt.coords, 17, { animate: true, duration: 0.7 });
  });

  listEl.appendChild(item);
  listItems.push(item);
});

/* ── Seções ───────────────────────────────────────────────────────── */
const sectionsEl = document.getElementById('sections');

POINTS.forEach((pt) => {
  const tags = pt.tags.map(t => `<span class="sec-tag">${t}</span>`).join('');
  const section = document.createElement('section');
  section.className = 'sec';
  section.id = `sec-${pt.id}`;
  section.innerHTML = `
    <div class="sec__head">
      <span class="sec__num">${String(pt.id).padStart(2, '0')}</span>
      <div>
        <h2 class="sec__name">${pt.name}</h2>
        <p class="sec__sub">${pt.sub}</p>
      </div>
      <div class="sec__tags">${tags}</div>
    </div>
    <div class="sec__body">
      <div class="sec__text">
        <p class="sec__placeholder">Descrição técnica da intervenção — a preencher.</p>
      </div>
      <div class="sec__image">
        <div class="sec__img-placeholder">imagem</div>
      </div>
    </div>`;
  sectionsEl.appendChild(section);
});
