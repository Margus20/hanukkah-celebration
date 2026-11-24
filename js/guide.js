// ====== GUÍA PASO A PASO (toca la vela que brilla) ======
let guideActive = false;
let guideStep = 0;

function startGuide() {
  // 1. Primero apagamos todo para empezar de cero.
  resetCandles();
  
  // 2. DESPUÉS activamos la guía (antes se desactivaba por error).
  guideActive = true;
  guideStep = 0;
  
  const g = document.getElementById('guideBox');
  g.innerHTML = '📖 <strong>Guía iniciada.</strong> Te mostraré el orden correcto: primero el Shamash, luego las bendiciones y después las velas de una en una. <em>(Reiniciar solo apaga; la Guía además te enseña.)</em>';
  
  // Pequeña pausa para que el usuario lea antes de que empiece el paso 1
  setTimeout(nextGuideStep, 1200);
}

function nextGuideStep() {
  const g = document.getElementById('guideBox');
  const targetIdxs = candleOrderForNight(currentNight);

  if (guideStep === 0) {
    g.innerHTML = '<strong>Paso 1:</strong> La vela piloto central (Shamash) ya está encendida. Es la fuente de fuego.';
  } else if (guideStep === 1) {
    g.innerHTML = '<strong>Paso 2:</strong> Recita las bendiciones (mira las tarjetas de abajo).';
  } else if (guideStep - 2 < targetIdxs.length) {
    const i = guideStep - 2;
    g.innerHTML = '<strong>Paso ' + (i + 3) + ':</strong> Toca la vela que brilla en dorado. La vela nueva siempre se enciende primero.';
    highlightCandle(targetIdxs[i]);
  } else {
    g.innerHTML = '✅ ¡Listo! Encendiste las ' + currentNight + ' velas de la noche ' + currentNight + ' en el orden correcto. 🕎';
    guideActive = false;
    clearHighlight();
  }
  guideStep++;
}

// Orden halájico: la vela nueva primero (de izquierda a derecha en la pantalla)
function candleOrderForNight(n) {
  const left = [0, 1, 2, 3];
  const right = [5, 6, 7, 8];
  const all = [...left, ...right];
  return all.slice(0, n);
}

// Resaltar una vela en el SVG con un brillo dorado suave
function highlightCandle(idx) {
  clearHighlight();
  const pos = WICK_POSITIONS[idx];
  const isShamash = (idx === 4);
  const length = isShamash ? SHAMASH_LENGTH : CANDLE_LENGTH;
  const topY = pos.y - length;
  
  const hl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  hl.setAttribute('x', pos.x - 14);
  hl.setAttribute('y', topY - 8);
  hl.setAttribute('width', 28);
  hl.setAttribute('height', length + 16);
  hl.setAttribute('fill', 'rgba(232, 197, 71, 0.18)');
  hl.setAttribute('stroke', '#e8c547');
  hl.setAttribute('stroke-width', '2');
  hl.setAttribute('rx', 6);
  hl.setAttribute('class', 'candle-highlight');
  candlesGroup.appendChild(hl);
}

function clearHighlight() {
  document.querySelectorAll('.candle-highlight').forEach(h => h.remove());
}
