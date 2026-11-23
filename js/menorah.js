// ====== MENORÁ SVG: DIBUJO, ARRASTRE Y ENCENDIDO ======

const svg = document.getElementById('menorahSVG');
const candlesGroup = document.getElementById('candles');
const flamesGroup = document.getElementById('flames');
const holdersGroup = document.getElementById('holders');

let isDragging = false;
let dragFlame = null;
let litCandles = new Set(); // índices de velas encendidas (0-8, siendo 4 el shamash)

// Dibujar los portavelas (bases pequeñas doradas)
function drawHolders() {
  holdersGroup.innerHTML = '';
  WICK_POSITIONS.forEach((pos, i) => {
    const holder = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    holder.setAttribute('x', pos.x - 15);
    holder.setAttribute('y', pos.y - 5);
    holder.setAttribute('width', 30);
    holder.setAttribute('height', 10);
    holder.setAttribute('fill', 'url(#goldGrad)');
    holder.setAttribute('rx', 3);
    holdersGroup.appendChild(holder);
  });
}

// Dibujar todas las velas
function drawCandles() {
  candlesGroup.innerHTML = '';
  WICK_POSITIONS.forEach((pos, i) => {
    const isShamash = (i === 4);
    const isLit = litCandles.has(i);
    const height = isShamash ? SHAMASH_HEIGHT : CANDLE_HEIGHT;
    // Si está encendida, se acorta un poco (efecto de consumo)
    const consumed = isLit ? 15 : 0;
    const candleHeight = height - consumed;
    
    const candle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    candle.setAttribute('x', pos.x - 8);
    candle.setAttribute('y', pos.y - candleHeight);
    candle.setAttribute('width', 16);
    candle.setAttribute('height', candleHeight);
    candle.setAttribute('fill', 'url(#candleGrad)');
    candle.setAttribute('rx', 2);
    candle.setAttribute('data-idx', i);
    candle.style.cursor = 'pointer';
    candlesGroup.appendChild(candle);
    
    // Mecha (línea negra pequeña arriba)
    const wick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    wick.setAttribute('x1', pos.x);
    wick.setAttribute('y1', pos.y - candleHeight);
    wick.setAttribute('x2', pos.x);
    wick.setAttribute('y2', pos.y - candleHeight - 5);
    wick.setAttribute('stroke', '#333');
    wick.setAttribute('stroke-width', 2);
    wick.setAttribute('data-idx', i);
    candlesGroup.appendChild(wick);
  });
}

// Dibujar una llama en la punta de la mecha
function drawFlame(pos, idx) {
  const isShamash = (idx === 4);
  const isLit = litCandles.has(idx);
  const height = isShamash ? SHAMASH_HEIGHT : CANDLE_HEIGHT;
  const consumed = isLit ? 15 : 0;
  const candleHeight = height - consumed;
  // La llama va en la punta de la mecha
  const flameY = pos.y - candleHeight - 10;
  
  const flame = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  flame.setAttribute('cx', pos.x);
  flame.setAttribute('cy', flameY);
  flame.setAttribute('rx', 10);
  flame.setAttribute('ry', 18);
  flame.setAttribute('fill', 'url(#flameGrad)');
  flame.classList.add('flame-svg');
  flamesGroup.appendChild(flame);
  return flame;
}

// Inicializar: dibujar todo y encender el Shamash
function initMenorah() {
  drawHolders();
  litCandles.clear();
  litCandles.add(4); // Shamash siempre encendido
  drawCandles();
  flamesGroup.innerHTML = '';
  drawFlame(WICK_POSITIONS[4], 4);
}

// Actualizar visualización después de encender/apagar
function updateMenorah() {
  drawCandles();
  flamesGroup.innerHTML = '';
  litCandles.forEach(i => drawFlame(WICK_POSITIONS[i], i));
}

// Crear llama arrastrable (SVG temporal que sigue al dedo/mouse)
function createDragFlame() {
  if (dragFlame) dragFlame.remove();
  dragFlame = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  dragFlame.setAttribute('rx', 10);
  dragFlame.setAttribute('ry', 18);
  dragFlame.setAttribute('fill', 'url(#flameGrad)');
  dragFlame.style.pointerEvents = 'none';
  flamesGroup.appendChild(dragFlame);
}

// Iniciar arrastre desde el Shamash
function startDrag(e) {
  e.preventDefault();
  isDragging = true;
  createDragFlame();
  moveDragFlame(e);
  document.addEventListener('mousemove', moveDragFlame);
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchmove', moveDragFlameTouch, { passive: false });
  document.addEventListener('touchend', endDrag);
}

function moveDragFlame(e) {
  if (!isDragging || !dragFlame) return;
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());
  dragFlame.setAttribute('cx', svgPt.x);
  dragFlame.setAttribute('cy', svgPt.y);
}

function moveDragFlameTouch(e) {
  e.preventDefault();
  if (!isDragging || !dragFlame) return;
  const touch = e.touches[0];
  const pt = svg.createSVGPoint();
  pt.x = touch.clientX;
  pt.y = touch.clientY;
  const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());
  dragFlame.setAttribute('cx', svgPt.x);
  dragFlame.setAttribute('cy', svgPt.y);
}

function endDrag(e) {
  if (!isDragging) return;
  isDragging = false;
  
  // Detectar si soltamos sobre una mecha
  const pt = svg.createSVGPoint();
  if (e.changedTouches && e.changedTouches.length > 0) {
    pt.x = e.changedTouches[0].clientX;
    pt.y = e.changedTouches[0].clientY;
  } else {
    pt.x = e.clientX;
    pt.y = e.clientY;
  }
  const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());
  
  // Buscar la mecha más cercana
  let closest = -1;
  let minDist = 40; // distancia máxima para "atrapar" la mecha
  WICK_POSITIONS.forEach((pos, i) => {
    if (i === 4) return; // no encender shamash de nuevo
    if (litCandles.has(i)) return; // ya encendida
    const dist = Math.sqrt(Math.pow(svgPt.x - pos.x, 2) + Math.pow(svgPt.y - (pos.y - CANDLE_HEIGHT), 2));
    if (dist < minDist) {
      minDist = dist;
      closest = i;
    }
  });
  
  if (closest >= 0) {
    lightCandle(closest);
  }
  
  if (dragFlame) dragFlame.remove();
  dragFlame = null;
  
  document.removeEventListener('mousemove', moveDragFlame);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchmove', moveDragFlameTouch);
  document.removeEventListener('touchend', endDrag);
}

// Encender una vela directamente (por toque)
function lightCandle(idx) {
  if (litCandles.has(idx)) return; // ya encendida
  if (litCandles.size - 1 >= currentNight) { // -1 porque el shamash ya está
    alert('Ya encendiste las ' + currentNight + ' velas de esta noche 🕎');
    return;
  }
  litCandles.add(idx);
  updateMenorah();
  if (litCandles.size - 1 >= currentNight) {
    document.getElementById('guideBox').textContent =
      '¡Felicidades! Encendiste las ' + currentNight + ' velas de la noche ' + currentNight + ' de Janucá 🕎✨';
  }
  if (guideActive) { clearHighlight(); nextGuideStep(); }
}

// Manejar toque/click directo en una vela
function handleCandleTap(e) {
  const target = e.target;
  const idx = parseInt(target.getAttribute('data-idx'));
  if (isNaN(idx) || idx === 4) return; // no tocar shamash ni elementos sin data-idx
  if (litCandles.has(idx)) return; // ya encendida
  
  // Verificar si estamos en modo arrastre
  if (isDragging) return;
  
  lightCandle(idx);
}

// Reiniciar velas
function resetCandles() {
  litCandles.clear();
  litCandles.add(4); // shamash
  updateMenorah();
  guideActive = false;
}

// Modo automático
async function autoLight() {
  resetCandles();
  const order = candleOrderForNight(currentNight);
  document.getElementById('autoBtn').disabled = true;
  document.getElementById('guideBox').textContent = 'Modo automático: encendiendo...';
  
  for (let i = 0; i < order.length; i++) {
    document.getElementById('guideBox').textContent =
      'Automático: encendiendo vela ' + (i + 1) + ' de ' + order.length + '...';
    await sleep(500);
    lightCandle(order[i]);
    await sleep(400);
  }
  
  document.getElementById('guideBox').textContent =
    '¡Automático completado! Noche ' + currentNight + ' encendida 🕎';
  document.getElementById('autoBtn').disabled = false;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Eventos de arrastre desde el Shamash
svg.addEventListener('mousedown', function(e) {
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());
  const dist = Math.sqrt(Math.pow(svgPt.x - WICK_POSITIONS[4].x, 2) + Math.pow(svgPt.y - (WICK_POSITIONS[4].y - SHAMASH_HEIGHT), 2));
  if (dist < 30) startDrag(e);
});
svg.addEventListener('touchstart', function(e) {
  const touch = e.touches[0];
  const pt = svg.createSVGPoint();
  pt.x = touch.clientX;
  pt.y = touch.clientY;
  const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());
  const dist = Math.sqrt(Math.pow(svgPt.x - WICK_POSITIONS[4].x, 2) + Math.pow(svgPt.y - (WICK_POSITIONS[4].y - SHAMASH_HEIGHT), 2));
  if (dist < 30) startDrag(e);
}, { passive: false });

// Eventos de toque directo en velas
candlesGroup.addEventListener('click', handleCandleTap);
candlesGroup.addEventListener('touchend', function(e) {
  const touch = e.changedTouches[0];
  const pt = svg.createSVGPoint();
  pt.x = touch.clientX;
  pt.y = touch.clientY;
  const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());
  // Buscar la vela más cercana al toque
  let closest = -1;
  let minDist = 25;
  WICK_POSITIONS.forEach((pos, i) => {
    if (i === 4) return;
    const candleTop = pos.y - CANDLE_HEIGHT;
    const dist = Math.sqrt(Math.pow(svgPt.x - pos.x, 2) + Math.pow(svgPt.y - candleTop, 2));
    if (dist < minDist) {
      minDist = dist;
      closest = i;
    }
  });
  if (closest >= 0) {
    const fakeEvent = { target: { getAttribute: () => closest } };
    handleCandleTap(fakeEvent);
  }
});
