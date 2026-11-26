// ====== ESTADO DE LA APLICACIÓN - BILINGÜE ======
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
    // Antes de Janucá: cuenta regresiva + aviso
    const ms = lightingTimes[0] - now;
    const d = Math.floor(ms / 86400000);
    const h = Math.floor(ms % 86400000 / 3600000);
    const m = Math.floor(ms % 3600000 / 60000);
    cd.textContent = tFormat('countdown_tpl', { d: d, h: h, m: m });
    sb.className = 'status-bar wait';
    const timeStr = fmtLocal(lightingTimes[0], LOC.tz);
    sb.textContent = tFormat('status_first', { time: timeStr });
    if (!demoMode) { setNight(1, true); }
  } else if (active <= 8) {
    // Durante Janucá: cuenta hacia la próxima vela o "última noche"
    const next = active < 8 ? lightingTimes[active] : null;
    if (next) {
      const ms = next - now;
      const d = Math.floor(ms / 86400000);
      const h = Math.floor(ms % 86400000 / 3600000);
      const m = Math.floor(ms % 3600000 / 60000);
      cd.textContent = tFormat('countdown_next', { d: d, h: h, m: m });
    } else {
      cd.textContent = t('countdown_last');
    }
    sb.className = 'status-bar ready';
    const timeStr = fmtLocal(lightingTimes[active - 1], LOC.tz);
    sb.textContent = tFormat('status_ready_night', { n: active, time: timeStr });
    if (!demoMode) { setNight(active, false); }
  }
  renderDayTabs(active);
}

// Activa o desactiva el modo para practicar sin esperar a diciembre
function toggleDemo() {
  demoMode = !demoMode;
  const btn = document.getElementById('demoBtn');
  btn.classList.toggle('on', demoMode);
  btn.textContent = demoMode ? t('demo_on') : t('demo_off');
  recompute();
}
