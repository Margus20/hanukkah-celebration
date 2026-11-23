// ====== INTERFAZ DE USUARIO (UI) ======

// Pinta los botones de las 8 noches y bloquea las que aún no han llegado
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

// Cambiar a una noche concreta: redibuja el SVG con el estado correcto
function setNight(n, locked) {
  currentNight = n;
  initMenorah(); // dibuja portavelas, velas y el Shamash encendido
  document.getElementById('shehejeianu').style.display = (n === 1) ? 'block' : 'none';
  document.getElementById('guideBox').textContent = locked
    ? '🔒 Noche ' + n + ' bloqueada (no ha llegado la hora). Usa el Modo demostración para practicar.'
    : 'Noche ' + n + ' de Janucá: debes encender ' + n + ' vela' + (n > 1 ? 's' : '') + '. Arrastra el Shamash o usa la guía/automático.';
  renderDayTabs(currentNight);
}
