// ====== MENORÁ: ARRASTRE, ENCENDIDO Y MODO AUTOMÁTICO ======

const cont = document.getElementById('menorahContainer');
const shamash = document.getElementById('shamashFlame');

// Coloca un elemento (llama) en la posición de una vela según sus coordenadas porcentuales
function place(el, pos) {
  const r = cont.getBoundingClientRect();
  el.style.left = (pos.x / 100 * r.width - 12) + 'px';
  el.style.top = (pos.y / 100 * r.height - 34) + 'px';
}

// Inicializa la posición del Shamash (llama piloto central)
function initShamash() {
  place(shamash, POS[4]);
  shamash.classList.add('shamash');
}

// Crea las zonas invisibles donde se pueden soltar las velas
function buildZones() {
  document.querySelectorAll('.candle-zone').forEach(z => z.remove());
  const order = POS.map((p, i) => ({ p, i })).filter(o => o.i !== 4);
  order.forEach(o => {
    const z = document.createElement('div');
    z.className = 'candle-zone';
    z.dataset.idx = o.i;
    const r = cont.getBoundingClientRect();
    z.style.left = (o.p.x / 100 * r.width - 21) + 'px';
    z.style.top = (o.p.y / 100 * r.height - 21) + 'px';
    z.addEventListener('mouseup', () => dropOn(z));
    z.addEventListener('touchend', () => dropOn(z));
    cont.appendChild(z);
  });
}

// Cuando sueltas la llama sobre una zona de vela
function dropOn(zone) {
  if (!isDragging) return;
  const idx = +zone.dataset.idx;
  if (document.querySelector('.flame[data-candle="' + idx + '"]')) return;
  if (litCount >= currentNight) {
    alert('Ya encendiste las ' + currentNight + ' velas de esta noche 🕎');
    return;
  }
  lightAt(idx);
}

// Enciende una vela en la posición indicada
function lightAt(idx) {
  const f = document.createElement('div');
  f.className = 'flame lit';
  f.dataset.candle = idx;
  place(f, POS[idx]);
  cont.appendChild(f);
  litCount++;
  if (litCount >= currentNight) {
    document.getElementById('guideBox').textContent =
      '¡Felicidades! Encendiste las ' + currentNight + ' velas de la noche ' + currentNight + ' de Janucá 🕎✨';
  }
  if (guideActive) { clearHighlight(); nextGuideStep(); }
}

// Variables de arrastre
let isDragging = false;

function startDrag(e) {
  e.preventDefault();
  isDragging = true;
  shamash.classList.add('dragging');
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchmove', dragT, { passive: false });
  document.addEventListener('touchend', endDrag);
}

function drag(e) {
  if (!isDragging) return;
  const r = cont.getBoundingClientRect();
  shamash.style.left = (e.clientX - r.left - 12) + 'px';
  shamash.style.top = (e.clientY - r.top - 34) + 'px';
}

function dragT(e) {
  e.preventDefault();
  if (!isDragging) return;
  const t = e.touches[0];
  const r = cont.getBoundingClientRect();
  shamash.style.left = (t.clientX - r.left - 12) + 'px';
  shamash.style.top = (t.clientY - r.top - 34) + 'px';
}

function endDrag() {
  isDragging = false;
  shamash.classList.remove('dragging');
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchmove', dragT);
  document.removeEventListener('touchend', endDrag);
  setTimeout(initShamash, 80);
}

shamash.addEventListener('mousedown', startDrag);
shamash.addEventListener('touchstart', startDrag, { passive: false });

// Modo automático: enciende todas las velas de la noche actual solo
async function autoLight() {
  resetCandles();
  const order = candleOrderForNight(currentNight);
  document.getElementById('autoBtn').disabled = true;
  document.getElementById('guideBox').textContent = 'Modo automático: encendiendo el Shamash...';
  await sleep(600);
  for (let i = 0; i < order.length; i++) {
    document.getElementById('guideBox').textContent =
      'Automático: encendiendo vela ' + (i + 1) + ' de ' + order.length + '...';
    await animateShamashTo(order[i]);
    lightAt(order[i]);
    await sleep(400);
  }
  initShamash();
  document.getElementById('guideBox').textContent =
    '¡Automático completado! Noche ' + currentNight + ' encendida 🕎';
  document.getElementById('autoBtn').disabled = false;
}

function animateShamashTo(idx) {
  return new Promise(res => {
    const p = POS[idx];
    shamash.style.transition = 'all .8s ease';
    place(shamash, p);
    setTimeout(() => { shamash.style.transition = ''; res(); }, 850);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Reinicia todas las velas encendidas
function resetCandles() {
  document.querySelectorAll('.flame.lit').forEach(f => f.remove());
  litCount = 0;
  clearHighlight();
  guideActive = false;
                     }
