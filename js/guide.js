// ====== GUÍA PASO A PASO (toca la vela que brilla) - BILINGÜE ======
let guideActive = false;
let guideStep = 0;

function startGuide() {
  // 1. Primero apagamos todo para empezar de cero.
  resetCandles();
  
  // 2. DESPUÉS activamos la guía.
  guideActive = true;
  guideStep = 0;
  
  const g = document.getElementById('guideBox');
  g.innerHTML = t('guide_step1');
  
  // Pequeña pausa para que el usuario lea antes de que empiece el paso 1
  setTimeout(nextGuideStep, 1200);
}

function nextGuideStep() {
  const g = document.getElementById('guideBox');
  const targetIdxs = candleOrderForNight(currentNight);

  if (guideStep === 0) {
    g.innerHTML = t('guide_step2');
  } else if (guideStep === 1) {
    g.innerHTML = t('guide_step3');
  } else if (guideStep - 2 < targetIdxs.length) {
    const i = guideStep - 2;
    const stepNum = i + 3;
    
    // Construimos el mensaje dinámico en el idioma actual
    const prefix = currentLang === 'en' ? 'Step ' : 'Paso ';
    const suffix = currentLang === 'en' 
      ? ': Tap the candle glowing in gold. The newest candle is always lit first.' 
      : ': Toca la vela que brilla en dorado. La vela nueva siempre se enciende primero.';
    
    g.innerHTML = '<strong>' + prefix + stepNum + '</strong>' + suffix;
    highlightCandle(targetIdxs[i]);
  } else {
    // Mensaje final con el número de noche
    const nightNum = currentNight;
    const msg = currentLang === 'en' 
      ? '✅ Done! You lit the ' + nightNum + ' candles of night ' + nightNum + ' in the correct order. 🕎'
      : '✅ ¡Listo! Encendiste las ' + nightNum + ' velas de la noche ' + nightNum + ' en el orden correcto. 🕎';
    
    g.innerHTML = msg;
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
