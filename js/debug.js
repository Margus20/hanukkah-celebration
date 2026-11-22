// ====== MODO DEPURACIÓN: Toca las mechas para obtener coordenadas ======

let debugMode = false;
let debugNight = 1;
let debugCoords = [];

function toggleDebug() {
  debugMode = !debugMode;
  const btn = document.getElementById('debugBtn');
  btn.classList.toggle('on', debugMode);
  btn.textContent = debugMode ? '🔍 Debug: ON' : '🔍 Modo depuración';
  debugCoords = [];
  document.getElementById('guideBox').textContent = debugMode
    ? '🔍 MODO DEPURACIÓN ACTIVADO: Toca la punta de cada mecha en la imagen. Se mostrarán las coordenadas abajo.'
    : 'Modo depuración desactivado.';
}

// Se llama cuando tocas la imagen en modo debug
cont.addEventListener('click', function(e) {
  if (!debugMode) return;
  const r = cont.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
  const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
  debugCoords.push({x: parseFloat(x), y: parseFloat(y)});
  document.getElementById('guideBox').textContent =
    '🔍 Mecha ' + debugCoords.length + ': x=' + x + ', y=' + y +
    ' | Total: ' + debugCoords.length + ' mechas marcadas. ' +
    (debugCoords.length === 9 ? '✅ ¡Completas! Copia el resultado.' : 'Toca la siguiente mecha.');
  
  // Mostrar marcador visual
  const marker = document.createElement('div');
  marker.style.cssText = 'position:absolute;width:8px;height:8px;background:red;border-radius:50%;pointer-events:none;z-index:20;';
  marker.style.left = (e.clientX - r.left - 4) + 'px';
  marker.style.top = (e.clientY - r.top - 4) + 'px';
  cont.appendChild(marker);
  setTimeout(() => marker.remove(), 2000);
});

function getDebugResult() {
  if (debugCoords.length !== 9) {
    alert('Necesitas marcar 9 mechas (8 velas + shamash). Llevas ' + debugCoords.length + '.');
    return;
  }
  const result = '  ' + debugNight + ': [\n' +
    debugCoords.map((c, i) => '    {x:' + c.x + ', y:' + c.y + '},' + (i === 4 ? '  // shamash' : '')).join('\n') +
    '\n  ],';
  document.getElementById('guideBox').textContent = 'Resultado:\n' + result;
  console.log(result);
  alert('Abre la consola (F12) y copia el resultado, o cópialo del cuadro verde.');
}

function resetDebug() {
  debugCoords = [];
  document.getElementById('guideBox').textContent = 'Depuración reiniciada. Toca las mechas nuevamente.';
}

function setDebugNight(n) {
  debugNight = n;
  debugCoords = [];
  setNight(n, false);
  document.getElementById('guideBox').textContent = 'Depurando Noche ' + n + '. Toca las 9 mechas en orden: vela1, vela2, vela3, vela4, shamash, vela5, vela6, vela7, vela8';
}
