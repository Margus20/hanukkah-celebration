// ====== MENORÁ SVG CON CONSUMO REALISTA, PERSISTENCIA Y BILINGÜE ======

const svg = document.getElementById('menorahSVG');
const candlesGroup = document.getElementById('candles');
const flamesGroup = document.getElementById('flames');
const holdersGroup = document.getElementById('holders');
const container = document.getElementById('menorahContainer');

let isDragging = false;
let dragFlame = null;
let litCandles = new Set();
let flameAnimations = [];

// ====== ESTADO INDIVIDUAL DE CADA VELA ======
let candleStates = [];
const STORAGE_KEY = 'hanukkah_candle_states';
const BURN_DURATION = 4 * 60 * 60 * 1000; // 4 horas
const RESET_BEFORE = 60 * 60 * 1000; // 1 hora antes del próximo encendido

function initCandleStates() {
  candleStates = [];
  for (let i = 0; i < 9; i++) {
    candleStates.push({ idx: i, litAt: null, consumed: false });
  }
}

// ====== PERSISTENCIA ======
function saveCandleStates() {
  const state = {
    candleStates: candleStates,
    currentNight: currentNight,
    savedAt: Date.now()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadCandleStates() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading states:', e);
    return null;
  }
}

function clearCandleStates() {
  localStorage.removeItem(STORAGE_KEY);
}

// ====== CONSUMO Y APAGADO AUTOMÁTICO ======
function updateCandleConsumption() {
  const now = Date.now();
  let changed = false;
  
  candleStates.forEach(state => {
    if (state.litAt && !state.consumed) {
      const elapsed = now - state.litAt;
      if (elapsed >= BURN_DURATION) {
        state.consumed = true;
        state.litAt = null;
        litCandles.delete(state.idx);
        changed = true;
      }
    }
  });
  
  if (changed) {
    updateMenorah();
    saveCandleStates();
  }
}

// ====== RESTABLECIMIENTO AUTOMÁTICO ======
function checkAndResetForNextNight() {
  const nextNight = currentNight + 1;
  if (nextNight > 8) return;
  
  const nextLightingTime = lightingTime(nextNight);
  if (!nextLightingTime) return;
  
  const now = Date.now();
  const timeUntilNext = nextLightingTime.getTime() - now;
  
  if (timeUntilNext <= RESET_BEFORE && timeUntilNext > 0) {
    resetAllCandles();
  }
}

function resetAllCandles() {
  initCandleStates();
  litCandles.clear();
  litCandles.add(4);
  candleStates[4].litAt = Date.now();
  clearCandleStates();
  updateMenorah();
}

// ====== TOAST BILINGÜE ======
let toastTimer = null;
function showToast(msg, tipo) {
  const t = document.getElementById('toast');
  if (!t) { alert(msg); return; }
  const icono = tipo === 'success' ? '🕎✨' : tipo === 'warning' ? '⚠️' : '🕎';
  t.innerHTML = '<span class="toast-icon">' + icono + '</span>' + msg;
  t.className = 'toast show' + (tipo ? ' ' + tipo : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = 'toast'; }, 3200);
}

// ====== DIBUJO ======
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

function drawCandles() {
  candlesGroup.innerHTML = '';
  const now = Date.now();
  
  WICK_POSITIONS.forEach((pos, i) => {
    const state = candleStates[i];
    const isShamash = (i === 4);
    const isLit = state && state.litAt !== null && !state.consumed;
    const length = isShamash ? SHAMASH_LENGTH : CANDLE_LENGTH;
    
    // Consumo progresivo basado en tiempo real
    let consumed = 0;
    if (isLit && state.litAt) {
      const elapsed = now - state.litAt;
      const maxConsumption = length * 0.3; // máximo 30% de la vela
      consumed = Math.min((elapsed / BURN_DURATION) * maxConsumption, maxConsumption);
    }
    
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

    // Mecha
    const wick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    wick.setAttribute('x1', pos.x);
    wick.setAttribute('y1', topY);
    wick.setAttribute('x2', pos.x);
    wick.setAttribute('y2', topY - 6);
    wick.setAttribute('stroke', '#333');
    wick.setAttribute('stroke-width', 2);
    wick.setAttribute('data-idx', i);
    candlesGroup.appendChild(wick);
    
    // Gotas de cera si está consumida más del 10%
    if (isLit && consumed > length * 0.1) {
      addWaxDrips(pos.x, topY, consumed);
    }
  });
}

function addWaxDrips(x, topY, consumed) {
  const numDrips = Math.min(Math.floor(consumed / 10), 3);
  for (let i = 0; i < numDrips; i++) {
    const drip = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    const offsetX = (Math.random() - 0.5) * 12;
    const dripY = topY + Math.random() * 15;
    drip.setAttribute('cx', x + offsetX);
    drip.setAttribute('cy', dripY);
    drip.setAttribute('rx', 2.5);
    drip.setAttribute('ry', 4);
    drip.setAttribute('fill', '#f0f0f0');
    drip.setAttribute('opacity', '0.6');
    drip.classList.add('wax-drip');
    drip.style.animationDelay = `${Math.random() * 2}s`;
    candlesGroup.appendChild(drip);
  }
}

function drawFlame(pos, idx) {
  const state = candleStates[idx];
  const isLit = state && state.litAt !== null && !state.consumed;
  if (!isLit) return null;
  
  const isShamash = (idx === 4);
  const length = isShamash ? SHAMASH_LENGTH : CANDLE_LENGTH;
  const now = Date.now();
  const elapsed = state.litAt ? now - state.litAt : 0;
  const maxConsumption = length * 0.3;
  const consumed = Math.min((elapsed / BURN_DURATION) * maxConsumption, maxConsumption);
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

  const duration = 0.8 + Math.random() * 0.6;
  const delay = Math.random() * 0.6;
  flame.style.animation = `flickerNatural ${duration}s ${delay}s infinite alternate`;

  flamesGroup.appendChild(flame);
  startSparks(pos, flameY, idx);
  return flame;
}

function startSparks(pos, flameY, idx) {
  const sparkInterval = setInterval(() => {
    const state = candleStates[idx];
    if (!state || !state.litAt || state.consumed) { clearInterval(sparkInterval); return; }
    if (Math.random() < 0.25) createSpark(pos, flameY);
  }, 2500 + Math.random() * 3500);
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
  const dx = (Math.random() - 0.5) * 24;
  const dy = -(Math.random() * 36 + 18);
  spark.style.setProperty('--dx', `${dx}px`);
  spark.style.setProperty('--dy', `${dy}px`);
  const duration = 0.9 + Math.random() * 0.5;
  spark.style.animation = `chispa-subir ${duration}s ease-out forwards`;
  container.appendChild(spark);
  setTimeout(() => { if (spark.parentNode) spark.parentNode.removeChild(spark); }, duration * 1000);
}

// ====== INICIALIZACIÓN ======
function initMenorah() {
  flameAnimations.forEach(interval => clearInterval(interval));
  flameAnimations = [];
  drawHolders();
  
  const saved = loadCandleStates();
  if (saved && saved.currentNight === currentNight) {
    candleStates = saved.candleStates;
    litCandles.clear();
    candleStates.forEach(state => {
      if (state.litAt && !state.consumed) {
        litCandles.add(state.idx);
      }
    });
  } else {
    initCandleStates();
    litCandles.clear();
    litCandles.add(4);
    candleStates[4].litAt = Date.now();
  }
  
  checkAndResetForNextNight();
  
  drawCandles();
  flamesGroup.innerHTML = '';
  litCandles.forEach(i => drawFlame(WICK_POSITIONS[i], i));
}

function updateMenorah() {
  flameAnimations.forEach(interval => clearInterval(interval));
  flameAnimations = [];
  drawCandles();
  flamesGroup.innerHTML = '';
  litCandles.forEach(i => drawFlame(WICK_POSITIONS[i], i));
}

// ====== ENCENDER VELA ======
function lightCandle(idx) {
  if (litCandles.has(idx)) return;
  if (litCandles.size - 1 >= currentNight) {
    showToast(t('toast_max_candles'), 'warning');
    return;
  }
  
  litCandles.add(idx);
  candleStates[idx].litAt = Date.now();
  candleStates[idx].consumed = false;
  
  updateMenorah();
  saveCandleStates();
  
  if (litCandles.size - 1 >= currentNight) {
    showToast(t('toast_success'), 'success');
  }
  if (guideActive) { clearHighlight(); nextGuideStep(); }
}

function handleCandleTap(e) {
  if (isDragging) return;
  const target = e.target;
  const idx = parseInt(target.getAttribute('data-idx'));
  if (isNaN(idx) || idx === 4) return;
  lightCandle(idx);
}

// ====== REINICIAR ======
function resetCandles() {
  flameAnimations.forEach(interval => clearInterval(interval));
  flameAnimations = [];
  initCandleStates();
  litCandles.clear();
  litCandles.add(4);
  candleStates[4].litAt = Date.now();
  clearCandleStates();
  updateMenorah();
  guideActive = false;
}

// ====== MODO AUTOMÁTICO ======
async function autoLight() {
  resetCandles();
  const order = candleOrderForNight(currentNight);
  document.getElementById('autoBtn').disabled = true;
  document.getElementById('guideBox').textContent = currentLang === 'en' ? 'Auto mode: lighting...' : 'Modo automático: encendiendo...';
  
  for (let i = 0; i < order.length; i++) {
    const msg = currentLang === 'en' 
      ? `Auto: lighting candle ${i + 1} of ${order.length}...` 
      : `Automático: encendiendo vela ${i + 1} de ${order.length}...`;
    document.getElementById('guideBox').textContent = msg;
    await sleep(500);
    lightCandle(order[i]);
    await sleep(400);
  }
  
  const finalMsg = currentLang === 'en' 
    ? `✅ Auto complete! Night ${currentNight} lit 🕎` 
    : `✅ ¡Automático completado! Noche ${currentNight} encendida 🕎`;
  document.getElementById('guideBox').textContent = finalMsg;
  document.getElementById('autoBtn').disabled = false;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ====== EVENTOS ======
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

// ====== ACTUALIZACIÓN PERIÓDICA ======
setInterval(() => {
  updateCandleConsumption();
}, 30000);

setInterval(() => {
  checkAndResetForNextNight();
}, 60000);
