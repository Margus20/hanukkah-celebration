// ====== MENORÁ SVG ======

const svg = document.getElementById('menorahSVG');
const candlesGroup = document.getElementById('candles');
const flamesGroup = document.getElementById('flames');
const holdersGroup = document.getElementById('holders');

let isDragging = false;
let dragFlame = null;
let litCandles = new Set();

// Dibujar portavelas (bases doradas)
function drawHolders() {
  holdersGroup.innerHTML = '';
  WICK_POSITIONS.forEach(pos => {
    const h = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    h.setAttribute('x', pos.x - 15);
    h.setAttribute('y', pos.y - 5);
    h.setAttribute('width', 30);
    h.setAttribute('height', 10);
    h.setAttribute('fill', 'url(#goldGrad)');
    h.setAttribute('rx', 3);
    holdersGroup.appendChild(h);
  });
}

// Dibujar todas las velas (hacia arriba desde la base)
function drawCandles() {
  candlesGroup.innerHTML = '';
  WICK_POSITIONS.forEach((pos, i) => {
    const isShamash = (i === 4);
    const isLit = litCandles.has(i);
    const length = isShamash ? SHAMASH_LENGTH : CANDLE_LENGTH;
    // Si está encendida, se acorta un poco
    const consumed = isLit ? 15 : 0;
    const actualLength = length - consumed;
    const topY = pos.y - actualLength; // parte superior de la vela
    
    // Vela (rectángulo hacia arriba desde la base)
    const candle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    candle.setAttribute('x', pos.x - 8);
    candle.setAttribute('y', topY);
    candle.setAttribute('width', 16);
    candle.setAttribute('height', actualLength);
    candle.setAttribute('fill', 'url(#candleGrad)');
    candle.setAttribute('rx', 2);
    candle.setAttribute('data-idx', i);
    candle.style.cursor = 'pointer';
    candlesGroup.appendChild(candle);
    
    // Mecha (línea negra de 6px arriba de la vela)
    const wick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    wick.setAttribute('x1', pos.x);
    wick.setAttribute('y1', topY);
    wick.setAttribute('x2', pos.x);
    wick.setAttribute('y2', topY - 6);
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
  const length = isShamash ? SHAMASH_LENGTH : CANDLE_LENGTH;
  const consumed = isLit ? 15 : 0;
  const actualLength = length - consumed;
  const topY = pos.y - actualLength;
  // La llama va 10px arriba de la punta de la mecha
  const flameY = topY - 16;
  
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

// Inicializar
function initMenorah() {
  drawHolders();
  litCandles.clear();
  litCandles.add(4); // Shamash siempre encendido
  drawCandles();
  flamesGroup.innerHTML = '';
  drawFlame(WICK_POSITIONS[4], 4);
}

// Actualizar después de encender/apagar
function updateMenorah() {
  drawCandles();
  flamesGroup.innerHTML = '';
  litCandles.forEach(i => drawFlame(WICK_POSITIONS[i], i));
}

// Encender una vela
function lightCandle(idx) {
  if (litCandles.has(idx)) return;
  if (litCandles.size - 1 >= currentNight) {
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

// Toque directo en una vela
function handleCandleTap(e) {
  if (isDragging) return;
  const target = e.target;
  const idx = parseInt(target.getAttribute('data-idx'));
  if (isNaN(idx) || idx === 4) return;
  lightCandle(idx);
}

// Reiniciar
function resetCandles() {
  litCandles.clear();
  litCandles.add(4);
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

// Eventos de toque en velas
candlesGroup.addEventListener('click', handleCandleTap);
candlesGroup.addEventListener('touchend', function(e) {
  if (isDragging) return;
  const touch = e.changedTouches[0];
  const pt = svg.createSVGPoint();
  pt.x = touch.clientX;
  pt.y = touch.clientY;
  const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());
  let closest = -1;
  let minDist = 30;
  WICK_POSITIONS.forEach((pos, i) => {
    if (i === 4) return;
    const dist = Math.sqrt(Math.pow(svgPt.x - pos.x, 2) + Math.pow(svgPt.y - pos.y, 2));
    if (dist < minDist) { minDist = dist; closest = i; }
  });
  if (closest >= 0) lightCandle(closest);
});
