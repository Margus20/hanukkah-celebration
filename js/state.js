// ====== ESTADO DE LA APLICACIÓN ======
let LOC = CIUDADES.caracas;
let demoMode = false;
let currentNight = 1;
let litCount = 0;
let lightingTimes = [];

// Función principal que recalcula todo (se ejecuta al cargar y cada minuto)
function recompute() {
  lightingTimes = NOCHES.map((_, i) => lightingTime(i + 1));
  const now = new Date();
  let active = 0;
  for (let i = 0; i < 8; i++) {
    if (now >= lightingTimes[i]) active = i + 1;
  }

  const cd = document.getElementById('countdown');
  const sb = document.getElementById('statusBar');

  if (active === 0) {
    const ms = lightingTimes[0] - now;
    cd.textContent = 'Faltan ' + fmtCount(ms) + ' para encender la primera vela';
    sb.className = 'status-bar wait';
    sb.textContent = '⏳ Aún no es Janucá. Primera vela: ' + fmtLocal(lightingTimes[0], LOC.tz);
    if (!demoMode) { setNight(1, true); }
  } else if (active <= 8) {
    const next = active < 8 ? lightingTimes[active] : null;
    cd.textContent = next ? ('Próxima vela en ' + fmtCount(next - now)) : 'Última noche encendida';
    sb.className = 'status-bar ready';
    sb.textContent = '🔥 ¡Es hora de encender! Noche ' + active + ' de Janucá (' + fmtLocal(lightingTimes[active - 1], LOC.tz) + ')';
    if (!demoMode) { setNight(active, false); }
  }
  renderDayTabs(active);
}

// Activa o desactiva el modo para practicar sin esperar a diciembre
function toggleDemo() {
  demoMode = !demoMode;
  const btn = document.getElementById('demoBtn');
  btn.classList.toggle('on', demoMode);
  btn.textContent = demoMode ? '🎓 Demo: ACTIVADA' : '🎓 Modo demostración';
  recompute();
}
