// ====== MENORÁ SVG CON LLAMAS NATURALES, CHISPAS Y TOAST ======

const svg = document.getElementById('menorahSVG');
const candlesGroup = document.getElementById('candles');
const flamesGroup = document.getElementById('flames');
const holdersGroup = document.getElementById('holders');
const container = document.getElementById('menorahContainer');

let isDragging = false;
let dragFlame = null;
let litCandles = new Set();
let flameAnimations = [];

// ====== TOAST PERSONALIZADO (reemplaza al alert del navegador) ======
let toastTimer = null;
function showToast(msg, tipo) {
  const t = document.getElementById('toast');
  if (!t) { alert(msg); return; } // respaldo si el div no existe
  const icono = tipo === 'success' ? '🕎✨' : tipo === 'warning' ? '⚠️' : '🕎';
  t.innerHTML = '<span class="toast-icon">' + icono + '</span>' + msg;
  t.className = 'toast show' + (tipo ? ' ' + tipo : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = 'toast'; }, 3200);
}

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
    const consumed = isLit ? 15 : 0;
    const actualLength = length - consumed;
    const topY = pos.y - actualLength;

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

// Dibujar una llama con animación SUTIL (no se despega de la mecha)
function drawFlame(pos, idx) {
  const isShamash = (idx === 4);
  const isLit = litCandles.has(idx);
  const length = isShamash ? SHAMASH_LENGTH : CANDLE_LENGTH;
  const consumed = isLit ? 15 : 0;
  const actualLength = length - consumed;
  const topY = pos.y - actualLength;
  const flameY = topY - 16;

  const flame = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  flame.setAttribute('cx', pos.x);
  flame.setAttribute('cy', flameY);
  flame.setAttribute('rx', 10);
  flame.setAttribute('ry', 18);
  flame.setAttribute('fill', 'url(#flameGrad)');
  flame.classList.add('flame-svg');

  // AJUSTE 1: ciclo más lento (0.8 a 1.4 s) para que la llama respire
  // suave en vez de agitarse desorbitadamente
  const duration = 0.8 + Math.random() * 0.6;
  const delay = Math.random() * 0.6;
  flame.style.animation = `flickerNatural ${duration}s ${delay}s infinite alternate`;

  flamesGroup.appendChild(flame);
  startSparks(pos, flameY, idx);
  return flame;
}

// Chispas esporádicas (AJUSTE 2: menos frecuentes y más suaves)
function startSparks(pos, flameY, idx) {
  const sparkInterval = setInterval(() => {
    if (!litCandles.has(idx)) { clearInterval(sparkInterval); return; }
    if (Math.random() < 0.25) createSpark(pos, flameY);
  }, 2500 + Math.random() * 3500); // cada 2.5 a 6 segundos
  flameAnimations.push(sparkInterval);
}

function createSpark(pos, flameY) {
  const spark = document.createElement('div');
  spark.classList.add('chispa');
  const colors = ['#ffd700', '#ffeb3b', '#ff9800', '#ffffff'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  spark.style.background = color;
  spark.style.boxShadow = `0 0 6px ${color}`;
  const svgRect = svg.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const offsetX = (pos.x / 700) * svgRect.width;
  const offsetY = (flameY / 450) * svgRect.height;
  spark.style.left = (offsetX + svgRect.left - containerRect.left) + 'px';
  spark.style.top = (offsetY + svgRect.top - containerRect.top) + 'px';
  // Trayectoria corta: sube poco y se desvía poco, como chispa real
  const dx = (Math.random() - 0.5) * 24;
  const dy = -(Math.random() * 36 + 18);
  spark.style.setProperty('--dx', `${dx}px`);
  spark.style.setProperty('--dy', `${dy}px`);
  const duration = 0.9 + Math.random() * 0.5;
  spark.style.animation = `chispa-subir ${duration}s ease-out forwards`;
  container.appendChild(spark);
  setTimeout(() => { if (spark.parentNode) spark.parentNode.removeChild(spark); }, duration * 1000);
}

// Inicializar
function initMenorah() {
  flameAnimations.forEach(interval => clearInterval(interval));
  flameAnimations = [];
  drawHolders();
  litCandles.clear();
  litCandles.add(4);
  drawCandles();
  flamesGroup.innerHTML = '';
  drawFlame(WICK_POSITIONS[4], 4);
}

// Actualizar
function updateMenorah() {
  flameAnimations.forEach(interval => clearInterval(interval));
  flameAnimations = [];
  drawCandles();
  flamesGroup.innerHTML = '';
  litCandles.forEach(i => drawFlame(WICK_POSITIONS[i], i));
}

// Encender una vela (AJUSTE 3: usa showToast en lugar de alert)
function lightCandle(idx) {
  if (litCandles.has(idx)) return;
  if (litCandles.size - 1 >= currentNight) {
    showToast('Ya encendiste las ' + currentNight + ' velas de esta noche', 'warning');
    return;
  }
  litCandles.add(idx);
  updateMenorah();
  if (litCandles.size - 1 >= currentNight) {
    showToast('¡Felicidades! Encendiste las ' + currentNight + ' velas de la noche ' + currentNight + ' de Janucá', 'success');
  }
  if (guideActive) { clearHighlight(); nextGuideStep(); }
}

// Toque directo
function handleCandleTap(e) {
  if (isDragging) return;
  const target = e.target;
  const idx = parseInt(target.getAttribute('data-idx'));
  if (isNaN(idx) || idx === 4) return;
  lightCandle(idx);
}

// Reiniciar
function resetCandles() {
  flameAnimations.forEach(interval => clearInterval(interval));
  flameAnimations = [];
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
