// ====== GUÍA PASO A PASO (adaptada a SVG) ======
let guideActive = false;
let guideStep = 0;

function startGuide() {
  guideActive = true;
  guideStep = 0;
  resetCandles(); 
  nextGuideStep();
}

function nextGuideStep() {
  const g = document.getElementById('guideBox');
  const targetIdxs = candleOrderForNight(currentNight);

  if (guideStep === 0) {
    g.innerHTML = '<strong>Paso 1:</strong> El Shamash (vela piloto central) ya está encendido. Es la fuente de fuego.';
  } else if (guideStep === 1) {
    g.innerHTML = '<strong>Paso 2:</strong> Recita las bendiciones (mira el panel de abajo).';
  } else if (guideStep - 2 < targetIdxs.length) {
    const i = guideStep - 2;
    g.innerHTML = '<strong>Paso ' + (i + 3) + ':</strong> Toca la llama del Shamash y arrástrala hasta la vela resaltada en amarillo.';
    highlightCandle(targetIdxs[i]);
  } else {
    g.innerHTML = '¡Listo! Encendiste las ' + currentNight + ' velas de la noche ' + currentNight + '. 🕎';
    guideActive = false;
    clearHighlight();
  }
  guideStep++;
}

// Orden halájico: la vela nueva primero (de izquierda a derecha en el juego)
function candleOrderForNight(n) {
  const left = [0, 1, 2, 3];
  const right = [5, 6, 7, 8];
  const all = [...left, ...right];
  return all.slice(0, n);
}

// Resaltar una vela en el SVG (cambia su color temporalmente)
function highlightCandle(idx) {
  clearHighlight();
  const pos = WICK_POSITIONS[idx];
  const candleHeight = (idx === 4) ? SHAMASH_HEIGHT : CANDLE_HEIGHT;
  
  // Crear un rectángulo de resaltado
  const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  highlight.setAttribute('x', pos.x - 12);
  highlight.setAttribute('y', pos.y - candleHeight - 5);
  highlight.setAttribute('width', 24);
  highlight.setAttribute('height', candleHeight + 10);
  highlight.setAttribute('fill', 'rgba(255, 215, 0, 0.3)');
  highlight.setAttribute('stroke', 'gold');
  highlight.setAttribute('stroke-width', 2);
  highlight.setAttribute('rx', 4);
  highlight.id = 'highlight-' + idx;
  candlesGroup.appendChild(highlight);
}

function clearHighlight() {
  const highlights = document.querySelectorAll('[id^="highlight-"]');
  highlights.forEach(h => h.remove());
}
