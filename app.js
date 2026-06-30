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
  const div = document.createElement('div');
  div.className = 'map-pin' + (isActive ? ' map-pin--active' : '');

  const img = document.createElement('img');
  img.src = 'https://sp2b.com.br/images/logo-sp2b.png';
  img.alt = 'SP2B';

  const label = document.createElement('span');
  label.className = 'map-pin__num';
  label.textContent = String(num).padStart(2, '0');

  div.appendChild(img);
  div.appendChild(label);

  return L.divIcon({
    className: '',
    html: div.outerHTML,
    iconSize:    [40, 40],
    iconAnchor:  [20, 20],
    popupAnchor: [0, -24],
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

function setActive(idx) {
  listItems.forEach((el, i) => el.classList.toggle('active', i === idx));
  markers.forEach((m, i) => m.setIcon(makeIcon(POINTS[i].id, i === idx)));
}

function clearActive() {
  listItems.forEach(el => el.classList.remove('active'));
  markers.forEach((m, i) => m.setIcon(makeIcon(POINTS[i].id, false)));
}

POINTS.forEach((pt, i) => {
  const marker = L.marker(pt.coords, { icon: makeIcon(pt.id, false) }).addTo(map);

  marker.bindPopup(makePopup(pt), { maxWidth: 240, minWidth: 200, closeButton: true });
  marker.on('click',      () => setActive(i));
  marker.on('popupclose', () => clearActive());

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
    map.setView(pt.coords, 18, { animate: true, duration: 0.6 });
    marker.openPopup();
  });

  listEl.appendChild(item);
  listItems.push(item);
});
