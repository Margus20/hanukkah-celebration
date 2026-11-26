// ====== INTERFAZ DE USUARIO (UI) - BILINGÜE ======

// Pinta los botones de las 8 noches y bloquea las que aún no han llegado
function renderDayTabs(active) {
  const tabs = document.getElementById('dayTabs');
  tabs.innerHTML = '';
  for (let i = 1; i <= 8; i++) {
    const b = document.createElement('button');
    b.textContent = t('night_label') + ' ' + i;
    const locked = !demoMode && i > active;
    if (locked) b.classList.add('locked');
    if (i === currentNight) b.classList.add('active');
    b.onclick = function() {
      if (locked) {
        showToast(t('toast_locked'), 'warning');
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
  const g = document.getElementById('guideBox');
  if (locked) {
    g.textContent = tReplace('status_locked', n);
  } else {
    g.textContent = tFormat('status_night', { n: n, s: n > 1 ? 's' : '' });
  }
  renderDayTabs(currentNight);
}
