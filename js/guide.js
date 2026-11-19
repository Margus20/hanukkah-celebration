// ====== GUÍA PASO A PASO ======
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
    g.innerHTML = '<strong>Paso ' + (i + 3) + ':</strong> Arrastra el Shamash hasta la vela resaltada (vela nueva primero).';
    highlight(targetIdxs[i]);
  } else {
    g.innerHTML = '¡Listo! Encendiste las ' + currentNight + ' velas de la noche ' + currentNight + '. 🕎';
    guideActive = false;
    clearHighlight();
  }
  guideStep++;
}

// Orden halájico: la vela nueva primero.
function candleOrderForNight(n) {
  const left = [0, 1, 2, 3];
  const right = [5, 6, 7, 8];
  const all = [...left, ...right];
  return all.slice(0, n);
}

function highlight(idx) {
  clearHighlight();
  const z = document.querySelector('.candle-zone[data-idx="' + idx + '"]');
  if (z) z.classList.add('target');
}

function clearHighlight() {
  document.querySelectorAll('.candle-zone.target').forEach(z => z.classList.remove('target'));
}
