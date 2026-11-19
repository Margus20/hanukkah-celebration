// ====== INTERFAZ DE USUARIO (UI) ======

function renderDayTabs(active) {
  const tabs = document.getElementById('dayTabs');
  tabs.innerHTML = '';
  for (let i = 1; i <= 8; i++) {
    const b = document.createElement('button');
    b.textContent = 'Noche ' + i;
    const locked = !demoMode && i > active;
    if (locked) b.classList.add('locked');
    if (i === currentNight) b.classList.add('active');
    b.onclick = function() {
      if (locked) {
        alert('Esa noche aún no ha llegado. Activa "Modo demostración" para practicar.');
        return;
      }
      setNight(i, false);
    };
    tabs.appendChild(b);
  }
}

function setNight(n, locked) {
  currentNight = n;
  document.getElementById('menorahImage').src = 'img/dias_candelabro/dia_' + n + '.png';
  resetCandles();
  document.getElementById('shehejeianu').style.display = (n === 1) ? 'block' : 'none';
  document.getElementById('guideBox').textContent = locked
    ? '🔒 Noche ' + n + ' bloqueada (no ha llegado la hora). Usa el Modo demostración para practicar.'
    : 'Noche ' + n + ' de Janucá: debes encender ' + n + ' vela' + (n > 1 ? 's' : '') + '. Arrastra el Shamash o usa la guía/automático.';
  renderDayTabs(currentNight);
}
